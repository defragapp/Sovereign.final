# Handoff Report: Milestone 3 — Stripe Billing Webhook Route & 402 Middleware (R4)

**Date**: 2026-09-07T21:38:00Z  
**Worker**: Worker M3 (`implementer`, `qa`, `specialist`)  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/worker_m3_o5/`  
**Parent Agent**: `8b912f37-c686-4313-b0e3-315fe41c30eb`  

---

## 1. Observation

### 1.1 Files Modified and Created
Under exclusive write ownership, the following files were modified or created:
1. `apps/worker/src/security/tier-guard.ts` (NEW):
   - Defines `requireProTier(request: Request, env: Env): Promise<AuthContext>`.
   - Checks `entitlements.plan === 'sovereign_pro'`. If not, throws HTTP 402 `Payment Required` Response with structured JSON problem detail:
     `{ type: 'https://sovereign.defrag.app/problems/payment-required', error: 'payment_required', message: 'This protected workspace route requires the sovereign_pro subscription tier.', requiredTier: 'sovereign_pro', currentPlan: entitlements.plan, upgradeUrl: 'https://sovereign.defrag.app/pricing' }`.
   - Defines `isProTier(env: Env, accountId: string): Promise<boolean>`.
2. `apps/worker/src/billing/stripe.ts` (MODIFIED):
   - Extended `PlanKey`: `export type PlanKey = 'free' | 'sovereign_plus' | 'sovereign_pro';` (line 4).
   - Added `'sovereign_pro'` to `PLAN_FEATURES` with all feature keys (line 123).
   - Added price mapping support for `'sovereign_pro'` in `priceToSubscription` (lines 138–152) honoring `STRIPE_PRICE_SOVEREIGN_PRO_MONTHLY` and `STRIPE_PRICE_SOVEREIGN_PRO_ANNUAL` as well as test price fixtures.
   - Updated `activeSubscription` (line 160) to check `plan_key IN ('sovereign_plus', 'sovereign_pro')`.
   - Updated `projectSubscriptionEvent` (lines 381–383) to recognize `'sovereign_pro'` as a paid tier when calculating `effectivePlan`.
3. `apps/worker/src/routes/stripe.ts` (MODIFIED):
   - Added explicit handling for `checkout.session.completed`: extracts `customer` and `accountId` (from metadata or `client_reference_id`), normalizes email if present, upserts into `stripe_customers` table, marks event processed in `webhook_events`, and returns HTTP 200 `{ received: true, projected: true, customerLinked: true, accountId, customerId }` (lines 123–155).
   - Added explicit handling for `invoice.payment_succeeded`: confirms subscription active in `stripe_subscriptions`, updates timestamps (`updated_at = datetime('now')`), refreshes `entitlement_cache`, marks event processed in `webhook_events`, and returns HTTP 200 `{ received: true, processed: true, subscriptionConfirmed: true }` (lines 157–205).
   - Added explicit handling for `invoice.payment_failed`: updates `stripe_subscriptions` status to `'past_due'`, downgrades `entitlement_cache` to `'free'`, triggers `notifyBillingLifecycle` with `kind: 'payment_attention'`, marks event processed in `webhook_events`, and returns HTTP 200 `{ received: true, processed: true, paymentFailed: true }` (lines 207–258).
   - Maintained existing subscription lifecycle projection for `customer.subscription.updated` and `customer.subscription.deleted` via `normalizeSubscriptionEvent` and `projectSubscriptionEvent`.
4. `apps/worker/src/index.ts` (MODIFIED):
   - Imported `requireProTier` from `./security/tier-guard` (line 5).
   - Added route binding `app.post('/api/billing/webhook', (context) => handleStripeWebhook(context.req.raw, context.env));` directly on Hono application alongside existing `/api/v1/stripe/webhook` (line 102).
   - Mounted protected route `app.all('/api/v1/workspace/pro', async (context) => { ... })` guarded by `requireProTier`, catching `Response` to return HTTP 402 on non-pro accounts and returning HTTP 200 `{ ok: true, tier: 'sovereign_pro', accountId: auth.accountId }` on pro accounts (lines 389–402).
5. `apps/worker/src/billing/stripe-webhook-route-r4.test.ts` (NEW):
   - Comprehensive 17-test Vitest suite covering all aspects of Requirement R4: missing/invalid signature 400 rejection, all 5 Stripe webhook events, idempotency deduplication, 402 payment required enforcement, 200 on `sovereign_pro`, and zero hardcoded secrets.

### 1.2 Gate Verification Results
All gate commands were executed directly on the repository:
- `pnpm typecheck`: Exited 0 (0 errors across all 5 workspace projects: `@sovereign/contracts`, `@sovereign/agent-contracts`, `@sovereign/web`, `@sovereign/sovereign-worker`, `@sovereign/worker`).
- `pnpm test`: Exited 0. All 70 test files (416 tests in worker + web tests) passed green.
- `pnpm verify:migrations`: Exited 0. Validated 19 D1 migration files for non-destructive structure. Verified immutable upgrade target remains `0019_deprecate_manual_capacity.sql`. Zero new migrations added.
- `pnpm scan:secrets`: Exited 0. "No committed secret patterns detected."
- `pnpm verify:foundation`: Exited 0. Foundation verified: 5 required files, JSON valid, core D1 tables present.
- `pnpm build`: Exited 0. Client bundle and worker dry-run deploy succeeded.

---

## 2. Logic Chain

1. **D1 Migration Immutability**:
   - *Observation*: `scripts/verify-migration-upgrade.mjs` checks `prior.at(-1) !== '0018_workers_ai_capacity_reservations.sql' || files.at(-1) !== '0019_deprecate_manual_capacity.sql'`.
   - *Observation*: Existing D1 schema from migrations `0001`, `0003`, `0004`, `0007`, and `0009` already defines tables `stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, and `webhook_events`.
   - *Inference*: Adding a new migration file would violate the immutable sequence gate.
   - *Deduction*: All webhook events (`checkout.session.completed`, `invoice.*`, `customer.subscription.*`) can be persisted completely within the existing schema. No new migration was created, and `pnpm verify:migrations` passed with exit code 0.

