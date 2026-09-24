# Implementation Plan: Gaze Lab Repository Skeleton

**Branch**: `001-repository-skeleton` | **Date**: 2026-09-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-repository-skeleton/spec.md`

## Summary

Create a modular monorepo foundation for the four Gaze Lab work fronts. The scaffold includes named
package boundaries and owners, a repeatable root verification command, architecture checks, and CI.
It intentionally includes no frontend or runnable demo and does not implement capture, vision, gaze
estimation, calibration, stabilization, or performance claims.

## Technical Context

**Language/Version**: TypeScript 7; Node.js 24 only

**Primary Dependencies**: pnpm 12 workspace; Vitest 5; Playwright Test prepared for future browser
features; Oxlint with TypeScript-Go-backed type-aware linting, Prettier, `@babel/parser` for
TS7-compatible import graph analysis, and custom boundary guards

**Storage**: None. The scaffold stores no session, participant, camera, or gaze data.

**Testing**: Vitest; TypeScript project checks; parsed-import graph architecture checks; GitHub
Actions runs the same root verification command

**Target Platform**: Windows, macOS, and Linux contributors using Node.js 24

**Project Type**: pnpm modular monorepo containing future app boundaries, TypeScript packages,
research documentation, and local evaluation tooling

**Performance Goals**: No gaze or camera performance is claimed in this feature.

**Constraints**: No frontend, camera access, recording, persistence, or network upload in this
skeleton. No SDK gaze-coordinate or confidence API is frozen in this scaffold.

**Scale/Scope**: Four primary contributors; six core packages; app/evaluation and harness package
shells; no production model or user-facing gaze-control behavior.

## Constitution Check

| Principle                              | Gate                                                                                                                  | Result |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| Accessibility, Agency, and Safety      | No user-facing behavior is included before its feature is specified                                                   | PASS   |
| Privacy by Default                     | No camera APIs, recording, session persistence, identifiers, or uploads in the scaffold                               | PASS   |
| Evidence Before Accuracy Claims        | No accuracy claim or model benchmark is introduced; future evaluation is documented as local-first                    | PASS   |
| Modular Contracts and Shared Ownership | Package map reflects approved boundaries and four assigned owners; dependency rule blocks core-to-app/harness imports | PASS   |
| Small, Verifiable Increments           | Root checks cover formatting, types, tests, dependency rules, privacy, and builds                                     | PASS   |

## Phase 0: Research Decisions

See [research.md](research.md). The selected workspace and quality-tooling choices are based on
current official project documentation and the installed team environment. Gaze-provider and public
SDK sample decisions remain deferred to later feature specs.

## Phase 1: Design and Contracts

See [data-model.md](data-model.md), [quickstart.md](quickstart.md), and
[contracts/architecture.md](contracts/architecture.md). There is no implemented user interface in
this feature. The SDK remains a package boundary, not a frozen gaze API.

## Project Structure

### Documentation (this feature)

```text
specs/001-repository-skeleton/
├── plan.md
├── research.md
├── data-model.md
├── contracts/architecture.md
├── quickstart.md
└── tasks.md
```

### Source Code (repository root)

```text
AGENTS.md
ARCHITECTURE.md
CONTRIBUTING.md
README.md
apps/
├── evaluation/                  # Local session/task runner shell (Flasto)
└── playground/                  # Future accessible browser experience boundary (Nardo)
packages/
├── camera/                      # Capture lifecycle/diagnostic boundary (Gordo)
├── vision/                      # Frame-to-observation boundary (Gordo)
├── estimator/                   # Observation-to-screen-estimate boundary (Samota)
├── stabilization/               # Temporal confidence/validity boundary (Samota)
├── calibration/                 # User calibration/validation boundary (Nardo)
└── sdk/                          # Public composition boundary (shared owners)
research/
├── baselines/                   # Future comparison adapters (Flasto + Samota)
├── datasets/                    # Manifests/provenance only; no raw video (Flasto)
└── experiments/                 # Protocol/result documentation (all owners)
tools/harness/                   # Future replay/metrics/report tooling (Flasto)
docs/
├── README.md                    # Knowledge map: authoritative docs and active work
├── decisions/
├── experiments/
├── plans/
└── product/
scripts/architecture/            # Privacy and parsed-import boundary checks
.github/workflows/ci.yml         # Required CI quality gates
```

**Structure Decision**: Use one pnpm workspace to share TypeScript contracts while keeping each
contributor's work front identifiable. Packages receive a manifest and a short responsibility
README; only root tooling has executable source in this initial scaffold. Do not add placeholder
algorithm code, frontend, or freeze unresolved SDK semantics.

The repository's developer/agent feedback harness is the local scripts, automated tests, root
verification command, and CI. Playwright is pinned for future browser features. `tools/harness` is
specifically the future gaze evaluation harness for deterministic replay, metrics, and reports; the
two harnesses are documented separately and share no implicit responsibility.

## Constitution Re-check

All gates still PASS after design. Package shells have no outward data effects, and core dependency
directions are enforced. Node.js 24 and TypeScript 7 are the required contributor runtime and
compiler; quality-tool choices must support both.

## Complexity Tracking

No constitution violations. The monorepo is explicitly approved in the architecture baseline and
supports four owners sharing contracts and verification.
