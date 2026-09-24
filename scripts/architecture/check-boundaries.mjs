#!/usr/bin/env node
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { parse } from "@babel/parser";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceExtensions = [".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"];
const workspaceRoots = ["apps", "packages", "tools"];

function parseRoot(args) {
  const rootIndex = args.indexOf("--root");
  if (rootIndex === -1) return repositoryRoot;
  if (!args[rootIndex + 1]) throw new Error("Expected a directory after --root.");
  return path.resolve(args[rootIndex + 1]);
}

async function collectSourceFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      files.push(...(await collectSourceFiles(entryPath)));
    } else if (entry.isFile() && sourceExtensions.includes(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }
  return files;
}

function collectImports(ast) {
  const imports = [];
  const visit = (node) => {
    if (!node || typeof node !== "object") return;

    if (
      ["ImportDeclaration", "ExportAllDeclaration", "ExportNamedDeclaration"].includes(node.type) &&
      node.source?.type === "StringLiteral"
    ) {
      imports.push(node.source.value);
    } else if (node.type === "ImportExpression" && node.source?.type === "StringLiteral") {
      imports.push(node.source.value);
    } else if (
      node.type === "CallExpression" &&
      node.callee?.type === "Import" &&
      node.arguments[0]?.type === "StringLiteral"
    ) {
      imports.push(node.arguments[0].value);
    } else if (
      node.type === "TSImportType" &&
      node.argument?.type === "TSLiteralType" &&
      node.argument.literal?.type === "StringLiteral"
    ) {
      imports.push(node.argument.literal.value);
    }

    for (const [key, value] of Object.entries(node)) {
      if (["loc", "start", "end", "extra", "leadingComments", "trailingComments"].includes(key)) {
        continue;
      }
      if (Array.isArray(value)) value.forEach(visit);
      else if (value && typeof value === "object") visit(value);
    }
  };
  visit(ast);
  return imports;
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function resolveLocalImport(specifier, importer, root, workspacePackages) {
  let basePath;
  if (specifier.startsWith(".")) {
    basePath = path.resolve(path.dirname(importer), specifier);
  } else if (workspacePackages.has(specifier)) {
    basePath = workspacePackages.get(specifier);
  } else {
    return null;
  }

  const relativeBase = path.relative(root, basePath);
  if (
    relativeBase === ".." ||
    relativeBase.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeBase)
  ) {
    return null;
  }

  const hasExtension = Boolean(path.extname(basePath));
  const candidates = hasExtension
    ? [basePath]
    : [
        ...sourceExtensions.map((extension) => `${basePath}${extension}`),
        ...sourceExtensions.map((extension) => path.join(basePath, `index${extension}`)),
      ];
  for (const candidate of candidates) if (await exists(candidate)) return candidate;
  return null;
}

async function readWorkspacePackages(root) {
  const packages = new Map();
  for (const workspaceRoot of workspaceRoots) {
    const directory = path.join(root, workspaceRoot);
    let entries = [];
    try {
      entries = await readdir(directory, { withFileTypes: true });
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    for (const entry of entries.filter((item) => item.isDirectory())) {
      const folder = path.join(directory, entry.name);
      try {
        const manifest = JSON.parse(await readFile(path.join(folder, "package.json"), "utf8"));
        if (typeof manifest.name === "string") {
          packages.set(manifest.name, path.join(folder, "src", "index.ts"));
        }
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
  return packages;
}

function findCycles(graph) {
  const state = new Map();
  const stack = [];
  const cycles = new Set();
  const visit = (modulePath) => {
    state.set(modulePath, 1);
    stack.push(modulePath);
    for (const dependency of graph.get(modulePath) ?? []) {
      if (state.get(dependency) === 1) {
        const cycle = [...stack.slice(stack.indexOf(dependency)), dependency];
        cycles.add(cycle.map((item) => path.posix.normalize(item)).join(" -> "));
      } else if (!state.has(dependency)) visit(dependency);
    }
    stack.pop();
    state.set(modulePath, 2);
  };

  for (const modulePath of graph.keys()) if (!state.has(modulePath)) visit(modulePath);
  return [...cycles];
}

function getViolation(rule, from, to) {
  if (rule === "core-no-apps" && /^packages\/[^/]+\//.test(from) && /^(apps|tools)\//.test(to)) {
    return true;
  }
  if (
    rule === "playground-sdk-only" &&
    from.startsWith("apps/playground/") &&
    /^packages\/(?!sdk\/)/.test(to)
  ) {
    return true;
  }
  return false;
}

try {
  const root = parseRoot(process.argv.slice(2));
  const sourceFiles = [];
  for (const folder of workspaceRoots)
    sourceFiles.push(...(await collectSourceFiles(path.join(root, folder))));

  const workspacePackages = await readWorkspacePackages(root);
  const graph = new Map();
  const edges = [];
  for (const file of sourceFiles) {
    const relativeFile = path.relative(root, file).split(path.sep).join("/");
    let ast;
    try {
      ast = parse(await readFile(file, "utf8"), {
        sourceType: "unambiguous",
        sourceFilename: file,
        plugins: ["typescript", "jsx"],
      });
    } catch (error) {
      throw new Error(`${relativeFile}:${error.loc?.line ?? 1} [parse-error] ${error.message}`, {
        cause: error,
      });
    }

    const dependencies = [];
    for (const specifier of collectImports(ast)) {
      const targetPath = await resolveLocalImport(specifier, file, root, workspacePackages);
      if (!targetPath) continue;
      const relativeTarget = path.relative(root, targetPath).split(path.sep).join("/");
      dependencies.push(relativeTarget);
      edges.push([relativeFile, relativeTarget]);
    }
    graph.set(relativeFile, dependencies);
  }

  const violations = [];
  for (const [from, to] of edges) {
    for (const rule of ["core-no-apps", "playground-sdk-only"]) {
      if (getViolation(rule, from, to)) violations.push(`${rule}: ${from} -> ${to}`);
    }
  }
  for (const cycle of findCycles(graph)) violations.push(`no-circular: ${cycle}`);

  if (violations.length > 0) {
    process.stdout.write(`${violations.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(
      `Architecture check passed (${sourceFiles.length} source files scanned).\n`,
    );
  }
} catch (error) {
  process.stderr.write(`Architecture check failed: ${error.message}\n`);
  process.exitCode = 1;
}
