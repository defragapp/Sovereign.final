export const POLICY_METADATA = {
  terms: { version: '2026-08-17.2' },
  privacy: { version: '2026-08-17.2' }
} as const;

export const POLICY_CONTENT_HASH = '10e0e2e9f3a17c6860c91311f3cfcbca426b237e49f2380ac57d11dc23fbf822' as const;
export const ELIGIBILITY_RULE = { version: '2026-08-17-18-plus', minimumAge: 18 } as const;

export type ApiError = {
  error?: string;
  message?: string;
  retryable?: boolean;
  nextAction?: string;
  field?: string;
  code?: string;
};

export interface AuthSession {
  authenticated: boolean;
  accountId: string;
  sessionId?: string;
  role?: string;
  plan?: string;
}

export interface BaselineStatus {
  ready: boolean;
  status?: string;
  state?: string;
  message?: string;
  nextAction?: string;
}

export interface BaselineInput {
  birthDate: string;
  birthTime?: string;
  birthTimeCertainty: 'exact' | 'approximate' | 'unknown';
  birthplace: string;
  birthTimezone: string;
}

export interface AccountOnboarding {
  completed: boolean;
  planIntent: 'free' | 'sovereign_plus';
  effectivePlan: 'free' | 'sovereign_plus';
}

export interface Entitlements {
  plan: 'free' | 'sovereign_plus';
  aiTurnsRemaining?: number;
  aiTurnsMonthly?: number;
  aiTurnsUsed?: number;
}

export interface SovereignSection {
  id: string;
  label: string;
  body: string;
}

export interface SovereignAction {
  type: string;
  label: string;
  target_id?: string;
}

export interface SovereignAnswerV2 {
  version: 'sovereign-answer.v2';
  mode: string;
  depth: string;
  headline: string;
  direct_answer: string;
  sections: SovereignSection[];
  basis_refs: string[];
  correction_prompt: string;
  actions: SovereignAction[];
  confidence: string;
  safety_mode: string;
}

export interface BasisRegistryItem {
  id: string;
  category: string;
  display: string;
  accessibleLabel: string;
  uncertainty: 'low' | 'medium' | 'high';
  provenance: string;
  subject: 'self' | 'other' | 'relationship';
}

export interface ThreadMessageResponse {
  text: string;
  answer: SovereignAnswerV2;
  basis: BasisRegistryItem[];
}

export interface ThreadItem {
  id: string;
  title: string;
  contextKind: string;
  surface: string;
  covenantEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadMessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  answer?: SovereignAnswerV2;
  basis?: BasisRegistryItem[];
}

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    const error = Object.assign(new Error((body as ApiError | undefined)?.message ?? (body as ApiError | undefined)?.error ?? `Request failed with status ${response.status}`), {
      status: response.status,
      body
    });
    throw error;
  }
  return body as T;
}

export async function checkSession(): Promise<AuthSession | null> {
  try {
    const res = await fetch('/api/v1/auth/session', { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function requestSignup(email: string, name: string): Promise<{ status: string; recovery?: string }> {
  const res = await fetch('/api/v1/auth/signup', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      name,
      termsAccepted: true,
      termsVersion: POLICY_METADATA.terms.version,
      privacyVersion: POLICY_METADATA.privacy.version,
      policyContentHash: POLICY_CONTENT_HASH,
      ageEligible: true,
      eligibilityRuleVersion: ELIGIBILITY_RULE.version,
      turnstileToken: 'test-turnstile-pass',
      returnTo: '/onboarding'
    })
  });
  return parse(res);
}

export async function requestLogin(email: string): Promise<{ status: string; recovery?: string }> {
  const res = await fetch('/api/v1/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      turnstileToken: 'test-turnstile-pass',
      returnTo: '/app'
    })
  });
  return parse(res);
}

export async function redeemAuth(tokenOrCode: { token?: string; email?: string; code?: string }): Promise<{ status: string; createdAccount?: boolean; next?: string }> {
  const res = await fetch('/api/v1/auth/redeem', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(tokenOrCode)
  });
  return parse(res);
}

export async function logout(): Promise<void> {
  await fetch('/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
}

export async function getBaselineStatus(): Promise<BaselineStatus> {
  const res = await fetch('/api/v1/baseline/status', { credentials: 'include' });
  const data = await parse<{ baseline: BaselineStatus }>(res);
  return data.baseline;
}

export async function submitBaseline(input: BaselineInput): Promise<{ baseline: unknown }> {
  const res = await fetch('/api/v1/baseline/onboarding', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input)
  });
  return parse(res);
}

export async function getAccountOnboarding(): Promise<AccountOnboarding> {
  const res = await fetch('/api/v1/account/onboarding', { credentials: 'include' });
  return parse(res);
}

export async function completeAccountOnboarding(plan: 'free' | 'sovereign_plus'): Promise<{ completed: boolean; planIntent: string }> {
  const res = await fetch('/api/v1/account/onboarding', {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan })
  });
  return parse(res);
}

export async function getEntitlements(): Promise<Entitlements> {
  return parse(await fetch('/api/v1/billing/entitlements', { credentials: 'include' }));
}

export async function listThreads(): Promise<ThreadItem[]> {
  const res = await fetch('/api/v1/threads', { credentials: 'include' });
  const data = await parse<{ threads: ThreadItem[] }>(res);
  return data.threads ?? [];
}

export async function getThreadMessages(threadId: string): Promise<ThreadMessageItem[]> {
  const res = await fetch(`/api/v1/threads/${encodeURIComponent(threadId)}`, { credentials: 'include' });
  const data = await parse<{ messages: ThreadMessageItem[] }>(res);
  return data.messages ?? [];
}

export async function sendThreadMessage(
  threadId: string,
  message: string,
  idempotencyKey: string
): Promise<ThreadMessageResponse> {
  const res = await fetch(`/api/v1/threads/${encodeURIComponent(threadId)}/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'x-idempotency-key': idempotencyKey,
      'accept': 'application/vnd.sovereign.answer+json'
    },
    body: JSON.stringify({
      message,
      context: { surface: 'Today' }
    })
  });
  return parse<ThreadMessageResponse>(res);
}

export async function submitCorrection(
  threadId: string,
  correction: 'yes' | 'partly' | 'not_today',
  note?: string
): Promise<{ ok: boolean }> {
  const res = await fetch(`/api/v1/threads/${encodeURIComponent(threadId)}/corrections`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ correction, note })
  });
  return parse(res);
}

