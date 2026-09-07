import React, { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className = '', ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl bg-white/[0.03] backdrop-blur-xl border-t border-white/10 border-x border-b border-white/[0.05] shadow-[0_32px_80px_rgba(0,0,0,0.4)] transition-all duration-300 hover:bg-white/[0.045]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
