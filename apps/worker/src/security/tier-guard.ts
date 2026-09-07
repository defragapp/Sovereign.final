import type { AuthContext, Env } from '../env';
import { requireAuth } from './auth';
import { getEntitlements } from '../db/entitlements';

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
      headers: {
        'content-type': 'application/json',
        'cache-control': 'private, no-store'
      }
    });
  }
  return auth;
}

export async function isProTier(env: Env, accountId: string): Promise<boolean> {
  const entitlements = await getEntitlements(env, accountId);
  return entitlements.plan === 'sovereign_pro';
}
