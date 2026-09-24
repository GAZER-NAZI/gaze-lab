# Research: Gaze Lab Repository Skeleton

## Decisions

### Runtime and version policy

- **Decision**: Require Node.js 24 only and TypeScript 7. Resolve the latest stable versions that
  support both, then commit the exact package resolutions in `pnpm-lock.yaml`. Keep runtime type
  definitions on the Node 24 line so APIs from newer Node releases do not leak into the codebase.
- **Rationale**: This matches the team's explicit baseline while retaining reproducible installs.
  “Latest” means latest stable and compatible, not prerelease or a package version that requires a
  different runtime/compiler.
- **Alternatives considered**: Supporting Node 22 as well (rejected to keep one team runtime); using
  floating dependency ranges without a committed lockfile (rejected because clean installs would not
  be reproducible).
- **Sources**: [Node.js release schedule](https://nodejs.org/en/about/previous-releases),
  [TypeScript](https://www.typescriptlang.org/).

Registry snapshot checked on 2026-09-24: Node.js 24.15.0 is the active local runtime; TypeScript
7.0.2; pnpm 12.6.0; Vitest 5.0.1; Oxlint 1.85.0; `oxlint-tsgolint` 7.0.2002; Prettier 3.9.9;
`@babel/parser` 7.29.9; `@types/node` 24.13.6; and `@playwright/test` 1.63.0. The architecture
checker uses `@babel/parser` 7.29.9 because the latest dependency-cruiser 18.4.0 reports TypeScript
transpiler support only below 7.0.0. These are the selected stable releases as of the research date,
subject to successful clean install and CI verification before the scaffold is considered complete.

### Workspace/package management

- **Decision**: Use the latest stable pnpm 12 release with workspaces, one lockfile, and explicit
  local workspace links.
- **Rationale**: pnpm documents first-class monorepo support, a root `pnpm-workspace.yaml`, a shared
  lockfile, and the `workspace:` protocol to ensure internal dependencies resolve locally.
- **Alternatives considered**: npm workspaces (fewer prerequisites but less strict local package
  linking); separate repositories (duplicates shared contracts and complicates comparable runs).
- **Sources**: [pnpm workspace documentation](https://pnpm.io/workspaces).

### TypeScript validation and tests

- **Decision**: Use TypeScript 7 and Vitest 5 for guardrail tests; use Oxlint with `oxlint-tsgolint`
  for TypeScript-aware lint and type diagnostics. Pin Playwright Test for future browser features,
  without installing browsers or adding an unused E2E test now.
- **Rationale**: Official Oxlint documentation states that its type-aware mode uses `typescript-go`
  and requires TypeScript 7. The latest typescript-eslint documentation currently caps its supported
  TypeScript range below 6.1, so it is not selected. Vitest 5.0.1 supports the selected Node 24
  runtime.
- **Alternatives considered**: ESLint with typescript-eslint (not selected because TS7 is outside
  its officially supported range); deferring Playwright entirely (rejected because the team asked to
  include browser automation in the planned toolchain).
- **Sources**: [Oxlint TypeScript-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware),
  [typescript-eslint supported versions](https://typescript-eslint.io/users/dependency-versions/),
  [Vitest release notes](https://vitest.dev/blog),
  [Vitest 5 package requirements](https://www.npmjs.com/package/vitest),
  [Playwright installation and Node.js requirements](https://playwright.dev/docs/intro),
  [Playwright CI setup](https://playwright.dev/docs/ci).

### Quality and test tooling

- **Decision**: Use TypeScript 7 project checks, Oxlint/`tsgolint`, Prettier, Vitest for guardrail
  tests, Playwright Test for future browser flows, and a small AST-based import graph checker using
  `@babel/parser` for architecture boundaries.
- **Rationale**: These checks cover formatting, static types, prohibited dependencies, privacy
  boundaries, and builds with tools compatible with the required TypeScript 7 runtime. Tool versions
  are locked so contributor and CI installs are reproducible.
- **Alternatives considered**: dependency-cruiser (rejected because its current TS transpiler
  support stops before TypeScript 7).
- **Sources**: [TypeScript download/setup](https://www.typescriptlang.org/download/),
  [pnpm workspaces](https://pnpm.io/workspaces).

### Gaze APIs and vision provider

- **Decision**: Do not select a vision provider, baseline algorithm, coordinate convention, or
  confidence schema in the repository-skeleton feature.
- **Rationale**: The approved architecture explicitly leaves these for small experiments. Freezing
  them before camera and estimator comparisons would make the scaffold appear more certain than the
  evidence supports.
- **Alternatives considered**: Put tentative gaze sample types in the first commit (rejected to
  avoid stabilizing a public contract before the team chooses it).

## Open Decisions Deferred to Later Features

- Browser landmark/vision runtime and model based on measured startup time, quality, and device
  performance.
- Public SDK coordinate convention and confidence/validity contract.
- Dataset and evaluation manifest fields beyond the already agreed pseudonym/privacy constraints.
- Whether offline research analysis needs a separate Python toolchain.
