# Dispatch for Forensic Auditor: Comprehensive Integrity & Anti-Cheat Forensics

## Working Directory
`/Users/cjo/Sovereign.final/.agents/auditor_1_o5/`

## Role & Objectives
Perform an exhaustive, objective Forensic Integrity Audit across all changes made in Milestones M1, M2, and M3.

## Audit Checks
1. Hardcoded Output & Cheating Detection:
   - Check if any test suite or implementation hardcodes fake returns, dummy facades, mocked success values, or circumvents the intended logic.
   - Inspect `apps/web/src/components/chat/SovereignThread.tsx`, `apps/web/src/components/fragments/*`, `apps/web/src/PublicLanding.v2.tsx`.
   - Inspect `apps/worker/src/security/tier-guard.ts`, `apps/worker/src/routes/stripe.ts`, `apps/worker/src/billing/stripe.ts`, `apps/worker/src/index.ts`.
2. D1 Migrations Invariant Check:
   - Confirm that NO new migration was added (no `0020_*.sql` or `002_subscription_status.sql`).
   - Run `pnpm verify:migrations`.
3. Language Law Compliance Forensics:
   - Search for forbidden terms: "Basis" (as visible UI label), "sovereign-answer.v2", "model-safe context", "server-approved".
   - Confirm Sources drawer label is "Sources" / "Source details", never "Basis".
4. Security & Secret Leak Forensics:
   - Run `pnpm scan:secrets`.
   - Confirm Stripe secret keys and webhook secrets are read from `env` bindings, never hardcoded.
5. Gate Integrity:
   - Run `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm verify:foundation`.

## Mandatory Reading
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/AGENTS.md`
4. `/Users/cjo/Sovereign.final/docs/product-language-system.md`

## Deliverable
Deliver your comprehensive Forensic Audit Report to `/Users/cjo/Sovereign.final/.agents/auditor_1_o5/handoff.md` concluding with an explicit verdict: `CLEAN` or `INTEGRITY VIOLATION`.
Notify the orchestrator via send_message.

## 2026-09-07T21:38:22Z
You are the Forensic Auditor (Forensic Integrity & Anti-Cheat Auditor).
Your working directory is /Users/cjo/Sovereign.final/.agents/auditor_1_o5/.
Read your task description in /Users/cjo/Sovereign.final/.agents/auditor_1_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/PROJECT.md, /Users/cjo/Sovereign.final/AGENTS.md, and /Users/cjo/Sovereign.final/docs/product-language-system.md.
Perform exhaustive integrity checks: check for hardcoded test results, facade implementations, D1 migration immutability, language law violations, secret leaks, and gate verification. Deliver your forensic audit report to /Users/cjo/Sovereign.final/.agents/auditor_1_o5/handoff.md with verdict CLEAN or INTEGRITY VIOLATION, and notify me.
