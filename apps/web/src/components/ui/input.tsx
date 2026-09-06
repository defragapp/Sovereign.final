import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--cream)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--line-strong)] focus:ring-2 focus:ring-[var(--ring-soft)]',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
