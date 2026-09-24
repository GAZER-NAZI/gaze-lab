# Gaze Lab: architecture design

**Status:** Approved architecture baseline; feature implementation is tracked through Spec Kit

**Date:** 2026-09-23

**Repository:** `gaze-lab`

## 1. Purpose

Gaze Lab is an independent project to research, evaluate, and build a browser-based gaze-control
engine. Its long-term purpose is to help people with ALS and other motor disabilities use a computer
through gaze, with enough control to carry out tasks that matter to them.

The first prototype will be tested by one or more members of the four-person team, using Chrome on
desktop computers and the webcams available to the team. It is an engineering prototype, not a claim
of clinical-grade performance or universal compatibility.

## 2. Product sequence

The first complete interaction should let a person navigate a web page, open content, scroll, and
return. The next milestone adds text entry through an on-screen keyboard and lets the person prepare
a message. Sending is a separate action with a clear confirmation and a way to cancel.

This sequence keeps the first validation focused on gaze estimation and reliable target activation
while preserving a path toward communication and broader browser use.

## 3. Decisions agreed by the team

- **Initial platform:** Chrome desktop.
- **Initial test setup:** the four team members' computers and webcams.
- **First user journey:** navigate and open content; text entry and message preparation follow in a
  later milestone.
- **Evaluation:** record task completion, time to completion, unintended activations, calibration
  success, gaze error, jitter, and latency.
- **Video privacy:** process camera frames locally and do not save video by default.
- **Evaluation data:** retain technical metrics without identifying the participant. Recording video
  for research requires explicit consent and a clear deletion path.
- **Team size:** four people, each with a primary functional area: camera/vision,
  estimation/stabilization, calibration/accessibility demo, and evaluation harness/integration/CI.
- **Project name:** `gaze-lab` is the repository name. A public product name can be chosen later
  with input from intended users.

## 4. Architecture proposal

Use one modular repository. The browser SDK, demo, experiments, and evaluation harness share typed
contracts and can evolve together. Keep package dependencies directed toward the SDK composition
layer; the estimator must not depend on the demo or the harness.

```text
Browser camera
  → frame and device diagnostics
  → face/eye/iris landmarks and head pose
  → personalized gaze estimator
  → confidence and temporal stabilization
  → public SDK gaze samples
  → accessible browser interaction layer

Evaluation harness observes the same capture and prediction pipeline,
replays controlled sessions, and reports comparable metrics.
```

### Proposed repository map

```text
AGENTS.md                         # Short navigation map for agents and contributors
ARCHITECTURE.md                   # Current module boundaries and dependency rules
docs/
  product/                        # User journeys and acceptance criteria
  decisions/                      # Accepted architecture decision records
  plans/                          # Active and completed execution plans
  experiments/                    # Hypotheses, protocols, and results
  superpowers/specs/              # Reviewed design documents
packages/
  camera/                         # Browser camera lifecycle and diagnostics
  vision/                         # Face, eye, iris, blink, and pose observations
  estimator/                      # Vision features to screen gaze estimates
  calibration/                    # Personalized calibration and validation
  stabilization/                  # Filtering, confidence, and lost-tracking behavior
  sdk/                            # Public API composing the packages
apps/
  playground/                     # Interactive demo and diagnostics
  evaluation/                     # Task runner and session controls
research/
  baselines/                      # WebGazer and other comparison adapters
  datasets/                       # Dataset manifests and provenance, not raw video
  experiments/                    # Offline analysis and model experiments
tools/
  harness/                        # Replay, metric calculation, and report generation
.github/workflows/                # CI checks and reproducible evaluation jobs
```

This is the target map, not a requirement to implement every package on day one. The current
repository skeleton establishes package boundaries, ownership, documentation, and quality tooling
only. Runtime modules, the browser playground, and evaluation behavior will be implemented through
later feature specs, starting with an agreed vertical slice.

## 5. Package responsibilities and contracts

- `camera` owns permission, device selection, stream lifecycle, actual resolution/FPS diagnostics,
  and frame timestamps. It does not infer gaze.
- `vision` turns frames into observations such as landmarks, face presence, blink state, and head
  pose. It does not choose screen coordinates.
- `estimator` maps observations to a screen point and confidence. It can be replaced or benchmarked
  independently.
- `calibration` gathers labeled fixations, fits user-specific parameters, and validates the result.
  It must report insufficient or poor-quality data instead of silently accepting it.
- `stabilization` smooths valid estimates, rejects implausible jumps, and marks stale or
  low-confidence tracking as invalid. It must not convert missing data into a confident point.
- `sdk` exposes stable lifecycle and subscription APIs and composes the packages.
- `playground` and `evaluation` consume the SDK; product UI must not be imported by core packages.
- `harness` evaluates the same SDK/provider contracts used by the playground and records the exact
  configuration and dataset manifest for each run.

The public sample should carry at least normalized or viewport coordinates, a monotonic timestamp,
validity, and confidence. The team will settle the coordinate convention and whether confidence is
scalar or structured before freezing the first SDK API. Camera frames and raw recordings must not
cross into analytics or network services by default.

## 6. Evaluation harness

The harness is a core project capability, not a later reporting add-on. It should support:

