# Adversarial Challenge Report: Backend Billing, Security & Migrations

**Agent**: Challenger 2 (`challenger_2_o5`)  
**Role**: Empirical Challenger (critic, specialist)  
**Target Milestone**: M3 / M4 (Backend Billing, Security & Migrations)  
**Final Verdict**: **APPROVE**  
**Date**: 2026-09-07T21:43:00Z  

---

## 1. Observation

### 1.1 Codebase Inspection and File Locations
Direct inspection of backend implementation and migration files confirmed the following structure:
- `apps/worker/src/routes/stripe.ts` (lines 88–315): Implements `handleStripeWebhook(request, env)` mounted on `/api/billing/webhook` and `/api/v1/stripe/webhook` in `apps/worker/src/index.ts` (lines 101–102).
- `apps/worker/src/security/stripe-signature.ts` (lines 12–31): Implements `verifyStripeSignature` enforcing a 300-second tolerance window, HMAC-SHA256 signature verification via Web Crypto, and constant-time string comparison (`constantTimeEqual`) across all candidate `v1` signatures.
- `apps/worker/src/security/tier-guard.ts` (lines 5–25): Implements `requireProTier(request, env)` throwing an RFC 7807 problem detail response with HTTP 402, `error: "payment_required"`, `requiredTier: "sovereign_pro"`, and `Cache-Control: private, no-store`.
- `apps/worker/src/index.ts` (lines 389–401): Routes `app.all('/api/v1/workspace/pro', ...)` through `requireProTier`, returning HTTP 200 `{ ok: true, tier: 'sovereign_pro', accountId }` for pro users.
- `apps/worker/migrations/`: Exactly 19 migration files present, strictly ending at `0019_deprecate_manual_capacity.sql`.
- `apps/sovereign-worker`: Symlink to `apps/worker` (`lrwxr-xr-x 1 cjo staff 6 Sep 5 21:16 sovereign-worker -> worker`).

### 1.2 Tool Execution Commands and Results

#### A. D1 Migration Sequence Verification (`pnpm verify:migrations`)
```bash
$ pnpm verify:migrations
> sovereign-final@ verify:migrations /Users/cjo/Sovereign.final
> node scripts/validate-migrations.mjs && node scripts/verify-migration-upgrade.mjs

Validated 19 D1 migration file(s) for non-destructive structure and unique table creation.
Migration upgrade verified immutable_from=0018 target=0019 replay=runner-rejected constraints=bounded
```
*Result*: Exit code 0. Zero migrations beyond 0019, zero duplicate migration numbers, migration upgrade target strictly `0019_deprecate_manual_capacity`.

#### B. Secret Scan Verification (`pnpm scan:secrets` & `pnpm scan:production-fixtures`)
```bash
$ pnpm scan:secrets
> sovereign-final@ scan:secrets /Users/cjo/Sovereign.final
> node scripts/scan-secrets.mjs

No committed secret patterns detected.
```
```bash
$ pnpm scan:production-fixtures
> sovereign-final@ scan:production-fixtures /Users/cjo/Sovereign.final
> node scripts/scan-production-fixtures.mjs

Production fixture scan passed.
```
*Result*: Exit code 0. Zero committed secrets detected. Direct regex scanning of `apps/worker/src/routes/stripe.ts`, `apps/worker/src/billing/stripe.ts`, `apps/worker/src/security/tier-guard.ts`, and `apps/worker/src/index.ts` confirmed zero occurrences of `sk_live_`, `sk_test_`, or `whsec_`. Secrets are accessed strictly via `env.STRIPE_WEBHOOK_SECRET` and `env.STRIPE_SECRET_KEY`.

#### C. Typecheck (`pnpm typecheck`)
```bash
$ pnpm typecheck
> sovereign-final@ typecheck /Users/cjo/Sovereign.final
> pnpm -r typecheck

Scope: 5 of 6 workspace projects
apps/web typecheck$ tsc --noEmit
packages/contracts typecheck$ tsc --noEmit
packages/agent-contracts typecheck$ tsc --noEmit
packages/agent-contracts typecheck: Done
packages/contracts typecheck: Done
apps/web typecheck: Done
apps/worker typecheck$ tsc --noEmit
apps/sovereign-worker typecheck$ tsc --noEmit
apps/sovereign-worker typecheck: Done
apps/worker typecheck: Done
```
*Result*: Exit code 0. Zero TypeScript errors across all workspace packages.

