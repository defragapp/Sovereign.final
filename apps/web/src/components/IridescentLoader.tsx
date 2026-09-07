/* ─────────────────────────────────────────────────────────────
   IridescentLoader.tsx
   Premium AI generation state indicator.
   Uses CSS keyframes from styles.css — no inline animation.
   Only rendered during active AI computation (sending === true).
───────────────────────────────────────────────────────────── */

import { SovereignMark } from '../App';

interface IridescentLoaderProps {
  /** Optional short label shown next to the dots */
  label?: string;
  /** Controls size: 'sm' = compact inline, 'md' = standard chat */
  size?: 'sm' | 'md';
}

export function IridescentLoader({ label, size = 'md' }: IridescentLoaderProps) {
  const isCompact = size === 'sm';

  return (
    <div
      className={`flex flex-col gap-${isCompact ? '2' : '3'}`}
      role="status"
      aria-label="Sovereign is generating your answer"
      aria-live="polite"
    >
      {/* Shimmer bar — signals active computation */}
      <div className="sov-shimmer-bar w-full" />

      {/* Typing indicator row */}
      <div className={`flex items-center gap-${isCompact ? '2' : '3'}`}>
        <SovereignMark size={isCompact ? 14 : 16} className="opacity-60" />

        {/* Three animated dots */}
        <span className="flex items-center gap-1" aria-hidden="true">
          <span className="sov-typing-dot" />
          <span className="sov-typing-dot" />
          <span className="sov-typing-dot" />
        </span>

        <span
          className={`font-utility text-[${isCompact ? '10px' : '11px'}] text-[var(--muted)] tracking-widest uppercase`}
        >
          {label ?? 'Synthesizing'}
        </span>
      </div>
    </div>
  );
}
