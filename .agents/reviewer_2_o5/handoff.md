# Review & Adversarial Challenge Report: Backend Billing, Security, Migrations & Gates (R4, R5)

**Reviewer**: Reviewer 2 (`reviewer`, `critic`)  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/reviewer_2_o5/`  
**Parent Agent**: `8b912f37-c686-4313-b0e3-315fe41c30eb`  
**Date**: 2026-09-07T21:42:00Z  
**Verdict**: **APPROVE**  

---

## 1. Observation

### 1.1 Implementation Files Inspected
1. `apps/worker/src/security/tier-guard.ts` (Lines 1–31):
   - `requireProTier(request: Request, env: Env): Promise<AuthContext>`:
     - Calls `requireAuth(request, env)`.
     - Calls `getEntitlements(env, auth.accountId)`.
     - Validates `entitlements.plan === 'sovereign_pro'`.
     - Throws HTTP 402 with structured RFC 7807/9457 problem detail if plan is not `sovereign_pro`:
       ```json
       {
         "type": "https://sovereign.defrag.app/problems/payment-required",
         "error": "payment_required",
         "message": "This protected workspace route requires the sovereign_pro subscription tier.",
         "requiredTier": "sovereign_pro",
         "currentPlan": entitlements.plan,
         "upgradeUrl": "https://sovereign.defrag.app/pricing"
       }
       ```
     - Sets headers `'content-type': 'application/json'` and `'cache-control': 'private, no-store'`.
   - `isProTier(env: Env, accountId: string): Promise<boolean>`:
     - Checks `(await getEntitlements(env, accountId)).plan === 'sovereign_pro'`.

2. `apps/worker/src/index.ts`:
   - Line 5: `import { requireProTier } from './security/tier-guard';`
   - Lines 101–102:
     ```ts
     app.post('/api/billing/webhook', (context) => handleStripeWebhook(context.req.raw, context.env));
     app.post('/api/v1/stripe/webhook', (context) => handleStripeWebhook(context.req.raw, context.env));
     ```
   - Lines 389–401:
     ```ts
     app.all('/api/v1/workspace/pro', async (context) => {
       try {
         const auth = await requireProTier(context.req.raw, context.env);
         return context.json({
           ok: true,
           tier: 'sovereign_pro',
           accountId: auth.accountId
         });
       } catch (error) {
         if (error instanceof Response) return error;
         throw error;
       }
     });
     ```

3. `apps/worker/src/routes/stripe.ts`:
   - Lines 88–93:
     ```ts
     const body = await request.text();
     const signature = request.headers.get('stripe-signature') ?? '';
     const valid = await verifyStripeSignature({ body, header: signature, secret: env.STRIPE_WEBHOOK_SECRET });
     if (!valid) return new Response('Invalid signature', { status: 400 });
     ```
   - Lines 102–114: Event deduplication using `webhook_events` table (`ON CONFLICT(provider, event_id) DO NOTHING`) and returning `{ received: true, duplicate: true, processed: true }` if already processed.
   - Lines 116–127: `HANDLED_EVENTS` set containing `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, and `SUBSCRIPTION_EVENTS`.
   - Lines 130–161: `checkout.session.completed`: links `customerId` to `accountId` in `stripe_customers` table, updates `webhook_events`.
   - Lines 163–219: `invoice.payment_succeeded`: updates subscription status to `active`, updates `entitlement_cache` for `sovereign_plus` or `sovereign_pro`, updates `webhook_events`.
   - Lines 221–279: `invoice.payment_failed`: updates subscription status to `past_due`, resets `entitlement_cache` to `free`, triggers `notifyBillingLifecycle(kind: 'payment_attention')`, updates `webhook_events`.
   - Lines 280–304: `customer.subscription.updated` & `customer.subscription.deleted`: projects subscription status, updates `entitlement_cache` with out-of-order event protection, fires lifecycle notifications.

4. `apps/worker/src/billing/stripe.ts`:
   - Line 4: `export type PlanKey = 'free' | 'sovereign_plus' | 'sovereign_pro';`
   - Lines 121–125: `PLAN_FEATURES` configured with full `FEATURE_KEYS` for `sovereign_pro`.
   - Lines 140–146, 149–154: `priceToSubscription` maps `STRIPE_PRICE_SOVEREIGN_PRO_MONTHLY` and `STRIPE_PRICE_SOVEREIGN_PRO_ANNUAL` to `{ plan: 'sovereign_pro' }`.
   - Lines 172–178: `activeSubscription` queries `plan_key IN ('sovereign_plus', 'sovereign_pro')`.
   - Lines 381–383: `projectSubscriptionEvent` sets `effectivePlan` to `sovereign_pro` for active `sovereign_pro` subscriptions.

