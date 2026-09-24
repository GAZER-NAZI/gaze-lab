#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"]);
const ignoredDirectories = new Set(["build", "coverage", "dist", "node_modules"]);
const rules = [
  {
    id: "camera-access",
    pattern:
      /\b(?:navigator\s*\.\s*mediaDevices\s*\.\s*)?getUserMedia\s*\(|\bmediaDevices\s*\.\s*getUserMedia\s*\(/,
    message: "Camera acquisition is not allowed without an approved feature and privacy review.",
  },
  {
    id: "data-persistence",
    pattern:
      /\b(?:localStorage|sessionStorage|indexedDB|openDatabase)\b|\bdocument\s*\.\s*cookie\b/,
    message:
      "Session or participant data must not be persisted without an approved privacy review.",
  },
  {
    id: "network-transfer",
    pattern: /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|\bsendBeacon\s*\(/,
    message: "Network transfer is not allowed without an approved feature and privacy review.",
  },
];

function parseRoot(args) {
  const rootIndex = args.indexOf("--root");
  if (rootIndex === -1) return path.join(repositoryRoot, "apps/playground/src");
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
    if (entry.isDirectory() && !ignoredDirectories.has(entry.name))
      files.push(...(await collectSourceFiles(entryPath)));
    else if (entry.isFile() && sourceExtensions.has(path.extname(entry.name)))
      files.push(entryPath);
  }
  return files;
}

try {
  const root = parseRoot(process.argv.slice(2));
  const rootStats = await stat(root).catch((error) => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (rootStats && !rootStats.isDirectory()) throw new Error(`Not a directory: ${root}`);

  const files = rootStats ? await collectSourceFiles(root) : [];
  const findings = [];
  for (const file of files) {
    const source = await readFile(file, "utf8");
    const lines = source.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const rule of rules) {
        if (rule.pattern.test(line)) {
          findings.push(
            `${path.relative(repositoryRoot, file)}:${index + 1} [${rule.id}] ${rule.message}`,
          );
        }
      }
    });
  }

  if (findings.length > 0) {
    process.stdout.write(`${findings.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Privacy check passed (${files.length} source files scanned).\n`);
  }
} catch (error) {
  process.stderr.write(`Privacy check failed: ${error.message}\n`);
  process.exitCode = 1;
}