#### D. Existing Unit Suite (`pnpm --filter @sovereign/worker test src/billing/stripe-webhook-route-r4.test.ts`)
```bash
$ pnpm --filter @sovereign/worker test src/billing/stripe-webhook-route-r4.test.ts
Scope: 2 of 6 workspace projects
apps/sovereign-worker test: ✓ src/billing/stripe-webhook-route-r4.test.ts (17 tests) 77ms
apps/worker test: ✓ src/billing/stripe-webhook-route-r4.test.ts (17 tests) 78ms
Test Files 1 passed (1)
Tests 17 passed (17)
```
*Result*: Exit code 0. All 17 milestone unit tests passed.

#### E. Empirical Adversarial Stress Harness (`pnpm tsx scripts/adversarial-billing-stress.ts`)
Executed 112 adversarial assertions across 5 core stress dimensions:
```bash
$ pnpm tsx scripts/adversarial-billing-stress.ts
=== STARTING EMPIRICAL ADVERSARIAL CHALLENGE (BACKEND BILLING & SECURITY) ===

--- CHALLENGE 1: Stripe Webhook Signature Edge Cases & Attack Scenarios ---
✅ PASS: Missing signature header returns 400
✅ PASS: Missing signature returns "Invalid signature"
✅ PASS: Empty signature header returns 400
✅ PASS: Empty signature returns "Invalid signature"
✅ PASS: Whitespace-only signature returns 400
✅ PASS: Malformed timestamp returns 400
✅ PASS: Missing timestamp key (t=) returns 400
✅ PASS: Missing signature key (v1=) returns 400
✅ PASS: Invalid HMAC digest returns 400
✅ PASS: Forged signature with wrong secret returns 400
✅ PASS: Expired signature (301s old) returns 400
✅ PASS: Future signature (>300s skew) returns 400
✅ PASS: Valid signature within 300s tolerance returns 200
✅ PASS: Key rotation with multiple v1 signatures successfully authenticates
✅ PASS: Missing signature on /api/v1/stripe/webhook returns 400
✅ PASS: Malformed JSON body with valid signature returns 400 "Invalid event"
✅ PASS: Invalid JSON returns "Invalid event"

--- CHALLENGE 2: Five Webhook Events Mutation & Idempotency ---
✅ PASS: checkout.session.completed returns 200
✅ PASS: checkout.session.completed links customer
✅ PASS: checkout.session.completed identifies accountId
✅ PASS: stripe_customers updated with cus_adv_1
✅ PASS: email is normalized to lowercase
✅ PASS: invoice.payment_succeeded returns 200
✅ PASS: subscription confirmed active
✅ PASS: subscription status updated to active
✅ PASS: entitlement cache upgraded to sovereign_plus
✅ PASS: invoice.payment_failed returns 200
✅ PASS: paymentFailed confirmed true
✅ PASS: subscription status set to past_due
✅ PASS: entitlement downgraded to free
✅ PASS: customer.subscription.updated returns 200
✅ PASS: subscription projected
✅ PASS: subscription status is active
✅ PASS: subscription plan is sovereign_pro
✅ PASS: entitlement cache is upgraded to sovereign_pro
✅ PASS: customer.subscription.deleted returns 200
✅ PASS: subscription deletion projected
✅ PASS: subscription status is canceled
✅ PASS: entitlement reset to free
✅ PASS: Initial event processing returns 200
✅ PASS: Initial event projected
✅ PASS: Duplicate event replay returns 200
✅ PASS: Duplicate event recognized as duplicate without re-executing
✅ PASS: Unresolved checkout identity returns 500 retryable error
✅ PASS: Error response specifies retryable: true
✅ PASS: processed_at is null for retryable error
✅ PASS: error_code recorded in webhook_events
✅ PASS: Stale subscription event returns 200
✅ PASS: Stale event identified and projection skipped
✅ PASS: Event on deleted account returns 200
✅ PASS: Response identifies deletedAccount
✅ PASS: Subscription retained as billing record without revival

--- CHALLENGE 3: 402 Payment Required Edge Cases ---
✅ PASS: Unauthenticated request to /api/v1/workspace/pro returns 401
✅ PASS: Malformed Bearer token returns 401
✅ PASS: Expired session token returns 401
✅ PASS: Account with plan "free" receives 402 Payment Required
✅ PASS: 402 response is application/json
✅ PASS: 402 has cache-control: private, no-store
✅ PASS: error code is "payment_required"
✅ PASS: requiredTier is "sovereign_pro"
✅ PASS: currentPlan is "free"
✅ PASS: upgradeUrl provided
✅ PASS: Account with plan "sovereign_plus" receives 402 Payment Required
✅ PASS: requiredTier is "sovereign_pro"
✅ PASS: currentPlan is "sovereign_plus"
✅ PASS: Account with plan "sovereign_pro" receives 200 OK
✅ PASS: response ok is true
✅ PASS: tier is sovereign_pro
✅ PASS: accountId is acct_pro
✅ PASS: POST /api/v1/workspace/pro returns 402 for non-pro account
✅ PASS: PUT /api/v1/workspace/pro returns 402 for non-pro account
✅ PASS: DELETE /api/v1/workspace/pro returns 402 for non-pro account

--- CHALLENGE 4: D1 Migration Sequence Immutability ---
✅ PASS: Total migration files is exactly 19 (found: 19)
✅ PASS: Latest migration is strictly '0019_deprecate_manual_capacity.sql' (found: 0019_deprecate_manual_capacity.sql)
✅ PASS: Migration #1 has expected prefix 0001 (0001_initial.sql)
... [migrations 0002 through 0018 checked]
✅ PASS: Migration #19 has expected prefix 0019 (0019_deprecate_manual_capacity.sql)
✅ PASS: No duplicate subscription_status migration exists
✅ PASS: No migration 0020 exists

--- CHALLENGE 5: Secret Leak & Binding Verification ---
✅ PASS: Zero hardcoded secret pattern "sk_live_" in apps/worker/src/routes/stripe.ts
✅ PASS: Zero hardcoded secret pattern "sk_test_" in apps/worker/src/routes/stripe.ts
✅ PASS: Zero hardcoded secret pattern "whsec_" in apps/worker/src/routes/stripe.ts
✅ PASS: Zero hardcoded secret pattern "sk_live_" in apps/worker/src/billing/stripe.ts
✅ PASS: Zero hardcoded secret pattern "sk_test_" in apps/worker/src/billing/stripe.ts
✅ PASS: Zero hardcoded secret pattern "whsec_" in apps/worker/src/billing/stripe.ts
✅ PASS: Zero hardcoded secret pattern "sk_live_" in apps/worker/src/security/tier-guard.ts
✅ PASS: Zero hardcoded secret pattern "sk_test_" in apps/worker/src/security/tier-guard.ts
✅ PASS: Zero hardcoded secret pattern "whsec_" in apps/worker/src/security/tier-guard.ts
✅ PASS: Zero hardcoded secret pattern "sk_live_" in apps/worker/src/index.ts
✅ PASS: Zero hardcoded secret pattern "sk_test_" in apps/worker/src/index.ts
✅ PASS: Zero hardcoded secret pattern "whsec_" in apps/worker/src/index.ts
✅ PASS: Zero hardcoded secret pattern "sk_live_" in apps/worker/src/security/stripe-signature.ts
✅ PASS: Zero hardcoded secret pattern "sk_test_" in apps/worker/src/security/stripe-signature.ts
✅ PASS: Zero hardcoded secret pattern "whsec_" in apps/worker/src/security/stripe-signature.ts
✅ PASS: Webhook secret accessed strictly via env.STRIPE_WEBHOOK_SECRET
✅ PASS: Stripe key accessed strictly via env.STRIPE_SECRET_KEY

======================================================
ALL EMPIRICAL CHALLENGES COMPLETE!
Results: 112 passed, 0 failed.
Verdict: APPROVE
======================================================
```

