import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowUp, ChevronDown, ChevronUp, Check, RotateCcw } from 'lucide-react';
import { BrandMark } from '../ui/BrandMark';
import { IridescentLoader } from '../IridescentLoader';
import {
  type AuthSession,
  type SovereignAnswerV2,
  type BasisRegistryItem,
  submitCorrection,
  getThreadMessages
} from '../../lib/api';

export interface ChatMessageSource {
  id?: string;
  display: string;
  accessibleLabel?: string;
  provenance?: string;
  uncertainty?: 'low' | 'medium' | 'high' | string;
  subject?: 'self' | 'other' | 'relationship' | string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'sovereign' | 'assistant';
  content: string;
  text?: string;
  isStreaming?: boolean;
  answer?: SovereignAnswerV2;
  sources?: (ChatMessageSource | BasisRegistryItem | string)[];
  basis?: BasisRegistryItem[];
  feedbackGiven?: 'yes' | 'partly' | 'not_today';
  createdAt?: string;
}

export interface SovereignThreadProps {
  threadId?: string;
  session?: (AuthSession & { hasPasskey?: boolean; passkeyVerified?: boolean }) | null;
  hasVerifiedPasskey?: boolean;
  surface?: 'Today' | 'Explore' | 'People' | 'Systems' | string;
  initialMessages?: ChatMessage[];
  onTurnComplete?: (message: ChatMessage) => void;
  className?: string;
  placeholder?: string;
}

const SUGGESTED_INQUIRIES = [
  'Why do I keep overthinking what to say?',
  'Why does this conversation keep going the same way?',
  'What am I missing about what is happening between us?',
  'How should I approach this decision?'
];

