## 2026-09-07T08:24:42Z

You are Worker Remediation for Sovereign.OS Milestone 3 Iteration 2.
Your working directory is: /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_remediation
Your parent conversation ID is: c76c6f5b-d8e4-45b7-af63-a75188c0ed34
Read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md before starting.

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File ownership:
You exclusively own edits in:
- /Users/cjo/Sovereign.final/apps/web/src/App.tsx
- /Users/cjo/Sovereign.final/apps/web/src/LandingParity.test.ts
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_remediation/

Reference reports:
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_reviewer_2/handoff.md (Identified 5 line-level findings)
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_1/handoff.md (Exact canonical copy & patch)
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_2/handoff.md (Exact line 173 fix for ui-contract-validator)
- /Users/cjo/Sovereign.final/.agents/teamwork_preview_explorer_fix_3/handoff.md (Test hardening additions)

Your mission:
1. Apply the 5 targeted fixes in apps/web/src/App.tsx:
   - Line 173: Replace `bg-[#000000]/90 backdrop-blur-md` with `bg-[#000000]` solid on Header.
   - Line 1453: Replace `What would you like to understand?` with canonical `What is active for you now?`.
   - Line 1584: Replace `placeholder="Ask Sovereign about your life..."` with canonical `placeholder="Ask Sovereign…"`.
   - Line 1594: Replace `Private by default · Model context is restricted to consenting data` with `Private by default · Sovereign uses only consented data`.
   - Line 1691: Replace `how authority flows` with `how pressure moves`.
2. Update apps/web/src/LandingParity.test.ts:
   - Add assertions for `model context`, `authority`, `Ask Sovereign about your life`, and `backdrop-blur` to prevent regressions.
3. Verification:
   - Run `node .agents/skills/ui-contract-validator.mjs` (must pass with code 0).
   - Run `pnpm test` (must pass 100%, 0 failures).
   - Run `pnpm verify:foundation` (must pass with code 0).
   - Run `pnpm typecheck` (must pass with 0 errors).
   - Run `pnpm build` (must pass with 0 errors).
4. Write your full implementation report to /Users/cjo/Sovereign.final/.agents/teamwork_preview_worker_remediation/report.md and create a self-contained handoff.md in your working directory. Then send a message back to parent.
