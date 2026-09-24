---
description: "Dependency-ordered tasks for the Gaze Lab repository skeleton"
---

# Tasks: Gaze Lab Repository Skeleton

**Input**: Design documents from `specs/001-repository-skeleton/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/architecture.md`, and `quickstart.md`

**Tests**: Include automated checks for root verification, privacy rules, and dependency boundaries,
as required by the spec and constitution.

**Organization**: Tasks are grouped by user story for traceability; shared workspace/tool setup is
foundational.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish reproducible Node/pnpm workspace and root quality commands.

- [x] T001 Create root `package.json`, `pnpm-workspace.yaml`, `.npmrc`, `.node-version`, and
      `.gitignore` requiring Node.js 24 and pinning the selected stable pnpm 12 release.
- [x] T002 Add latest stable compatible dependencies for TypeScript 7, Oxlint with
      `oxlint-tsgolint`, Prettier, Vitest 5, Playwright Test, `@babel/parser`, and Node 24 types;
      add root TypeScript, lint, test, and formatting configuration. Do not configure a frontend or
      browser test yet.
- [x] T003 Add root scripts for build, lint, typecheck (recursive, optional per workspace), test,
      `check:boundaries`, `check:privacy`, `format:check`, and `verify` to `package.json`; make
      `verify` fail if any required command fails.
- [x] T004 Add root `README.md` with project purpose, prerequisites, exact setup/verification
      commands, explicit no-frontend status, and how to find Spec Kit artifacts; add
      `docs/README.md` as a concise map of authoritative knowledge, active Spec Kit work, and
      decisions.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create package shells and enforce architectural guardrails before story-specific work.

- [x] T005 [P] Create package manifests and responsibility READMEs in `packages/camera/`,
      `packages/vision/`, `packages/estimator/`, `packages/stabilization/`, `packages/calibration/`,
      `packages/sdk/`, `apps/playground/`, `apps/evaluation/`, and `tools/harness/` using
      `@gaze-lab/<name>` workspace names.
- [x] T006 [P] Add workspace guides in `research/baselines/README.md`,
      `research/datasets/README.md`, `research/experiments/README.md`, and
      `docs/{product,decisions,experiments,plans}/README.md`; explicitly prohibit raw video and
      direct identifiers in dataset guidance and distinguish the developer/agent harness from the
      gaze evaluation harness.
- [x] T007 [P] Write privacy-guard tests and safe/prohibited fixtures in
      `scripts/architecture/check-privacy.test.mjs` and `scripts/architecture/fixtures/privacy/`;
      run them and confirm they fail because the guard does not exist yet.
- [x] T008 [P] Write dependency-boundary tests and safe/prohibited fixtures in
      `scripts/architecture/check-boundaries.test.mjs` and
      `scripts/architecture/fixtures/boundaries/`; run them and confirm they fail because the
      boundary checker does not exist yet.
- [x] T009 Implement `scripts/architecture/check-privacy.mjs` with configurable `--root`; scan app
      source when present, and pass safely before app source exists.
- [x] T010 Implement `scripts/architecture/check-boundaries.mjs` with a TypeScript-syntax AST parser
      to forbid core-package imports from `apps/` or `tools/`, forbid playground imports from
      packages other than SDK, and prohibit circular dependencies.
- [x] T011 Add `.github/workflows/ci.yml` using Node.js 24, install the pinned pnpm toolchain, and
      run `pnpm verify` on pull requests and pushes.

**Checkpoint**: Workspace installs, package manifests resolve, and root verification passes with
architecture/privacy guards safely handling app areas that have no source yet.

---

## Phase 3: User Story 1 - Start Contributing From a Clean Checkout (Priority: P1) 🎯 MVP

**Goal**: A contributor can install the workspace and run all local checks with one documented
workflow.

**Independent Test**: Follow `specs/001-repository-skeleton/quickstart.md` from a clean checkout and
`pnpm verify` passes.

### Tests for User Story 1

- [x] T012 [P] [US1] Add unit tests for root architecture and privacy guardrails; no app smoke tests
      are in scope.
- [x] T013 [P] [US1] Keep Playwright Test available in the pinned root toolchain for a later browser
      feature; do not create an E2E test before a browser feature exists.

### Implementation for User Story 1

- [x] T014 [US1] Keep app directories as responsibility shells only; create no HTML, frontend
      source, server, or runnable demo.
- [x] T015 [US1] Ensure workspace and root quality scripts work without app source or package-local
      runtime dependencies.
