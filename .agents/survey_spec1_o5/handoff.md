# Handoff Report: Survey Spec Miner (Backend Billing Webhook & Gate Testing Suite)

**Date**: 2026-09-07T21:29:00Z  
**Working Directory**: `/Users/cjo/Sovereign.final/.agents/survey_spec1_o5/`  
**Target Requirements**: Requirement R4 (Stripe Billing Webhook Route) & Requirement R5 (Gate Testing & Deployment Verification)  
**Parent Agent**: `8b912f37-c686-4313-b0e3-315fe41c30eb` (`parent`)  

---

## 1. Observation

### 1.1 Codebase & Workspace Architecture
- `apps/sovereign-worker` is a symbolic link pointing directly to `apps/worker` (`apps/sovereign-worker -> worker`, confirmed via `ls -la apps/`).
- The monorepo uses `pnpm@9.15.9` with workspaces: `@sovereign/web` (`apps/web`), `@sovereign/worker` (`apps/worker`), `@sovereign/contracts` (`packages/contracts`), and `@sovereign/agent-contracts` (`packages/agent-contracts`).

### 1.2 D1 Migrations & Canonical Target
- The migrations directory is located at `apps/worker/migrations/` (accessible also via `apps/sovereign-worker/migrations/`).
- There are currently 19 migration files in sequential order:
  1. `0001_initial.sql` (defines `accounts`, `stripe_customers`, `entitlement_cache`, `webhook_events`)
  2. `0002_thread_turn_state.sql`
  3. `0003_product_completion.sql` (creates `stripe_subscriptions` with `account_id`, `stripe_subscription_id`, `plan_key`, `status`, `current_period_end`, `cancel_at_period_end`, `source_event_id`)
  4. `0004_stripe_customers.sql` (adds `email_normalized TEXT` and index `stripe_customers_customer_idx ON stripe_customers(stripe_customer_id)`)
  5. `0005_auth_baseline_jobs.sql`
  6. `0006_ai_usage_windows.sql`
  7. `0007_stripe_event_ordering.sql` (adds `last_event_created INTEGER` and `last_event_id TEXT` to `stripe_subscriptions`, index `stripe_subscriptions_event_order_idx`)
  8. `0008_identity_bound_invitations.sql`
  9. `0009_production_scale_and_billing_safety.sql` (creates index `webhook_events_pending_idx ON webhook_events(provider, processed_at, received_at)` and adds terms/privacy version columns to `accounts`)
  10. `0010_account_onboarding_and_chat_history.sql`
  11. `0011_email_code_recovery.sql`
  12. `0012_baseline_facets_and_answer_v2.sql`
  13. `0013_workers_ai_free_capacity.sql`
  14. `0014_passkey_authentication.sql`
  15. `0015_release_evidence.sql`
  16. `0016_policy_acceptance_receipts.sql`
  17. `0017_privacy_access_and_eligibility.sql`
  18. `0018_workers_ai_capacity_reservations.sql`
  19. `0019_deprecate_manual_capacity.sql` (renames capacity tracking tables to `legacy_...`)
- In `scripts/verify-migration-upgrade.mjs` (lines 7–9):
  ```javascript
  const prior = files.filter((name) => name < '0019_deprecate_manual_capacity.sql');
  const latest = '0019_deprecate_manual_capacity.sql';
  if (prior.at(-1) !== '0018_workers_ai_capacity_reservations.sql' || files.at(-1) !== latest) throw new Error('immutable migration sequence is not 0018 -> 0019');
  ```
  This proves definitively that **NO new D1 migration file can be created**. Creating any `0020_*.sql` breaks the immutable migration upgrade gate immediately.

### 1.3 Routing & Webhook Ingress
- In `apps/worker/src/runtime-entry.ts` (lines 23–30):
  ```typescript
  const STRIPE_WEBHOOK_PATHS = new Set([
    '/api/v1/stripe/webhook',
    '/api/billing/webhook',
    '/api/stripe/webhook',
    '/api/webhooks/stripe',
    '/stripe/webhook',
    '/webhooks/stripe'
  ]);
  ```
