# Privacy and consent baseline

## Current state

This repository is a tooling and architecture skeleton. It does not capture camera data, infer gaze,
persist sessions, or transmit participant information. No participant data should be added to source
control or CI artifacts.

## Future feature requirements

- Camera frames remain on-device by default; recording is off by default and must not be implicit.
- Any research collection needs an explicit, accessible consent flow describing purpose, fields,
  retention, access, and deletion before collection starts.
- Prefer pseudonymous evaluation identifiers and collect only fields needed by an approved protocol.
  Never store direct identifiers in evaluation manifests.
- Keep raw video out of datasets and CI. Any proposed exception requires an explicit review of
  consent, security, retention, and deletion before implementation.
- Provide a clear stop path and honor consent withdrawal by stopping capture and following the
  documented deletion process for collected data.

These are design guardrails, not legal advice or a claim that a research protocol has been approved.
