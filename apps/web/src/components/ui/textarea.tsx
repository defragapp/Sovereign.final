import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full resize-none rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-[15px] leading-6 text-[var(--cream)] outline-none placeholder:text-[var(--muted)] focus:border-[var(--line-strong)] focus:ring-2 focus:ring-[var(--ring-soft)]',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