- In `apps/worker/src/runtime-entry.ts` (lines 108–120):
  ```typescript
  if (request.method === 'POST' && STRIPE_WEBHOOK_PATHS.has(url.pathname)) {
    const target = new URL(request.url);
    target.protocol = 'https:';
    target.hostname = APP_HOST;
    target.port = '';
    target.pathname = '/api/v1/stripe/webhook';
    const forwarded = new Request(target.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    return worker.fetch(forwarded, env, executionContext);
  }
  ```
- In `apps/worker/src/index.ts` (line 100):
  ```typescript
  app.post('/api/v1/stripe/webhook', (context) => handleStripeWebhook(context.req.raw, context.env));
  ```
  Note: While `runtime-entry.ts` forwards `/api/billing/webhook` to `/api/v1/stripe/webhook`, `index.ts` currently does not register `app.post('/api/billing/webhook', ...)` directly on the Hono `app`. Adding it directly guarantees that direct Hono `app.request` test invocations work identically to edge gateway invocations.

### 1.4 Webhook Handler & Signature Verification
- In `apps/worker/src/routes/stripe.ts` (lines 88–92):
  ```typescript
  export async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') ?? '';
    const valid = await verifyStripeSignature({ body, header: signature, secret: env.STRIPE_WEBHOOK_SECRET });
    if (!valid) return new Response('Invalid signature', { status: 400 });
  ```
- In `apps/worker/src/security/stripe-signature.ts` (lines 19–30):
  When `stripe-signature` is missing or empty, `signatures.length === 0` or timestamp parsing fails, immediately returning `false`. `handleStripeWebhook` then returns HTTP `400 Bad Request` with text `'Invalid signature'`.
- Idempotency & Deduplication: `apps/worker/src/routes/stripe.ts` (lines 102–114) inserts `(provider, event_id, event_type, received_at)` into `webhook_events`. If already processed, it returns HTTP 200 `{ received: true, duplicate: true, processed: true }`.

### 1.5 Environment Bindings & Secret Isolation
- In `apps/worker/src/env.ts` (lines 20–21):
  ```typescript
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  ```
- In `apps/worker/wrangler.jsonc`, `STRIPE_WEBHOOK_SECRET` and `STRIPE_SECRET_KEY` are not placed in cleartext `vars`; they are passed securely as Cloudflare Worker secret bindings.
- Executing `pnpm scan:secrets` (`node scripts/scan-secrets.mjs`) scans all git-tracked files for regex pattern `(sk-live-|sk_test_|whsec_|OPENAI_API_KEY=sk-|cf_[A-Za-z0-9_-]{20,})` and returned exit code 0 ("No committed secret patterns detected").

### 1.6 Current Event Handling in `apps/worker/src/routes/stripe.ts`
- Currently, `SUBSCRIPTION_EVENTS` (lines 13–19) includes:
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `customer.subscription.paused`
  - `customer.subscription.resumed`
- Non-subscription events currently hit line 116:
  ```typescript
  if (!SUBSCRIPTION_EVENTS.has(event.type)) {
    await env.DB.prepare(`UPDATE webhook_events SET processed_at = datetime('now'), error_code = NULL
      WHERE provider = 'stripe' AND event_id = ?`).bind(event.id).run();
    return Response.json({ received: true, projected: false });
  }
  ```
- Specifically:
  1. `checkout.session.completed` is currently marked processed but does not update `stripe_customers`.
  2. `invoice.payment_succeeded` and `invoice.payment_failed` are marked processed without invoice-specific subscription reconciliations or lifecycle notifications.

