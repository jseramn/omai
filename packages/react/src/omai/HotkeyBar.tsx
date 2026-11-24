import { Fragment, type ComponentPropsWithRef, type ReactNode } from 'react';
import { Kbd } from '../primitives';
import type { KeyCombo } from '../types';
import { cn } from '../utils';
import { useHotkey } from './useHotkey';

export interface HotkeyItem {
  keys: KeyCombo;
  label: ReactNode;
  onTrigger?(): void;
  combo?: string;
}

export interface HotkeyBarProps extends ComponentPropsWithRef<'div'> {
  items: readonly HotkeyItem[];
  position?: 'inline' | 'top' | 'bottom';
  separator?: ReactNode;
  size?: 'sm' | 'md';
}

function HotkeyBinding({ combo, onTrigger }: { combo: string; onTrigger: () => void }) {
  useHotkey(combo, () => onTrigger());
  return null;
}

export function HotkeyBar({
  items,
  position = 'inline',
  separator = '·',
  size = 'md',
  className,
  ref,
  ...rest
}: HotkeyBarProps) {
  const kbdSize = size === 'sm' ? 'sm' : 'md';

  return (
    <div
      ref={ref}
      className={cn('omai-hotkey-bar', className)}
      data-position={position}
      data-size={size}
      {...rest}
    >
      {items.map((item, idx) => (
        <Fragment key={`${idx}-${item.keys.join('+')}`}>
          {item.combo && item.onTrigger ? (
            <HotkeyBinding combo={item.combo} onTrigger={item.onTrigger} />
          ) : null}

          {item.onTrigger ? (
            <button
              type="button"
              className="omai-hotkey-bar__item omai-hotkey-bar__item--interactive"
              onClick={item.onTrigger}
            >
              <Kbd keys={item.keys} size={kbdSize} />
              <span className="omai-hotkey-bar__label">{item.label}</span>
            </button>
          ) : (
            <span className="omai-hotkey-bar__item">
              <Kbd keys={item.keys} size={kbdSize} />
              <span className="omai-hotkey-bar__label">{item.label}</span>
            </span>
          )}

          {idx < items.length - 1 ? (
            <span className="omai-hotkey-bar__sep" aria-hidden="true">
              {separator}
            </span>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
