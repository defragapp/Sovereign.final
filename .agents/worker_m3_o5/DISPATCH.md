# Dispatch for Worker M3: Stripe Billing Webhook Route & 402 Middleware (R4)

## Working Directory
`/Users/cjo/Sovereign.final/.agents/worker_m3_o5/`

## Role & Objectives
Implement Milestone 3: Requirement R4.
1. Strictly preserve D1 migration immutability:
   - Migration target remains `0019_deprecate_manual_capacity.sql`.
   - DO NOT create any new migration file (no `0020_*.sql` or `002_*.sql`).
   - Use existing tables `stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, and `webhook_events` from migrations `0001`, `0003`, `0004`, `0007`, `0009`.
2. Add explicit `/api/billing/webhook` route in `apps/worker/src/index.ts`:
   - Bind `app.post('/api/billing/webhook', (context) => handleStripeWebhook(context.req.raw, context.env))` alongside existing `/api/v1/stripe/webhook`.
3. Handle all 5 required events in `apps/worker/src/routes/stripe.ts`:
   - `checkout.session.completed`: link `customer` to `accountId` in `stripe_customers` table.
   - `invoice.payment_succeeded`: confirm subscription active, update timestamps.
   - `invoice.payment_failed`: set subscription to `past_due`, update entitlement cache to `free`, trigger `notifyBillingLifecycle` with `kind: 'payment_attention'`.
   - `customer.subscription.updated`: verify projection to subscription state.
   - `customer.subscription.deleted`: verify projection to canceled state.
4. Missing signature check:
   - Ensure POST to `/api/billing/webhook` without `stripe-signature` header immediately returns HTTP 400 with `'Invalid signature'`.
   - Verify Stripe secret is read strictly from `env.STRIPE_WEBHOOK_SECRET` (zero hardcoded secrets).
5. Implement 402 Payment Required middleware:
   - Create `apps/worker/src/security/tier-guard.ts` (or update `auth.ts`) defining `requireProTier(request, env)`.
   - Checks account entitlement plan; if not `sovereign_pro`, returns HTTP 402 `Payment Required` with structured JSON problem detail.
   - Mount a protected route in `apps/worker/src/index.ts` (e.g. `GET /api/v1/workspace/pro`) guarded by `requireProTier`.
   - Add `'sovereign_pro'` to `PlanKey` in `apps/worker/src/billing/stripe.ts`.
6. Create comprehensive Vitest test suite in `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`:
   - Tests 400 on missing/invalid signature.
   - Tests `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - Tests 402 on `/api/v1/workspace/pro` for non-pro accounts and 200 for `sovereign_pro`.
   - Asserts zero hardcoded secret patterns.

## Exclusive Write Ownership
- `apps/worker/src/index.ts`
- `apps/worker/src/routes/stripe.ts`
- `apps/worker/src/billing/stripe.ts`
- `apps/worker/src/security/tier-guard.ts`
- `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`

## Mandatory Reading Before Starting Work
1. `/Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md` (specifically section `## 2026-09-07T21:23:27Z`)
2. `/Users/cjo/Sovereign.final/PROJECT.md`
3. `/Users/cjo/Sovereign.final/.agents/survey_spec1_o5/handoff.md`
4. `/Users/cjo/Sovereign.final/AGENTS.md`

## Mandatory Verification
After implementing changes:
1. `pnpm typecheck` must exit 0
2. `pnpm test` must exit 0 (including `stripe-webhook-route-r4.test.ts`)
3. `pnpm verify:migrations` must exit 0
4. `pnpm scan:secrets` must exit 0
5. `pnpm verify:foundation` must exit 0

## Deliverable
Write a complete completion report to `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/handoff.md` including files modified, test outputs, and notify the orchestrator via send_message.

## 2026-09-07T21:30:50Z
<USER_REQUEST>
You are Worker M3 (Stripe Billing Webhook Route & 402 Middleware: R4).
Your working directory is /Users/cjo/Sovereign.final/.agents/worker_m3_o5/.
Read your detailed task description in /Users/cjo/Sovereign.final/.agents/worker_m3_o5/DISPATCH.md.
MANDATORY: You MUST read /Users/cjo/Sovereign.final/.agents/ORIGINAL_REQUEST.md (specifically section ## 2026-09-07T21:23:27Z) before starting work.
Also read /Users/cjo/Sovereign.final/PROJECT.md, /Users/cjo/Sovereign.final/.agents/survey_spec1_o5/handoff.md, and /Users/cjo/Sovereign.final/AGENTS.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

CRITICAL CONSTRAINT: Do NOT add any new D1 migrations! Canonical target is 0019_deprecate_manual_capacity.sql.

You have exclusive write ownership of:
- apps/worker/src/index.ts
- apps/worker/src/routes/stripe.ts
- apps/worker/src/billing/stripe.ts
- apps/worker/src/security/tier-guard.ts
- apps/worker/src/billing/stripe-webhook-route-r4.test.ts

Implement Requirement R4, run verification (pnpm typecheck, pnpm test, pnpm verify:migrations, pnpm scan:secrets, pnpm verify:foundation), deliver your completion report to /Users/cjo/Sovereign.final/.agents/worker_m3_o5/handoff.md and notify me when complete.
</USER_REQUEST>
