'use client';

import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-250 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary:
      'text-[var(--deep)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
    secondary:
      'border border-[var(--border)] bg-transparent text-[var(--white)] hover:border-[var(--gold)] hover:text-[var(--gold)] hover:shadow-sm',
    ghost:
      'bg-transparent text-[var(--muted)] hover:text-[var(--white)]',
  };

  const primaryStyle = variant === 'primary' ? {
    background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
    boxShadow: '0 4px 16px rgba(240,165,0,0.25)',
  } : undefined;

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      style={{ ...primaryStyle, ...style }}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
