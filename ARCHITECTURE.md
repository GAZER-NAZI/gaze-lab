# Architecture and ownership

The workspace establishes boundaries only; packages do not yet expose gaze APIs or implement camera,
vision, estimation, stabilization, calibration, or interaction behavior.

| Area                                                        | Owner  | Responsibility                                               |
| ----------------------------------------------------------- | ------ | ------------------------------------------------------------ |
| `packages/camera` and `packages/vision`                     | Gordo  | Browser capture lifecycle and frame-to-observation pipeline  |
| `packages/estimator` and `packages/stabilization`           | Samota | Gaze estimate, confidence, temporal filtering, and validity  |
| `packages/calibration` and `apps/playground`                | Nardo  | User calibration and accessible browser experience           |
| `tools/harness`, `apps/evaluation`, CI and research tooling | Flasto | Reproducible evaluation, metrics, integration and automation |
| `packages/sdk`                                              | Shared | Compose agreed module contracts into a browser-facing API    |

`packages/` must remain independent of apps and tools. The future playground should depend on the
SDK rather than bypassing it. Package-to-package dependencies must remain acyclic and flow through
reviewed contracts. The mechanical rules live in `scripts/architecture/check-boundaries.mjs`.

The developer/agent feedback harness is `pnpm verify`, tests, static checks, and CI. By contrast,
`tools/harness` is reserved for gaze replay, evaluation metrics, and reports. There is no frontend
or runnable demo in this skeleton.

For product context and design rationale, use [docs/README.md](docs/README.md) and the active Spec
Kit artifacts rather than duplicating decisions here.
