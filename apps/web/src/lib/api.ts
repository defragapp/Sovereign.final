export type ApiError = {
  error?: string;
  message?: string;
  retryable?: boolean;
  nextAction?: string;
};

export type BaselineStatus = {
  ready: boolean;
  status?: string;
};

export type Entitlements = {
  plan: 'free' | 'sovereign_plus';
  aiTurnsRemaining?: number;
};

async function parse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const body = text ? JSON.parse(text) : undefined;
  if (!response.ok) {
    throw Object.assign(new Error((body as ApiError | undefined)?.message ?? 'Request failed'), {
      status: response.status,
      body
    });
  }
  return body as T;
}

export async function getBaselineStatus(): Promise<BaselineStatus> {
  return parse(await fetch('/api/v1/baseline/status', { credentials: 'include' }));
}

export async function getEntitlements(): Promise<Entitlements> {
  return parse(await fetch('/api/v1/billing/entitlements', { credentials: 'include' }));
}

export async function sendThreadMessage(threadId: string, content: string, idempotencyKey: string): Promise<Response> {
  return fetch(`/api/v1/threads/${encodeURIComponent(threadId)}/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'idempotency-key': idempotencyKey
    },
    body: JSON.stringify({ content })
  });
}
