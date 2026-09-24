# Architecture Boundary Contract

## Package responsibilities

| Package                   | Owns                                                   | Primary owner |
| ------------------------- | ------------------------------------------------------ | ------------- |
| `@gaze-lab/camera`        | Browser capture lifecycle and camera diagnostics       | Gordo         |
| `@gaze-lab/vision`        | Frame-to-face/eye/pose observations                    | Gordo         |
| `@gaze-lab/estimator`     | Observations-to-screen-gaze estimate                   | Samota        |
| `@gaze-lab/stabilization` | Temporal filtering, confidence, stale/invalid tracking | Samota        |
| `@gaze-lab/calibration`   | Personalized calibration and quality validation        | Nardo         |
| `@gaze-lab/sdk`           | Public lifecycle/subscription API composing packages   | Shared owners |
| `@gaze-lab/playground`    | Future accessible browser experience consuming the SDK | Nardo         |
| `@gaze-lab/evaluation`    | Local task/session UI consuming SDK and reports        | Flasto        |
| `@gaze-lab/harness`       | Replay, metrics, manifests, and comparable reports     | Flasto        |

The terms “harness” refer to two different concerns. The developer/agent feedback harness consists
of repository scripts, unit tests, `pnpm verify`, and CI. Playwright is reserved for future browser
features. `tools/harness` is the gaze evaluation harness for controlled replay, metrics, and
reports. Keep these responsibilities separate in names and documentation.

## Dependency rules

1. Core packages under `packages/` MUST NOT import from `apps/` or `tools/`.
2. The playground MUST consume the SDK composition boundary, not reach into implementation packages
   directly.
3. The evaluation app and harness MUST NOT be imported by core packages.
4. No package may create a circular dependency.
5. Package owners on both sides MUST review changes to shared contracts.

## Future playground contract

- No playground behavior is implemented in this skeleton. A future feature MUST consume the SDK
  boundary and include browser tests appropriate to its user flows and privacy requirements.

## Public API deferred

The SDK's gaze sample coordinate convention and confidence/validity schema are intentionally not
defined here. A later feature spec must record the team's evidence-based decision before the API is
published.
