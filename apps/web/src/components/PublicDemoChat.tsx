import { useEffect, useState } from 'react';

type DemoTurn = {
  role: 'user' | 'sovereign';
  content: string;
  metadata?: {
    groundingSources?: string[];
  };
};

const DEMO_CONVERSATION: DemoTurn[] = [
  {
    role: 'user',
    content: 'Why does the same conversation feel urgent to me and pressuring to them?'
  },
  {
    role: 'sovereign',
    content: `You likely need verbal reassurance to settle; they may need silence to process. When one person seeks clarity and the other needs time to think, each move makes sense from the inside and feels wrong from the outside.

**The core dynamic:** You move toward connection when uncertain. They move away to think clearly. Neither response is wrong—they're just different processing speeds.

**What's actually happening:** You're not too much. They're not withdrawn. You're both protecting what helps you stay stable. The friction happens because you don't realize you're protecting different things.

**One clear move:** "I need to know you're still with me. I don't need the answer right now—just that you heard me." That tells them what reassures you without asking them to change their thinking process.`,
    metadata: {
      groundingSources: ['Communication patterns', 'Relational response under uncertainty', 'Processing pace differences']
    }
  }
];

export function PublicDemoChat() {
  const [displayedTurns, setDisplayedTurns] = useState<DemoTurn[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || currentIndex >= DEMO_CONVERSATION.length) return;

    const turn = DEMO_CONVERSATION[currentIndex];
    const delay = currentIndex === 0 ? 800 : 3000; // Longer delay before Sovereign response

    const timer = setTimeout(() => {
      setDisplayedTurns((prev) => [...prev, turn]);
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, isAutoPlaying]);

  return (
    <div
      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col gap-5 text-gray-100"
      aria-live="polite"
      aria-label="Demo conversation with Sovereign"
    >
      <div className="min-h-[260px] flex flex-col justify-center">
        {displayedTurns.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-neutral-400" role="status">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden="true" />
            <p className="text-xs">Starting conversation...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedTurns.map((turn, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {turn.role === 'user' && (
                  <div className="max-w-[90%] rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm text-white">
                    <p>{turn.content}</p>
                  </div>
                )}
                {turn.role === 'sovereign' && (
                  <div className="max-w-full rounded-2xl bg-black/60 border border-white/15 p-5 text-sm text-gray-200 leading-relaxed space-y-3">
                    <p className="whitespace-pre-line">{turn.content}</p>
                    {turn.metadata?.groundingSources && (
                      <div className="border-t border-white/10 pt-2.5 text-xs text-neutral-400">
                        <strong className="text-neutral-300">Grounded in:</strong> {turn.metadata.groundingSources.join(' • ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
        <p className="text-xs text-neutral-400">This is how Sovereign understands you.</p>
        <a
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-4 py-2 text-xs font-semibold transition-all duration-300 hover:bg-neutral-200"
        >
          Try it yourself
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="13" y2="4" />
            <polyline points="13 4 13 4 13 13 4 13" />
          </svg>
        </a>
      </div>
    </div>
  );
}
