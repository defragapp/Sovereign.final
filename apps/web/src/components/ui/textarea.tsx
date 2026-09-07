import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'min-h-28 w-full resize-none rounded-[12px] border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] leading-6 text-white outline-none transition-all duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-neutral-500 focus:border-white/30 focus:ring-2 focus:ring-white/10',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
