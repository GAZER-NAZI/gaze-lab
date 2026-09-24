import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const checkerPath = path.join(repositoryRoot, "scripts/architecture/check-boundaries.mjs");
const fixturesPath = path.join(repositoryRoot, "scripts/architecture/fixtures/boundaries");

describe("workspace dependency boundaries", () => {
  it("allows an acyclic playground-to-SDK-to-camera dependency path", () => {
    const output = execFileSync(
      process.execPath,
      [checkerPath, "--root", path.join(fixturesPath, "safe")],
      { cwd: repositoryRoot, encoding: "utf8" },
    );

    expect(output).toContain("Architecture check passed");
  });

  it("rejects core-to-app, playground-to-non-SDK, and circular dependencies", () => {
    const result = spawnSync(
      process.execPath,
      [checkerPath, "--root", path.join(fixturesPath, "prohibited")],
      { cwd: repositoryRoot, encoding: "utf8" },
    );

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("core-no-apps");
    expect(result.stdout).toContain("playground-sdk-only");
    expect(result.stdout).toContain("no-circular");
  });
});
