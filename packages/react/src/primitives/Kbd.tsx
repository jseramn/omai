import { Fragment, type ComponentPropsWithRef } from 'react';
import type { KeyCombo } from '../types';
import { cn } from '../utils/cn';

export interface KbdProps extends ComponentPropsWithRef<'kbd'> {
  keys?: KeyCombo;
  size?: 'sm' | 'md';
}

export function Kbd({
  ref,
  className,
  keys,
  size = 'md',
  children,
  ...rest
}: KbdProps) {
  const hasKeys = Array.isArray(keys) && keys.length > 0;

  return (
    <kbd
      ref={ref}
      className={cn('omai-kbd', className)}
      data-size={size}
      data-combo={hasKeys ? '' : undefined}
      {...rest}
    >
      {hasKeys
        ? keys.map((key, index) => (
            <Fragment key={`${key}-${index}`}>
              {index > 0 && (
                <span className="omai-kbd__sep" aria-hidden="true">
                  +
                </span>
              )}
              <kbd className="omai-kbd__key">{key}</kbd>
            </Fragment>
          ))
        : children}
    </kbd>
  );
}