1. A repeatable task protocol with target locations and expected actions.
2. A live mode for testing the team's real webcams.
3. A replay mode for deterministic comparisons using consented, documented test material.
4. A baseline adapter for WebGazer, so candidate estimators receive equivalent inputs and evaluation
   tasks where technically possible.
5. Reports for task completion, time, unintended activation count, calibration success, gaze error,
   jitter, latency, valid-frame rate, and actual camera settings.
6. Versioned manifests describing participant pseudonym, device/camera class, browser version,
   session protocol, consent status, and software/model configuration. Manifests must avoid direct
   identifiers.

The first runs establish the baseline; numeric improvement thresholds will be selected after
observing the team's hardware and variation between people. Results must show sample counts and
uncertainty where possible so a small test is not presented as general proof.

## 7. Accessibility and interaction safety

- Use large, well-spaced targets in the playground and evaluation flows.
- Make dwell activation visible, adjustable, and cancellable.
- Provide an explicit way to pause gaze control and recover from an accidental activation.
- Avoid requiring dragging or blink-triggered actions in the first milestone.
- Keep composing a message separate from sending it; sending requires deliberate confirmation.
- Evaluate fatigue and user-reported comfort alongside technical accuracy as soon as intended users
  participate.

The playground validates the engine and interaction patterns. It does not imply that arbitrary
third-party websites can be made fully accessible by the SDK alone; browser-level support and site
semantics remain relevant constraints.

## 8. Four-person ownership

| Area                                  | Primary owner | Main interface                                               |
| ------------------------------------- | ------------- | ------------------------------------------------------------ |
| Camera and vision                     | Gordo         | Timestamped frames and vision observations                   |
| Estimation and stabilization          | Samota        | Gaze sample, confidence, and validity                        |
| Calibration and accessible playground | Nardo         | Calibration flow and browser interaction behavior            |
| Harness, metrics, integration, and CI | Flasto        | Protocols, reports, compatibility gates, and SDK integration |

Changes to shared contracts receive review from the owners on both sides of the boundary.

## 9. Repository and agent workflow

- `AGENTS.md` is a concise map, not a copy of all engineering guidance.
- `ARCHITECTURE.md` describes current module boundaries and allowed dependency direction.
- Product decisions and experiments are versioned under `docs/`; chat history is not the source of
  truth.
- CI checks formatting, types, unit/integration tests, architecture boundaries, and builds.
  Evaluation jobs publish comparable reports without uploading raw video.
- Playwright is part of the pinned toolchain for future browser features. Each feature that adds
  browser behavior should define appropriate E2E coverage; the repository skeleton has no browser
  app or E2E test.
- Each PR states the user-visible behavior, tests, and benchmark impact. Accuracy claims link to a
  reproducible harness run.
- Keep changes small enough that an engineer or agent can understand the module and its contract
  without loading the whole repository.
- Periodically check documentation against the implementation and remove obsolete guidance.

### Initial contributor toolchain

- Node.js 24 is the sole supported runtime for the initial repository.
- TypeScript 7 is the required compiler. Select the latest stable versions of supporting tools that
  officially support this runtime/compiler pair; keep exact resolutions in the pnpm lockfile.
- Use TypeScript-Go-backed Oxlint type-aware checks rather than a linter/parser that does not
  officially support TypeScript 7.

## 10. Approaches considered

### Recommended: modular monorepo

Core packages, SDK, playground, and harness share contracts and release together. This supports four
contributors and makes end-to-end evaluation straightforward. The risk of coupling is controlled
with enforced dependency rules and package-level tests.

### Alternative: separate SDK and research repositories

This gives research experiments more freedom, but duplicates contracts and makes it easier for
evaluation to drift from the shipped SDK. It may be reconsidered if the research pipeline later
needs independent release or compute infrastructure.

### Alternative: build the SDK first and add the harness later

This reaches a visual demo quickly, but makes accuracy claims difficult to reproduce and encourages
tuning by anecdote. It conflicts with the project's central goal of measurable improvement, so it is
not recommended.

## 11. Open technical decisions for the first implementation plan

These decisions should be resolved with small documented experiments before they become long-term
commitments:

- Which browser vision runtime and landmark model provide the best balance of landmark quality,
  startup time, and performance on the team's hardware?
- Whether offline research scripts need a separate Python toolchain; the shared browser/workspace
  baseline is TypeScript 7 on Node.js 24.
- What exact gaze coordinate convention and confidence contract should the public SDK expose?
- What task protocol and test targets produce a reliable baseline across four different people and
  cameras?
- Which model and session metadata can be retained while keeping the no-video-by-default privacy
  promise?

The first architecture does not promise a particular accuracy or claim superiority over WebGazer.
Those claims require measurements against the baseline on more than one person and camera.

## 12. Acceptance criteria for the architecture

- A contributor can locate the source of camera, vision, estimation, calibration, stabilization,
  SDK, and evaluation behavior from the repository map.
- Core packages have explicit input/output contracts and do not import apps or harness code.
- A new estimator can be compared to the baseline without changing the playground's task
  implementation.
- A live test reports actual camera settings and all agreed evaluation metrics that can be measured
  in that run.
- No camera recording is persisted or transmitted by default.
- The first implementation plan can deliver the browser navigation/open-content journey as a
  vertical slice and defer on-screen text entry to the next milestone.
