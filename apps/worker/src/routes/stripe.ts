import type { Env } from '../env';
import { enabledFeatureKeys, priceToSubscription, projectSubscriptionEvent, type NormalizedStripeEvent, type PlanKey } from '../billing/stripe';
import { notifyBillingLifecycle, type BillingNotificationKind } from '../billing/notifications';
import { verifyStripeSignature } from '../security/stripe-signature';

interface StripeEvent {
  id: string;
  type: string;
  created?: number;
  data: { object: Record<string, unknown> };
}

const SUBSCRIPTION_EVENTS = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.subscription.paused',
  'customer.subscription.resumed'
]);

function stringValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value) return value;
  if (value && typeof value === 'object' && typeof (value as { id?: unknown }).id === 'string') {
    return (value as { id: string }).id;
  }
  return undefined;
}

function metadataValue(object: Record<string, unknown>, key: string): string | undefined {
  const metadata = object.metadata;
  if (!metadata || typeof metadata !== 'object') return undefined;
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === 'string' && value ? value : undefined;
}

function firstPriceId(object: Record<string, unknown>): string | undefined {
  const items = object.items;
  if (!items || typeof items !== 'object') return undefined;
  const data = (items as { data?: unknown }).data;
  if (!Array.isArray(data)) return undefined;
  const price = (data[0] as { price?: unknown } | undefined)?.price;
  return stringValue(price);
}

async function accountForSubscription(env: Env, object: Record<string, unknown>, customerId?: string): Promise<string | undefined> {
  const metadataAccount = metadataValue(object, 'account_id');
  if (metadataAccount) return metadataAccount;
  if (!customerId) return undefined;
  const row = await env.DB.prepare('SELECT account_id FROM stripe_customers WHERE stripe_customer_id = ?')
    .bind(customerId)
    .first<{ account_id: string }>();
  return row?.account_id;
}

async function normalizeSubscriptionEvent(env: Env, event: StripeEvent): Promise<NormalizedStripeEvent> {
  const object = event.data.object;
  const subscriptionId = stringValue(object.id);
  const customerId = stringValue(object.customer);
  const accountId = await accountForSubscription(env, object, customerId);
  const price = priceToSubscription(env, firstPriceId(object));
  if (!subscriptionId || !accountId) throw new Error('subscription_identity_unresolved');
  const periodEnd = typeof object.current_period_end === 'number'
    ? new Date(object.current_period_end * 1000).toISOString()
    : undefined;
  return {
    id: event.id,
    type: event.type,
    accountId,
    subscriptionId,
    customerId,
    plan: price.plan,
    interval: price.interval,
    status: typeof object.status === 'string' ? object.status : 'unknown',
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: object.cancel_at_period_end === true,
    created: event.created ?? 0
  };
}

function notificationKind(event: NormalizedStripeEvent): BillingNotificationKind | undefined {
  if (['past_due', 'unpaid', 'incomplete'].includes(event.status)) return 'payment_attention';
  if (event.cancelAtPeriodEnd && event.status !== 'canceled') return 'cancellation_scheduled';
  if (event.type === 'customer.subscription.deleted' || event.status === 'canceled' || event.status === 'incomplete_expired' || event.status === 'paused') return 'returned_to_free';
  if ((event.type === 'customer.subscription.created' || event.type === 'customer.subscription.resumed') && ['active', 'trialing'].includes(event.status)) return 'activated';
  return undefined;
}

