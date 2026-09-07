import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  observation: string;
  pattern: string;
  shift: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[var(--surface)] transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sage)] cursor-pointer select-none"
            >
              <span className="font-statement text-base sm:text-lg text-[var(--cream)] font-medium pr-4 leading-snug">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[var(--cream)]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[rgba(255,255,255,0.05)] space-y-4 text-xs sm:text-sm font-explanation text-[var(--muted)]">
                <div>
                  <span className="font-utility text-[10px] text-[var(--sage)] tracking-wider block mb-1">
                    GROUNDED OBSERVATION
                  </span>
                  <p className="text-[var(--cream)]/90 leading-relaxed">{item.observation}</p>
                </div>
                <div>
                  <span className="font-utility text-[10px] text-[var(--sage)] tracking-wider block mb-1">
                    THE STRUCTURAL PATTERN
                  </span>
                  <p className="leading-relaxed">{item.pattern}</p>
                </div>
                <div>
                  <span className="font-utility text-[10px] text-[var(--sage)] tracking-wider block mb-1">
                    THE SHIFT
                  </span>
                  <p className="text-[var(--cream)]/90 font-medium leading-relaxed">{item.shift}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
