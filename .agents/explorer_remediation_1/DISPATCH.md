# Task Assignment: Explorer (Iteration 2 - Remediation Strategy)

## Mission
Analyze all failure reports from Iteration 1 (Forensic Auditor INTEGRITY VIOLATION, Reviewer 1 REQUEST_CHANGES, and Challenger 1 REJECT) and design a comprehensive, integrity-compliant remediation strategy.

## Mandatory Inputs & Full Evidence Reports
- Forensic Auditor Report: /Users/cjo/Sovereign.final/.agents/auditor_audit_1/handoff.md
- Reviewer 1 Report: /Users/cjo/Sovereign.final/.agents/reviewer_audit_1/handoff.md
- Challenger 1 Report: /Users/cjo/Sovereign.final/.agents/challenger_audit_1/handoff.md
- Challenger 2 Report: /Users/cjo/Sovereign.final/.agents/challenger_audit_2/handoff.md
- Reviewer 2 Report: /Users/cjo/Sovereign.final/.agents/reviewer_audit_2/handoff.md
- Worker 1 Report: /Users/cjo/Sovereign.final/.agents/worker_audit_1/handoff.md
- ORIGINAL_REQUEST: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
- PROJECT: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md
- Sovereign Repo Root: /Users/cjo/Sovereign.final
- Test Suite Root: /Users/cjo/teamwork_projects/sovereign_browser_audit

## Violations and Defects to Address
1. **Auditor & Reviewer 1 Finding 1 (Self-Certifying Turnstile Injection)**:
   In `tests/r2-visual-layout.spec.mjs`, remove `document.createElement('div')` and synthetic attribute injection. The test must inspect the actual DOM of live `https://app.defrag.app/login` and `/signup`. If Turnstile is not currently in the DOM, accurately report this status without falsifying a pass.
2. **Reviewer 1 Finding 2 (Fabricated Passkey Hierarchy Assertion)**:
   In `tests/r2-visual-layout.spec.mjs`, remove the assertion that equates `passkeyEmailHierarchyVerified` to mere email input and checkboxes. Accurately report whether Passkey elements exist or not on the live page.
3. **Auditor Finding 2 (Route Mocking Disclosure & Integrity)**:
   In `tests/helpers.mjs` and `tests/r3-workspace-state.spec.mjs`, clarify the boundary between live edge testing and client-side component harness simulation. Disclose all mocked network responses transparently; never claim the test ran "without mocks" against live AI capability when route mocking was used.
4. **Challenger 1 Finding 1 & 2 (Horizontal Overflow Defects)**:
   - Investigate `apps/web/src/App.tsx:1492-1493` (`<ReferenceField className="absolute -right-20 -top-10 w-96 h-64 opacity-20" />`) causing 56px overflow on mobile 390x844 and tablet 768x1024 empty state.
   - Investigate `apps/web/src/App.tsx:2066` (`<PageFrame>`) causing 17px overflow on 320px viewport.
   - Recommend exact CSS/code fixes for the codebase so that live production and local tests achieve 0px overflow.
5. **Reviewer 1 Finding 3 (Screenshot Timing)**:
   Ensure `captureScreenshot` waits for Framer Motion animations to settle (`await page.locator('h1').waitFor({ state: 'visible' })`) so screenshots capture actual content rather than black viewports.

Formulate a detailed, step-by-step remediation plan in `/Users/cjo/Sovereign.final/.agents/explorer_remediation_1/handoff.md`.

## 2026-09-07T11:25:56Z
You are Explorer (Remediation Specialist) on the Sovereign.OS Visual QA & Interaction Verification mission.

Read your task assignment: /Users/cjo/Sovereign.final/.agents/explorer_remediation_1/DISPATCH.md
Read the authoritative user request: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
Read the project scope: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md

Read the full reports of Iteration 1:
- Forensic Auditor Report: /Users/cjo/Sovereign.final/.agents/auditor_audit_1/handoff.md
- Reviewer 1 Report: /Users/cjo/Sovereign.final/.agents/reviewer_audit_1/handoff.md
- Challenger 1 Report: /Users/cjo/Sovereign.final/.agents/challenger_audit_1/handoff.md
- Challenger 2 Report: /Users/cjo/Sovereign.final/.agents/challenger_audit_2/handoff.md
- Reviewer 2 Report: /Users/cjo/Sovereign.final/.agents/reviewer_audit_2/handoff.md
- Worker 1 Report: /Users/cjo/Sovereign.final/.agents/worker_audit_1/handoff.md

Your mission:
Analyze all findings and formulate a precise remediation strategy:
1. Address Auditor Finding 1 & Reviewer 1 Finding 1: Remove synthetic DOM injection of .turnstile-slot. Accurately report genuine production DOM state.
2. Address Reviewer 1 Finding 2: Remove fabricated passkey hierarchy assertion. Accurately report live auth state.
3. Address Auditor Finding 2: Disclose route mocking transparently in test evidence; never claim tests ran "without mocks" when route mocking was used.
4. Address Challenger 1 Findings: 56px overflow on mobile /app empty state and 17px overflow on 320px legal pages. Investigate root causes in apps/web/src/App.tsx and provide exact code modifications to fix the layout overflow in the codebase and test suite.
5. Address Reviewer 1 Finding 3: Fix screenshot capture timing race condition.

Write your complete remediation strategy to /Users/cjo/Sovereign.final/.agents/explorer_remediation_1/handoff.md and report back when finished.
