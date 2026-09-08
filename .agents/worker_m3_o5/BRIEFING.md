# BRIEFING — 2026-09-07T21:31:00Z

## Mission
Implement Milestone 3: Requirement R4 (Stripe Billing Webhook Route `/api/billing/webhook`, 5 webhook events, missing signature 400, `requireProTier` 402 middleware, zero D1 migrations, and Vitest suite).

## 🔒 My Identity
- Archetype: implementer
- Roles: implementer, qa, specialist
- Working directory: /Users/cjo/Sovereign.final/.agents/worker_m3_o5/
- Original parent: 8b912f37-c686-4313-b0e3-315fe41c30eb
- Milestone: Milestone 3 (Requirement R4)

## 🔒 Key Constraints
- Strictly preserve D1 migration immutability: target remains 0019_deprecate_manual_capacity.sql. NEVER create any new migration file.
- Exclusive write ownership: apps/worker/src/index.ts, apps/worker/src/routes/stripe.ts, apps/worker/src/billing/stripe.ts, apps/worker/src/security/tier-guard.ts, apps/worker/src/billing/stripe-webhook-route-r4.test.ts. Do not modify files outside ownership.
- Missing signature check: POST to /api/billing/webhook without stripe-signature header must return HTTP 400 with 'Invalid signature'.
- Stripe secrets read strictly from env bindings (env.STRIPE_WEBHOOK_SECRET, env.STRIPE_SECRET_KEY) — zero hardcoded secrets.
- Handle 5 webhook events: checkout.session.completed, invoice.payment_succeeded, invoice.payment_failed, customer.subscription.updated, customer.subscription.deleted.
- 402 Payment Required middleware: requireProTier guards /api/v1/workspace/pro, returning HTTP 402 if plan is not sovereign_pro.
- Zero mock/dummy cheating: all logic genuine and backed by real database state and cryptographic verification.
- Pass all gates: pnpm typecheck, pnpm test, pnpm verify:migrations, pnpm scan:secrets, pnpm verify:foundation.

## Current Parent
- Conversation ID: 8b912f37-c686-4313-b0e3-315fe41c30eb
- Updated: not yet

## Task Summary
- **What to build**: Explicit `/api/billing/webhook` route in Hono app, full 5-event handling in `stripe.ts`, `requireProTier` in `tier-guard.ts` returning 402, `PlanKey` update with `sovereign_pro`, and comprehensive Vitest test file `stripe-webhook-route-r4.test.ts`.
- **Success criteria**: All gates green, zero new migrations, 100% test pass, verified 400 and 402 responses.
- **Interface contracts**: `/Users/cjo/Sovereign.final/PROJECT.md` § Billing & Security Contract.
- **Code layout**: `/Users/cjo/Sovereign.final/PROJECT.md` § Code Layout.

## Key Decisions Made
- Used existing `stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, and `webhook_events` tables with zero new D1 migrations. Target remains 0019_deprecate_manual_capacity.sql.
- Bound `app.post('/api/billing/webhook', ...)` in `apps/worker/src/index.ts` alongside existing `/api/v1/stripe/webhook`.
- Implemented `requireProTier` in `apps/worker/src/security/tier-guard.ts` verifying `entitlements.plan === 'sovereign_pro'`, throwing HTTP 402 with structured problem detail.
- Protected `app.all('/api/v1/workspace/pro', ...)` with `requireProTier`, catching `Response` to return 402 on non-pro accounts and 200 on `sovereign_pro`.
- Added `'sovereign_pro'` to `PlanKey` in `apps/worker/src/billing/stripe.ts` and updated `PLAN_FEATURES`, `priceToSubscription`, `activeSubscription`, and `projectSubscriptionEvent`.
- Implemented full 5-event handling in `apps/worker/src/routes/stripe.ts`: `checkout.session.completed` (upserts `stripe_customers`), `invoice.payment_succeeded` (confirms `active`, updates timestamps), `invoice.payment_failed` (sets `past_due`, downgrades cache to `free`, fires `notifyBillingLifecycle(kind: 'payment_attention')`), `customer.subscription.updated` (projects updated status), `customer.subscription.deleted` (projects `canceled` and resets to `free`).
- Authored 17-test Vitest suite in `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`.

## Artifact Index
- `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/DISPATCH.md` — Assignment & Requirements
- `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/BRIEFING.md` — Persistent Memory
- `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/progress.md` — Liveness Heartbeat
- `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/handoff.md` — Handoff Report

## Change Tracker
- **Files modified**:
  - `apps/worker/src/security/tier-guard.ts`: created `requireProTier` and `isProTier`
  - `apps/worker/src/billing/stripe.ts`: added `sovereign_pro` to `PlanKey`, `PLAN_FEATURES`, `priceToSubscription`, `activeSubscription`, and `projectSubscriptionEvent`
  - `apps/worker/src/routes/stripe.ts`: added handling for `checkout.session.completed`, `invoice.payment_succeeded`, and `invoice.payment_failed`
  - `apps/worker/src/index.ts`: added `/api/billing/webhook` and `/api/v1/workspace/pro` routes
  - `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`: created 17-test suite for R4
- **Build status**: PASS (`pnpm typecheck`, `pnpm build`, `pnpm test`, `pnpm verify:migrations`, `pnpm scan:secrets`, `pnpm verify:foundation`)
- **Pending issues**: None

## Quality Status
- **Build/test result**: All 70 test files (416 tests) passing green, 0 errors
- **Lint status**: Clean, zero TypeScript errors across all 5 workspace projects
- **Tests added/modified**: `apps/worker/src/billing/stripe-webhook-route-r4.test.ts` (17 tests covering 400 signature, 5 events, 402 tier guard, and secret isolation)

## Loaded Skills
- None loaded yet
