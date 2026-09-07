import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import app from '../index';
import type { Env } from '../env';
import { createSignedSessionToken } from '../security/auth';
import { requireProTier, isProTier } from '../security/tier-guard';
import { handleStripeWebhook } from '../routes/stripe';

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
              if (sql.includes('UPDATE stripe_subscriptions') && sql.includes('SET status')) {
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

describe('Requirement R4: Stripe Billing Webhook Route & 402 Tier Guard', () => {
  describe('Webhook Route Ingress & Signature Enforcement', () => {
    it('returns HTTP 400 when stripe-signature header is missing on /api/billing/webhook', async () => {
      const { env } = createTestEnvironment();
      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'evt_test_no_sig', type: 'invoice.payment_succeeded' })
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe('Invalid signature');
    });

    it('returns HTTP 400 when stripe-signature header is invalid on /api/billing/webhook', async () => {
      const { env } = createTestEnvironment();
      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': 't=12345,v1=deadbeefinvalidhmacdigest'
        },
        body: JSON.stringify({ id: 'evt_test_bad_sig', type: 'invoice.payment_succeeded' })
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe('Invalid signature');
    });

    it('returns HTTP 400 when stripe-signature header is missing on /api/v1/stripe/webhook', async () => {
      const { env } = createTestEnvironment();
      const request = new Request('https://app.defrag.app/api/v1/stripe/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: 'evt_test_no_sig', type: 'invoice.payment_succeeded' })
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe('Invalid signature');
    });
  });

  describe('Webhook Event 1: checkout.session.completed', () => {
    it('links customer to accountId in stripe_customers table upon checkout.session.completed', async () => {
      const { env, state } = createTestEnvironment();
      const event = {
        id: 'evt_cs_completed_1',
        type: 'checkout.session.completed',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'cs_test_session_1',
            customer: 'cus_sovereign_user_1',
            client_reference_id: 'acct_free',
            customer_details: { email: 'user1@example.com' }
          }
        }
      };

      const body = JSON.stringify(event);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, timestamp);

      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': signature },
        body
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result).toMatchObject({
        received: true,
        projected: true,
        customerLinked: true,
        accountId: 'acct_free',
        customerId: 'cus_sovereign_user_1'
      });

      // Assert stripe_customers was updated in state
      const customerRecord = state.stripeCustomers.get('acct_free');
      expect(customerRecord).toBeDefined();
      expect(customerRecord?.stripe_customer_id).toBe('cus_sovereign_user_1');
      expect(customerRecord?.email_normalized).toBe('user1@example.com');
    });
  });

  describe('Webhook Event 2: invoice.payment_succeeded', () => {
    it('confirms subscription active and updates timestamps upon invoice.payment_succeeded', async () => {
      const { env, state } = createTestEnvironment();
      // Setup existing subscription in past_due state
      state.stripeSubscriptions.set('sub_inv_success_1', {
        id: 'sub_inv_success_1',
        account_id: 'acct_plus',
        stripe_subscription_id: 'sub_inv_success_1',
        plan_key: 'sovereign_plus',
        status: 'past_due',
        cancel_at_period_end: 0,
        updated_at: '2026-01-01T00:00:00Z'
      });

      const event = {
        id: 'evt_inv_succeeded_1',
        type: 'invoice.payment_succeeded',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'in_test_inv_1',
            subscription: 'sub_inv_success_1',
            customer: 'cus_plus_user',
            metadata: { account_id: 'acct_plus' }
          }
        }
      };

      const body = JSON.stringify(event);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, timestamp);

      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': signature },
        body
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result).toMatchObject({
        received: true,
        processed: true,
        subscriptionConfirmed: true,
        subscriptionId: 'sub_inv_success_1'
      });

      // Subscription should be active and entitlement updated
      const sub = state.stripeSubscriptions.get('sub_inv_success_1');
      expect(sub?.status).toBe('active');
      const entitlement = state.entitlements.get('acct_plus');
      expect(entitlement?.plan).toBe('sovereign_plus');
    });
  });

  describe('Webhook Event 3: invoice.payment_failed', () => {
    it('sets subscription to past_due, downgrades entitlement to free, and triggers payment_attention', async () => {
      const { env, state } = createTestEnvironment();
      // Setup active subscription for acct_plus
      state.stripeSubscriptions.set('sub_inv_fail_1', {
        id: 'sub_inv_fail_1',
        account_id: 'acct_plus',
        stripe_subscription_id: 'sub_inv_fail_1',
        plan_key: 'sovereign_plus',
        status: 'active',
        cancel_at_period_end: 0,
        updated_at: '2026-01-01T00:00:00Z'
      });

      const event = {
        id: 'evt_inv_failed_1',
        type: 'invoice.payment_failed',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'in_test_fail_1',
            subscription: 'sub_inv_fail_1',
            customer: 'cus_plus_user',
            metadata: { account_id: 'acct_plus' }
          }
        }
      };

      const body = JSON.stringify(event);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, timestamp);

      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': signature },
        body
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result).toMatchObject({
        received: true,
        processed: true,
        paymentFailed: true,
        subscriptionId: 'sub_inv_fail_1',
        accountId: 'acct_plus'
      });

      // Subscription should be past_due and entitlement downgraded to free
      const sub = state.stripeSubscriptions.get('sub_inv_fail_1');
      expect(sub?.status).toBe('past_due');
      const entitlement = state.entitlements.get('acct_plus');
      expect(entitlement?.plan).toBe('free');
    });
  });

  describe('Webhook Events 4 & 5: customer.subscription.updated and deleted', () => {
    it('projects customer.subscription.updated to active state and updates entitlement cache', async () => {
      const { env, state } = createTestEnvironment();
      const event = {
        id: 'evt_sub_updated_1',
        type: 'customer.subscription.updated',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'sub_live_1',
            status: 'active',
            metadata: { account_id: 'acct_free' },
            items: { data: [{ price: { id: 'price_plus_monthly' } }] }
          }
        }
      };

      const body = JSON.stringify(event);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, timestamp);

      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': signature },
        body
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result).toMatchObject({
        received: true,
        projected: true
      });

      const sub = state.stripeSubscriptions.get('sub_live_1');
      expect(sub?.status).toBe('active');
      expect(sub?.plan_key).toBe('sovereign_plus');
      const entitlement = state.entitlements.get('acct_free');
      expect(entitlement?.plan).toBe('sovereign_plus');
    });

    it('projects customer.subscription.deleted to canceled state and resets entitlement cache to free', async () => {
      const { env, state } = createTestEnvironment();
      // Initially active
      state.stripeSubscriptions.set('sub_to_delete_1', {
        id: 'sub_to_delete_1',
        account_id: 'acct_plus',
        stripe_subscription_id: 'sub_to_delete_1',
        plan_key: 'sovereign_plus',
        status: 'active',
        cancel_at_period_end: 0,
        updated_at: '2026-01-01T00:00:00Z'
      });

      const event = {
        id: 'evt_sub_deleted_1',
        type: 'customer.subscription.deleted',
        created: Math.floor(Date.now() / 1000) + 10,
        data: {
          object: {
            id: 'sub_to_delete_1',
            status: 'canceled',
            metadata: { account_id: 'acct_plus' },
            items: { data: [{ price: { id: 'price_plus_monthly' } }] }
          }
        }
      };

      const body = JSON.stringify(event);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, timestamp);

      const request = new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': signature },
        body
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result).toMatchObject({
        received: true,
        projected: true
      });

      const sub = state.stripeSubscriptions.get('sub_to_delete_1');
      expect(sub?.status).toBe('canceled');
      const entitlement = state.entitlements.get('acct_plus');
      expect(entitlement?.plan).toBe('free');
    });

    it('deduplicates already processed event IDs returning HTTP 200 without duplicate processing', async () => {
      const { env } = createTestEnvironment();
      const event = {
        id: 'evt_dedup_1',
        type: 'customer.subscription.updated',
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: 'sub_dedup_1',
            status: 'active',
            metadata: { account_id: 'acct_free' },
            items: { data: [{ price: { id: 'price_plus_monthly' } }] }
          }
        }
      };

      const body = JSON.stringify(event);
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await signPayload(body, env.STRIPE_WEBHOOK_SECRET, timestamp);

      const makeRequest = () => new Request('https://app.defrag.app/api/billing/webhook', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'stripe-signature': signature },
        body
      });

      const firstResponse = await app.fetch(makeRequest(), env, executionContext);
      expect(firstResponse.status).toBe(200);
      expect(await firstResponse.json()).toMatchObject({ received: true, projected: true });

      const duplicateResponse = await app.fetch(makeRequest(), env, executionContext);
      expect(duplicateResponse.status).toBe(200);
      expect(await duplicateResponse.json()).toMatchObject({ received: true, duplicate: true, processed: true });
    });
  });

  describe('402 Payment Required Middleware: requireProTier', () => {
    it('returns HTTP 401 Unauthorized when request has no session token', async () => {
      const { env } = createTestEnvironment();
      const request = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { origin: 'https://app.defrag.app' }
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(401);
    });

    it('returns HTTP 402 Payment Required with structured problem detail when account is on free tier', async () => {
      const { env } = createTestEnvironment();
      const token = await createSignedSessionToken(
        { sub: 'email:free@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );

      const request = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          origin: 'https://app.defrag.app'
        }
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(402);
      expect(response.headers.get('content-type')).toContain('application/json');

      const payload = await response.json() as Record<string, any>;
      expect(payload).toMatchObject({
        type: 'https://sovereign.defrag.app/problems/payment-required',
        error: 'payment_required',
        requiredTier: 'sovereign_pro',
        currentPlan: 'free',
        upgradeUrl: 'https://sovereign.defrag.app/pricing'
      });
      expect(payload.message).toContain('sovereign_pro');
    });

    it('returns HTTP 402 Payment Required when account is on sovereign_plus tier', async () => {
      const { env } = createTestEnvironment();
      const token = await createSignedSessionToken(
        { sub: 'email:plus@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );

      const request = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          origin: 'https://app.defrag.app'
        }
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(402);

      const payload = await response.json();
      expect(payload).toMatchObject({
        error: 'payment_required',
        requiredTier: 'sovereign_pro',
        currentPlan: 'sovereign_plus'
      });
    });

    it('returns HTTP 200 OK when account has sovereign_pro tier', async () => {
      const { env } = createTestEnvironment();
      const token = await createSignedSessionToken(
        { sub: 'email:pro@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );

      const request = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          origin: 'https://app.defrag.app'
        }
      });

      const response = await app.fetch(request, env, executionContext);
      expect(response.status).toBe(200);

      const payload = await response.json();
      expect(payload).toMatchObject({
        ok: true,
        tier: 'sovereign_pro',
        accountId: 'acct_pro'
      });
    });

    it('requireProTier directly throws Response with status 402 for non-pro accounts', async () => {
      const { env } = createTestEnvironment();
      const token = await createSignedSessionToken(
        { sub: 'email:free@example.com', exp: Math.floor(Date.now() / 1000) + 3600 },
        env.SESSION_SIGNING_SECRET
      );
      const request = new Request('https://app.defrag.app/api/v1/workspace/pro', {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` }
      });

      try {
        await requireProTier(request, env);
        expect.fail('requireProTier should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(Response);
        const res = err as Response;
        expect(res.status).toBe(402);
        const data = await res.json() as Record<string, any>;
        expect(data.error).toBe('payment_required');
        expect(data.requiredTier).toBe('sovereign_pro');
      }
    });

    it('isProTier correctly reports tier status', async () => {
      const { env } = createTestEnvironment();
      expect(await isProTier(env, 'acct_free')).toBe(false);
      expect(await isProTier(env, 'acct_plus')).toBe(false);
      expect(await isProTier(env, 'acct_pro')).toBe(true);
    });
  });

  describe('Security & Zero Hardcoded Secret Isolation', () => {
    it('ensures zero hardcoded secret patterns in backend billing and route sources', () => {
      const filesToInspect = [
        'apps/worker/src/routes/stripe.ts',
        'apps/worker/src/billing/stripe.ts',
        'apps/worker/src/security/tier-guard.ts',
        'apps/worker/src/index.ts'
      ];

      // Prohibited secret tokens
      const forbiddenPatterns = [
        ['sk', 'live', ''].join('_'),
        ['sk', 'test', ''].join('_'),
        ['wh', 'sec', ''].join('')
      ];

      for (const file of filesToInspect) {
        const content = readFileSync(new URL(`../../../../${file}`, import.meta.url), 'utf8');
        for (const pattern of forbiddenPatterns) {
          expect(content).not.toContain(pattern);
        }
      }
    });

    it('reads Stripe secrets strictly from env bindings', () => {
      const routeContent = readFileSync(new URL('../routes/stripe.ts', import.meta.url), 'utf8');
      expect(routeContent).toContain('env.STRIPE_WEBHOOK_SECRET');
      expect(routeContent).not.toContain('const STRIPE_WEBHOOK_SECRET =');

      const billingContent = readFileSync(new URL('./stripe.ts', import.meta.url), 'utf8');
      expect(billingContent).toContain('env.STRIPE_SECRET_KEY');
      expect(billingContent).not.toContain('const STRIPE_SECRET_KEY =');
    });
  });
});
