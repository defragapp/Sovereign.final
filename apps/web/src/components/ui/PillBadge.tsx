import type { ReactNode } from 'react';

export function PillBadge({
  variant = 'default',
  className = '',
  children
}: {
  variant?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-[var(--color-text-secondary,#9ca3af)] ${className}`}>
      {children}
    </span>
  );
}