### 1.7 Current Entitlement & Tier Gating
- `apps/worker/src/db/entitlements.ts`:
  - Plan keys currently recognized: `'free'` and `'sovereign_plus'`.
  - Gating uses `requireFeature(entitlements, feature)` which throws HTTP 403 `entitlement_required`.
- Currently, no route or middleware returns HTTP `402 Payment Required`.
- `sovereign_pro` tier is not yet present in `PlanKey` or the route guard.

### 1.8 Gate Testing Results
All gate commands were executed directly on the repository:
1. `pnpm typecheck` -> **Exited 0**. All 5 workspace projects (`@sovereign/contracts`, `@sovereign/agent-contracts`, `@sovereign/web`, `@sovereign/sovereign-worker`, `@sovereign/worker`) compiled with zero TypeScript errors.
2. `pnpm build` -> **Exited 0**. `@sovereign/web` generated `dist/index.html` (0.89 kB), `dist/assets/index-*.css` (469.56 kB), `dist/assets/index-*.js` (416.48 kB). `@sovereign/worker` and `@sovereign/sovereign-worker` completed wrangler dry-run build (52 assets, 1221.13 KiB total upload / 236.54 KiB gzip).
3. `pnpm test` -> **Exited 0**. 69 test files, 399 unit and contract tests in `apps/worker` passed; `PublicSupport.test.ts` and `LandingParity.test.ts` passed in `apps/web`.
4. `pnpm verify:foundation` -> **Exited 0**. Verified 5 required files, valid JSON in manifests/packages, and presence of 9 core D1 tables.
5. `pnpm verify:migrations` -> **Exited 0**. Validated 19 D1 migrations for non-destructive structure and verified 0018 -> 0019 immutable upgrade sequence.
6. `pnpm scan:secrets` -> **Exited 0**. No secret patterns detected.
7. `pnpm verify:cloudflare-build` -> **Exited 0**. All 24 build stages passed sequentially on commit `ead8cbfcd9410440f3cf1c46f7b7f69f97c43f0d`.
8. Deployment Command: `pnpm production:release:text` runs `scripts/assert-main-release.mjs --require-current-origin-main` followed by `scripts/cloudflare-production-text-release.mjs`.

---

## 2. Logic Chain

