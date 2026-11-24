import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Size } from '../types';
import { cn } from '../utils/cn';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: Size;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  ref,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      ref={ref}
      type={type}
      className={cn('omai-button', className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={loading ? '' : undefined}
      data-full-width={fullWidth ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      {...rest}
    >
      {loading && <span className="omai-button__spinner" aria-hidden="true" />}
      <span className="omai-button__content">
        {leadingIcon && (
          <span className="omai-button__icon" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        {children !== undefined && children !== null && (
          <span className="omai-button__label">{children}</span>
        )}
        {trailingIcon && (
          <span className="omai-button__icon" aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </span>
    </button>
  );
}