export function SovereignThread({
  threadId: initialThreadId,
  session,
  hasVerifiedPasskey,
  surface = 'Today',
  initialMessages = [],
  onTurnComplete,
  className = '',
  placeholder
}: SovereignThreadProps) {
  const [currentThreadId, setCurrentThreadId] = useState(
    initialThreadId || `thread-${Date.now()}`
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const scrollEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isPasskeyVerified = Boolean(
    session?.hasPasskey || session?.passkeyVerified || hasVerifiedPasskey
  );

  useEffect(() => {
    if (scrollEndRef.current) {
      scrollEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const nextHeight = Math.min(Math.max(scrollHeight, 44), 200);
      textareaRef.current.style.height = `${nextHeight}px`;
      textareaRef.current.style.overflowY = scrollHeight > 200 ? 'auto' : 'hidden';
    }
  }, [draft]);

  const toggleSourceDrawer = (messageId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleFeedback = async (
    messageId: string,
    choice: 'yes' | 'partly' | 'not_today'
  ) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedbackGiven: choice } : m))
    );
    try {
      await submitCorrection(currentThreadId, choice);
    } catch (e) {
      // Silent fail
    }
  };

  const handleNewConversation = () => {
    setCurrentThreadId(`thread-${Date.now()}`);
    setMessages([]);
    setError(null);
    setIsStreaming(false);
    setDraft('');
    setExpandedSources({});
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.focus();
    }
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const inquiry = draft.trim();
    if (!inquiry || isStreaming) return;

    setError(null);
    setIsStreaming(true);
    setDraft('');

    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
      textareaRef.current.style.overflowY = 'hidden';
    }

    const userMessageId = `user-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: inquiry,
      text: inquiry,
      createdAt: new Date().toISOString()
    };

    const sovereignMessageId = `sov-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const sovereignMessage: ChatMessage = {
      id: sovereignMessageId,
      role: 'sovereign',
      content: '',
      text: '',
      isStreaming: true,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage, sovereignMessage]);

    try {
      const idempotencyKey = `turn_${crypto.randomUUID()}`;
      const response = await fetch(
        `/api/v1/threads/${encodeURIComponent(currentThreadId)}/messages`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'accept': 'text/event-stream',
            'x-idempotency-key': idempotencyKey
          },
          body: JSON.stringify({
            message: inquiry,
            context: { surface }
          })
        }
      );

      if (response.status === 401) {
        window.location.assign(
          `/login?returnTo=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || payload.error || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream available');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === sovereignMessageId
              ? { ...m, content: accumulated, text: accumulated }
              : m
          )
        );
      }

      let completedTurn: ChatMessage = {
        ...sovereignMessage,
        content: accumulated,
        text: accumulated,
        isStreaming: false
      };

      try {
        const threadMessages = await getThreadMessages(currentThreadId);
        const lastMsg = threadMessages[threadMessages.length - 1];
        if (lastMsg && (lastMsg.answer || lastMsg.basis)) {
          completedTurn = {
            ...completedTurn,
            content: lastMsg.text || accumulated,
            text: lastMsg.text || accumulated,
            answer: lastMsg.answer,
            sources: lastMsg.basis
          };
        }
      } catch (e) {
        // Ignore enrichment error
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === sovereignMessageId ? completedTurn : m))
      );

      onTurnComplete?.(completedTurn);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to receive response';
      setError(errorMessage);
      setMessages((prev) => prev.filter((m) => m.id !== sovereignMessageId));
    } finally {
      setIsStreaming(false);
    }
  }

  const getNormalizedSources = (message: ChatMessage): ChatMessageSource[] => {
    const rawList = message.sources || message.basis || [];
    return rawList.map((item) => {
      if (typeof item === 'string') {
        return { display: item };
      }
      return {
        id: item.id,
        display: item.display,
        accessibleLabel: item.accessibleLabel,
        provenance: item.provenance,
        uncertainty: item.uncertainty,
        subject: item.subject
      };
    });
  };

  return (
    <div
      className={`relative flex flex-col h-full min-h-[500px] w-full bg-[#000000] text-[#f5f5f7] ${className} page-noise`}
      data-testid="sovereign-thread"
    >
      <div className="stage-glow" />
      <header className="relative z-10 flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#000000]/90 sticky top-0">
        <div className="flex items-center gap-3">
          <BrandMark size={20} className="text-[#f5f5f7]" />
          <span className="text-sm font-semibold tracking-tight text-[#f5f5f7]">
            Sovereign
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-[#8e8e93] bg-white/[0.03]">
            {surface}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isPasskeyVerified && (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#9fbaa1]/30 bg-[#9fbaa1]/10 text-[#9fbaa1]"
              role="status"
              aria-label="Passkey verified"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#9fbaa1]" />
              <span>Passkey Verified</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleNewConversation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs font-medium text-[#8e8e93] hover:text-[#f5f5f7] hover:border-white/20 transition-all cursor-pointer"
            aria-label="Start a new conversation (Cmd+K)"
            title="Cmd+K"
          >
            <RotateCcw className="h-3 w-3" />
            <span>New</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 max-w-4xl w-full mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[350px] text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#9fbaa1]">
              <BrandMark size={24} />
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-[#f5f5f7]">
              What is active for you now?
            </h1>
            <p className="text-sm leading-relaxed text-[#8e8e93]">
              Ask in ordinary language. Sovereign answers from your private Baseline,
              surfaces how pressure moves, active dynamics, and keeps unknowns explicit.
            </p>
            <div className="pt-2 w-full space-y-2.5">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#636366]">
                Or start with a situation:
              </div>
              <div className="flex flex-col gap-2">
                {SUGGESTED_INQUIRIES.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setDraft(prompt);
                      textareaRef.current?.focus();
                    }}
                    className="text-left text-xs px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-[#d1d1d6] hover:text-[#f5f5f7] hover:border-white/20 hover:bg-white/[0.06] transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map((message) => {
              const sources = getNormalizedSources(message);
              const isSourcesOpen = Boolean(expandedSources[message.id]);

              {/* Block 1: User prompt block */}
              if (message.role === 'user') {
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="ml-auto max-w-[85%] rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-[#f5f5f7]"
                  >
                    <p className="whitespace-pre-wrap">{message.content || message.text}</p>
                  </motion.div>
                );
              }

              {/* Block 2: Sovereign synthesized answer block */}
              return (
                <motion.article
                  key={message.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full space-y-4"
                >
                  <div className="glass-border p-6 md:p-8 space-y-5 shadow-xl">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#8e8e93]">
                      <span className="text-[#9fbaa1] flex items-center gap-1.5 font-medium">
                        <BrandMark size={14} className="text-[#9fbaa1]" />
                        <span className="tracking-wider uppercase">SOVEREIGN SYNTHESIS</span>
                      </span>
                      <span className="tracking-wider uppercase text-[#636366]">PRIVATE</span>
                    </div>

                    {message.answer?.headline && (
                      <h2 className="text-xl md:text-2xl font-medium tracking-tight text-[#f5f5f7] font-display">
                        {message.answer.headline}
                      </h2>
                    )}

                    {message.isStreaming && !message.content && !message.text ? (
                      <div className="pt-2 pb-1">
                        <IridescentLoader label="Sovereign is synthesizing your answer" />
                      </div>
                    ) : (
                      <div className="text-[15px] leading-[1.72] text-[#e5e5ea] answer-direct">
                        <p className="whitespace-pre-wrap">
                          {message.answer?.direct_answer || message.content || message.text}
                          {message.isStreaming && (
                            <span
                              className="inline-block w-1.5 h-4 ml-1 bg-[#9fbaa1] animate-pulse align-middle"
                              aria-hidden="true"
                            />
                          )}
                        </p>
                      </div>
                    )}

                    {message.answer?.sections && message.answer.sections.length > 0 && (
                      <div className="space-y-3 border-t border-white/[0.08] pt-4">
                        {message.answer.sections.map((sec) => (
                          <div
                            key={sec.id}
                            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-1.5"
                          >
                            <div className="font-mono text-[10px] text-[#9fbaa1] uppercase tracking-wider font-medium">
                              {sec.label}
                            </div>
                            <div className="text-xs leading-relaxed text-[#d1d1d6] whitespace-pre-wrap">
                              {sec.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Block 3: Collapsible Sources drawer */}
                    {sources.length > 0 && (
                      <div className="border-t border-white/[0.08] pt-3">
                        <button
                          type="button"
                          onClick={() => toggleSourceDrawer(message.id)}
                          aria-expanded={isSourcesOpen}
                          aria-label="Sources. Open source details."
                          className="inline-flex items-center gap-2 text-xs font-mono text-[#8e8e93] hover:text-[#f5f5f7] transition-colors cursor-pointer group"
                        >
                          <span className="font-semibold text-[#e5e5ea]">Sources</span>
                          <span className="text-[#636366]">({sources.length})</span>
                          <span className="text-[#8e8e93] text-[11px] group-hover:underline">
                            See source details
                          </span>
                          {isSourcesOpen ? (
                            <ChevronUp className="h-3.5 w-3.5 text-[#8e8e93]" />
                          ) : (
                            <ChevronDown className="h-3.5 w-3.5 text-[#8e8e93]" />
                          )}
                        </button>

                        {isSourcesOpen && (
                          <div className="mt-3 rounded-xl border border-white/10 bg-[#141413] p-4 space-y-3">
                            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
                              <h3 className="text-xs font-semibold text-[#f5f5f7] uppercase tracking-wider font-mono">
                                Source details
                              </h3>
                              <button
                                type="button"
                                onClick={() => toggleSourceDrawer(message.id)}
                                className="text-xs text-[#8e8e93] hover:text-white cursor-pointer"
                                aria-label="Close source details"
                              >
                                Close
                              </button>
                            </div>
                            <p className="text-xs text-[#8e8e93] leading-relaxed">
                              These are the source values Sovereign used for this answer. They can inform reflection; they do not prove personality or current state.
                            </p>
                            <div className="space-y-2 pt-1">
                              {sources.map((source, index) => (
                                <div
                                  key={source.id || index}
                                  className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-xs space-y-1 font-mono"
                                >
                                  <div className="font-medium text-[#f5f5f7]">
                                    {source.display || source.accessibleLabel || String(source)}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8e8e93]">
                                    {source.accessibleLabel && source.accessibleLabel !== source.display && (
                                      <span>{source.accessibleLabel}</span>
                                    )}
                                    {source.provenance && (
                                      <span>Source · {source.provenance}</span>
                                    )}
                                    {source.uncertainty && (
                                      <span>Uncertainty · {source.uncertainty}</span>
                                    )}
                                    {source.subject && (
                                      <span>
                                        Applies to · {source.subject === 'self' ? 'You' : source.subject === 'other' ? 'Other person' : 'Relationship'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="border-t border-white/[0.08] pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8e8e93]">
                      <span>{message.answer?.correction_prompt || 'Does this match today?'}</span>
                      {!message.feedbackGiven ? (
                        <div className="flex gap-2">
                          {(['yes', 'partly', 'not_today'] as const).map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => handleFeedback(message.id, choice)}
                              className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-[#e5e5ea] hover:border-white/25 hover:bg-white/[0.08] transition-colors capitalize cursor-pointer"
                            >
                              {choice.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#9fbaa1] font-medium flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>Recorded: {message.feedbackGiven.replace('_', ' ')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 pb-4 md:px-6 max-w-4xl w-full mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass-border p-2 shadow-2xl focus-within:border-white/30 transition-colors">
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask Sovereign…"
                disabled={isStreaming}
                aria-label="Send inquiry to Sovereign"
                className="w-full min-h-[44px] max-h-[200px] border-0 bg-transparent px-2 py-2 text-sm text-[#f5f5f7] placeholder-[#636366] focus:outline-none resize-none leading-relaxed"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isStreaming}
                aria-label="Send"
                className="shrink-0 h-9 w-9 rounded-lg bg-[#9fbaa1] text-[#000000] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#b0cbb2] transition-colors flex items-center justify-center cursor-pointer"
              >
                {isStreaming ? (
                  <div className="h-4 w-4 border-2 border-[#000000] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="mt-2 text-center font-mono text-[10px] text-[#636366]">
            Private by default · Sovereign uses only consented data
          </div>
        </form>
      </div>
    </div>
  );
}
