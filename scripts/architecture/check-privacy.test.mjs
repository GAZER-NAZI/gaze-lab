import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const guardPath = path.join(repositoryRoot, "scripts/architecture/check-privacy.mjs");
const fixturesPath = path.join(repositoryRoot, "scripts/architecture/fixtures/privacy");

describe("application privacy guard", () => {
  it("allows a safe source tree", () => {
    const output = execFileSync(
      process.execPath,
      [guardPath, "--root", path.join(fixturesPath, "safe")],
      { cwd: repositoryRoot, encoding: "utf8" },
    );

    expect(output).toContain("Privacy check passed");
  });

  it("rejects camera capture, persistence, and network upload with file-level findings", () => {
    const result = spawnSync(
      process.execPath,
      [guardPath, "--root", path.join(fixturesPath, "prohibited")],
      { cwd: repositoryRoot, encoding: "utf8" },
    );

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("camera-access");
    expect(result.stdout).toContain("data-persistence");
    expect(result.stdout).toContain("network-transfer");
    expect(result.stdout).toContain("camera.ts");
    expect(result.stdout).toContain("storage.ts");
    expect(result.stdout).toContain("upload.ts");
  });
});
