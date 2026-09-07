import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function PrimaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; className?: string }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[8px] bg-white text-black px-5 py-2.5 text-sm font-semibold transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(255,255,255,0.15)] active:translate-y-0 disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
