# Agent and contributor entry point

Before changing behavior, read [CONTRIBUTING.md](CONTRIBUTING.md),
[ARCHITECTURE.md](ARCHITECTURE.md), and the relevant active feature under `specs/`. The repository
is a skeleton: do not infer or implement product behavior outside an agreed spec.

Use the [knowledge index](docs/README.md) to find authoritative product, privacy, decision,
experiment, and ownership guidance. Keep camera data local by default; never add recording,
identifiers, persistence, or upload without an explicit reviewed privacy decision.

Run `pnpm verify` before proposing changes. Keep package dependency direction enforced by
`pnpm check:boundaries`; `tools/harness` means gaze evaluation tooling, while tests/scripts/CI are
the developer feedback harness.