#### F. Production Diagnostics Full Gate (`pnpm verify:cloudflare-build`)
```bash
$ pnpm verify:cloudflare-build
[cloudflare-release] stage=production-release status=success
[cloudflare-release] stage=intelligence-release status=success
[cloudflare-release] stage=visual-intelligence status=success
[cloudflare-release] stage=premium-platform status=success
[cloudflare-release] stage=typecheck status=success
[cloudflare-release] stage=tests status=success (70 test files passed, 416 tests)
[cloudflare-release] stage=auth-smoke status=success
[cloudflare-release] stage=baseline-smoke status=success
[cloudflare-release] stage=jobs-smoke status=success
[cloudflare-release] stage=worker-gateway-smoke status=success
[cloudflare-release] stage=stripe-smoke status=success
[cloudflare-release] stage=product-smoke status=success
[cloudflare-release] stage=release-closure-smoke status=success
[cloudflare-release] stage=build status=success
[cloudflare-release] stage=public-source-maps status=success
[cloudflare-release] stage=worker-bundle-size status=success (238.39 KiB compressed, well under 2500 KiB budget)
[cloudflare-release] stage=production-d1-parity status=success (40 tables, 100 indexes verified)
[cloudflare-release] build gate complete commit=ead8cbfcd9410440f3cf1c46f7b7f69f97c43f0d
```
*Result*: Exit code 0. All 17 verification stages completed with success.

