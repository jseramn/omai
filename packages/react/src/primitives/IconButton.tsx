import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import type { ButtonProps } from './Button';

export interface IconButtonProps
  extends Omit<ButtonProps, 'leadingIcon' | 'trailingIcon' | 'fullWidth' | 'children'> {
  icon: ReactNode;
  'aria-label': string;
}

export function IconButton({
  ref,
  className,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  icon,
  ...rest
}: IconButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      ref={ref}
      type={type}
      className={cn('omai-icon-button', className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      data-variant={variant}
      data-size={size}
      data-loading={loading ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      {...rest}
    >
      {loading ? (
        <span className="omai-button__spinner" aria-hidden="true" />
      ) : (
        <span className="omai-icon-button__icon" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  );
}
