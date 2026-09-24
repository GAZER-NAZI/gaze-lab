# Contributing

## Setup

Install Node.js 24, Git, and Corepack. From a clean clone:

```powershell
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm verify
```

The root `packageManager` pins pnpm and `pnpm-lock.yaml` pins dependency resolutions. Playwright is
available for future browser features; no browser tests or app page exist in the current skeleton.

## Workflow

1. Find or propose a Spec Kit feature under `specs/` before implementing product behavior.
2. Work only in the package/front assigned to you; check [ARCHITECTURE.md](ARCHITECTURE.md) and its
   package README for neighboring boundaries.
3. Keep shared contracts explicit and reviewed by affected owners. Do not invent the SDK's gaze
   coordinate, confidence, or validity semantics.
4. Run `pnpm verify`. The boundary and privacy guards are deliberate architecture gates.
5. Keep changes scoped and describe tests and any unverified behavior in the pull request.

## Privacy and data

Raw video, direct identifiers, and participant-linked data are not part of this scaffold. Dataset
guidance is in `research/datasets/README.md`; the future privacy requirements are in
`docs/product/privacy-and-consent.md`. New capture, storage, or transmission requires an explicit
reviewed feature and consent/data-handling plan.

## Harness naming

Use “developer feedback harness” for tests, scripts, local verification, and CI. Reserve
`tools/harness` and “gaze evaluation harness” for replaying gaze tasks and producing research
metrics. They serve different goals and are not interchangeable.
