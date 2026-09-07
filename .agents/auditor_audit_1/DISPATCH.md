# Task Assignment: Forensic Auditor (Integrity Forensics & Verification Authenticity)

## Mission
Perform strict forensic integrity auditing of the visual QA suite, execution traces, captured screenshots, and test artifacts in /Users/cjo/teamwork_projects/sovereign_browser_audit.

## Authoritative Inputs
- ORIGINAL_REQUEST: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
- PROJECT: /Users/cjo/Sovereign.final/.agents/orchestrator_2/PROJECT.md
- Worker 1 Handoff: /Users/cjo/Sovereign.final/.agents/worker_audit_1/handoff.md
- Test Suite Root: /Users/cjo/teamwork_projects/sovereign_browser_audit
- Evidence Files:
  - /Users/cjo/teamwork_projects/sovereign_browser_audit/evidence/audit-evidence.json
  - /Users/cjo/teamwork_projects/sovereign_browser_audit/evidence/audit-evidence.md
  - /Users/cjo/teamwork_projects/sovereign_browser_audit/screenshots/

## Forensic Integrity Instructions
1. Inspect test script source code:
   - Verify `audit-runner.mjs`, `tests/r1-payload-styles.spec.mjs`, `tests/r2-visual-layout.spec.mjs`, and `tests/r3-workspace-state.spec.mjs`.
   - Verify that tests actually launch Chromium and interact with live network endpoints rather than returning hardcoded `true` or dummy results.
2. Inspect screenshot artifacts:
   - Check files in `screenshots/desktop-1440/` and `screenshots/mobile-390/`.
   - Validate PNG binary magic bytes (`\x89PNG\r\n\x1a\n`), file dimensions (1440x900 vs 390x844), file sizes, and non-empty content.
3. Validate evidence telemetry:
   - Check `evidence/audit-evidence.json` for genuine timestamps, HTTP response codes, and computed style measurements.
4. Deliver your binary verdict (`CLEAN` or `INTEGRITY VIOLATION`) with detailed forensic analysis to `/Users/cjo/Sovereign.final/.agents/auditor_audit_1/handoff.md`. Report back when complete.

## 2026-09-07T11:21:02Z
<USER_REQUEST>
You are the Forensic Integrity Auditor on the Sovereign.OS Visual QA & Interaction Verification mission.

Read your task assignment: /Users/cjo/Sovereign.final/.agents/auditor_audit_1/DISPATCH.md
Read the authoritative user request: /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md
Read Worker 1 handoff: /Users/cjo/Sovereign.final/.agents/worker_audit_1/handoff.md

Conduct a rigorous forensic integrity audit:
1. Inspect the test code in /Users/cjo/teamwork_projects/sovereign_browser_audit (audit-runner.mjs, tests/*.spec.mjs) to verify tests are authentic, genuinely interact with live production, and do not contain hardcoded or mocked pass values.
2. Forensically inspect generated screenshots in screenshots/desktop-1440/ and screenshots/mobile-390/ (validate PNG headers, dimensions, file integrity).
3. Validate telemetry and measurements in evidence/audit-evidence.json and evidence/audit-evidence.md.
4. Deliver your binary verdict (CLEAN or INTEGRITY VIOLATION) in /Users/cjo/Sovereign.final/.agents/auditor_audit_1/handoff.md. Report back when complete.
</USER_REQUEST>
