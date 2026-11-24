import { useEffect, useState, type ComponentPropsWithRef } from 'react';
import type { Size } from '../types';
import { cn } from '../utils/cn';

export interface AvatarProps extends ComponentPropsWithRef<'span'> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | Size | 'xl';
  shape?: 'square' | 'circle';
  status?: 'online' | 'away' | 'busy' | 'offline';
}

function getInitials(name?: string, alt?: string): string {
  const source = (name || alt || '').trim();
  if (!source) return '?';
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
}

export function Avatar({
  ref,
  className,
  src,
  alt,
  name,
  size = 'md',
  shape = 'square',
  status,
  children,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImage = Boolean(src && !failed);
  const label = alt ?? name;

  return (
    <span
      ref={ref}
      className={cn('omai-avatar', className)}
      data-size={size}
      data-shape={shape}
      data-status={status}
      {...rest}
    >
      {showImage ? (
        <img
          className="omai-avatar__image"
          src={src}
          alt={label ?? ''}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="omai-avatar__fallback" role={label ? 'img' : undefined} aria-label={label}>
          {children ?? getInitials(name, alt)}
        </span>
      )}
      {status && (
        <span
          className="omai-avatar__status"
          data-status={status}
          aria-label={status}
        />
      )}
    </span>
  );
}
