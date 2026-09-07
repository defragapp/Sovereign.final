# Task Assignment: Worker 1 (Visual QA & Interaction Test Suite Implementation)

## Mission
Build and execute the automated browser visual QA and interaction verification suite in /Users/cjo/teamwork_projects/sovereign_browser_audit against the live Sovereign.OS production deployment.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Authoritative Inputs
- ORIGINAL_REQUEST: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
- PROJECT: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md
- Explorer 1 Report (Tooling & Environment): /Users/cjo/Sovereign.final/.agents/explorer_survey_1/handoff.md
- Explorer 2 Report (Codebase & Live Endpoints): /Users/cjo/Sovereign.final/.agents/explorer_survey_2/handoff.md
- Spec Miner 1 Report (Requirements & Checklists): /Users/cjo/Sovereign.final/.agents/spec_miner_survey_1/handoff.md
- Repo root: /Users/cjo/Sovereign.final
- Target working directory: /Users/cjo/teamwork_projects/sovereign_browser_audit

## Scope & Implementation Requirements
In `/Users/cjo/teamwork_projects/sovereign_browser_audit`:
1. Create `package.json` (ESM module) configuring dependencies / scripts.
2. Implement `audit-runner.mjs` using Playwright Chromium (which is locally cached at `~/Library/Caches/ms-playwright/chromium-1243`).
3. Implement modular test specs in `tests/`:
   - `tests/r1-payload-styles.spec.mjs`: Live production payload & style auditing.
   - `tests/r2-visual-layout.spec.mjs`: Visual regression, scroll reveals, spotlight, Turnstile auth mounting, horizontal overflow.
   - `tests/r3-workspace-state.spec.mjs`: Interactive workspace state testing (<IridescentLoader/> shimmer/dots keyframes, .answer-direct typography scaling, .sov-tab-content 0.18s tab switching).
4. Execute `audit-runner.mjs` against live endpoints:
   - `https://sovereign.defrag.app`
   - `https://app.defrag.app`
   Across viewports:
   - Desktop: 1440x900
   - Mobile: 390x844
5. Ensure interactive testing executes authentic interactions:
   - On landing page: test scroll reveals, spotlight, demo terminal interaction.
   - On auth routes (`/login`, `/signup`): test Turnstile container mounting, passkey primary CTA, recovery divider, email fallback form.
   - On workspace state: test query submission triggering inference state, measure computed keyframe animations on `.sov-shimmer-bar` (2.4s) and `.sov-typing-dot` (1.4s), measure `.answer-direct` typography (`1rem` / `1.0625rem` md, `1.72` line-height), and test tab switching across `people`, `systems`, `explore`, and `you` views asserting `.sov-tab-content` 0.18s transition.
6. Generate outputs:
   - Screenshots in `screenshots/desktop-1440/` and `screenshots/mobile-390/`.
   - Structured JSON report in `evidence/audit-evidence.json`.
   - Markdown summary in `evidence/audit-evidence.md`.
7. Deliver full handoff report to `/Users/cjo/Sovereign.final/.agents/worker_audit_1/handoff.md`.

## 2026-09-07T11:10:27Z
You are Worker 1 (Browser QA & Interaction Test Suite Developer) on the Sovereign.OS Visual QA & Interaction Verification mission.

Read your task assignment: /Users/cjo/Sovereign.final/.agents/worker_audit_1/DISPATCH.md
Read the authoritative user request: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
Read the project scope: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md
Read the survey reports:
- /Users/cjo/Sovereign.final/.agents/explorer_survey_1/handoff.md
- /Users/cjo/Sovereign.final/.agents/explorer_survey_2/handoff.md
- /Users/cjo/Sovereign.final/.agents/spec_miner_survey_1/handoff.md
Skill reference: /Users/cjo/Sovereign.final/.agents/skills/sovereign-production-release/SKILL.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
In /Users/cjo/teamwork_projects/sovereign_browser_audit:
1. Build the automated visual QA & interaction testing harness (`audit-runner.mjs` and modular test suites in `tests/`).
2. Run the suite against live production `https://sovereign.defrag.app` and `https://app.defrag.app` across desktop (1440x900) and mobile (390x844).
3. Validate:
   - R1: Zero legacy CSS files (`public.css`, `workspace.css`, `design-system.css`) in `<head>` and network payloads. Background computes to slate `#09090b` or `#121212` (or `#000000`/`#050505`). Zero bronze overrides (`var(--bronze-accent)`). Zero glassmorphism (`backdrop-blur`).
   - R2: Scroll reveals (`whileInView`, `staggerChildren`), dark stage spotlight, Turnstile mounting into `.turnstile-slot`, passkey/email fallback hierarchy, zero horizontal scroll overflow (`overflowX <= 2px`).
   - R3: Synthetic query simulation triggering inference state, `<IridescentLoader/>` shimmer bar animation (`sov-shimmer` 2.4s) and typing dots keyframes (`sov-dot-fade` 1.4s), `.answer-direct` typography scaling (`1rem` mobile / `1.0625rem` md with `1.72` line-height), and smooth `.sov-tab-content` 0.18s tab switching across people, systems, explore, and you views without jitter.
4. Capture screenshots into `screenshots/desktop-1440/` and `screenshots/mobile-390/`.
5. Output structured evidence to `evidence/audit-evidence.json` and human-readable report `evidence/audit-evidence.md`.
6. Document commands run, test execution outputs, and verification in `/Users/cjo/Sovereign.final/.agents/worker_audit_1/handoff.md`. Report back when complete.
