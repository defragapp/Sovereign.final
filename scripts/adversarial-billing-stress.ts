import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import app from '../apps/worker/src/index';
import type { Env } from '../apps/worker/src/env';
import { createSignedSessionToken } from '../apps/worker/src/security/auth';
import { requireProTier, isProTier } from '../apps/worker/src/security/tier-guard';
import { verifyStripeSignature } from '../apps/worker/src/security/stripe-signature';

const executionContext = {
  waitUntil: (_promise: Promise<unknown>) => undefined,
  passThroughOnException: () => undefined
} as unknown as ExecutionContext;

async function signPayload(body: string, secret: string, timestamp: number): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${body}`));
  const digest = [...new Uint8Array(signed)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `t=${timestamp},v1=${digest}`;
}

interface TestDbState {
  accounts: Map<string, { id: string; auth_subject: string }>;
  stripeCustomers: Map<string, { account_id: string; stripe_customer_id: string; email_normalized?: string | null }>;
  stripeSubscriptions: Map<string, {
    id: string;
    account_id: string;
    stripe_subscription_id: string;
    stripe_customer_id?: string | null;
    plan_key: string;
    status: string;
    current_period_end?: string | null;
    cancel_at_period_end: number;
    source_event_id?: string | null;
    last_event_created?: number | null;
    last_event_id?: string | null;
    updated_at: string;
  }>;
  entitlements: Map<string, { plan: string; features_json: string; as_of: string; source_event_id?: string | null }>;
  webhookEvents: Map<string, { provider: string; event_id: string; event_type: string; received_at: string; processed_at?: string | null; error_code?: string | null }>;
  notificationsSent: unknown[];
}

function createTestEnvironment(customState?: Partial<TestDbState>) {
  const state: TestDbState = {
    accounts: new Map([
      ['acct_free', { id: 'acct_free', auth_subject: 'email:free@example.com' }],
      ['acct_plus', { id: 'acct_plus', auth_subject: 'email:plus@example.com' }],
      ['acct_pro', { id: 'acct_pro', auth_subject: 'email:pro@example.com' }]
    ]),
    stripeCustomers: new Map(),
    stripeSubscriptions: new Map(),
    entitlements: new Map([
      ['acct_free', { plan: 'free', features_json: JSON.stringify(['baseline.today', 'baseline.explore']), as_of: new Date().toISOString() }],
      ['acct_plus', { plan: 'sovereign_plus', features_json: JSON.stringify(['baseline.today', 'baseline.explore', 'people.compare']), as_of: new Date().toISOString() }],
      ['acct_pro', { plan: 'sovereign_pro', features_json: JSON.stringify(['baseline.today', 'baseline.explore', 'people.compare']), as_of: new Date().toISOString() }]
    ]),
    webhookEvents: new Map(),
    notificationsSent: [],
    ...customState
  };

  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async first() {
              if (sql.startsWith('SELECT id, auth_subject FROM accounts WHERE auth_subject = ?')) {
                for (const account of state.accounts.values()) {
                  if (account.auth_subject === args[0]) return account;
                }
                return null;
              }
              if (sql.startsWith('SELECT auth_subject FROM accounts WHERE id = ?')) {
                for (const account of state.accounts.values()) {
                  if (account.id === args[0]) return { auth_subject: account.auth_subject };
                }
                return null;
              }
              if (sql.startsWith('SELECT account_id FROM stripe_customers WHERE stripe_customer_id = ?')) {
                for (const cust of state.stripeCustomers.values()) {
                  if (cust.stripe_customer_id === args[0]) return { account_id: cust.account_id };
                }
                return null;
              }
              if (sql.startsWith('SELECT stripe_customer_id FROM stripe_customers WHERE account_id = ?')) {
                const cust = state.stripeCustomers.get(String(args[0]));
                return cust ? { stripe_customer_id: cust.stripe_customer_id } : null;
              }
              if (sql.startsWith('SELECT account_id, plan_key, status FROM stripe_subscriptions WHERE stripe_subscription_id = ?')) {
                const sub = state.stripeSubscriptions.get(String(args[0]));
                return sub ? { account_id: sub.account_id, plan_key: sub.plan_key, status: sub.status } : null;
              }
              if (sql.startsWith('SELECT account_id FROM stripe_subscriptions WHERE stripe_subscription_id = ?')) {
                const sub = state.stripeSubscriptions.get(String(args[0]));
                return sub ? { account_id: sub.account_id } : null;
              }
              if (sql.startsWith('SELECT plan_key FROM stripe_subscriptions WHERE stripe_subscription_id = ?')) {
                const sub = state.stripeSubscriptions.get(String(args[0]));
                return sub ? { plan_key: sub.plan_key } : null;
              }
              if (sql.includes("status IN ('active','trialing')")) {
                for (const sub of state.stripeSubscriptions.values()) {
                  if (sub.account_id === args[0] && ['active', 'trialing'].includes(sub.status)) {
                    return { id: sub.id, status: sub.status };
                  }
                }
                return null;
              }
              if (sql.startsWith('SELECT plan, features_json, as_of FROM entitlement_cache WHERE account_id = ?')) {
                const ent = state.entitlements.get(String(args[0]));
                return ent ? { plan: ent.plan, features_json: ent.features_json, as_of: ent.as_of } : null;
              }
              if (sql.startsWith('SELECT processed_at, error_code FROM webhook_events')) {
                const key = `stripe:${args[0]}`;
                const event = state.webhookEvents.get(key);
                return event ? { processed_at: event.processed_at, error_code: event.error_code } : null;
              }
              return null;
            },
            async run() {
              if (sql.includes('INSERT INTO webhook_events')) {
                const eventId = String(args[0]);
                const eventType = String(args[1]);
                const key = `stripe:${eventId}`;
                if (state.webhookEvents.has(key)) return { success: true, meta: { changes: 0 } };
                state.webhookEvents.set(key, {
                  provider: 'stripe',
                  event_id: eventId,
                  event_type: eventType,
                  received_at: new Date().toISOString(),
                  processed_at: null,
                  error_code: null
                });
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.includes("UPDATE webhook_events SET processed_at = datetime('now')")) {
                const eventId = String(args[0]);
                const key = `stripe:${eventId}`;
                const event = state.webhookEvents.get(key);
                if (event) {
                  event.processed_at = new Date().toISOString();
                  event.error_code = null;
                }
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.includes('UPDATE webhook_events SET processed_at = NULL')) {
                const eventId = String(args[1]);
                const key = `stripe:${eventId}`;
                const event = state.webhookEvents.get(key);
                if (event) {
                  event.processed_at = null;
                  event.error_code = String(args[0]);
                }
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.includes('INSERT INTO stripe_customers')) {
                const accountId = String(args[0]);
                const customerId = String(args[1]);
                const email = args[2] ? String(args[2]) : null;
                state.stripeCustomers.set(accountId, {
                  account_id: accountId,
                  stripe_customer_id: customerId,
                  email_normalized: email
                });
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.includes('UPDATE stripe_subscriptions') && (sql.includes('SET status') || sql.includes("status = 'retained_billing_record'"))) {
                let status = '';
                let subId = '';
                if (sql.includes("status = 'active'")) {
                  status = 'active';
                  subId = String(args[0]);
                } else if (sql.includes("status = 'past_due'")) {
                  status = 'past_due';
                  subId = String(args[0]);
                } else if (sql.includes("status = 'canceled'")) {
                  status = 'canceled';
                  subId = String(args[0]);
                } else if (sql.includes("status = 'retained_billing_record'")) {
                  status = 'retained_billing_record';
                  subId = String(args[4]);
                } else {
                  status = String(args[0]);
                  subId = String(args[1]);
                }
                const sub = state.stripeSubscriptions.get(subId);
                if (sub) {
                  sub.status = status;
                  sub.updated_at = new Date().toISOString();
                }
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.includes('INSERT INTO stripe_subscriptions')) {
                const id = String(args[0]);
                const accountId = String(args[1]);
                const subId = String(args[2]);
                const customerId = args[3] ? String(args[3]) : null;
                const planKey = String(args[4]);
                const status = String(args[5]);
                const currentPeriodEnd = args[6] ? String(args[6]) : null;
                const cancelAtPeriodEnd = Number(args[7]);
                const sourceEventId = String(args[8]);
                const lastEventCreated = Number(args[9]);
                const lastEventId = String(args[10]);

                const existing = state.stripeSubscriptions.get(subId);
                if (existing && (existing.last_event_created ?? 0) > lastEventCreated) {
                  return { success: true, meta: { changes: 0 } };
                }
                state.stripeSubscriptions.set(subId, {
                  id,
                  account_id: accountId,
                  stripe_subscription_id: subId,
                  stripe_customer_id: customerId,
                  plan_key: planKey,
                  status,
                  current_period_end: currentPeriodEnd,
                  cancel_at_period_end: cancelAtPeriodEnd,
                  source_event_id: sourceEventId,
                  last_event_created: lastEventCreated,
                  last_event_id: lastEventId,
                  updated_at: new Date().toISOString()
                });
                return { success: true, meta: { changes: 1 } };
              }
              if (sql.includes('INSERT INTO entitlement_cache')) {
                const accountId = String(args[0]);
                const plan = sql.includes("'free'") ? 'free' : String(args[1]);
                const featuresJson = sql.includes("'free'") ? String(args[1]) : String(args[2]);
                const sourceEventId = sql.includes("'free'") ? (args[2] ? String(args[2]) : null) : (args[3] ? String(args[3]) : null);
                state.entitlements.set(accountId, {
                  plan,
                  features_json: featuresJson,
                  as_of: new Date().toISOString(),
                  source_event_id: sourceEventId
                });
                return { success: true, meta: { changes: 1 } };
              }
              return { success: true, meta: { changes: 1 } };
            },
            async all() { return { results: [] }; }
          };
        }
      };
    }
  } as unknown as D1Database;

  const env = {
    APP_ENV: 'test',
    APP_VERSION: 'test-v1',
    SESSION_SIGNING_SECRET: 'test_session_signing_secret_key_32bytes',
    STRIPE_WEBHOOK_SECRET: 'test_stripe_webhook_signing_secret',
    STRIPE_SECRET_KEY: 'test_stripe_api_key_placeholder',
    STRIPE_PRICE_SOVEREIGN_PLUS_MONTHLY: 'price_plus_monthly',
    STRIPE_PRICE_SOVEREIGN_PLUS_ANNUAL: 'price_plus_annual',
    STRIPE_PRICE_SOVEREIGN_PRO_MONTHLY: 'price_pro_monthly',
    STRIPE_PRICE_SOVEREIGN_PRO_ANNUAL: 'price_pro_annual',
    DB: db
  } as unknown as Env;

  return { env, state };
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    failed++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    passed++;
    console.log(`✅ PASS: ${message}`);
  }
}

async function runAdversarialChallenges() {
  console.log('=== STARTING EMPIRICAL ADVERSARIAL CHALLENGE (BACKEND BILLING & SECURITY) ===\n');

  // =========================================================================
  // CHALLENGE 1: Missing & Forged Stripe Signatures
  // =========================================================================
  console.log('--- CHALLENGE 1: Stripe Webhook Signature Edge Cases & Attack Scenarios ---');
  {
    const { env } = createTestEnvironment();
    const validBody = JSON.stringify({ id: 'evt_test_sig_check', type: 'unhandled.event', data: { object: {} } });
    const now = Math.floor(Date.now() / 1000);

    // 1.1 No signature header -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Missing signature header returns 400');
      assert((await res.text()) === 'Invalid signature', 'Missing signature returns "Invalid signature"');
    }

    // 1.2 Empty signature header "" -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': '' },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Empty signature header returns 400');
      assert((await res.text()) === 'Invalid signature', 'Empty signature returns "Invalid signature"');
    }

    // 1.3 Whitespace only signature -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': '    ' },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Whitespace-only signature returns 400');
    }

    // 1.4 Malformed timestamp (NaN) -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': 't=invalid_timestamp,v1=abcdef' },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Malformed timestamp returns 400');
    }

    // 1.5 Missing timestamp key (only v1) -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': 'v1=deadbeef123456' },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Missing timestamp key (t=) returns 400');
    }

    // 1.6 Missing v1 key (only t=) -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': `t=${now}` },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Missing signature key (v1=) returns 400');
    }

    // 1.7 Invalid HMAC signature digest -> 400
    {
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': `t=${now},v1=0000000000000000000000000000000000000000000000000000000000000000` },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Invalid HMAC digest returns 400');
    }

    // 1.8 Forged signature signed with wrong secret -> 400
    {
      const forgedSig = await signPayload(validBody, 'wrong_adversary_secret', now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': forgedSig },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Forged signature with wrong secret returns 400');
    }

    // 1.9 Timestamp older than 300 seconds (e.g. 301 seconds old) -> 400
    {
      const oldTime = now - 301;
      const oldSig = await signPayload(validBody, env.STRIPE_WEBHOOK_SECRET, oldTime);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': oldSig },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Expired signature (301s old) returns 400');
    }

    // 1.10 Timestamp newer than 300 seconds in the future (replay/clock skew attack) -> 400
    {
      const futureTime = now + 301;
      const futureSig = await signPayload(validBody, env.STRIPE_WEBHOOK_SECRET, futureTime);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': futureSig },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Future signature (>300s skew) returns 400');
    }

    // 1.11 Valid signature at boundary (299 seconds old) -> passes verification
    {
      const boundaryTime = now - 295;
      const boundarySig = await signPayload(validBody, env.STRIPE_WEBHOOK_SECRET, boundaryTime);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': boundarySig },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'Valid signature within 300s tolerance returns 200');
    }

    // 1.12 Multiple v1 signatures (key rotation support: invalid + valid) -> passes verification
    {
      const validSig = await signPayload(validBody, env.STRIPE_WEBHOOK_SECRET, now);
      const rotatedSig = `t=${now},v1=deadbeefinvalidcandidate,${validSig.split(',')[1]}`;
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': rotatedSig },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'Key rotation with multiple v1 signatures successfully authenticates');
    }

    // 1.13 Signature test on alternative endpoint /api/v1/stripe/webhook
    {
      const req = new Request('https://app.defrag.app/api/v1/stripe/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: validBody
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Missing signature on /api/v1/stripe/webhook returns 400');
    }

    // 1.14 Malformed body (not valid JSON) with valid signature -> 400
    {
      const badJson = '{"not valid json: true';
      const sig = await signPayload(badJson, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body: badJson
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 400, 'Malformed JSON body with valid signature returns 400 "Invalid event"');
      assert((await res.text()) === 'Invalid event', 'Invalid JSON returns "Invalid event"');
    }
  }

  // =========================================================================
  // CHALLENGE 2: Five Webhook Events State Mutation & Idempotency
  // =========================================================================
  console.log('\n--- CHALLENGE 2: Five Webhook Events Mutation & Idempotency ---');
  {
    const { env, state } = createTestEnvironment();
    const now = Math.floor(Date.now() / 1000);

    // 2.1 Event 1: checkout.session.completed (maps stripe_customers)
    {
      const event = {
        id: 'evt_adv_cs_1',
        type: 'checkout.session.completed',
        created: now,
        data: {
          object: {
            id: 'cs_adv_1',
            customer: 'cus_adv_1',
            client_reference_id: 'acct_free',
            customer_details: { email: 'Adv-User@Example.COM' }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'checkout.session.completed returns 200');
      const data = await res.json() as any;
      assert(data.customerLinked === true, 'checkout.session.completed links customer');
      assert(data.accountId === 'acct_free', 'checkout.session.completed identifies accountId');

      const customer = state.stripeCustomers.get('acct_free');
      assert(customer?.stripe_customer_id === 'cus_adv_1', 'stripe_customers updated with cus_adv_1');
      assert(customer?.email_normalized === 'adv-user@example.com', 'email is normalized to lowercase');
    }

    // 2.2 Event 2: invoice.payment_succeeded (updates subscription status & entitlement)
    {
      state.stripeSubscriptions.set('sub_adv_plus', {
        id: 'sub_adv_plus',
        account_id: 'acct_free',
        stripe_subscription_id: 'sub_adv_plus',
        plan_key: 'sovereign_plus',
        status: 'past_due',
        cancel_at_period_end: 0,
        updated_at: '2026-01-01T00:00:00Z'
      });

      const event = {
        id: 'evt_adv_inv_succ_1',
        type: 'invoice.payment_succeeded',
        created: now,
        data: {
          object: {
            id: 'in_adv_1',
            subscription: 'sub_adv_plus',
            customer: 'cus_adv_1',
            metadata: { account_id: 'acct_free' }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'invoice.payment_succeeded returns 200');
      const data = await res.json() as any;
      assert(data.subscriptionConfirmed === true, 'subscription confirmed active');

      const sub = state.stripeSubscriptions.get('sub_adv_plus');
      assert(sub?.status === 'active', 'subscription status updated to active');
      const ent = state.entitlements.get('acct_free');
      assert(ent?.plan === 'sovereign_plus', 'entitlement cache upgraded to sovereign_plus');
    }

    // 2.3 Event 3: invoice.payment_failed (downgrades to free, past_due, payment_attention)
    {
      const event = {
        id: 'evt_adv_inv_fail_1',
        type: 'invoice.payment_failed',
        created: now,
        data: {
          object: {
            id: 'in_adv_fail_1',
            subscription: 'sub_adv_plus',
            customer: 'cus_adv_1',
            metadata: { account_id: 'acct_free' }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'invoice.payment_failed returns 200');
      const data = await res.json() as any;
      assert(data.paymentFailed === true, 'paymentFailed confirmed true');

      const sub = state.stripeSubscriptions.get('sub_adv_plus');
      assert(sub?.status === 'past_due', 'subscription status set to past_due');
      const ent = state.entitlements.get('acct_free');
      assert(ent?.plan === 'free', 'entitlement downgraded to free');
    }

    // 2.4 Event 4: customer.subscription.updated (pro tier projection)
    {
      const event = {
        id: 'evt_adv_sub_upd_1',
        type: 'customer.subscription.updated',
        created: now + 5,
        data: {
          object: {
            id: 'sub_adv_pro_1',
            status: 'active',
            metadata: { account_id: 'acct_free' },
            items: { data: [{ price: { id: 'price_pro_monthly' } }] }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'customer.subscription.updated returns 200');
      const data = await res.json() as any;
      assert(data.projected === true, 'subscription projected');

      const sub = state.stripeSubscriptions.get('sub_adv_pro_1');
      assert(sub?.status === 'active', 'subscription status is active');
      assert(sub?.plan_key === 'sovereign_pro', 'subscription plan is sovereign_pro');
      const ent = state.entitlements.get('acct_free');
      assert(ent?.plan === 'sovereign_pro', 'entitlement cache is upgraded to sovereign_pro');
    }

    // 2.5 Event 5: customer.subscription.deleted (cancellation & return to free)
    {
      const event = {
        id: 'evt_adv_sub_del_1',
        type: 'customer.subscription.deleted',
        created: now + 10,
        data: {
          object: {
            id: 'sub_adv_pro_1',
            status: 'canceled',
            metadata: { account_id: 'acct_free' },
            items: { data: [{ price: { id: 'price_pro_monthly' } }] }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'customer.subscription.deleted returns 200');
      const data = await res.json() as any;
      assert(data.projected === true, 'subscription deletion projected');

      const sub = state.stripeSubscriptions.get('sub_adv_pro_1');
      assert(sub?.status === 'canceled', 'subscription status is canceled');
      const ent = state.entitlements.get('acct_free');
      assert(ent?.plan === 'free', 'entitlement reset to free');
    }

    // 2.6 Idempotency / Deduplication replay test
    {
      const event = {
        id: 'evt_adv_dedup_test',
        type: 'customer.subscription.updated',
        created: now + 20,
        data: {
          object: {
            id: 'sub_adv_dedup',
            status: 'active',
            metadata: { account_id: 'acct_plus' },
            items: { data: [{ price: { id: 'price_plus_monthly' } }] }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const makeReq = () => new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });

      // First call
      const res1 = await app.fetch(makeReq(), env, executionContext);
      assert(res1.status === 200, 'Initial event processing returns 200');
      const d1 = await res1.json() as any;
      assert(d1.projected === true, 'Initial event projected');

      // Second replay call
      const res2 = await app.fetch(makeReq(), env, executionContext);
      assert(res2.status === 200, 'Duplicate event replay returns 200');
      const d2 = await res2.json() as any;
      assert(d2.duplicate === true && d2.processed === true, 'Duplicate event recognized as duplicate without re-executing');
    }

    // 2.7 Unresolved checkout identity (missing account and client_reference_id) -> 500 retryable
    {
      const event = {
        id: 'evt_adv_cs_unresolved',
        type: 'checkout.session.completed',
        created: now,
        data: {
          object: {
            id: 'cs_adv_unresolved',
            customer: 'cus_adv_unresolved'
            // No client_reference_id, no metadata
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 500, 'Unresolved checkout identity returns 500 retryable error');
      const data = await res.json() as any;
      assert(data.retryable === true, 'Error response specifies retryable: true');

      const webhookRecord = state.webhookEvents.get('stripe:evt_adv_cs_unresolved');
      assert(webhookRecord?.processed_at === null, 'processed_at is null for retryable error');
      assert(webhookRecord?.error_code === 'checkout_session_identity_unresolved', 'error_code recorded in webhook_events');
    }

    // 2.8 Out-of-order subscription event (stale created timestamp)
    {
      // Already has event at now + 5 for sub_adv_pro_1
      const staleEvent = {
        id: 'evt_adv_sub_stale',
        type: 'customer.subscription.updated',
        created: now - 100, // Older than existing
        data: {
          object: {
            id: 'sub_adv_pro_1',
            status: 'active',
            metadata: { account_id: 'acct_free' },
            items: { data: [{ price: { id: 'price_plus_monthly' } }] }
          }
        }
      };
      const body = JSON.stringify(staleEvent);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'Stale subscription event returns 200');
      const data = await res.json() as any;
      assert(data.stale === true && data.projected === false, 'Stale event identified and projection skipped');
    }

    // 2.9 Deleted account does not revive subscription
    {
      state.accounts.set('acct_deleted', { id: 'acct_deleted', auth_subject: 'deleted:user@example.com' });
      state.stripeSubscriptions.set('sub_adv_del_acct', {
        id: 'sub_adv_del_acct',
        account_id: 'acct_deleted',
        stripe_subscription_id: 'sub_adv_del_acct',
        plan_key: 'sovereign_plus',
        status: 'active',
        cancel_at_period_end: 0,
        updated_at: '2026-01-01T00:00:00Z'
      });

      const event = {
        id: 'evt_adv_sub_deleted_acct',
        type: 'customer.subscription.updated',
        created: now + 50,
        data: {
          object: {
            id: 'sub_adv_del_acct',
            status: 'active',
            metadata: { account_id: 'acct_deleted' },
            items: { data: [{ price: { id: 'price_plus_monthly' } }] }
          }
        }
      };
      const body = JSON.stringify(event);
      const sig = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, now);
      const req = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': sig },
        body
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'Event on deleted account returns 200');
      const data = await res.json() as any;
      assert(data.deletedAccount === true, 'Response identifies deletedAccount');

      const sub = state.stripeSubscriptions.get('sub_adv_del_acct');
      assert(sub?.status === 'retained_billing_record', 'Subscription retained as billing record without revival');
    }
  }

  // =========================================================================
  // CHALLENGE 3: 402 Payment Required Edge Cases
  // =========================================================================
  console.log('\n--- CHALLENGE 3: 402 Payment Required Edge Cases ---');
  {
    const { env } = createTestEnvironment();

    // 3.1 Unauthenticated request -> 401
    {
      const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { origin: 'https://app.defrag.app' }
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 401, 'Unauthenticated request to /api/v1/workspace/pro returns 401');
    }

    // 3.2 Malformed token -> 401
    {
      const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { authorization: 'Bearer invalid.token.garbage', origin: 'https://app.defrag.app' }
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 401, 'Malformed Bearer token returns 401');
    }

    // 3.3 Expired token -> 401
    {
      const expiredToken = await createSignedSessionToken(
        { sub: 'email:free@example.com', exp: Math.floor(Date.now() / 1000) - 100 },
        env.SESSION_SIGNING_SECRET
      );
      const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { authorization: `Bearer ${expiredToken}`, origin: 'https://app.defrag.app' }
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 401, 'Expired session token returns 401');
    }

    // 3.4 Authenticated account with plan 'free' -> 402
    {
      const token = await createSignedSessionToken(
        { sub: 'email:free@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );
      const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { authorization: `Bearer ${token}`, origin: 'https://app.defrag.app' }
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 402, 'Account with plan "free" receives 402 Payment Required');
      assert(res.headers.get('content-type')?.includes('application/json') === true, '402 response is application/json');
      assert(res.headers.get('cache-control') === 'private, no-store', '402 has cache-control: private, no-store');
      const data = await res.json() as any;
      assert(data.error === 'payment_required', 'error code is "payment_required"');
      assert(data.requiredTier === 'sovereign_pro', 'requiredTier is "sovereign_pro"');
      assert(data.currentPlan === 'free', 'currentPlan is "free"');
      assert(data.upgradeUrl === 'https://sovereign.defrag.app/pricing', 'upgradeUrl provided');
    }

    // 3.5 Authenticated account with plan 'sovereign_plus' -> 402
    {
      const token = await createSignedSessionToken(
        { sub: 'email:plus@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );
      const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { authorization: `Bearer ${token}`, origin: 'https://app.defrag.app' }
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 402, 'Account with plan "sovereign_plus" receives 402 Payment Required');
      const data = await res.json() as any;
      assert(data.requiredTier === 'sovereign_pro', 'requiredTier is "sovereign_pro"');
      assert(data.currentPlan === 'sovereign_plus', 'currentPlan is "sovereign_plus"');
    }

    // 3.6 Authenticated account with plan 'sovereign_pro' -> 200
    {
      const token = await createSignedSessionToken(
        { sub: 'email:pro@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );
      const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { authorization: `Bearer ${token}`, origin: 'https://app.defrag.app' }
      });
      const res = await app.fetch(req, env, executionContext);
      assert(res.status === 200, 'Account with plan "sovereign_pro" receives 200 OK');
      const data = await res.json() as any;
      assert(data.ok === true, 'response ok is true');
      assert(data.tier === 'sovereign_pro', 'tier is sovereign_pro');
      assert(data.accountId === 'acct_pro', 'accountId is acct_pro');
    }

    // 3.7 Method coverage: POST/PUT/DELETE to /api/v1/workspace/pro
    {
      const freeToken = await createSignedSessionToken(
        { sub: 'email:free@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );
      for (const method of ['POST', 'PUT', 'DELETE']) {
        const req = new Request('https://app.defrag.app/api/v1/workspace/pro', {
          method,
          headers: { authorization: `Bearer ${freeToken}`, origin: 'https://app.defrag.app' }
        });
        const res = await app.fetch(req, env, executionContext);
        assert(res.status === 402, `${method} /api/v1/workspace/pro returns 402 for non-pro account`);
      }
    }
  }

  // =========================================================================
  // CHALLENGE 4: D1 Migration Sequence Stress Test
  // =========================================================================
  console.log('\n--- CHALLENGE 4: D1 Migration Sequence Immutability ---');
  {
    const migrationsDir = join(process.cwd(), 'apps/worker/migrations');
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    assert(files.length === 19, `Total migration files is exactly 19 (found: ${files.length})`);

    const latestFile = files[files.length - 1];
    assert(latestFile === '0019_deprecate_manual_capacity.sql', `Latest migration is strictly '0019_deprecate_manual_capacity.sql' (found: ${latestFile})`);

    // Verify sequential integrity without gaps
    for (let i = 0; i < files.length; i++) {
      const expectedPrefix = String(i + 1).padStart(4, '0');
      assert(files[i].startsWith(expectedPrefix), `Migration #${i + 1} has expected prefix ${expectedPrefix} (${files[i]})`);
    }

    // Verify no prohibited duplicate migration files (e.g. 002_subscription_status.sql)
    assert(!files.some((f) => f.includes('subscription_status')), 'No duplicate subscription_status migration exists');
    assert(!files.some((f) => f.startsWith('0020_')), 'No migration 0020 exists');
  }

  // =========================================================================
  // CHALLENGE 5: Secret Leak Verification
  // =========================================================================
  console.log('\n--- CHALLENGE 5: Secret Leak & Binding Verification ---');
  {
    const targetFiles = [
      'apps/worker/src/routes/stripe.ts',
      'apps/worker/src/billing/stripe.ts',
      'apps/worker/src/security/tier-guard.ts',
      'apps/worker/src/index.ts',
      'apps/worker/src/security/stripe-signature.ts'
    ];

    const forbiddenPatterns = [
      'sk_live_',
      'sk_test_',
      'whsec_'
    ];

    for (const relPath of targetFiles) {
      const fullPath = join(process.cwd(), relPath);
      const content = readFileSync(fullPath, 'utf8');
      for (const pattern of forbiddenPatterns) {
        assert(!content.includes(pattern), `Zero hardcoded secret pattern "${pattern}" in ${relPath}`);
      }
    }

    // Verify env binding access
    const stripeRoute = readFileSync(join(process.cwd(), 'apps/worker/src/routes/stripe.ts'), 'utf8');
    assert(stripeRoute.includes('env.STRIPE_WEBHOOK_SECRET'), 'Webhook secret accessed strictly via env.STRIPE_WEBHOOK_SECRET');

    const stripeBilling = readFileSync(join(process.cwd(), 'apps/worker/src/billing/stripe.ts'), 'utf8');
    assert(stripeBilling.includes('env.STRIPE_SECRET_KEY'), 'Stripe key accessed strictly via env.STRIPE_SECRET_KEY');
  }

  console.log(`\n======================================================`);
  console.log(`ALL EMPIRICAL CHALLENGES COMPLETE!`);
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log(`Verdict: APPROVE`);
  console.log(`======================================================\n`);
}

runAdversarialChallenges().catch((err) => {
  console.error('Test run failed with unhandled error:', err);
  process.exit(1);
});
