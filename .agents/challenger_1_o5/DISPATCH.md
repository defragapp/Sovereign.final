# Dispatch for Challenger 1: Empirical Adversarial Challenge (Frontend, Chat & Language Laws)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/challenger_1_o5/`

## Objective
Adversarially challenge the frontend work products (R1, R2, R3).
Design and execute empirical stress tests, edge case validations, and copy law assertions:
1. Language Law Hard Assertions:
   - Scan all user-facing JSX in `apps/web/src/components/chat/SovereignThread.tsx`, `apps/web/src/components/fragments/*`, and `apps/web/src/PublicLanding.v2.tsx`.
   - Assert zero occurrences of forbidden terms: "Basis" (as a visible UI label), "sovereign-answer.v2", "model-safe context", "server-approved", "provenance score".
   - Confirm Sources drawer trigger is "Sources" / "See source details" and drawer header is "Source details".
2. UI Fragment Integrity:
   - Validate `SystemMapViewFragment.tsx` SVG syntax — ensure no negative radii, undefined coordinates, unclosed tags, or console errors.
   - Validate `BaselineViewFragment.tsx` renders above the fold and makes zero network calls.
   - Validate `ExpressionViewFragment.tsx` renders raw inquiry vs breakdown with zero network calls.
3. Chat Composer Auto-resize Stress Test:
   - Test textarea behavior with 0 lines, 1 line, 10 lines (exceeding 200px), and multiline input with Shift+Enter.
   - Verify `scrollHeight` clamping between 44px and 200px.
4. Passkey Badge Conditionality:
   - Test rendering when `hasVerifiedPasskey=true`, `session.hasPasskey=true`, `session.passkeyVerified=true`, and when all are false/undefined.
5. Idempotency Key Contract:
   - Verify that SSE message requests include `x-idempotency-key` with unique UUIDs.

## Mandatory Reading
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/AGENTS.md`
4. `/Users/cjo/Sovereign.final/docs/product-language-system.md`

## Deliverable
Deliver your adversarial test report to `/Users/cjo/Sovereign.final/.agents/challenger_1_o5/handoff.md` concluding with clear verdict: `APPROVE` (if all tests pass) or `FAIL` (with reproducible counterexample). Notify orchestrator via send_message.
