import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Orientation } from '../types';
import { cn } from '../utils/cn';

export interface SeparatorProps extends ComponentPropsWithRef<'div'> {
  orientation?: Orientation;
  decorative?: boolean;
  label?: ReactNode;
}

export function Separator({
  ref,
  className,
  orientation = 'horizontal',
  decorative = true,
  label,
  ...rest
}: SeparatorProps) {
  const hasLabel = label !== undefined && label !== null && label !== false;

  return (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={!decorative ? orientation : undefined}
      className={cn('omai-separator', className)}
      data-orientation={orientation}
      data-labeled={hasLabel ? '' : undefined}
      {...rest}
    >
      {hasLabel && <span className="omai-separator__label">{label}</span>}
    </div>
  );
}