2. **Missing & Invalid Signature Rejection**:
   - *Observation*: `handleStripeWebhook` evaluates `verifyStripeSignature({ body, header: signature, secret: env.STRIPE_WEBHOOK_SECRET })`. When `stripe-signature` header is absent or invalid, `verifyStripeSignature` returns `false`.
   - *Observation*: `handleStripeWebhook` line 92 returns `new Response('Invalid signature', { status: 400 })`.
   - *Inference*: Requests to `/api/billing/webhook` or `/api/v1/stripe/webhook` without valid signature are immediately rejected with HTTP 400 and body text `'Invalid signature'`.
   - *Verification*: Verified in `stripe-webhook-route-r4.test.ts` for both missing and forged signatures.

3. **Five Webhook Events Handling**:
   - *Observation*: In `routes/stripe.ts`, `HANDLED_EVENTS` includes `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, and `SUBSCRIPTION_EVENTS` (`customer.subscription.updated`, `customer.subscription.deleted`, etc.).
   - *Observation*: `checkout.session.completed` maps `customer` to `accountId` in `stripe_customers`, resolving `client_reference_id` or `metadata.account_id`.
   - *Observation*: `invoice.payment_succeeded` confirms `status = 'active'`, updates timestamps, and maintains active cache state.
   - *Observation*: `invoice.payment_failed` updates subscription status to `past_due`, falls back entitlement cache to `free`, and fires `notifyBillingLifecycle(kind: 'payment_attention')`.
   - *Observation*: `customer.subscription.updated` and `deleted` continue through `normalizeSubscriptionEvent` and `projectSubscriptionEvent`, updating status and entitlement cache accordingly.
   - *Verification*: Verified across 5 dedicated unit tests in `stripe-webhook-route-r4.test.ts`.

4. **402 Payment Required Middleware**:
   - *Observation*: `requireProTier(request, env)` authenticates the request via `requireAuth(request, env)` (throwing 401 if unauthenticated) and inspects `getEntitlements(env, auth.accountId).plan`.
   - *Observation*: If `entitlements.plan !== 'sovereign_pro'`, it throws HTTP 402 with structured problem detail.
   - *Observation*: `/api/v1/workspace/pro` is mounted in `apps/worker/src/index.ts` guarded by `requireProTier`.
   - *Verification*: Verified in `stripe-webhook-route-r4.test.ts` that unauthenticated requests return 401, `free` and `sovereign_plus` accounts return 402, and `sovereign_pro` accounts return 200.

5. **Secret Isolation**:
   - *Observation*: `STRIPE_WEBHOOK_SECRET` and `STRIPE_SECRET_KEY` are read strictly from `env` bindings in `apps/worker/src/routes/stripe.ts` and `apps/worker/src/billing/stripe.ts`.
   - *Observation*: `pnpm scan:secrets` scans all tracked files for secret prefixes (`sk-live-`, `sk_test_`, `whsec_`) and exited with code 0.
   - *Verification*: Zero hardcoded secrets exist in source code or test fixtures.

---

## 3. Caveats

- **Test Fixtures & Secret Keys**: In-memory test suites use mock signing strings (e.g. `'test_stripe_webhook_signing_secret'`) for cryptographic HMAC simulation. In live production Cloudflare deployment, secrets are provisioned solely via Cloudflare Worker encrypted environment secrets.
- **Production Stripe Price IDs**: For production deployment of `sovereign_pro`, Cloudflare Worker environment variables `STRIPE_PRICE_SOVEREIGN_PRO_MONTHLY` and `STRIPE_PRICE_SOVEREIGN_PRO_ANNUAL` should be populated with the live Stripe price IDs.
- No other caveats.

---

## 4. Conclusion

Requirement R4 is completely implemented, verified, and integrated into the Sovereign codebase:
- Direct `/api/billing/webhook` route bound in `apps/worker/src/index.ts`.
- Missing and forged signatures immediately rejected with HTTP 400 `'Invalid signature'`.
- All 5 lifecycle webhook events handled with database state projection and lifecycle notifications.
- 402 Payment Required middleware (`requireProTier`) implemented in `apps/worker/src/security/tier-guard.ts` and protecting `/api/v1/workspace/pro`.
- `PlanKey` updated with `'sovereign_pro'` across the billing domain.
- Zero new D1 migrations created; canonical migration target immutable at `0019_deprecate_manual_capacity.sql`.
- Zero hardcoded secrets; passes `pnpm scan:secrets`.
- All gates (`typecheck`, `test`, `verify:migrations`, `scan:secrets`, `verify:foundation`, `build`) exit with code 0.

---

## 5. Verification Method

To independently verify this implementation, run:

```bash
# 1. Verify TypeScript compilation across all workspace projects (must exit 0)
pnpm typecheck

# 2. Run the full Vitest test suite including stripe-webhook-route-r4.test.ts (must exit 0)
pnpm test

# 3. Run the dedicated R4 test suite specifically (must exit 0, 17 passing tests)
pnpm --filter @sovereign/worker exec vitest run src/billing/stripe-webhook-route-r4.test.ts

# 4. Verify D1 migrations immutability (0018 -> 0019, zero new migrations, must exit 0)
pnpm verify:migrations

# 5. Scan repository for hardcoded secrets (must exit 0)
pnpm scan:secrets

# 6. Verify foundation manifest and database invariants (must exit 0)
pnpm verify:foundation

# 7. Run dry-run build for web and worker (must exit 0)
pnpm build
```

Invalidation conditions:
- Any new file added under `apps/worker/migrations/`.
- `pnpm typecheck` failing on `PlanKey` or `tier-guard.ts`.
- `POST /api/billing/webhook` returning non-400 on missing signature.
- `GET /api/v1/workspace/pro` returning non-402 on `free` or `sovereign_plus` accounts.