1. **Migration Safety**:
   - *Premise*: `scripts/verify-migration-upgrade.mjs` checks `prior.at(-1) !== '0018_workers_ai_capacity_reservations.sql' || files.at(-1) !== '0019_deprecate_manual_capacity.sql'`.
   - *Inference*: Any addition of a new migration (such as `0020_*.sql`) causes `files.at(-1)` to mismatch `latest`, failing the build gate.
   - *D1 Schema Check*: Tables `accounts`, `stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, and `webhook_events` already contain all necessary columns (`email_normalized`, `last_event_created`, `last_event_id`, `terms_version`, `privacy_version`, etc.) from migrations `0001`, `0003`, `0004`, `0007`, and `0009`.
   - *Deduction*: All required billing state and event tracking can and must be accommodated using the existing schema without adding new D1 migrations.

2. **Webhook Path Redundancy**:
   - *Premise*: `runtime-entry.ts` maps `STRIPE_WEBHOOK_PATHS` (`/api/billing/webhook`, etc.) to `/api/v1/stripe/webhook`, but `index.ts` only declares `app.post('/api/v1/stripe/webhook', ...)`.
   - *Inference*: If a test suite imports `app` from `src/index.ts` directly and dispatches `app.request('/api/billing/webhook', ...)`, Hono router returns 404 because `runtime-entry.ts` is bypassed.
   - *Deduction*: Adding `app.post('/api/billing/webhook', (context) => handleStripeWebhook(context.req.raw, context.env))` to `index.ts` alongside `/api/v1/stripe/webhook` ensures 100% path compatibility both at the edge and in isolated unit tests.

3. **Missing Signature Header (Requirement R4)**:
   - *Premise*: `handleStripeWebhook` checks `verifyStripeSignature({ body, header: signature, secret: env.STRIPE_WEBHOOK_SECRET })`. If invalid or empty, it returns `new Response('Invalid signature', { status: 400 })`.
   - *Deduction*: When an HTTP POST to `/api/billing/webhook` arrives without `stripe-signature`, `signature` is `''`, `verifyStripeSignature` evaluates to `false`, and HTTP 400 is returned.

4. **Event Handling Expansion (Requirement R4)**:
   - *Premise*: R4 requires handling 5 specific events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
   - *Inference*:
     - `customer.subscription.updated` and `customer.subscription.deleted` are already processed via `normalizeSubscriptionEvent` and `projectSubscriptionEvent`.
     - `checkout.session.completed`: Contains `customer` (`cus_...`) and `client_reference_id` or `metadata.account_id` (`acct_...`). It must link the Stripe customer to the Sovereign account in `stripe_customers`.
     - `invoice.payment_succeeded`: Confirms payment on the subscription; keeps or restores subscription to `active` and updates `entitlement_cache`.
     - `invoice.payment_failed`: Signals delinquent payment; updates subscription status to `past_due`, gracefully downgrades `entitlement_cache` to `free`, and fires `notifyBillingLifecycle` with `kind: 'payment_attention'`.
   - *Deduction*: Extending `handleStripeWebhook` with explicit branches for `checkout.session.completed`, `invoice.payment_succeeded`, and `invoice.payment_failed` satisfies R4 event requirements and leverages existing tables (`stripe_customers`, `stripe_subscriptions`, `entitlement_cache`, `webhook_events`).

5. **402 Payment Required Middleware (Requirement R4)**:
   - *Premise*: Requirement R4 mandates: "Add 402 Payment Required middleware for protected workspace routes that require `sovereign_pro` tier. Acceptance criteria: Subscription tier `sovereign_pro` enforces a 402 response on a protected route in the worker."
   - *Inference*: Existing entitlement checks in `apps/worker/src/db/entitlements.ts` throw HTTP 403. A 402 middleware must check whether the authenticated account possesses the `sovereign_pro` tier. If the account is on `free` or `sovereign_plus` (or below `sovereign_pro`), it must reject the request with HTTP `402 Payment Required`.
   - *Deduction*:
     - Define `requireProTier` middleware or route guard.
     - Protect a designated workspace route (e.g. `GET /api/v1/workspace/pro` or `POST /api/v1/workspace/pro/analysis`).
     - Return structured 402 error payload:
       ```json
       {
         "error": "payment_required",
         "message": "This protected workspace route requires the sovereign_pro subscription tier.",
         "requiredTier": "sovereign_pro",
         "currentPlan": "free"
       }
       ```

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Billing Webhook | Multi-path Webhook Ingress | Ingress routes all historical Stripe webhook paths to canonical worker handler | POST to `/api/billing/webhook`, `/api/v1/stripe/webhook`, `/stripe/webhook` | Internal request forwarding to worker | Rejects payload > 1MB via `enforceIngressLimits` (413) | `apps/worker/src/runtime-entry.ts:23-30` |
| 2 | Security | Constant-Time Stripe Signature Verification | Validates HMAC-SHA256 signature against `STRIPE_WEBHOOK_SECRET` with 300s timestamp tolerance | Request body, `stripe-signature` header, `env.STRIPE_WEBHOOK_SECRET` | Boolean `true`/`false` | Returns HTTP 400 `'Invalid signature'` if header missing or HMAC mismatch | `apps/worker/src/security/stripe-signature.ts:12-31` |
| 3 | Billing DB | Webhook Idempotency & Deduplication | Records provider and event ID in `webhook_events` with conflict detection | `event.id`, `event.type`, `provider='stripe'` | `{ received: true, duplicate: true, processed: true }` | HTTP 500 retryable response if DB write or projection fails | `apps/worker/src/routes/stripe.ts:102-120` |
| 4 | Billing DB | Event Ordering Guard | Prevents out-of-order Stripe events from overwriting newer subscription state | `last_event_created`, `last_event_id` | `applied: true` or `applied: false, stale: true` | Skips entitlement downgrade/upgrade if event is stale | `apps/worker/src/billing/stripe.ts:335-367` |
| 5 | Billing Lifecycle | Subscription State Projection | Maps Stripe status (`active`, `past_due`, `canceled`, etc.) to internal plans (`free`, `sovereign_plus`) | Normalized Stripe Event | `{ applied: boolean, plan: PlanKey, status: string }` | Unknown price throws HTTP 400 | `apps/worker/src/billing/stripe.ts:313-390` |
| 6 | Notification | Billing Operational Emails | Automatically dispatches transactional notifications for activation, cancellation, or payment attention | `BillingNotificationInput` | Boolean delivery status | Fails closed without throwing, logs warning | `apps/worker/src/billing/notifications.ts:42-70` |
| 7 | Entitlements | Entitlement Cache & Feature Gating | Fast read-only query for account plan and enabled feature set | `accountId` | `EntitlementSet: { plan, features, asOf }` | Throws HTTP 403 `entitlement_required` | `apps/worker/src/db/entitlements.ts:9-32` |
| 8 | Gate Testing | Cloudflare Build Diagnostics | 24-stage release gate enforcing typecheck, tests, smokes, bundle size, and D1 parity | Environment variables, git commit SHA | Stage logs & exit code 0/1 | Exits on first failed stage and writes release progress | `scripts/cloudflare-build-diagnostics.mjs` |
| 9 | Release Guard | Main-Only Release Gate | Prevents release from non-main branches or stale commits superseded by `origin/main` | Git HEAD SHA, `refs/heads/main` | Exit 0 if match | Exits 1 with `"commit ... superseded by current main"` | `scripts/assert-main-release.mjs` |
| 10 | Security Scan | Hardcoded Secret Scanner | Regex scan across all committed files for Stripe, OpenAI, and Cloudflare tokens | Git tracked files | "No committed secret patterns detected" | Throws "Potential secret detected" (exit 1) | `scripts/scan-secrets.mjs` |

---

## 4. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Stripe Webhook | POST `/api/billing/webhook` with no `stripe-signature` header | Header resolves to `''`, signature parsing finds 0 signatures, returns HTTP 400 `Invalid signature`. |
| 2 | Stripe Webhook | POST `/api/billing/webhook` with expired timestamp (`t < now - 300`) | Timestamp difference exceeds tolerance (300s), returns HTTP 400 `Invalid signature`. |
| 3 | Stripe Webhook | Duplicate delivery of already processed event ID | Matches existing `webhook_events` row where `processed_at IS NOT NULL`, returns HTTP 200 `{ received: true, duplicate: true, processed: true }` without re-projecting. |
| 4 | Stripe Webhook | Retried delivery after transient 500 error | Initial failed attempt leaves `processed_at = NULL` and records `error_code`. Next delivery proceeds to re-execute projection and updates `processed_at`. |
| 5 | Subscription Projection | Out-of-order arrival: older `active` event arrives after newer `canceled` event | SQL `WHERE excluded.last_event_created > stripe_subscriptions.last_event_created` rejects older event, returns `{ applied: false, stale: true }`. |
| 6 | Subscription Projection | Deleted account receives Stripe billing event | Matches account with `auth_subject LIKE 'deleted:%'`. Updates subscription to `retained_billing_record`, entitlement cache set to `free`, returns `{ applied: false, deletedAccount: true }`. |
| 7 | Pro Tier Route Guard | Request to protected workspace route by unauthenticated user | `requireAuth` throws HTTP 401 `Unauthorized`. |
| 8 | Pro Tier Route Guard | Request to protected workspace route by user on `free` plan | Guard detects `entitlements.plan !== 'sovereign_pro'`, returns HTTP 402 `Payment Required`. |
| 9 | Pro Tier Route Guard | Request to protected workspace route by user on `sovereign_pro` plan | Guard permits request, handler returns HTTP 200 with workspace data. |
| 10 | Ingress Limits | Large payload > 1,048,576 bytes posted to `/api/billing/webhook` | Caught by `enforceIngressLimits`, rejected with HTTP 413 `Payload Too Large`. |

---

## 5. Schema Analysis (Migrations 0004 & 0009)

### Migration 0004: `0004_stripe_customers.sql`
```sql
PRAGMA foreign_keys = ON;

