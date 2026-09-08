# Dispatch for Challenger 2: Empirical Adversarial Challenge (Backend Billing, Security & Migrations)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/challenger_2_o5/`

## Objective
Adversarially challenge the backend billing, routing, security, and migration contracts (R4 & R5).
Design and execute empirical stress tests and edge cases:
1. Missing & Forged Stripe Signatures:
   - Send POST to `/api/billing/webhook` with:
     - No `stripe-signature` header -> must return 400
     - Empty `stripe-signature: ""` -> must return 400
     - Malformed timestamp -> must return 400
     - Invalid HMAC signature -> must return 400
     - Timestamp older than 300 seconds -> must return 400
2. Five Webhook Events State Mutation:
   - `checkout.session.completed`: verify account is mapped in `stripe_customers`.
   - `invoice.payment_succeeded`: verify active subscription timestamp update.
   - `invoice.payment_failed`: verify subscription set to `past_due`, entitlement downgraded to `free`, and notification fired.
   - `customer.subscription.updated` & `deleted`: verify projection.
3. 402 Payment Required Edge Cases:
   - Unauthenticated request to `/api/v1/workspace/pro` -> 401
   - Authenticated account with plan `'free'` -> 402
   - Authenticated account with plan `'sovereign_plus'` -> 402
   - Authenticated account with plan `'sovereign_pro'` -> 200
4. D1 Migration Sequence Stress Test:
   - Check `apps/worker/migrations/`.
   - Assert `0019_deprecate_manual_capacity.sql` is strictly the latest file.
   - Run `pnpm verify:migrations`.
5. Secret Leak Verification:
   - Run `pnpm scan:secrets`.
   - Verify no secrets in source files or environment fixtures.

## Mandatory Reading
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/AGENTS.md`

## Deliverable
Deliver your adversarial challenge report to `/Users/cjo/Sovereign.final/.agents/challenger_2_o5/handoff.md` concluding with clear verdict: `APPROVE` (if all tests pass) or `FAIL` (with reproducible counterexample). Notify orchestrator via send_message.

## 2026-09-07T21:38:22Z
You are Challenger 2 (Backend Billing, Security & Migrations).
Your working directory is /Users/cjo/Sovereign.final/.agents/challenger_2_o5/.
Read your task description in /Users/cjo/Sovereign.final/.agents/challenger_2_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/PROJECT.md and /Users/cjo/Sovereign.final/AGENTS.md.
Adversarially challenge backend billing contracts, missing signatures (400), 5 events, 402 middleware, migration immutability, deliver your report to /Users/cjo/Sovereign.final/.agents/challenger_2_o5/handoff.md with verdict APPROVE or FAIL, and notify me.