---

## 2. Logic Chain

1. **Webhook Ingress & Signature Hardening**:
   - In `apps/worker/src/routes/stripe.ts` (lines 89–92), the raw text payload is extracted via `request.text()` before any JSON parsing.
   - `verifyStripeSignature` checks whether `stripe-signature` contains a finite timestamp `t` and at least one `v1` signature.
   - An omitted header, empty string, whitespace string, malformed timestamp (`t=invalid`), or missing signature component immediately evaluates to `valid = false`.
   - Line 92 returns `new Response('Invalid signature', { status: 400 })`. This was empirically verified by tests 1.1–1.7.
   - Forged digests and signatures signed with unauthorized keys fail the HMAC-SHA256 comparison and return 400 (tests 1.8–1.9).
   - Signatures with timestamps > 300 seconds in the past or > 300 seconds in the future are rejected with 400, preventing replay attacks and clock-skew tampering (tests 1.10–1.11).
   - Valid signatures with multiple `v1` values (standard Stripe secret rotation) are safely supported via `signatures.some(...)` and `constantTimeEqual` (test 1.13).
   - Malformed JSON payloads accompanied by valid signatures return HTTP 400 `'Invalid event'` at line 98 without throwing unhandled exceptions (tests 1.15–1.16).

2. **Five Stripe Webhook Events State Mutation**:
   - `checkout.session.completed`:
     - Reads customer ID and resolves account ID via `metadata.account_id` or `client_reference_id` (lines 131–140).
     - Inserts or updates `stripe_customers` with `account_id`, `stripe_customer_id`, and normalized lowercase email (lines 142–149).
     - Returns HTTP 200 with `{ received: true, projected: true, customerLinked: true, accountId, customerId }` (lines 154–160).
     - When identity is unresolved, it throws an error that is caught, sets `webhook_events.processed_at = NULL` with `error_code = 'checkout_session_identity_unresolved'`, and returns HTTP 500 `{ retryable: true }` to prompt Stripe to retry (test 2.7).
   - `invoice.payment_succeeded`:
     - Sets subscription status to `active` in `stripe_subscriptions` (lines 183–188).
     - Reconciles `entitlement_cache` for `sovereign_plus` or `sovereign_pro` (lines 190–207).
     - Returns HTTP 200 `{ received: true, processed: true, subscriptionConfirmed: true }` (test 2.2).
   - `invoice.payment_failed`:
     - Sets subscription status to `past_due` in `stripe_subscriptions` (lines 241–246).
     - Downgrades `entitlement_cache` to `plan = 'free'` (lines 248–259).
     - Emits `payment_attention` notification via `notifyBillingLifecycle` (lines 260–266).
     - Returns HTTP 200 `{ received: true, processed: true, paymentFailed: true }` (test 2.3).
   - `customer.subscription.updated` & `customer.subscription.deleted`:
     - Normalized and projected via `projectSubscriptionEvent` in `apps/worker/src/billing/stripe.ts` (lines 325–402).
     - Projections update `stripe_subscriptions` and `entitlement_cache`.
     - Out-of-order events with older `last_event_created` timestamps are detected by SQL conflict guards and safely skipped with `{ applied: false, stale: true }` (test 2.8).
     - Deleted accounts (`auth_subject.startsWith('deleted:')`) are protected against accidental resurrection: the subscription is marked `retained_billing_record` and entitlement remains `free` (test 2.9).
   - Idempotency & Deduplication:
     - `INSERT INTO webhook_events ... ON CONFLICT(provider, event_id) DO NOTHING` (lines 102–106).
     - If changes == 0 and `processed_at` is set, returns HTTP 200 `{ received: true, duplicate: true, processed: true }` immediately without re-mutating state (test 2.6).

