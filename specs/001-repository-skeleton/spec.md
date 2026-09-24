# Feature Specification: Gaze Lab Repository Skeleton

**Feature Branch**: `001-repository-skeleton`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "Build the initial professional repository skeleton for Gaze Lab using
Spec Kit, based on the approved modular architecture and four-person ownership."

## User Scenarios & Testing

### User Story 1 - Start contributing from a clean checkout (Priority: P1)

A team member clones Gaze Lab, follows one concise quick-start guide, installs the project tools,
and can run the repository verification commands without needing undocumented setup.

**Why this priority**: All four contributors need a dependable shared starting point before they can
develop their separate areas.

**Independent Test**: A contributor with the documented prerequisites follows the quick start from a
fresh clone and completes full local verification successfully.

**Acceptance Scenarios**:

1. **Given** a clean checkout and the documented prerequisites, **When** a contributor follows the
   quick start, **Then** they can install dependencies and run verification.
2. **Given** a verification command fails, **When** the contributor reads the output, **Then** it
   identifies the failing check and exits unsuccessfully.

---

### User Story 2 - Find and work in an assigned area (Priority: P1)

Each team member can locate the module for their assigned front, understand its responsibility, and
make a change without importing product UI or harness code into core engine modules.

**Why this priority**: Four contributors need parallel work without hidden ownership or accidental
coupling between the camera, estimation, calibration, and evaluation areas.

**Independent Test**: A reviewer maps each owner to a documented module and runs the repository's
architecture check against deliberately allowed and prohibited dependency directions.

**Acceptance Scenarios**:

1. **Given** the repository map, **When** a team member looks up their assigned area, **Then** the
   responsible package, owner, and neighboring contract are identifiable.
2. **Given** a core package importing a playground or harness module, **When** architecture checks
   run, **Then** the check fails and reports the prohibited dependency.
3. **Given** packages with no algorithm implementation yet, **When** a contributor opens their
   package guidance, **Then** it explains the module boundary and what is intentionally deferred.

---

### User Story 3 - Preserve privacy defaults for future work (Priority: P2)

A team member can understand and verify the privacy rules before adding future camera capture or
evaluation-data handling, so a later change cannot silently introduce recording, identifiers, or
uploads into the default flow.

**Why this priority**: The project may eventually handle sensitive camera data; privacy boundaries
need to be part of the scaffold before those capabilities are introduced.

**Independent Test**: Run the privacy guard against safe and prohibited source fixtures and review
the documented defaults; no live camera or playground behavior is required.

**Acceptance Scenarios**:

1. **Given** a future code change introduces camera acquisition, persistence, or upload in an app,
   **When** the privacy guard runs, **Then** it fails with the offending file and rule.
2. **Given** approved local-only capture guidance, **When** a contributor reads the privacy
   document, **Then** no-recording-by-default, explicit research consent, deletion, and
   pseudonymous-metrics expectations are clear.

### Edge Cases

- A package's source directory is not implemented yet; package guidance and root verification still
  work without treating an empty source tree as a runtime feature.
- A contributor runs verification before installing dependencies; the quick start must identify the
  missing prerequisite and the expected setup command.
- App source directories do not exist yet; verification must tolerate that state.
- A forbidden package import is added; the architecture check must fail before the change can be
  considered verified.

## Requirements

### Functional Requirements

- **FR-001**: The repository MUST provide a concise contributor guide with prerequisites and exact
  commands to install, test, and run all local quality checks.
- **FR-002**: The repository MUST organize and document the camera, vision, estimator, calibration,
  stabilization, SDK, playground, evaluation, and harness responsibilities.
- **FR-003**: The repository MUST document the primary owner for each of the four agreed fronts:
  Gordo for camera and vision; Samota for estimation and stabilization; Nardo for calibration and
  accessible playground; Flasto for harness, metrics, integration, and CI.
- **FR-004**: The repository MUST enforce that core engine packages do not import application or
  harness code, and that future apps consume the SDK composition layer rather than bypassing it.
- **FR-005**: The repository MUST remain a frontend-free architecture/tooling skeleton; app behavior
  belongs to a later approved feature.
- **FR-006**: A single documented local verification command MUST run the configured formatting,
  type, unit tests, architecture-boundary, privacy, and build checks and return a failing exit
  status if any check fails.
- **FR-007**: Continuous integration MUST run the same required repository checks on proposed
  changes without uploading raw video or participant-identifying evaluation data.
- **FR-008**: The repository MUST initialize Spec Kit with a project constitution and a feature
  specification, plan, and task workflow available to contributors.
- **FR-009**: Package guidance MUST distinguish the responsibilities and data boundaries of core
  packages from apps and evaluation tools. Repository guidance MUST distinguish the agent/developer
  feedback harness (scripts, tests, static checks, and CI) from the gaze evaluation harness (replay,
  metrics, and reports).
- **FR-010**: The initial scaffold MUST NOT claim or implement gaze accuracy, calibration quality,
  stabilization performance, or universal camera compatibility.
- **FR-011**: The repository MUST include Playwright as prepared tooling for future browser E2E
  features; no browser test or runnable frontend is required in this skeleton.
- **FR-012**: A concise root `AGENTS.md` and a `docs/README.md` index MUST guide contributors and
  agents to the authoritative architecture, decisions, product documentation, and active Spec Kit
  work without duplicating those sources.

### Key Entities

- **Package boundary**: A named module responsibility, its allowed dependencies, public entry
  points, and primary owner.
- **Contributor workflow**: The prerequisites and repeatable commands used to set up, run, and
  verify a clean checkout.
- **Evaluation manifest**: A future description of test configuration and pseudonymous session
  metadata; the scaffold defines no participant identity or raw-video storage.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A team member with the documented prerequisites can install dependencies and run
  verification from a clean checkout in 10 minutes or less using the quick start.
- **SC-002**: All four owners can identify their package, responsibilities, and adjacent contract
  from the repository documentation in 2 minutes or less.
- **SC-003**: One root verification command completes formatting, type, unit, boundary, privacy, and
  build checks and returns nonzero when any required check is intentionally made to fail.
- **SC-004**: Playwright is pinned and available for future browser testing without requiring the
  skeleton itself to ship a frontend.
- **SC-005**: No raw video or participant-identifying data is persisted or transmitted by the
  scaffold or its default CI workflow.

## Assumptions

- This feature creates the developer-facing foundation only; real camera capture, landmark
  detection, gaze estimation, calibration, stabilization, interaction activation, and benchmark
  behavior belong to later feature specifications.
- The contributor toolchain is standardized on Node.js 24 and TypeScript 7. Dependencies use the
  latest stable versions compatible with that runtime/compiler pair, with exact resolutions recorded
  by the package manager lockfile.
- The existing approved architecture and ownership table are the source for initial module names and
  ownership; changes to shared contracts require cross-owner review.
