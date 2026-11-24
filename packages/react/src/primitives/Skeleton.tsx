import type { ComponentPropsWithRef, CSSProperties } from 'react';
import { cn } from '../utils/cn';

export interface SkeletonProps extends ComponentPropsWithRef<'div'> {
  variant?: 'block' | 'text' | 'pixel';
  width?: number | string;
  height?: number | string;
  lines?: number;
}

export function Skeleton({
  ref,
  className,
  variant = 'block',
  width,
  height,
  lines,
  style,
  ...rest
}: SkeletonProps) {
  const inlineStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
  };

  const lineCount = variant === 'text' && lines && lines > 1 ? lines : 0;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('omai-skeleton', className)}
      data-variant={variant}
      style={inlineStyle}
      {...rest}
    >
      {lineCount > 0 &&
        Array.from({ length: lineCount }, (_, idx) => (
          <span key={idx} className="omai-skeleton__line" />
        ))}
    </div>
  );
}