export async function handleStripeWebhook(request: Request, env: Env): Promise<Response> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';
  const valid = await verifyStripeSignature({ body, header: signature, secret: env.STRIPE_WEBHOOK_SECRET });
  if (!valid) return new Response('Invalid signature', { status: 400 });

  let event: StripeEvent;
  try {
    event = JSON.parse(body) as StripeEvent;
  } catch {
    return new Response('Invalid event', { status: 400 });
  }
  if (!event.id || !event.type || !event.data?.object) return new Response('Invalid event', { status: 400 });

  const inserted = await env.DB.prepare(
    `INSERT INTO webhook_events(provider, event_id, event_type, received_at)
     VALUES('stripe', ?, ?, datetime('now'))
     ON CONFLICT(provider, event_id) DO NOTHING`
  ).bind(event.id, event.type).run();

  if ((inserted.meta?.changes ?? 0) === 0) {
    const existing = await env.DB.prepare(`SELECT processed_at, error_code FROM webhook_events
      WHERE provider = 'stripe' AND event_id = ?`)
      .bind(event.id)
      .first<{ processed_at?: string | null; error_code?: string | null }>();
    if (existing?.processed_at) return Response.json({ received: true, duplicate: true, processed: true });
  }

  const HANDLED_EVENTS = new Set([
    'checkout.session.completed',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
    ...SUBSCRIPTION_EVENTS
  ]);

  if (!HANDLED_EVENTS.has(event.type)) {
    await env.DB.prepare(`UPDATE webhook_events SET processed_at = datetime('now'), error_code = NULL
      WHERE provider = 'stripe' AND event_id = ?`).bind(event.id).run();
    return Response.json({ received: true, projected: false });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const object = event.data.object;
      const customerId = stringValue(object.customer);
      const accountId = metadataValue(object, 'account_id') ?? stringValue(object.client_reference_id);
      const email = typeof (object.customer_details as { email?: unknown })?.email === 'string'
        ? ((object.customer_details as { email: string }).email).trim().toLowerCase()
        : undefined;

      if (!accountId || !customerId) {
        throw new Error('checkout_session_identity_unresolved');
      }

      await env.DB.prepare(`INSERT INTO stripe_customers (account_id, stripe_customer_id, email_normalized, updated_at)
        VALUES (?, ?, ?, datetime('now'))
        ON CONFLICT(account_id) DO UPDATE SET
          stripe_customer_id = excluded.stripe_customer_id,
          email_normalized = COALESCE(excluded.email_normalized, stripe_customers.email_normalized),
          updated_at = datetime('now')`)
        .bind(accountId, customerId, email ?? null)
        .run();

      await env.DB.prepare(`UPDATE webhook_events SET processed_at = datetime('now'), error_code = NULL
        WHERE provider = 'stripe' AND event_id = ?`).bind(event.id).run();

      return Response.json({
        received: true,
        projected: true,
        customerLinked: true,
        accountId,
        customerId
      });
    }

    if (event.type === 'invoice.payment_succeeded') {
      const object = event.data.object;
      const subscriptionId = stringValue(object.subscription);
      const customerId = stringValue(object.customer);
      let accountId = metadataValue(object, 'account_id');

      if (!accountId && subscriptionId) {
        const subRow = await env.DB.prepare('SELECT account_id FROM stripe_subscriptions WHERE stripe_subscription_id = ?')
          .bind(subscriptionId)
          .first<{ account_id: string }>();
        if (subRow) accountId = subRow.account_id;
      }
      if (!accountId && customerId) {
        const custRow = await env.DB.prepare('SELECT account_id FROM stripe_customers WHERE stripe_customer_id = ?')
          .bind(customerId)
          .first<{ account_id: string }>();
        if (custRow) accountId = custRow.account_id;
      }

      if (subscriptionId) {
        await env.DB.prepare(`UPDATE stripe_subscriptions
          SET status = 'active', updated_at = datetime('now')
          WHERE stripe_subscription_id = ?`)
          .bind(subscriptionId)
          .run();
      }

      if (accountId && subscriptionId) {
        const subRow = await env.DB.prepare('SELECT plan_key FROM stripe_subscriptions WHERE stripe_subscription_id = ?')
          .bind(subscriptionId)
          .first<{ plan_key: string }>();
        if (subRow && (subRow.plan_key === 'sovereign_plus' || subRow.plan_key === 'sovereign_pro')) {
          const plan = subRow.plan_key as PlanKey;
          await env.DB.prepare(`INSERT INTO entitlement_cache (account_id, plan, features_json, as_of, source_event_id, updated_at)
            VALUES (?, ?, ?, datetime('now'), ?, datetime('now'))
            ON CONFLICT(account_id) DO UPDATE SET
              plan = excluded.plan,
              features_json = excluded.features_json,
              as_of = excluded.as_of,
              source_event_id = excluded.source_event_id,
              updated_at = excluded.updated_at`)
            .bind(accountId, plan, JSON.stringify(enabledFeatureKeys(plan)), event.id)
            .run();
        }
      }

      await env.DB.prepare(`UPDATE webhook_events SET processed_at = datetime('now'), error_code = NULL
        WHERE provider = 'stripe' AND event_id = ?`).bind(event.id).run();

      return Response.json({
        received: true,
        processed: true,
        subscriptionConfirmed: true,
        subscriptionId: subscriptionId ?? null,
        accountId: accountId ?? null
      });
    }

    if (event.type === 'invoice.payment_failed') {
      const object = event.data.object;
      const subscriptionId = stringValue(object.subscription);
      const customerId = stringValue(object.customer);
      let accountId = metadataValue(object, 'account_id');

      if (!accountId && subscriptionId) {
        const subRow = await env.DB.prepare('SELECT account_id FROM stripe_subscriptions WHERE stripe_subscription_id = ?')
          .bind(subscriptionId)
          .first<{ account_id: string }>();
        if (subRow) accountId = subRow.account_id;
      }
      if (!accountId && customerId) {
        const custRow = await env.DB.prepare('SELECT account_id FROM stripe_customers WHERE stripe_customer_id = ?')
          .bind(customerId)
          .first<{ account_id: string }>();
        if (custRow) accountId = custRow.account_id;
      }

      if (subscriptionId) {
        await env.DB.prepare(`UPDATE stripe_subscriptions
          SET status = 'past_due', updated_at = datetime('now')
          WHERE stripe_subscription_id = ?`)
          .bind(subscriptionId)
          .run();
      }

      if (accountId) {
        await env.DB.prepare(`INSERT INTO entitlement_cache (account_id, plan, features_json, as_of, source_event_id, updated_at)
          VALUES (?, 'free', ?, datetime('now'), ?, datetime('now'))
          ON CONFLICT(account_id) DO UPDATE SET
            plan = 'free',
            features_json = excluded.features_json,
            as_of = excluded.as_of,
            source_event_id = excluded.source_event_id,
            updated_at = excluded.updated_at`)
          .bind(accountId, JSON.stringify(enabledFeatureKeys('free')), event.id)
          .run();

        await notifyBillingLifecycle(env, {
          eventId: event.id,
          accountId,
          kind: 'payment_attention',
          status: 'past_due',
          effectivePlan: 'free'
        });
      }

      await env.DB.prepare(`UPDATE webhook_events SET processed_at = datetime('now'), error_code = NULL
        WHERE provider = 'stripe' AND event_id = ?`).bind(event.id).run();

      return Response.json({
        received: true,
        processed: true,
        paymentFailed: true,
        subscriptionId: subscriptionId ?? null,
        accountId: accountId ?? null
      });
    }
    const normalized = await normalizeSubscriptionEvent(env, event);
    const projection = await projectSubscriptionEvent(env, normalized);
    const kind = projection.applied ? notificationKind(normalized) : undefined;
    const notificationSent = kind
      ? await notifyBillingLifecycle(env, {
          eventId: normalized.id,
          accountId: normalized.accountId,
          kind,
          interval: normalized.interval,
          currentPeriodEnd: normalized.currentPeriodEnd,
          status: normalized.status,
          effectivePlan: 'plan' in projection ? projection.plan : 'free'
        })
      : false;

    await env.DB.prepare(`UPDATE webhook_events SET processed_at = datetime('now'), error_code = NULL
      WHERE provider = 'stripe' AND event_id = ?`).bind(event.id).run();
    return Response.json({
      received: true,
      projected: projection.applied,
      stale: projection.stale,
      retried: (inserted.meta?.changes ?? 0) === 0,
      notificationSent,
      deletedAccount: 'deletedAccount' in projection && projection.deletedAccount === true
    });
  } catch (error) {
    const code = error instanceof Response
      ? `stripe_projection_http_${error.status}`
      : error instanceof Error
        ? error.message.replace(/[^a-z0-9_-]/gi, '_').slice(0, 80)
        : 'stripe_projection_failed';
    await env.DB.prepare(`UPDATE webhook_events SET processed_at = NULL, error_code = ?
      WHERE provider = 'stripe' AND event_id = ?`).bind(code, event.id).run();
    return Response.json({ received: true, projected: false, retryable: true }, { status: 500 });
  }
}