import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-[12px] border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all duration-[200ms] ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-neutral-500 focus:border-white/30 focus:ring-2 focus:ring-white/10',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
