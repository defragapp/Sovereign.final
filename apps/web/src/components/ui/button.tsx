import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[8px] font-medium tracking-[-0.01em] transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
  {
    variants: {
      variant: {
        primary: 'bg-white text-black hover:bg-neutral-100 hover:shadow-[0_12px_24px_rgba(255,255,255,0.15)]',
        secondary: 'border border-white/15 bg-white/[0.05] text-white hover:bg-white/10 hover:border-white/30',
        ghost: 'text-neutral-400 hover:bg-white/[0.05] hover:text-white',
        glass: 'border border-white/20 bg-white/[0.08] text-white hover:bg-white/[0.16] hover:border-white/40 shadow-xl'
      },
      size: {
        sm: 'h-8 px-3.5 text-xs rounded-[6px]',
        md: 'h-10 px-5 text-sm rounded-[8px]',
        lg: 'h-12 px-6 text-[15px] rounded-[8px]'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = 'Button';
export { Button };