3. **402 Payment Required Edge Cases**:
   - `apps/worker/src/security/tier-guard.ts` executes `requireAuth(request, env)` first.
   - Unauthenticated, expired, or tampered requests are rejected by `requireAuth` with HTTP 401 Unauthorized (tests 3.1–3.3).
   - If authenticated, `getEntitlements(env, auth.accountId)` is queried.
   - If `plan !== 'sovereign_pro'`, `requireProTier` throws an HTTP 402 Response containing RFC 7807 problem details (`error: "payment_required"`, `requiredTier: "sovereign_pro"`, `upgradeUrl: "https://sovereign.defrag.app/pricing"`) with headers `Content-Type: application/json` and `Cache-Control: private, no-store` (tests 3.4–3.5).
   - If account plan is `'sovereign_pro'`, `requireProTier` returns `auth`, and the route handler returns HTTP 200 `{ ok: true, tier: 'sovereign_pro', accountId: auth.accountId }` (test 3.6).
   - In `apps/worker/src/index.ts` line 389, `app.all('/api/v1/workspace/pro')` guarantees that all HTTP methods (GET, POST, PUT, DELETE) enforce this contract uniformly (test 3.7).

4. **D1 Migration Sequence Immutability**:
   - Inspection of `apps/worker/migrations/` confirms exactly 19 migrations (`0001_initial.sql` through `0019_deprecate_manual_capacity.sql`).
   - Every file follows the strict 4-digit sequential prefix pattern `0001` through `0019`.
   - There are zero gaps, zero duplicate prefixes, no `002_subscription_status.sql`, and zero migrations with prefix `0020` or higher.
   - `pnpm verify:migrations` passed with exit code 0.
   - `/health` and `/ready` endpoints in `apps/worker/src/index.ts` report `migrationVersion: '0019_deprecate_manual_capacity'`, preserving runtime parity.

5. **Secret Leak & Isolation Verification**:
   - `pnpm scan:secrets` passed with exit code 0.
   - `pnpm scan:production-fixtures` passed with exit code 0.
   - Direct source scanning revealed zero hardcoded Stripe API secret tokens (`sk_live_`, `sk_test_`) or webhook secrets (`whsec_`) in any source files.
   - Webhook signature verification strictly consumes `env.STRIPE_WEBHOOK_SECRET`.
   - API client calls strictly consume `env.STRIPE_SECRET_KEY`.

---

## 3. Caveats

1. **Live Stripe Sandbox Calls**: Testing was executed against local Cloudflare Worker simulation with cryptographic Web Crypto primitives and state projection oracles. Live network calls to external `api.stripe.com` require active external credentials not used during offline hermetic gate verification.
2. **Turnstile Mocking in Test Mode**: In test mode (`APP_ENV=test`), Cloudflare Turnstile token validation is bypassed per test-suite configuration, which does not affect Stripe webhook or 402 tier guard behavior.

---

## 4. Conclusion

The backend billing webhook ingress (`/api/billing/webhook` and `/api/v1/stripe/webhook`), signature verification with replay attack mitigation, 5-event state mutation lifecycle, idempotency deduplication, 402 Payment Required tier guard middleware (`requireProTier`), D1 migration immutability (strictly 19 migrations ending at `0019_deprecate_manual_capacity.sql`), and secret leak isolation have all been empirically challenged and verified with **zero errors**.

All 112 empirical adversarial challenge assertions passed, all 17 unit tests in `src/billing/stripe-webhook-route-r4.test.ts` passed, `pnpm verify:migrations` passed, `pnpm scan:secrets` passed, and the complete 17-stage `pnpm verify:cloudflare-build` release gate passed.

**Final Recommendation**: **APPROVE**

---

## 5. Verification Method

To independently reproduce and verify all results, execute the following commands from the repository root (`/Users/cjo/Sovereign.final`):

```bash
# 1. Run empirical adversarial stress test harness (112 assertions)
pnpm tsx scripts/adversarial-billing-stress.ts

# 2. Run M3 Stripe webhook and 402 tier guard unit tests
pnpm --filter @sovereign/worker test src/billing/stripe-webhook-route-r4.test.ts

# 3. Verify migration sequence immutability and target version
pnpm verify:migrations

# 4. Verify zero hardcoded secrets
pnpm scan:secrets && pnpm scan:production-fixtures

# 5. Verify TypeScript types across all workspace packages
pnpm typecheck

# 6. Verify production build
pnpm build

# 7. Run complete Cloudflare production release diagnostics gate
pnpm verify:cloudflare-build
```

**Invalidation Conditions**:
- Any return code other than 400 for missing, empty, malformed, or forged Stripe signatures.
- Any failure to transition subscription state or entitlement cache upon receiving the 5 handled Stripe events.
- Any return code other than 402 for un-upgraded accounts accessing `/api/v1/workspace/pro`.
- Any addition of a migration file beyond `0019_deprecate_manual_capacity.sql`.
- Any detection of hardcoded Stripe secret tokens in source files.
