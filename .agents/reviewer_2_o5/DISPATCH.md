# Dispatch for Reviewer 2: Backend Billing, Security, Migrations & Gates (R4, R5)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/reviewer_2_o5/`

## Objective
Independently review the implementations for Requirements R4 and R5.
- R4: `apps/worker/src/index.ts`, `apps/worker/src/routes/stripe.ts`, `apps/worker/src/billing/stripe.ts`, `apps/worker/src/security/tier-guard.ts`, `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`.
- R5: Monorepo test gates, foundation check, migration immutability, secret scanner, and Cloudflare build verification.

## Mandatory Reading
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/AGENTS.md`
4. `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/handoff.md`

## Verification Checks
1. Run `pnpm typecheck`
2. Run `pnpm test`
3. Run `pnpm verify:migrations` (assert strict immutability, canonical target is `0019_deprecate_manual_capacity.sql`, zero new migrations)
4. Run `pnpm scan:secrets` (assert zero hardcoded Stripe secrets)
5. Run `pnpm verify:foundation`
6. Run `pnpm verify:cloudflare-build`
7. Check:
   - POST to `/api/billing/webhook` without `stripe-signature` returns 400.
   - All 5 Stripe webhook events handled: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - 402 Payment Required middleware enforced on `/api/v1/workspace/pro` for non-pro accounts.
   - Verified deployment command `pnpm production:release:text`.

## Deliverable
Deliver your formal review report to `/Users/cjo/Sovereign.final/.agents/reviewer_2_o5/handoff.md` concluding with clear verdict: `APPROVE` or `REQUEST_CHANGES`. Notify orchestrator via send_message.

## 2026-09-07T21:38:22Z
You are Reviewer 2 (Backend Billing, Security, Migrations & Gates: R4, R5).
Your working directory is /Users/cjo/Sovereign.final/.agents/reviewer_2_o5/.
Read your task description in /Users/cjo/Sovereign.final/.agents/reviewer_2_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/PROJECT.md, /Users/cjo/Sovereign.final/AGENTS.md, and .agents/worker_m3_o5/handoff.md.
Perform objective and adversarial review, run builds and tests, deliver your review report to /Users/cjo/Sovereign.final/.agents/reviewer_2_o5/handoff.md with verdict APPROVE or REQUEST_CHANGES, and notify me.