5. `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`:
   - 17 unit tests verifying missing signature (400), forged signature (400), all 5 events, deduplication, 401 unauthenticated, 402 on free/plus, 200 on pro, and zero hardcoded secrets.

### 1.2 Automated Tool Commands & Results
All commands were executed directly by Reviewer 2 in `/Users/cjo/Sovereign.final`:
- `pnpm typecheck`: Exit code 0. Zero TypeScript errors across all 5 workspace projects (`@sovereign/contracts`, `@sovereign/agent-contracts`, `@sovereign/web`, `@sovereign/sovereign-worker`, `@sovereign/worker`).
- `pnpm test`: Exit code 0. All 70 test files passed (416 tests green in worker packages, plus web tests).
- `pnpm --filter @sovereign/worker exec vitest run src/billing/stripe-webhook-route-r4.test.ts`: Exit code 0. 17 passed.
- `pnpm --filter @sovereign/worker exec vitest run src/billing/`: Exit code 0. 52 passed across 7 test suites.
- `pnpm verify:migrations`: Exit code 0. Validated 19 D1 migration files for non-destructive structure. Verified upgrade path `0018_workers_ai_capacity_reservations.sql -> 0019_deprecate_manual_capacity.sql`. Zero new migrations added.
- `pnpm scan:secrets`: Exit code 0. "No committed secret patterns detected."
- `pnpm verify:foundation`: Exit code 0. 5 required files present, JSON valid, core D1 tables present.
- `pnpm build`: Exit code 0. Web bundle generated (451 KiB js, 476 KiB css) and worker dry-run deploy succeeded.
- Smoke suites (`smoke:stripe`, `smoke:auth`, `smoke:baseline`, `smoke:jobs`, `smoke:worker-gateway`, `smoke:product`, `smoke:release-closure`): All exit code 0.
- Verifier scripts (`scan:production-fixtures`, `verify:release-config`, `verify:production-release`, `verify:intelligence-release`, `verify:visual-intelligence`, `verify:premium-platform`, `verify:worker-bundle-size`): All exit code 0.
- `pnpm verify:cloudflare-build`: Exit code 0. All 24 automated release build stages passed green. Commit SHA verified: `ead8cbfcd9410440f3cf1c46f7b7f69f97c43f0d`.

### 1.3 Adversarial Stress Testing Results
Executed custom stress test scenarios via `tsx -e`:
- Test 1 (Missing signature header): Correctly rejected with HTTP 400 `'Invalid signature'`.
- Test 2 (Expired timestamp >300s): Correctly rejected with HTTP 400 `'Invalid signature'`.
- Test 3 (Forged HMAC digest): Correctly rejected with HTTP 400 `'Invalid signature'`.
- Test 4 (Multiple v1 signatures in header): Validated successfully if any signature matches.
- Test 5 (Wrong webhook secret): Correctly rejected with HTTP 400.
- Test 6 (Malformed JSON with valid signature): Handled safely, returning HTTP 400 `'Invalid event'`.
- Test 7 (Replay attack with processed event): Returns `{ received: true, duplicate: true, processed: true }` without mutating database or re-triggering lifecycle notifications.
- Test 8 (Tier Guard `/api/v1/workspace/pro` unauthenticated): Returns HTTP 401 Unauthorized.
- Test 9 (Tier Guard `/api/v1/workspace/pro` free account): Returns HTTP 402 Payment Required with problem detail.
- Test 10 (Tier Guard `/api/v1/workspace/pro` plus account): Returns HTTP 402 Payment Required with problem detail.
- Test 11 (Tier Guard `/api/v1/workspace/pro` pro account): Returns HTTP 200 OK `{ ok: true, tier: 'sovereign_pro', accountId }`.

---

## 2. Logic Chain

1. **Integrity & Authenticity Check**:
   - *Observation*: Source code in `apps/worker/src/security/tier-guard.ts`, `apps/worker/src/routes/stripe.ts`, and `apps/worker/src/billing/stripe.ts` contains real logic interfacing with SQLite D1 tables (`stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, `webhook_events`), WebCrypto HMAC validation, and real auth resolution via `requireAuth`.
   - *Observation*: Tests in `apps/worker/src/billing/stripe-webhook-route-r4.test.ts` compute actual HMAC signatures using WebCrypto and test real application responses via `app.fetch`.
   - *Inference*: No hardcoded outputs, dummy facades, or shortcuts exist. Work is genuine and fully functional.

2. **Strict Migration Immutability**:
   - *Observation*: `scripts/verify-migration-upgrade.mjs` line 9 strictly asserts `prior.at(-1) !== '0018_workers_ai_capacity_reservations.sql' || files.at(-1) !== '0019_deprecate_manual_capacity.sql'`.
   - *Observation*: `apps/worker/migrations/` contains exactly 19 migration files, ending at `0019_deprecate_manual_capacity.sql`.
   - *Observation*: Existing tables created in migrations `0004` and `0009` (`stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, `webhook_events`) fully support all 5 webhook events without schema modifications.
   - *Inference*: Migration immutability is strictly satisfied. Zero new migrations added.

