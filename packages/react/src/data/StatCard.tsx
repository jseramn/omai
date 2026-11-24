import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Tone } from '../types';
import { cn } from '../utils';

export interface StatCardProps extends ComponentPropsWithRef<'div'> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  delta?: { value: ReactNode; direction: 'up' | 'down' | 'flat'; tone?: Tone };
  icon?: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  meter?: number;
  sparkline?: readonly number[];
}

const SPARK_BLOCKS = '▁▂▃▄▅▆▇█';

function toSparklineString(values: readonly number[]): string {
  if (values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  return values
    .map((val) => {
      if (span === 0) return SPARK_BLOCKS[3]!;
      const normalized = (val - min) / span;
      const idx = Math.min(
        SPARK_BLOCKS.length - 1,
        Math.max(0, Math.round(normalized * (SPARK_BLOCKS.length - 1))),
      );
      return SPARK_BLOCKS[idx]!;
    })
    .join('');
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  icon,
  description,
  tone = 'brand',
  meter,
  sparkline,
  className,
  ref,
  ...rest
}: StatCardProps) {
  const deltaTone: Tone =
    delta?.tone ??
    (delta?.direction === 'up'
      ? 'success'
      : delta?.direction === 'down'
        ? 'danger'
        : 'neutral');

  const meterPercent = meter !== undefined ? Math.min(100, Math.max(0, meter)) : undefined;

  return (
    <div
      ref={ref}
      className={cn('omai-stat-card', className)}
      data-tone={tone}
      {...rest}
    >
      <div className="omai-stat-card__header">
        <span className="omai-stat-card__label">{label}</span>
        {icon ? <span className="omai-stat-card__icon">{icon}</span> : null}
      </div>

      <div className="omai-stat-card__main">
        <div className="omai-stat-card__value-group">
          <span className="omai-stat-card__value">{value}</span>
          {unit ? <span className="omai-stat-card__unit">{unit}</span> : null}
        </div>

        {delta ? (
          <span className="omai-stat-card__delta" data-tone={deltaTone}>
            {delta.direction === 'up' ? (
              <TrendingUp size={14} strokeWidth={1.75} aria-hidden />
            ) : delta.direction === 'down' ? (
              <TrendingDown size={14} strokeWidth={1.75} aria-hidden />
            ) : (
              <Minus size={14} strokeWidth={1.75} aria-hidden />
            )}
            <span>{delta.value}</span>
          </span>
        ) : null}
      </div>

      {sparkline && sparkline.length > 0 ? (
        <div className="omai-stat-card__sparkline" aria-hidden="true">
          {toSparklineString(sparkline)}
        </div>
      ) : null}

      {meterPercent !== undefined ? (
        <div
          className="omai-stat-card__meter"
          role="progressbar"
          aria-valuenow={meterPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="omai-stat-card__meter-fill" style={{ width: `${meterPercent}%` }} />
        </div>
      ) : null}

      {description ? <div className="omai-stat-card__description">{description}</div> : null}
    </div>
  );
}
