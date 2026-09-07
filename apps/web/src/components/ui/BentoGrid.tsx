import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * BentoGrid – showcases core runtime capabilities in an asymmetrical grid with spring transitions.
 */
export const BentoGrid = () => {
  const items = [
    { title: 'Baseline Discovery', description: 'Create a private personal Baseline once and reuse it forever.', bg: '#0c0c0e' },
    { title: 'Live Threading', description: 'Real‑time AI turns that stay in sync with your conversation.', bg: '#050505' },
    { title: 'Context Syncing', description: 'Persist and reference contextual data across sessions.', bg: '#0c0c0e' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: 'minmax(200px, auto)' }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-2xl border border-white/10 bg-[var(--ink)] p-6 shadow-xl"
          style={{ backgroundColor: item.bg }}
        >
          <h3 className="text-lg font-medium text-[var(--cream)] mb-2">{item.title}</h3>
          <p className="text-sm text-[var(--muted)]">{item.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
