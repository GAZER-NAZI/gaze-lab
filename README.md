# Gaze Lab

Gaze Lab is a research and engineering project exploring browser-based gaze control to help people
with ALS and other motor disabilities use a computer. The agreed first product journey is web
navigation and opening content; writing and sending messages are also important product interests.

This repository is currently an architecture and tooling skeleton only. It contains no frontend,
demo, camera capture, gaze inference, calibration flow, or accuracy claims. Package directories and
ownership guides define where future work belongs; implementation starts through reviewed Spec Kit
features.

## Requirements

- Node.js 24 (the repository pins the supported patch in `.node-version`).
- Corepack and Git.

## Clone and verify

```powershell
corepack enable pnpm
pnpm install --frozen-lockfile
pnpm verify
```

Start a feature from the relevant package after its Spec Kit scope is agreed; there is no app to
launch yet. The repository's quality harness checks formatting, lint, types, unit tests, package
boundaries, privacy rules, and builds. Playwright is included for browser-level tests when the first
browser feature is specified; this skeleton has no E2E page or camera permission flow.

## Start here

- [Contributor instructions](CONTRIBUTING.md)
- [Architecture and owners](ARCHITECTURE.md)
- [Knowledge index](docs/README.md)
- [Active repository-skeleton feature](specs/001-repository-skeleton/)
- [Project constitution](.specify/memory/constitution.md)

## Team fronts

- Gordo — camera and vision (`packages/camera`, `packages/vision`).
- Samota — estimation and stabilization (`packages/estimator`, `packages/stabilization`).
- Nardo — calibration and accessible playground (`packages/calibration`, `apps/playground`).
- Flasto — harness, metrics, integration, and CI (`tools/harness`, `apps/evaluation`, research
  tooling).
