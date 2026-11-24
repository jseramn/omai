import type { ComponentPropsWithRef } from 'react';
import type { Tone } from '../types';
import { cn } from '../utils/cn';

export interface BadgeProps extends ComponentPropsWithRef<'span'> {
  tone?: Tone;
  variant?: 'soft' | 'solid' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  ref,
  className,
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  dot = false,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cn('omai-badge', className)}
      data-tone={tone}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {dot && <span className="omai-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
