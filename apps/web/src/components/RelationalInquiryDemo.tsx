import { useState } from 'react';

interface Scenario {
  title: string;
  myReference: string;
  theirReference: string;
  exchange: { user: string; other: string };
  observable: string;
  pattern: string;
  insight: string;
}

const SCENARIOS: Scenario[] = [
  {
    title: 'Pacing & Time',
    myReference: 'Tends to pause and reflect internally before speaking.',
    theirReference: 'Tends to talk things through out loud to process them.',
    exchange: {
      other: '“Can we talk through what happened right now?”',
      user: '“I need a minute to gather my thoughts before we get into it.”'
    },
    observable: 'One person seeks immediate verbal clarity; the other seeks a brief pause to reflect. Neither response expresses hostility.',
    pattern: 'When one person asks with urgency, the other feels pressed to speak before they are ready. When one steps back, the other experiences the silence as distance. The loop accelerates itself.',
    insight: 'Sovereign holds both styles as valid. Naming the timing difference lets you agree on when to talk, without either person feeling pressured or shut out.'
  },
  {
    title: 'Feedback & Collaboration',
    myReference: 'Values direct, structural feedback focused on the work.',
    theirReference: 'Values tone, encouragement, and collaborative alignment.',
    exchange: {
      user: '“Here are three specific gaps in this proposal we should fix.”',
      other: '“Does any part of the direction actually work for you?”'
    },
    observable: 'One person evaluates the work against objective criteria; the other is listening for whether their underlying intent was seen and valued.',
    pattern: 'Analytical feedback without warm framing can register as unappreciative. When the other person asks for reassurance, it can feel like resistance to the critique.',
    insight: 'Sovereign keeps both perspectives intact: acknowledging shared intent first allows direct feedback to be received without friction.'
  },
  {
    title: 'Autonomy & Closeness',
    myReference: 'Gains clarity and calm through independent action.',
    theirReference: 'Gains safety and trust through mutual, joint decision-making.',
    exchange: {
      user: '“I went ahead and finalized the plan so we wouldn’t lose time.”',
      other: '“I thought we were going to make this decision together.”'
    },
    observable: 'One person acts decisively to create momentum; the other was anticipating a shared checkpoint.',
    pattern: 'Decisive action can be interpreted as exclusion; asking for consensus can be interpreted as unnecessary delay.',
    insight: 'Sovereign helps you see where autonomy and collaboration meet, establishing clear checkpoints without stalling execution.'
  }
];

export function RelationalInquiryDemo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scenario = SCENARIOS[activeIdx];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
        <div>
          <span className="font-utility text-[10px] text-[var(--sage)]">RELATIONAL INQUIRY DEMONSTRATION</span>
          <div className="font-statement text-base md:text-lg text-[var(--cream)] mt-1">
            Examining what happens between two distinct references
          </div>
        </div>
        <div className="flex gap-1 bg-[var(--surface-2)] p-1 rounded-lg border border-[var(--line)]">
          {SCENARIOS.map((s, idx) => (
            <button
              key={s.title}
              onClick={() => setActiveIdx(idx)}
              className={`px-2.5 py-1 text-xs rounded-md transition ${
                activeIdx === idx
                  ? 'bg-[var(--surface)] text-[var(--cream)] border border-[var(--line)] font-medium shadow-xs'
                  : 'text-[var(--muted)] hover:text-[var(--cream)]'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* DUAL REFERENCE DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-utility text-[10px] text-[var(--cream)]">YOUR REFERENCE</span>
            <span className="font-utility text-[9px] text-[var(--subtle)]">BASELINE A</span>
          </div>
          <p className="font-explanation text-xs text-[var(--cream)] leading-relaxed">
            {scenario.myReference}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-utility text-[10px] text-[var(--sage)]">THEIR REFERENCE</span>
            <span className="font-utility text-[9px] text-[var(--subtle)]">BASELINE B</span>
          </div>
          <p className="font-explanation text-xs text-[var(--cream)] leading-relaxed">
            {scenario.theirReference}
          </p>
        </div>
      </div>

      {/* REAL EXCHANGE */}
      <div className="rounded-xl border border-[var(--line)] bg-[#0d0d0c] p-4 space-y-2">
        <span className="font-utility text-[10px] text-[var(--subtle)]">THE REAL INTERACTION</span>
        <div className="space-y-1.5 font-statement text-xs md:text-sm text-[var(--cream)]">
          <div className="text-[var(--sage)]">{scenario.exchange.other}</div>
          <div className="text-[var(--muted)]">{scenario.exchange.user}</div>
        </div>
      </div>

      {/* OBSERVABLE VS PATTERN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <span className="font-utility text-[10px] text-[var(--subtle)]">WHAT IS OBSERVABLE</span>
          <p className="font-explanation text-xs leading-relaxed text-[var(--muted)]">
            {scenario.observable}
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="font-utility text-[10px] text-[var(--subtle)]">ONE POSSIBLE RECURRING PATTERN</span>
          <p className="font-explanation text-xs leading-relaxed text-[var(--muted)]">
            {scenario.pattern}
          </p>
        </div>
      </div>

      {/* SOVEREIGN PERSPECTIVE */}
      <div className="border-t border-[var(--line)] pt-4 flex items-start gap-3">
        <div className="sovereign-mark shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-utility text-[10px] text-[var(--sage)]">WHAT SOVEREIGN OFFERS</span>
          <p className="font-explanation text-xs leading-relaxed text-[var(--cream)]">
            {scenario.insight}
          </p>
        </div>
      </div>
    </div>
  );
}
