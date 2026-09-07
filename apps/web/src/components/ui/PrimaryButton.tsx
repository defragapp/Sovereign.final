import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function PrimaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full bg-[var(--color-text-primary,#f9fafb)] text-[var(--color-base,#030712)] px-5 py-2.5 text-sm font-medium transition hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
