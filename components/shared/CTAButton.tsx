import Link from 'next/link';
import { ReactNode } from 'react';

type CTAVariant = 'primary' | 'secondary' | 'tertiary';
type CTASize    = 'default' | 'small';

interface CTAButtonProps {
  href: string;
  variant?: CTAVariant;
  size?: CTASize;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

export function CTAButton({
  href,
  variant  = 'primary',
  size     = 'default',
  external = false,
  className = '',
  children,
}: CTAButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-sans font-medium transition-colors tracking-[-0.005em]';

  const variantClasses: Record<CTAVariant, string> = {
    primary:   'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]',
    secondary: 'border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white',
    tertiary:  'text-[var(--accent)] hover:underline',
  };

  // Secondary has border — reduce padding by 1px (TZ_05)
  const sizeClasses: Record<CTAVariant, Record<CTASize, string>> = {
    primary:   { default: 'px-7 py-[14px] text-sm',        small: 'px-4 py-2 text-[13px]'          },
    secondary: { default: 'px-[27px] py-[13px] text-sm',   small: 'px-[15px] py-[7px] text-[13px]' },
    tertiary:  { default: 'text-sm',                        small: 'text-[13px]'                    },
  };

  const externalProps = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  return (
    <Link
      href={href}
      className={`${base} ${variantClasses[variant]} ${sizeClasses[variant][size]} ${className}`}
      style={{ borderRadius: variant === 'tertiary' ? undefined : 0 }}
      {...externalProps}
    >
      {children}
    </Link>
  );
}