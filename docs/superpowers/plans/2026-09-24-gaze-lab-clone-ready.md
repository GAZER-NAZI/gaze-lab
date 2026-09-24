# Gaze Lab Clone-Ready Repository Implementation Plan

> **For agentic workers:** Implement this plan inline with `superpowers:executing-plans`, using TDD
> for behavior and verifying each task before proceeding.

**Goal:** Make the Gaze Lab repository reproducibly cloneable and ready for four contributors to
start work in their assigned areas.

**Architecture:** Keep a small pnpm monorepo with documented package ownership and mechanical
dependency/privacy checks. Treat root scripts, Vitest, Playwright, and CI as the developer/agent
feedback harness; reserve `tools/harness` for gaze replay and evaluation. Playwright is prepared for
future browser features; this task creates no frontend or runnable demo.

**Tech Stack:** Node.js 24; TypeScript 7; pnpm 12; Vitest 5; Oxlint with `oxlint-tsgolint`;
Playwright Test pinned for future browser tests; Prettier; `@babel/parser` for TS7-compatible import
analysis; GitHub Actions.

**Spec:** `specs/001-repository-skeleton/spec.md`; implementation details in
`specs/001-repository-skeleton/plan.md` and `tasks.md`.

## Global Constraints

- Require Node.js 24 and TypeScript 7; lock exact dependency resolutions.
- Keep raw camera video local and do not record or transmit it by default.
- Do not implement a frontend, browser server, camera acquisition, inference, session storage, or
  analytics in this scaffold.
- Core packages must not depend on apps or tools; a future playground must consume the SDK boundary.
- Separate gaze evaluation tooling from agent/developer feedback tooling in names and documentation.
- Do not add gaze algorithms, calibration behavior, or accuracy claims in this scaffold.
- Do not push or publish without a configured remote and an explicitly confirmed destination.

## Review Focus

- Windows clean checkout: Corepack/pnpm commands and locked dependencies work in PowerShell.
- Node/tool peer compatibility: install and type checks succeed on Node 24 with TypeScript 7.
- Guardrail fixtures: safe fixture code passes while prohibited imports, capture, persistence, and
  uploads fail with useful paths.
- CI parity: CI runs the same required checks as local verification without installing a browser.

---

### Task 1: Pin and install the supported toolchain

**Files:** `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.npmrc`, `.node-version`,
`tsconfig.base.json`, Oxlint config, `vitest.config.ts`, `.prettierrc.json`, and `.prettierignore`.

**Implementation and verification:**

- Require Node 24 and pin the current stable pnpm 12 release through `packageManager`.
- Replace TypeScript 5/ESLint parser dependencies with TypeScript 7, Oxlint and `oxlint-tsgolint`;
  pin current compatible stable packages including Playwright Test.
- Add root scripts for `lint`, `typecheck`, `test`, `format:check`, `check:boundaries`,
  `check:privacy`, `build`, and `verify`.
- Keep lockfile resolution reproducible; make `verify` stop on the first failing required gate.
- Run `node --version`, `pnpm --version`, `pnpm install --frozen-lockfile`, and inspect installed
  top-level versions. Expected: Node 24 and exact pinned pnpm; frozen install succeeds without peer
  warnings.

### Task 2: Implement architecture and privacy guardrails test-first

**Files:** `scripts/architecture/check-privacy.test.mjs`,
`scripts/architecture/check-boundaries.test.mjs`, their fixtures,
`scripts/architecture/check-privacy.mjs`, `scripts/architecture/check-boundaries.mjs`,
`package.json`.

**Steps:** Run the existing safe/prohibited fixture tests and confirm RED because the checker
implementations are absent. Parse TS/JS imports with `@babel/parser`, build the local workspace
dependency graph, then enforce the three named rules. Implement the privacy scanner over app source
files. Run each focused suite and the complete Vitest suite. Expected: safe fixtures pass;
prohibited camera access, persistence, uploads, forbidden dependency directions, and cycles fail
with file/rule details. Guards must tolerate a missing app source tree.

### Task 3: Keep application areas as frontend-free shells

**Files:** `apps/playground/package.json`, `apps/playground/README.md`, root test/tool
configuration.

**Steps:** Keep only package manifest and responsibility documentation for the future playground.
Remove UI, styles, app server, browser tests, and app-specific runtime dependencies. Keep Playwright
pinned as agreed, but defer browser config and tests until a browser feature is approved. Verify
root checks tolerate absent app source.

### Task 4: Complete the contributor map and knowledge index

**Files:** `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `docs/README.md`,
`docs/{product,decisions,experiments,plans}/README.md`,
`research/{baselines,datasets,experiments}/README.md`, package responsibility READMEs,
`tools/harness/README.md`, `.github/CODEOWNERS`.

**Steps:** Document exact clean-clone commands and Node/pnpm requirements; keep `AGENTS.md` short
and link to the knowledge index; map product, architecture, decisions, active Spec Kit feature and
plans; state each owner/package/neighbor boundary; explicitly label `tools/harness` as the gaze
evaluation harness; state no raw video/direct identifiers in dataset guidance. Verify links and
ensure documentation does not promise implemented gaze functionality.

### Task 5: Add continuous integration and validate clean-clone parity

**Files:** `.github/workflows/ci.yml`, `README.md`, `CONTRIBUTING.md`,
`specs/001-repository-skeleton/quickstart.md`, `.gitignore`.

**Steps:** Configure CI on Node 24 to install the pinned pnpm version, install dependencies with the
frozen lockfile, and run `pnpm verify`. On the current machine, follow the documented steps from a
clean dependency install, run every command, and check the final diff and
`git diff --cached --check` before any commit. Expected: a clean checkout can install and verify the
skeleton; there is no server to start.

### Task 6: Final review and handoff

Review every requirement in `specs/001-repository-skeleton/spec.md` against code, docs, test
results, and CI. Run `pnpm verify` and the clean-checkout instructions; report any limitation in CI
that cannot be exercised locally. Confirm branch and remote status. Do not create or push a remote
repository until the destination and visibility are confirmed.
