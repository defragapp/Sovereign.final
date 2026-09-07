import { useEffect, useState } from 'react';

type TurnState = 'idle' | 'streaming' | 'complete' | 'error';

export interface SovereignTurn {
  id: string;
  role: 'user' | 'sovereign';
  content: string;
  isStreaming: boolean;
  metadata?: {
    groundingSources?: string[];
    reasoning?: string;
  };
}

interface UseSovereignTurnOptions {
  threadId?: string;
  onTurnStart?: () => void;
  onChunk?: (content: string) => void;
  onComplete?: (turn: SovereignTurn) => void;
  onError?: (error: Error) => void;
}

export function useSovereignTurn(options: UseSovereignTurnOptions = {}) {
  const [state, setState] = useState<TurnState>('idle');
  const [userTurn, setUserTurn] = useState<SovereignTurn | null>(null);
  const [sovereignTurn, setSovereignTurn] = useState<SovereignTurn | null>(null);
  const [error, setError] = useState<Error | null>(null);

  async function submitInquiry(inquiryText: string) {
    if (!inquiryText.trim()) return;

    const threadId = options.threadId || `thread-${Date.now()}`;
    const userTurnId = crypto.randomUUID();
    const sovereignTurnId = crypto.randomUUID();

    // Create user turn
    const newUserTurn: SovereignTurn = {
      id: userTurnId,
      role: 'user',
      content: inquiryText.trim(),
      isStreaming: false
    };
    setUserTurn(newUserTurn);

    // Create sovereign turn placeholder
    const newSovereignTurn: SovereignTurn = {
      id: sovereignTurnId,
      role: 'sovereign',
      content: '',
      isStreaming: true
    };
    setSovereignTurn(newSovereignTurn);

    setState('streaming');
    setError(null);
    options.onTurnStart?.();

    try {
      const response = await fetch(`/api/v1/threads/${encodeURIComponent(threadId)}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'text/event-stream'
        },
        body: JSON.stringify({ message: inquiryText.trim() })
      });

      if (response.status === 401) {
        throw new Error('Authentication required');
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        setSovereignTurn((prev) =>
          prev ? { ...prev, content: accumulated } : null
        );
        options.onChunk?.(accumulated);
      }

      // Mark complete
      const completeTurn: SovereignTurn = {
        ...newSovereignTurn,
        content: accumulated,
        isStreaming: false
      };
      setSovereignTurn(completeTurn);
      setState('complete');
      options.onComplete?.(completeTurn);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setState('error');
      options.onError?.(error);
    }
  }

  return {
    state,
    userTurn,
    sovereignTurn,
    error,
    submitInquiry
  };
}
