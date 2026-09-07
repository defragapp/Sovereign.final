# Autonomous Visual QA & Interaction Verification Plan

## Objective
Execute autonomous visual QA & interaction verification for live Sovereign.OS production deployment across https://sovereign.defrag.app and https://app.defrag.app.

## Milestones

### Milestone 1: Survey & Test Infrastructure Setup
- Explore available test tooling, existing Playwright setups in Sovereign.final, and live site accessibility.
- Initialize test runner harness and working directory in `/Users/cjo/teamwork_projects/sovereign_browser_audit`.
- Confirm network connectivity and live endpoint status.

### Milestone 2: R1 - Live Production Payload & Style Auditing
- Automated browser testing across `https://sovereign.defrag.app` and `https://app.defrag.app` on desktop (1440x900) and mobile (390x844).
- Assert zero presence of legacy CSS files (`public.css`, `workspace.css`, `design-system.css`) in `<head>` or network requests.
- Verify computed background slate `#09090b` or `#121212`.
- Verify zero bronze tints (`var(--bronze-accent)`) or forbidden glassmorphism (`backdrop-blur`).
- Record structured audit reports and screenshots in `~/teamwork_projects/sovereign_browser_audit/r1_payload_style/`.

### Milestone 3: R2 - Visual Regression & Layout Verification
- Verify landing page scroll reveals (`whileInView`, `staggerChildren`).
- Verify dark stage spotlight effects.
- Verify auth modal Turnstile widget mounting with passkey/email fallback hierarchy.
- Assert zero horizontal scroll overflow at both 1440x900 and 390x844.
- Record visual proof screenshots in `~/teamwork_projects/sovereign_browser_audit/r2_visual_layout/`.

### Milestone 4: R3 - Interactive Workspace State Testing
- Simulate synthetic query flow to trigger AI generation state.
- Verify `<IridescentLoader/>` shimmer bar animation (`.sov-shimmer-bar` and `.sov-typing-dot` keyframes active).
- Verify `.answer-direct` typography scaling (`1rem` / `1.0625rem` md, `1.72` line-height).
- Verify smooth `.sov-tab-content` 0.18s tab switching across `people`, `systems`, `explore`, and `you` views without jitter.
- Record timing traces, computed style logs, and interaction recordings in `~/teamwork_projects/sovereign_browser_audit/r3_interactive/`.

### Milestone 5: Independent Verification, Review & Forensic Audit
- Dispatch independent Reviewers and Challengers to execute tests and inspect generated artifacts.
- Dispatch Forensic Auditor to check compliance, authenticity, and lack of synthetic fabrication.
- Deliver final synthesis, `handoff.md`, and report to Sentinel.
