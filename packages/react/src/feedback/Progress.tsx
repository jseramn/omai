import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Size, Tone } from '../types';
import { cn } from '../utils/cn';

export interface ProgressProps extends ComponentPropsWithRef<'div'> {
  value?: number | null;
  max?: number;
  tone?: Tone;
  size?: Size;
  variant?: 'bar' | 'blocks';
  segments?: number;
  label?: ReactNode;
  showValue?: boolean;
}

function buildBtopBlocks(ratio: number, segments: number): string {
  const exact = Math.max(0, Math.min(1, ratio)) * segments;
  const full = Math.floor(exact);
  const remainder = exact - full;
  let chars = '';
  for (let i = 0; i < segments; i++) {
    if (i < full) {
      chars += '█';
    } else if (i === full && remainder >= 0.66) {
      chars += '▓';
    } else if (i === full && remainder >= 0.33) {
      chars += '▒';
    } else {
      chars += '░';
    }
  }
  return chars;
}

export function Progress({
  ref,
  className,
  value,
  max = 100,
  tone = 'brand',
  size = 'md',
  variant = 'bar',
  segments = 20,
  label,
  showValue = false,
  'aria-label': ariaLabelProp,
  ...rest
}: ProgressProps) {
  const isIndeterminate = value === null || value === undefined;
  const clamped = isIndeterminate ? 0 : Math.min(max, Math.max(0, value));
  const ratio = !isIndeterminate && max > 0 ? clamped / max : 0;
  const percent = Math.round(ratio * 100);
  const ariaLabel =
    ariaLabelProp ?? (typeof label === 'string' ? label : 'Progress');

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={!isIndeterminate ? clamped : undefined}
      className={cn('omai-progress', className)}
      data-tone={tone}
      data-size={size}
      data-variant={variant}
      data-indeterminate={isIndeterminate ? '' : undefined}
      {...rest}
    >
      {(label !== undefined && label !== null) || showValue ? (
        <div className="omai-progress__header">
          {label !== undefined && label !== null && (
            <span className="omai-progress__label">{label}</span>
          )}
          {showValue && (
            <span className="omai-progress__value">
              {isIndeterminate ? '…' : `${percent}%`}
            </span>
          )}
        </div>
      ) : null}
      {variant === 'blocks' ? (
        <div className="omai-progress__blocks" aria-hidden="true">
          {isIndeterminate
            ? '▒░'.repeat(Math.max(1, Math.floor(segments / 2)))
            : buildBtopBlocks(ratio, segments)}
        </div>
      ) : (
        <div className="omai-progress__track" aria-hidden="true">
          <div
            className="omai-progress__fill"
            style={!isIndeterminate ? { width: `${percent}%` } : undefined}
          />
        </div>
      )}
    </div>
  );
}