3. **Signature Verification & Ingress Security**:
   - *Observation*: `handleStripeWebhook` evaluates `verifyStripeSignature` before JSON parsing. Both missing and invalid signatures return HTTP 400 `'Invalid signature'`.
   - *Observation*: Both `/api/billing/webhook` and `/api/v1/stripe/webhook` are bound in `apps/worker/src/index.ts` to `handleStripeWebhook`.
   - *Inference*: Ingress contracts are strictly satisfied.

4. **Lifecycle Webhook Handling & Out-of-Order Safety**:
   - *Observation*: `checkout.session.completed` maps customer ID to account ID in `stripe_customers`.
   - *Observation*: `invoice.payment_succeeded` activates subscription and updates entitlement cache.
   - *Observation*: `invoice.payment_failed` transitions subscription to `past_due`, resets cache to `free`, and emits `payment_attention` notification.
   - *Observation*: `customer.subscription.updated` and `deleted` project state with monotonic timestamp guards (`last_event_created`), preventing out-of-order events from overwriting newer state.
   - *Inference*: All 5 events are correctly handled with proper state isolation and notifications.

5. **Tier Guard & 402 Enforcement**:
   - *Observation*: `requireProTier` authenticates the request, inspects server-authoritative entitlements, and throws HTTP 402 with structured problem detail when plan is not `sovereign_pro`.
   - *Observation*: Route `/api/v1/workspace/pro` catches the thrown `Response` and returns it directly to the caller with appropriate headers.
   - *Inference*: Tier guard is server-authoritative and correctly enforced.

6. **Monorepo Build Gates & Deployment Command**:
   - *Observation*: `package.json` defines `"production:release:text": "node scripts/assert-main-release.mjs --require-current-origin-main && node scripts/cloudflare-production-text-release.mjs"`.
   - *Observation*: `pnpm verify:cloudflare-build` executed all 24 release stages and exited 0.
   - *Inference*: Monorepo gates and deployment commands are verified.

---

## 3. Caveats

- **Live Production Secrets**: In local and test runs, mock HMAC keys and price IDs were used. Production deployment requires live Stripe price IDs (`STRIPE_PRICE_SOVEREIGN_PRO_MONTHLY`, `STRIPE_PRICE_SOVEREIGN_PRO_ANNUAL`) and live webhook secrets to be provisioned via Cloudflare Worker encrypted environment secrets.
- No other caveats.

---

## 4. Conclusion

Requirements R4 and R5 are completely, robustly, and legitimately implemented.
- Signature verification on `/api/billing/webhook` enforces HTTP 400 on missing or invalid signatures.
- All 5 Stripe webhook events are handled with correct database projections and notifications.
- 402 Payment Required middleware guards `/api/v1/workspace/pro` with structured problem details.
- Zero new D1 migrations were added; target remains canonical `0019_deprecate_manual_capacity.sql`.
- Zero secrets committed; `pnpm scan:secrets` clean.
- All gates pass: `typecheck`, `test`, `verify:migrations`, `scan:secrets`, `verify:foundation`, `build`, and `verify:cloudflare-build`.
- Zero integrity violations detected.

**Final Verdict**: **APPROVE**

---

## 5. Verification Method

To independently reproduce and verify this review, execute the following commands in repository root:

```bash
# 1. Typecheck all workspace packages
pnpm typecheck

# 2. Run full test suite
pnpm test

# 3. Run R4 dedicated test suite
pnpm --filter @sovereign/worker exec vitest run src/billing/stripe-webhook-route-r4.test.ts

# 4. Verify D1 migrations immutability (target 0019, zero new migrations)
pnpm verify:migrations

# 5. Scan repository for hardcoded secrets
pnpm scan:secrets

# 6. Verify foundation invariants
pnpm verify:foundation

# 7. Verify full Cloudflare build diagnostics gate
pnpm verify:cloudflare-build

# 8. Verify monorepo dry-run build
pnpm build
```

Invalidation conditions:
- Any new `.sql` file in `apps/worker/migrations/`.
- `POST /api/billing/webhook` without `stripe-signature` returning non-400.
- `GET /api/v1/workspace/pro` returning non-402 on `free` or `sovereign_plus` accounts.
- `pnpm scan:secrets` failing.
- `pnpm verify:cloudflare-build` failing any of the 24 stages.
