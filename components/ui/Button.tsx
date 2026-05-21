'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'ghost' | 'accent';
type Size = 'default' | 'small';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className = '', children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 font-sans font-medium transition-colors cursor-pointer tracking-[-0.005em] disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<Variant, string> = {
      primary: 'bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--accent)]',
      ghost:   'bg-transparent text-[var(--text-primary)] border border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg)]',
      accent:  'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]',
    };

    // Ghost has border — padding reduced by 1px to maintain same visual height (TZ_05)
    const sizeClasses: Record<Variant, Record<Size, string>> = {
      primary: { default: 'px-7 py-[14px] text-sm',        small: 'px-4 py-2 text-[13px]'          },
      ghost:   { default: 'px-[27px] py-[13px] text-sm',   small: 'px-[15px] py-[7px] text-[13px]' },
      accent:  { default: 'px-7 py-[14px] text-sm',        small: 'px-4 py-2 text-[13px]'          },
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variantClasses[variant]} ${sizeClasses[variant][size]} ${className}`}
        style={{ borderRadius: 0 }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';