# Data Model: Gaze Lab Repository Skeleton

This feature creates developer-facing repository metadata and module boundaries. It does not create
persisted application or participant data.

## Repository Package

- **Name**: Stable workspace package name such as `@gaze-lab/camera`.
- **Area**: Camera, vision, estimator, stabilization, calibration, SDK, playground, evaluation, or
  harness responsibility.
- **Owner**: Primary accountable contributor, as recorded in the approved architecture baseline.
- **Dependencies**: Explicit package imports permitted by the architecture boundary rules.
- **Status**: Scaffold-only until the package's behavior has its own reviewed feature spec.

## Contributor Workflow

- **Prerequisites**: Supported Node.js version, pnpm version, and Git.
- **Commands**: Install, run, test, and verify commands documented in the repository root.
- **Result**: Human-readable status and a nonzero process exit when a required check fails.

## Evaluation Manifest (future-facing reference only)

- **Purpose**: Describe a future run's pseudonymous participant, browser/device class, protocol,
  consent status, and software/model configuration.
- **Privacy rule**: No direct identifiers or raw video; no manifest is produced by the scaffold.
- **Lifecycle**: A later evaluation feature will define the exact schema before any run data is
  collected.

## Explicitly Not Modeled Yet

Gaze coordinates, confidence representation, calibration samples/models, camera frame payloads,
vision landmarks, participant identity, and raw recordings are not frozen by this scaffold.
