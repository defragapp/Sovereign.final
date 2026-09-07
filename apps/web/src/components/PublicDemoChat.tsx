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
    <div className="public-demo-chat" aria-live="polite" aria-label="Demo conversation with Sovereign">
      <div className="demo-chat-frame">
        {displayedTurns.length === 0 ? (
          <div className="demo-loading" role="status">
            <div className="demo-spinner" aria-hidden="true" />
            <p>Starting conversation...</p>
          </div>
        ) : (
          <div className="demo-turns">
            {displayedTurns.map((turn, idx) => (
              <div
                key={idx}
                className={`demo-turn demo-turn-${turn.role}`}
                style={{
                  animation: `slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards`
                }}
              >
                {turn.role === 'user' && (
                  <div className="turn-user-content">
                    <p>{turn.content}</p>
                  </div>
                )}
                {turn.role === 'sovereign' && (
                  <div className="turn-sovereign-content">
                    <p>{turn.content}</p>
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
          </div>
        )}
      </div>
      <div className="demo-actions">
        <p className="demo-tagline">This is how Sovereign understands you.</p>
        <a href="/signup" className="button-primary">
          Try it yourself
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="13" y2="4" />
            <polyline points="13 4 13 4 13 13 4 13" />
          </svg>
        </a>
      </div>
    </div>
  );
}
