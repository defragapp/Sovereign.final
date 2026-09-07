# Task Assignment: Worker 2 (Remediation Execution & Test Suite Polish)

## Mission
Apply the comprehensive remediation patch from Iteration 1, update apps/web/src/App.tsx and the test suite in /Users/cjo/teamwork_projects/sovereign_browser_audit, build and verify the web package, re-run all test specs and the master audit runner, and emit updated, clean evidence.

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Authoritative Inputs
- Remediation Strategy & Handoff: /Users/cjo/Sovereign.final/.agents/explorer_remediation_1/handoff.md
- Unified Remediation Patch: /Users/cjo/Sovereign.final/.agents/explorer_remediation_1/remediation.patch
- Forensic Auditor Report: /Users/cjo/Sovereign.final/.agents/auditor_audit_1/handoff.md
- Reviewer 1 Report: /Users/cjo/Sovereign.final/.agents/reviewer_audit_1/handoff.md
- Challenger 1 Report: /Users/cjo/Sovereign.final/.agents/challenger_audit_1/handoff.md
- ORIGINAL_REQUEST: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
- PROJECT: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md
- Repo root: /Users/cjo/Sovereign.final
- Test suite root: /Users/cjo/teamwork_projects/sovereign_browser_audit

## Scope & Implementation Instructions
1. Apply the unified patch `/Users/cjo/Sovereign.final/.agents/explorer_remediation_1/remediation.patch`:
   - `apps/web/src/App.tsx`:
     - Line 1492: add `overflow-hidden` to the relative container of `<ReferenceField />` to fix the 56px mobile/tablet horizontal overflow.
     - Lines 1410 & 1480: add `overflow-x-hidden` to workspace container and `<main>`.
     - Line 2066: add `overflow-x-hidden` to `PageFrame` to fix the 17px overflow on 320px screens.
     - Lines 175 & 186: refine `Header` inner padding (`px-4 sm:px-8`) and button cluster gap (`gap-2.5 sm:gap-4`).
   - `apps/web/src/components/ui/GlassCard.tsx`:
     - Line 10: remove `backdrop-blur-xl`.
   - `/Users/cjo/teamwork_projects/sovereign_browser_audit/tests/helpers.mjs`:
     - Enhance `captureScreenshot` with heading wait and 800ms settle delay.
     - Add explicit disclosure header to `configureAuthenticatedRoutes`.
   - `/Users/cjo/teamwork_projects/sovereign_browser_audit/tests/r1-payload-styles.spec.mjs`:
     - Fix screenshot name prefix (`target.domain === DOMAINS.app ? 'app' : 'marketing'`).
   - `/Users/cjo/teamwork_projects/sovereign_browser_audit/tests/r2-visual-layout.spec.mjs`:
     - Fix screenshot name prefix.
     - Completely remove synthetic `document.createElement('div')` and `data-turnstile-rendered="true"`. Inspect authentic live DOM for `.turnstile-slot` and Turnstile iframes.
     - Remove fabricated passkey hierarchy assertion. Inspect authentic live DOM for passkey buttons and recovery divider. Honestly record presence/absence.
   - `/Users/cjo/teamwork_projects/sovereign_browser_audit/tests/r3-workspace-state.spec.mjs`:
     - Add explicit disclosure note regarding client-side test fixtures.
     - Measure initial empty state horizontal overflow before interaction and assert `<= 2px`.
   - `/Users/cjo/teamwork_projects/sovereign_browser_audit/audit-runner.mjs`:
     - Add `executionTelemetry` with transparent route mocking disclosure.
     - Accurately map `authHierarchyAndGateVerified` and telemetry flags.
2. Verify web build and tests in Sovereign.final:
   - `pnpm --filter @sovereign/web test`
   - `pnpm --filter @sovereign/web build`
3. Execute the full test suite in `/Users/cjo/teamwork_projects/sovereign_browser_audit`:
   - `node tests/r1-payload-styles.spec.mjs`
   - `node tests/r2-visual-layout.spec.mjs`
   - `node tests/r3-workspace-state.spec.mjs`
   - `node tests/challenger-adversarial-stress.spec.mjs`
   - `node audit-runner.mjs`
4. Verify updated evidence:
   - `evidence/audit-evidence.json`
   - `evidence/audit-evidence.md`
   - Captured screenshots in `screenshots/desktop-1440/` and `screenshots/mobile-390/`.


## 2026-09-07T11:30:14Z
You are Worker 2 (Remediation Specialist) on the Sovereign.OS Visual QA & Interaction Verification mission.

Read your task assignment: /Users/cjo/Sovereign.final/.agents/worker_remediation_1/DISPATCH.md
Read the authoritative user request: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
Read the project scope: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md
Read the remediation strategy & unified patch:
- Strategy: /Users/cjo/Sovereign.final/.agents/explorer_remediation_1/handoff.md
- Unified Patch: /Users/cjo/Sovereign.final/.agents/explorer_remediation_1/remediation.patch
Read previous audit & review reports:
- Forensic Auditor: /Users/cjo/Sovereign.final/.agents/auditor_audit_1/handoff.md
- Reviewer 1: /Users/cjo/Sovereign.final/.agents/reviewer_audit_1/handoff.md
- Challenger 1: /Users/cjo/Sovereign.final/.agents/challenger_audit_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Instructions:
1. Apply the modifications from the unified patch across /Users/cjo/Sovereign.final (apps/web/src/App.tsx, GlassCard.tsx) and /Users/cjo/teamwork_projects/sovereign_browser_audit (helpers.mjs, r1-payload-styles.spec.mjs, r2-visual-layout.spec.mjs, r3-workspace-state.spec.mjs, audit-runner.mjs).
2. Run build and tests in Sovereign.final:
   - `pnpm --filter @sovereign/web test`
   - `pnpm --filter @sovereign/web build`
3. Execute all test specs and the master runner in /Users/cjo/teamwork_projects/sovereign_browser_audit:
   - `node tests/r1-payload-styles.spec.mjs`
   - `node tests/r2-visual-layout.spec.mjs`
   - `node tests/r3-workspace-state.spec.mjs`
   - `node tests/challenger-adversarial-stress.spec.mjs`
   - `node audit-runner.mjs`
4. Confirm:
   - Zero synthetic DOM injection in test scripts.
   - Authentic DOM queries and truthful reporting for Turnstile and Passkey.
   - Full disclosure of route mocking in telemetry.
   - Initial empty-state workspace overflow on mobile 390x844 is measured and verified <= 2px (0px).
   - 320px legal page overflow is fixed and verified <= 2px (0px).
   - Screenshots captured with proper settle delay and clean headings.
5. Deliver your full report to /Users/cjo/Sovereign.final/.agents/worker_remediation_1/handoff.md and report back when finished.
