import { useEffect, useState, useRef } from 'react';
import type { FormEvent, ReactNode } from 'react';

type TurnState = 'idle' | 'streaming' | 'complete' | 'error';

interface ChatTurn {
  id: string;
  role: 'user' | 'sovereign';
  content: string;
  isStreaming?: boolean;
  metadata?: {
    groundingSources?: string[];
    reasoning?: string;
  };
}

interface SovereignChatWorkspaceProps {
  threadId?: string;
}

const EMPTY_STATE_PROMPTS = [
  {
    category: 'Explore Yourself',
    prompts: [
      'Why do I avoid difficult conversations?',
      'What does my stress response look like?',
      'How do I know when I\'m overextending?'
    ]
  },
  {
    category: 'Understand Your People',
    prompts: [
      'Why does my partner do that?',
      'How do I talk to my child about disappointment?',
      'What\'s really going on in this dynamic?'
    ]
  },
  {
    category: 'See Your Whole System',
    prompts: [
      'How does tension move through my family?',
      'What patterns keep repeating at work?',
      'What am I responsible for here?'
    ]
  }
];

export function SovereignChatWorkspace({ threadId: initialThreadId }: SovereignChatWorkspaceProps) {
  const [threadId, setThreadId] = useState(initialThreadId || `thread-${Date.now()}`);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [state, setState] = useState<TurnState>('idle');
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest turn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [turns]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [draft]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const inquiry = draft.trim();
    if (!inquiry || state === 'streaming') return;

    setError(null);
    setState('streaming');
    setDraft('');

    // Add user turn
    const userTurnId = crypto.randomUUID();
    const userTurn: ChatTurn = {
      id: userTurnId,
      role: 'user',
      content: inquiry
    };
    setTurns((prev) => [...prev, userTurn]);

    // Create sovereign turn placeholder
    const sovereignTurnId = crypto.randomUUID();
    const sovereignTurn: ChatTurn = {
      id: sovereignTurnId,
      role: 'sovereign',
      content: '',
      isStreaming: true
    };
    setTurns((prev) => [...prev, sovereignTurn]);

    try {
      const response = await fetch(`/api/v1/threads/${encodeURIComponent(threadId)}/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'accept': 'text/event-stream'
        },
        body: JSON.stringify({ message: inquiry })
      });

      if (response.status === 401) {
        window.location.assign(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
        return;
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

        // Update the streaming turn with accumulated content
        setTurns((prev) =>
          prev.map((t) =>
            t.id === sovereignTurnId
              ? { ...t, content: accumulated }
              : t
          )
        );
      }

      // Mark as complete
      setTurns((prev) =>
        prev.map((t) =>
          t.id === sovereignTurnId
            ? { ...t, isStreaming: false }
            : t
        )
      );

      setState('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response');
      setState('error');
      // Remove the failed sovereign turn
      setTurns((prev) => prev.filter((t) => t.id !== sovereignTurnId));
    }
  }

  function handleNewConversation() {
    setThreadId(`thread-${Date.now()}`);
    setTurns([]);
    setError(null);
    setState('idle');
    setDraft('');
  }

  return (
    <div className="sovereign-chat-workspace">
      {/* Header */}
      <header className="sovereign-chat-header">
        <div className="chat-header-brand">
          <svg className="brand-mark" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L2 12l10 10 10-10L12 2z" />
          </svg>
          <strong>Sovereign</strong>
        </div>
        <div className="chat-header-actions">
          <button
            className="button-icon"
            onClick={handleNewConversation}
            aria-label="Start a new conversation (Cmd+K)"
            title="Cmd+K"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="4" x2="8" y2="12" />
              <line x1="4" y1="8" x2="12" y2="8" />
            </svg>
            New
          </button>
        </div>
      </header>

      {/* Main chat area */}
      <div className="sovereign-chat-main">
        {turns.length === 0 ? (
          <div className="chat-empty-state">
            <div className="empty-state-content">
              <h1>What would you like to explore?</h1>
              <p>Ask Sovereign about yourself, your relationships, or the systems around you.</p>

              <div className="empty-state-prompts">
                {EMPTY_STATE_PROMPTS.map((section) => (
                  <div key={section.category} className="prompt-category">
                    <h3>{section.category}</h3>
                    <div className="prompt-list">
                      {section.prompts.map((prompt) => (
                        <button
                          key={prompt}
                          className="prompt-button"
                          onClick={() => {
                            setDraft(prompt);
                            textareaRef.current?.focus();
                          }}
                        >
                          {prompt}
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="5" y1="12" x2="13" y2="4" />
                            <polyline points="13 4 13 4 13 13 4 13" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-turns">
            {turns.map((turn) => (
              <div key={turn.id} className={`chat-turn chat-turn-${turn.role}`}>
                {turn.role === 'user' && (
                  <div className="turn-content user-content">
                    <p>{turn.content}</p>
                  </div>
                )}
                {turn.role === 'sovereign' && (
                  <div className="turn-content sovereign-content">
                    <div className="turn-text">
                      {turn.content ? (
                        <p>{turn.content}</p>
                      ) : (
                        <div className="turn-loading" role="status">
                          <div className="loading-spinner" aria-hidden="true" />
                          <span>Sovereign is thinking...</span>
                        </div>
                      )}
                    </div>
                    {turn.isStreaming && (
                      <div className="turn-cursor" aria-hidden="true" />
                    )}
                    {turn.metadata?.groundingSources && (
                      <div className="turn-sources">
                        <small>
                          <strong>Grounded in:</strong> {turn.metadata.groundingSources.join(' • ')}
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {error && (
              <div className="chat-error" role="alert">
                <p>{error}</p>
                <button onClick={() => setError(null)}>Dismiss</button>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <form className="sovereign-composer" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="composer-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
          placeholder="Ask Sovereign anything... (Shift+Enter for new line)"
          disabled={state === 'streaming'}
          aria-label="Send inquiry to Sovereign"
        />
        <button
          type="submit"
          className="composer-send"
          disabled={!draft.trim() || state === 'streaming'}
          aria-label="Send"
        >
          {state === 'streaming' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <circle cx="4" cy="8" r="1.5" opacity="0.5" />
              <circle cx="8" cy="8" r="1.5" opacity="0.7" />
              <circle cx="12" cy="8" r="1.5" opacity="0.9" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="4" x2="8" y2="12" />
              <polyline points="3 9 8 4 13 9" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
