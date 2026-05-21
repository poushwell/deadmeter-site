import { HTMLAttributes } from 'react';

type CardVariant = 'light' | 'dark';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
}

export function Card({
  variant = 'light',
  hoverable = false,
  className = '',
  children,
  ...props
}: CardProps) {
  const variants: Record<CardVariant, string> = {
    light: `bg-white border border-[var(--border)] p-7 ${
      hoverable ? 'hover:border-[var(--text-primary)] transition-colors cursor-pointer' : ''
    }`,
    dark: 'bg-[var(--surface-dark-2)] border border-white/10 p-7',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}