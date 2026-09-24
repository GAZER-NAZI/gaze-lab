# Quickstart Validation: Gaze Lab Repository Skeleton

## Prerequisites

- Node.js 24.
- pnpm 12 (the exact release is pinned in `package.json`).
- TypeScript 7 is installed with the workspace dependencies.
- Git.

## Setup and run

From the repository root:

```powershell
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm verify
```

There is intentionally no frontend or development server in this skeleton.

## Verify

```powershell
pnpm verify
```

Expected: formatting, lint, types, unit tests, architecture boundaries, privacy checks, and builds
pass; the command exits nonzero if any required check fails. Playwright is prepared for a future
browser feature, but no browser is required by this skeleton.

## Privacy smoke check

The scaffold contains no app behavior and requests no camera permission. App source directories may
be absent; the privacy check should safely handle that state.

## Contract check

Introduce a temporary prohibited dependency from a package under `packages/` to `apps/` or
`tools/harness/`, then run `pnpm check:boundaries`. Expected: the check fails and identifies the
prohibited edge. Remove the temporary import after the check.