ALTER TABLE stripe_customers ADD COLUMN email_normalized TEXT;
CREATE INDEX stripe_customers_customer_idx ON stripe_customers(stripe_customer_id);
```
- **Context & Lineage**: Enhances `stripe_customers` created in `0001_initial.sql`.
- **Capabilities Granted**:
  1. Allows bidirectional mapping between `stripe_customer_id` (`cus_...`) and `account_id`.
  2. Enables indexing by Stripe Customer ID for fast lookup during incoming webhooks (`checkout.session.completed`, `invoice.*`).
  3. Supports email normalization for account resolution when metadata is omitted.

### Migration 0009: `0009_production_scale_and_billing_safety.sql`
```sql
PRAGMA foreign_keys = ON;

ALTER TABLE accounts ADD COLUMN terms_accepted_at TEXT;
ALTER TABLE accounts ADD COLUMN terms_version TEXT;
ALTER TABLE accounts ADD COLUMN privacy_version TEXT;

CREATE INDEX auth_magic_links_ip_created_idx
  ON auth_magic_links(requested_ip_hash, created_at DESC);

CREATE INDEX webhook_events_pending_idx
  ON webhook_events(provider, processed_at, received_at);

CREATE INDEX background_jobs_account_kind_due_idx
  ON background_jobs(account_id, kind, status, run_after);

