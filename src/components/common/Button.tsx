import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-md hover:from-slate-700 hover:to-slate-600 hover:shadow-lg active:scale-[0.98] disabled:from-slate-400 disabled:to-slate-400',
  secondary:
    'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98] disabled:bg-slate-50 disabled:text-slate-400',
  danger:
    'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg active:scale-[0.98] disabled:bg-red-300',
  ghost:
    'text-slate-600 hover:bg-slate-100 disabled:text-slate-300',
  outline:
    'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 active:scale-[0.98] disabled:text-slate-300 disabled:border-slate-200',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-xl gap-2',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          disabled && 'cursor-not-allowed',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