- [x] T016 [US1] Complete onboarding and contributor workflow in `CONTRIBUTING.md` and
      `specs/001-repository-skeleton/quickstart.md`, including missing-prerequisite troubleshooting
      and explicit no-frontend scope.

**Checkpoint**: A team member can independently install and verify the repository from a clean
checkout.

---

## Phase 4: User Story 2 - Find and Work in an Assigned Area (Priority: P1)

**Goal**: Each contributor can find their package, responsibility, neighboring contract, and review
boundary.

**Independent Test**: Map all four owners to the package guidance and confirm an intentionally
forbidden import fails `pnpm check:boundaries`.

### Tests for User Story 2

- [x] T017 [P] [US2] Verify `scripts/architecture/check-boundaries.test.mjs` covers
      package-to-app/harness, playground-to-non-SDK, circular-import failures, and an acyclic
      package-to-package pass.

### Implementation for User Story 2

- [x] T018 [US2] Write `ARCHITECTURE.md` with the package map, allowed dependency direction,
      API-free status of the skeleton, and owner assignments: Gordo, Samota, Nardo, and Flasto.
- [ ] T019 [US2] Add concise `AGENTS.md` navigation guidance to `docs/README.md` and
      `ARCHITECTURE.md`. Add `.github/CODEOWNERS` after the team provides verified GitHub usernames
      or team handles; do not invent handles.
- [x] T020 [US2] Run `pnpm check:boundaries` and document the expected prohibited-import
      failure/pass behavior in `CONTRIBUTING.md`.

**Checkpoint**: Owners and package boundaries are discoverable and enforced without creating a gaze
API prematurely.

---

## Phase 5: User Story 3 - Preserve Privacy Defaults (Priority: P2)

**Goal**: The privacy contract is clear and its guardrails reject unreviewed capture, persistence,
and upload behavior.

**Independent Test**: Run the privacy guard against safe and prohibited source fixtures and review
the local-only/no-recording-by-default policy without requiring app behavior.

### Implementation for User Story 3

- [x] T021 [US3] Add `docs/product/privacy-and-consent.md` describing local-only future capture, no
      recording by default, explicit research consent, deletion expectations, and pseudonymous
      metrics.
- [x] T022 [US3] Verify `scripts/architecture/check-privacy.test.mjs` reports camera acquisition,
      persistence, and upload violations and passes its safe fixture.

**Checkpoint**: Privacy defaults are documented and enforced before future capture or
evaluation-data features are added.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Confirm traceability and ensure the scaffold is a reproducible baseline.

- [x] T023 [P] Add `.editorconfig` and update root documentation links to
      `docs/superpowers/specs/2026-09-23-gaze-lab-architecture-design.md` and the active Spec Kit
      feature artifacts.
- [x] T024 Run `pnpm verify` and the full clean-checkout steps in
      `specs/001-repository-skeleton/quickstart.md`; fix failures and mark this task complete only
      after all required checks pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; creates reproducible workspace and root commands.
- **Foundational (Phase 2)**: Depends on Setup; creates module shells, boundary tooling, and CI.
- **User Stories (Phases 3-5)**: Depend on Setup and Foundational; privacy guard tests and tools are
  part of the foundation.
- **Polish (Phase 6)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2; delivers the first usable contributor flow.
- **US2 (P1)**: Starts after Phase 2; package shells are present; its docs and boundary tests are
  independently reviewable.
- **US3 (P2)**: Starts after Phase 2; privacy policy and guard tests are independent of playground
  implementation.

### Parallel Opportunities

- T005 and T006 can run in parallel because they create separate package and documentation trees.
- T007 and T008 tests can be authored in parallel; T009 and T010 implementations follow their
  respective RED runs.
- T012 establishes guardrail tests; T013 only makes Playwright available for a future browser
  feature.
- T017 can be validated alongside T018 because test fixtures and architecture documentation are
  separate files.

## Parallel Example: Setup and Package Documentation

```text
Task: T002 Add shared TypeScript/lint/format/E2E configs and dependencies
Task: T005 Create package manifests and responsibility READMEs
Task: T006 Add research/docs area guides
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 to make a clean clone install and verify.
3. Validate US1 with the quickstart from a clean checkout.
4. Complete US2 boundary/ownership guidance and US3 privacy guardrails before treating the repo as
   ready for parallel engine development.

### Incremental Team Strategy

After the shared workspace and root scripts are stable, owners can add detailed module behavior in
separate Spec Kit features. Cross-owner contracts are reviewed by both affected owners. The
repository-skeleton feature does not assign future camera or estimator algorithms to this branch.
