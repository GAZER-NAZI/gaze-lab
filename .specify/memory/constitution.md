<!--
Sync Impact Report
- Version change: template → 1.0.0 (initial project constitution)
- Modified principles: none (initial ratification)
- Added sections: Product Constraints; Development Workflow
- Removed sections: template examples and placeholders
- Follow-up TODOs: none
-->

# Gaze Lab Constitution

## Core Principles

### I. Accessibility, Agency, and Safety
The product MUST prioritize the intended user's ability to act independently, comfortably,
and safely. Gaze activation MUST be visible, adjustable, pausable, and recoverable. Consequential
actions such as sending a message MUST require deliberate confirmation. The prototype MUST NOT
be described as a clinical device or as suitable for every person or computer.

### II. Privacy by Default
Camera frames MUST be processed locally in the browser and MUST NOT be recorded, persisted, or
transmitted by default. Research recording requires explicit informed consent and a clear deletion
path. Evaluation data MUST use pseudonymous participant identifiers and MUST exclude direct
identifiers.

### III. Evidence Before Accuracy Claims
Accuracy, stability, and usability claims MUST be supported by reproducible evaluation runs.
Reports MUST identify the tested setup and configuration, include sample counts, and describe
uncertainty where possible. Early results from the four team members MUST NOT be generalized to
all users, webcams, or environments.

### IV. Modular Contracts and Shared Ownership
Camera, vision, estimation, calibration, stabilization, SDK, playground, and harness MUST remain
separable through explicit contracts. Core packages MUST NOT depend on application or evaluation
code. Changes to shared contracts MUST be reviewed by the owners on both sides of the boundary.
Primary ownership is Gordo (camera and vision), Samota (estimation and stabilization), Nardo
(calibration and accessible playground), and Flasto (harness, metrics, integration, and CI).

### V. Small, Verifiable Increments
Work MUST be divided into small increments with acceptance criteria and proportionate automated
verification. Every change to behavior or a shared contract MUST include tests at the relevant
unit or integration boundary. The team MUST prefer the simplest design that preserves replaceable
providers and measurable progress; speculative abstractions are not a reason to delay validation.

## Product Constraints

- The initial target is Chrome on desktop, tested on the four team members' computers and available
  webcams.
- The first journey is navigating a page, opening content, scrolling, and returning. Text entry and
  message preparation are later work; sending remains a separately confirmed action.
- Initial evaluation tracks task completion, time, unintended activations, calibration success,
  gaze error, jitter, latency, valid-frame rate, and actual camera settings where measurable.
- The initial prototype is an engineering research prototype, not a clinical-grade or universally
  compatible product.

## Development Workflow

Spec Kit is the project's shared source of truth for specifications, plans, and implementation
tasks. Team members MAY use Superpowers or other skills as complementary tools, but those tools
MUST NOT replace or silently contradict accepted Spec Kit artifacts. When intended behavior changes,
update the feature specification before revising downstream plan and task artifacts.

Each change MUST state its user-visible impact, tests, and evaluation implications. CI MUST check
formatting, types, tests, architecture boundaries, and builds as those capabilities are added.
Evaluation reports MUST NOT upload raw video. No accuracy claim is accepted without a reproducible
harness run.

## Governance

This constitution governs repository architecture and development decisions. Amendments require
team agreement, an updated version, and a concise explanation of the change. Versioning follows
semantic intent: MAJOR for incompatible principle changes, MINOR for new or materially expanded
principles, and PATCH for non-semantic clarification. Feature specifications and plans MUST be
checked against the constitution before implementation; conflicts MUST be resolved in favor of
the constitution or by an explicit approved amendment.

**Version**: 1.0.0 | **Ratified**: 2026-09-24 | **Last Amended**: 2026-09-24