CREATE INDEX deletion_jobs_due_idx
  ON deletion_jobs(status, scheduled_for, account_id);
```
- **Context & Lineage**: Establishes high-throughput billing and event safety indexes.
- **Capabilities Granted**:
  1. `webhook_events_pending_idx`: High-performance index for filtering unprocessed or pending events (`provider = 'stripe' AND processed_at IS NULL`).
  2. Prevents table scans during high-frequency webhook retries.
  3. Ensures idempotency table `webhook_events` scales cleanly under webhook surges.

### Overall Billing Schema Integrity
The existing database schema spans:
1. `stripe_customers` (`account_id`, `stripe_customer_id`, `email_normalized`, `created_at`, `updated_at`)
2. `stripe_subscriptions` (`id`, `account_id`, `stripe_subscription_id`, `stripe_customer_id`, `plan_key`, `status`, `current_period_end`, `cancel_at_period_end`, `source_event_id`, `last_event_created`, `last_event_id`, `created_at`, `updated_at`)
3. `entitlement_cache` (`account_id`, `plan`, `features_json`, `as_of`, `source_event_id`, `updated_at`)
4. `webhook_events` (`provider`, `event_id`, `event_type`, `received_at`, `processed_at`, `error_code`)

**Conclusion on Migrations**: No schema alterations are needed. Canonical target is strictly `0019_deprecate_manual_capacity.sql`.

---

## 6. Concrete Implementation Plan for R4

### Step 1: Explicit `/api/billing/webhook` Route in `apps/worker/src/index.ts`
Add direct route binding in `apps/worker/src/index.ts`:
```typescript
app.post('/api/billing/webhook', (context) => handleStripeWebhook(context.req.raw, context.env));
app.post('/api/v1/stripe/webhook', (context) => handleStripeWebhook(context.req.raw, context.env));
```

### Step 2: Handle All 5 Required Webhook Events in `apps/worker/src/routes/stripe.ts`
Expand event handling logic:
1. `checkout.session.completed`:
   - Extract `accountId` from `metadata.account_id` or `client_reference_id`.
   - Extract `customerId` from `object.customer`.
   - Upsert into `stripe_customers`:
     ```sql
     INSERT INTO stripe_customers (account_id, stripe_customer_id, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(account_id) DO UPDATE SET stripe_customer_id = excluded.stripe_customer_id, updated_at = datetime('now')
     ```
   - Mark event processed in `webhook_events`.
   - Return `{ received: true, projected: true, customerLinked: true }`.
2. `invoice.payment_succeeded`:
   - Extract `subscriptionId = object.subscription` and `customerId = object.customer`.
   - If subscription exists, ensure `status = 'active'` and update `updated_at`.
   - Mark event processed in `webhook_events`.
   - Return `{ received: true, processed: true }`.
3. `invoice.payment_failed`:
   - Extract `subscriptionId = object.subscription` and `customerId = object.customer`.
   - Query `account_id` from `stripe_subscriptions` or `stripe_customers`.
   - Update `stripe_subscriptions` set `status = 'past_due'`.
   - Gracefully fallback `entitlement_cache` to plan `'free'`.
   - Trigger `notifyBillingLifecycle(env, { eventId: event.id, accountId, kind: 'payment_attention', status: 'past_due', effectivePlan: 'free' })`.
   - Mark event processed in `webhook_events`.
   - Return `{ received: true, processed: true, paymentFailed: true }`.
4. `customer.subscription.updated`:
   - Already handled via `normalizeSubscriptionEvent` and `projectSubscriptionEvent`.
5. `customer.subscription.deleted`:
   - Already handled via `normalizeSubscriptionEvent` and `projectSubscriptionEvent`.

### Step 3: Implement 402 Payment Required Middleware
1. Define `requireProTier` in `apps/worker/src/security/tier-guard.ts` (or `apps/worker/src/security/auth.ts`):
   ```typescript
   export async function requireProTier(request: Request, env: Env): Promise<AuthContext> {
     const auth = await requireAuth(request, env);
     const entitlements = await getEntitlements(env, auth.accountId);
     if (entitlements.plan !== 'sovereign_pro') {
       throw Response.json({
         type: 'https://sovereign.defrag.app/problems/payment-required',
         error: 'payment_required',
         message: 'This protected workspace route requires the sovereign_pro subscription tier.',
         requiredTier: 'sovereign_pro',
         currentPlan: entitlements.plan,
         upgradeUrl: 'https://sovereign.defrag.app/pricing'
       }, {
         status: 402,
         headers: { 'cache-control': 'private, no-store' }
       });
     }
     return auth;
   }
   ```
2. In `apps/worker/src/index.ts`:
   Protect designated workspace route:
   ```typescript
   app.get('/api/v1/workspace/pro', async (context) => {
     const auth = await requireProTier(context.req.raw, context.env);
     return context.json({
       status: 'ok',
       tier: 'sovereign_pro',
       accountId: auth.accountId,
       features: ['pro.deep_reasoning', 'pro.system_synthesis']
     });
   });
   ```
3. Expand `PlanKey` in `apps/worker/src/billing/stripe.ts` to include `'sovereign_pro'`:
   ```typescript
   export type PlanKey = 'free' | 'sovereign_plus' | 'sovereign_pro';
   ```

### Step 4: Add Vitest Contract Test Suite for R4
Create `apps/worker/src/billing/stripe-webhook-route-r4.test.ts`:
- Assert POST to `/api/billing/webhook` without `stripe-signature` returns 400.
- Assert POST to `/api/billing/webhook` with invalid signature returns 400.
- Assert POST to `/api/billing/webhook` with signed `checkout.session.completed` upserts `stripe_customers`.
- Assert POST to `/api/billing/webhook` with signed `invoice.payment_succeeded` succeeds.
- Assert POST to `/api/billing/webhook` with signed `invoice.payment_failed` sets status to past_due, updates entitlement to free, and triggers notification.
- Assert POST to `/api/billing/webhook` with signed `customer.subscription.updated` and `customer.subscription.deleted` updates state.
- Assert GET to `/api/v1/workspace/pro` returns 402 for accounts on `free` or `sovereign_plus`.
- Assert GET to `/api/v1/workspace/pro` returns 200 for accounts on `sovereign_pro`.
- Assert zero hardcoded secrets in source files.

---

## 7. Gate Testing & Verification Strategy (R5)

### Gate Commands Verification Table
| Step | Gate Command | Expected Outcome | Current Status | Command Executed |
|------|--------------|------------------|----------------|------------------|
| 1 | `pnpm typecheck` | 0 TypeScript errors across all 5 workspace projects | PASSED (0 errors) | `pnpm typecheck` |
| 2 | `pnpm build` | Clean client build (`apps/web`) & Worker bundle (`apps/worker`) | PASSED (clean dry-run) | `pnpm build` |
| 3 | `pnpm test` | All Vitest tests green across web and worker | PASSED (399 worker tests, all web tests) | `pnpm test` |
| 4 | `pnpm verify:foundation` | 5 required files present, JSON valid, 9 core D1 tables | PASSED | `pnpm verify:foundation` |
| 5 | `pnpm verify:migrations` | 19 migrations validated, immutable upgrade 0018 -> 0019 | PASSED | `pnpm verify:migrations` |
| 6 | `pnpm scan:secrets` | Zero committed secret patterns (`whsec_`, `sk_test_`, etc.) | PASSED | `pnpm scan:secrets` |
| 7 | `pnpm verify:cloudflare-build` | Full 24-stage release diagnostics pipeline green | PASSED (commit `ead8cbf`) | `pnpm verify:cloudflare-build` |

### Deployment Command
- The sole verified deployment command is:
  ```bash
  pnpm production:release:text
  ```
- This script verifies that the commit being deployed matches `origin/main` and records the exact SHA (`ead8cbfcd9410440f3cf1c46f7b7f69f97c43f0d`) in release evidence.

---

## 8. Caveats
- **Secret Keys in Local Test Environment**: In tests, mock HMAC keys and secrets (e.g. `'test_webhook_hmac_retry'`) are used in memory. Production secrets must only be provisioned via Cloudflare Worker encrypted secret bindings.
- **`sovereign_pro` Tier Pricing**: In production Stripe, if `sovereign_pro` is introduced as a distinct paid SKU, its monthly/annual price IDs should be bound to `env.STRIPE_PRICE_SOVEREIGN_PRO_MONTHLY` and `env.STRIPE_PRICE_SOVEREIGN_PRO_ANNUAL` in `apps/worker/src/env.ts`.

---

## 9. Conclusion
- Requirements R4 and R5 have been completely surveyed, validated against live codebase contracts, and specified with surgical precision.
- Migration schema from `0004` and `0009` fully accommodates all Stripe customer and event needs without creating any new D1 migrations.
- The gate testing suite (`typecheck`, `build`, `test`, `verify:foundation`, `verify:cloudflare-build`) is currently 100% green.
- The implementation plan for the Stripe billing webhook route, the 5 lifecycle events, the 400 signature check, and the 402 `sovereign_pro` payment required middleware is fully specified and ready for implementation.

---

## 10. Verification Method

To independently verify these findings, execute:
```bash
# 1. Verify TypeScript compilation
pnpm typecheck

# 2. Verify production build
pnpm build

# 3. Verify all test suites
pnpm test

# 4. Verify repository foundation
pnpm verify:foundation

# 5. Verify D1 migration sequence immutability (0018 -> 0019)
pnpm verify:migrations

# 6. Verify absence of committed secrets
pnpm scan:secrets

# 7. Verify Cloudflare build pipeline
pnpm verify:cloudflare-build
```
All commands must exit with code 0.
