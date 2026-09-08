# Dispatch for Survey Spec Miner (Backend Billing Webhook & Gate Testing Suite)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/survey_spec1_o5/`

## Objective
Investigate the codebase for Requirements R4 (Stripe Billing Webhook Route) and R5 (Gate Testing & Deployment Verification).

## Mandatory Inputs to Read
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/AGENTS.md`
3. Backend code in `apps/sovereign-worker/src/`:
   - D1 migrations: check migrations, verify 0004 (`0004_stripe_customers.sql`) and 0009 (`0009_production_scale_and_billing_safety.sql`), confirm canonical target is `0019_deprecate_manual_capacity.sql`. Confirm NO new D1 migration should be created.
   - Worker route handling in `apps/sovereign-worker/src/index.ts` or routes directory.
   - Current `/api/billing/webhook` or `/api/billing/*` handlers.
   - Check environment bindings (where is Stripe webhook secret defined/read? e.g. `c.env.STRIPE_WEBHOOK_SECRET` or similar). Confirm no hardcoded secrets!
   - Event handling for:
     1. `checkout.session.completed`
     2. `invoice.payment_succeeded`
     3. `invoice.payment_failed`
     4. `customer.subscription.updated`
     5. `customer.subscription.deleted`
   - 402 Payment Required middleware: where should it be applied, how to check `sovereign_pro` tier?
   - Missing signature header check: assert POST to `/api/billing/webhook` without `stripe-signature` returns 400.
4. Gate Testing Infrastructure:
   - Run commands and examine configurations: `pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm verify:foundation`.
   - Look at existing tests, especially `PublicSupport.test.ts` and `LandingParity.test.ts`.
   - Check how tests can be added to verify R4 (Stripe webhook events, 400 on missing signature, 402 payment required).
   - Check deployment command `pnpm production:release:text` and release scripts.

## Output Requirement
Write a comprehensive report to `/Users/cjo/Sovereign.final/.agents/survey_spec1_o5/handoff.md` with:
- Current state observation
- Schema analysis from migrations 0004 and 0009
- Concrete implementation plan for `/api/billing/webhook` and 402 middleware
- Current gate test results and test plan for R4 and R5
- Verification strategy

## 2026-09-07T21:24:48Z
You are Survey Spec Miner (Backend Billing Webhook & Gate Testing Suite).
Your working directory is /Users/cjo/Sovereign.final/.agents/survey_spec1_o5/.
Read your detailed task description in /Users/cjo/Sovereign.final/.agents/survey_spec1_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/AGENTS.md.
Investigate the codebase for Requirements R4 (Stripe Billing Webhook Route) and R5 (Gate Testing & Deployment Verification).
Verify current test results (pnpm typecheck, pnpm build, pnpm test, pnpm verify:foundation), migrations 0004 & 0009, and Stripe webhook handling.
Deliver your comprehensive handoff report to /Users/cjo/Sovereign.final/.agents/survey_spec1_o5/handoff.md and notify me when complete.

