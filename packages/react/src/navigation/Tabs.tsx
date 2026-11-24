import { useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode } from 'react';
import type { Orientation, Size } from '../types';
import { cn, getNavigationDelta, getNextIndex, useControllableState } from '../utils';

export interface TabItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'defaultValue' | 'onChange'> {
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?(value: string): void;
  variant?: 'underline' | 'boxed';
  orientation?: Orientation;
  activation?: 'automatic' | 'manual';
  size?: Size;
  listClassName?: string;
  'aria-label'?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'underline',
  orientation = 'horizontal',
  activation = 'automatic',
  size = 'md',
  listClassName,
  'aria-label': ariaLabel,
  className,
  ref,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? '';

  const [selectedValue, setSelectedValue] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? firstEnabled,
    onChange: onValueChange,
  });

  const [focusedValue, setFocusedValue] = useState<string>(selectedValue);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeTabValue = items.some((item) => item.value === selectedValue) ? selectedValue : firstEnabled;
  const focusTargetValue = items.some((item) => item.value === focusedValue && !item.disabled)
    ? focusedValue
    : activeTabValue;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = getNavigationDelta(event.key, orientation);
    if (delta === null) return;

    event.preventDefault();
    const isDisabled = (idx: number) => Boolean(items[idx]?.disabled);
    let nextIndex = index;

    if (delta === 'first') {
      nextIndex = getNextIndex(-1, 1, items.length, { loop: false, isDisabled });
      if (nextIndex === -1) return;
    } else if (delta === 'last') {
      nextIndex = getNextIndex(items.length, -1, items.length, { loop: false, isDisabled });
      if (nextIndex === items.length) return;
    } else {
      nextIndex = getNextIndex(index, delta, items.length, { loop: true, isDisabled });
    }

    const nextItem = items[nextIndex];
    if (!nextItem || nextItem.disabled) return;

    setFocusedValue(nextItem.value);
    tabRefs.current[nextIndex]?.focus();

    if (activation === 'automatic') {
      setSelectedValue(nextItem.value);
    }
  };

  return (
    <div
      ref={ref}
      className={cn('omai-tabs', className)}
      data-variant={variant}
      data-orientation={orientation}
      data-size={size}
      {...rest}
    >
      <div
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={cn('omai-tabs__list', listClassName)}
      >
        {items.map((item, index) => {
          const isSelected = item.value === activeTabValue;
          const isFocusable = activation === 'manual' ? item.value === focusTargetValue : isSelected;
          const hasContent = item.content !== undefined;
          const tabId = `${baseId}-tab-${item.value}`;
          const panelId = `${baseId}-panel-${item.value}`;

          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={isSelected}
              aria-controls={hasContent ? panelId : undefined}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              tabIndex={isFocusable && !item.disabled ? 0 : -1}
              data-state={isSelected ? 'active' : 'inactive'}
              data-disabled={item.disabled ? '' : undefined}
              className="omai-tabs__tab"
              onClick={() => {
                if (item.disabled) return;
                setFocusedValue(item.value);
                setSelectedValue(item.value);
              }}
              onFocus={() => {
                if (!item.disabled) setFocusedValue(item.value);
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {item.icon ? <span className="omai-tabs__icon">{item.icon}</span> : null}
              <span className="omai-tabs__label">{item.label}</span>
              {item.badge !== undefined && item.badge !== null ? (
                <span className="omai-tabs__badge">{item.badge}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        if (item.content === undefined) return null;
        const isSelected = item.value === activeTabValue;
        const tabId = `${baseId}-tab-${item.value}`;
        const panelId = `${baseId}-panel-${item.value}`;

        return (
          <div
            key={item.value}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            tabIndex={0}
            hidden={!isSelected}
            data-state={isSelected ? 'active' : 'inactive'}
            className="omai-tabs__panel"
          >
            {isSelected ? item.content : null}
          </div>
        );
      })}
    </div>
  );
}
