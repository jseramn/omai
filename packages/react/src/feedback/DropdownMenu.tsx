import { Check } from 'lucide-react';
import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { Kbd } from '../primitives/Kbd';
import { useOmaiPortalAttributes } from '../theme';
import type { Align, KeyCombo, Side } from '../types';
import { cn } from '../utils/cn';
import { getNavigationDelta, getNextIndex } from '../utils/focus';
import {
  mergeRefs,
  useControllableState,
  useEscapeKey,
  useOnClickOutside,
} from '../utils/hooks';
import { useFloatingPosition } from '../utils/position';
import { Portal } from '../utils/Portal';

export type DropdownMenuEntry =
  | {
      type?: 'item';
      id: string;
      label: ReactNode;
      icon?: ReactNode;
      shortcut?: KeyCombo;
      disabled?: boolean;
      danger?: boolean;
      onSelect?: () => void;
    }
  | {
      type: 'checkbox';
      id: string;
      label: ReactNode;
      checked: boolean;
      onCheckedChange: (checked: boolean) => void;
      disabled?: boolean;
    }
  | { type: 'label'; label: ReactNode }
  | { type: 'separator' };

export interface DropdownMenuProps {
  trigger: ReactElement;
  items: readonly DropdownMenuEntry[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  className?: string;
  'aria-label'?: string;
}

type ActionableEntry = Extract<DropdownMenuEntry, { id: string }>;

function isActionable(entry: DropdownMenuEntry): entry is ActionableEntry {
  return entry.type !== 'label' && entry.type !== 'separator';
}

function getEntryText(label: ReactNode): string {
  if (typeof label === 'string' || typeof label === 'number') return String(label);
  return '';
}

export function DropdownMenu({
  trigger,
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  className,
  'aria-label': ariaLabel,
}: DropdownMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const actionableItems = items.filter(isActionable);
  const firstEnabledIndex = actionableItems.findIndex((item) => !item.disabled);
  const [activeIndex, setActiveIndex] = useState<number>(firstEnabledIndex >= 0 ? firstEnabledIndex : 0);

  const portalAttrs = useOmaiPortalAttributes();
  const pos = useFloatingPosition({
    open,
    anchorRef: triggerRef,
    floatingRef: menuRef,
    side,
    align,
    offset: 6,
  });

  useEffect(() => {
    if (open) {
      const idx = firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
      setActiveIndex(idx);
      const frame = requestAnimationFrame(() => {
        const btn = itemRefs.current[idx];
        if (btn) btn.focus({ preventScroll: true });
        else menuRef.current?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open, firstEnabledIndex]);

  const closeMenu = (restoreTriggerFocus = true) => {
    setOpen(false);
    if (restoreTriggerFocus) {
      triggerRef.current?.focus({ preventScroll: true });
    }
  };

  useEscapeKey(() => closeMenu(true), open);
  useOnClickOutside([triggerRef, menuRef], () => closeMenu(false), open);

  const focusItemAt = (idx: number) => {
    setActiveIndex(idx);
    itemRefs.current[idx]?.focus({ preventScroll: true });
  };

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (actionableItems.length === 0) return;
    const isDisabled = (i: number) => Boolean(actionableItems[i]?.disabled);
    const delta = getNavigationDelta(e.key, 'vertical');

    if (delta !== null) {
      e.preventDefault();
      let nextIdx = activeIndex;
      if (delta === 'first') {
        nextIdx = getNextIndex(-1, 1, actionableItems.length, { loop: false, isDisabled });
      } else if (delta === 'last') {
        nextIdx = getNextIndex(actionableItems.length, -1, actionableItems.length, {
          loop: false,
          isDisabled,
        });
      } else {
        nextIdx = getNextIndex(activeIndex, delta, actionableItems.length, {
          loop: true,
          isDisabled,
        });
      }
      if (nextIdx >= 0) focusItemAt(nextIdx);
      return;
    }

    if (e.key === 'Tab') {
      closeMenu(false);
      return;
    }

    // Single-character typeahead
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && e.key !== ' ') {
      const char = e.key.toLowerCase();
      for (let step = 1; step <= actionableItems.length; step++) {
        const candidateIdx = (activeIndex + step) % actionableItems.length;
        const candidate = actionableItems[candidateIdx];
        if (
          candidate &&
          !candidate.disabled &&
          getEntryText(candidate.label).trim().toLowerCase().startsWith(char)
        ) {
          e.preventDefault();
          focusItemAt(candidateIdx);
          break;
        }
      }
    }
  };

  const triggerProps = (trigger.props ?? {}) as Record<string, unknown>;
  const existingRef =
    (triggerProps.ref as Ref<HTMLElement> | undefined) ??
    (trigger as unknown as { ref?: Ref<HTMLElement> }).ref;

  const renderedTrigger = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    ref: mergeRefs(triggerRef, existingRef),
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? menuId : undefined,
    onClick: (e: MouseEvent<HTMLElement>) => {
      (triggerProps.onClick as ((ev: MouseEvent<HTMLElement>) => void) | undefined)?.(e);
      if (!e.defaultPrevented) {
        setOpen((prev) => !prev);
      }
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      (triggerProps.onKeyDown as ((ev: KeyboardEvent<HTMLElement>) => void) | undefined)?.(e);
      if (e.defaultPrevented) return;
      if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        setOpen(true);
      }
    },
  });

  let actionableCounter = -1;

  return (
    <>
      {renderedTrigger}
      {open && (
        <Portal>
          <div
            {...portalAttrs}
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={ariaLabel}
            tabIndex={-1}
            className={cn('omai-dropdown-menu', className)}
            data-side={pos.side}
            data-align={pos.align}
            data-state="open"
            style={{
              position: 'fixed',
              top: `${pos.top}px`,
              left: `${pos.left}px`,
            }}
            onKeyDown={handleMenuKeyDown}
          >
            {items.map((entry, idx) => {
              if (entry.type === 'separator') {
                return (
                  <div
                    key={`sep-${idx}`}
                    role="separator"
                    className="omai-dropdown-menu__separator"
                  />
                );
              }

              if (entry.type === 'label') {
                return (
                  <div key={`lbl-${idx}`} className="omai-dropdown-menu__label">
                    {entry.label}
                  </div>
                );
              }

              actionableCounter += 1;
              const currentIndex = actionableCounter;
              const isActive = currentIndex === activeIndex;

              if (entry.type === 'checkbox') {
                return (
                  <button
                    key={entry.id}
                    ref={(el) => {
                      itemRefs.current[currentIndex] = el;
                    }}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={entry.checked}
                    disabled={entry.disabled}
                    tabIndex={isActive ? 0 : -1}
                    className="omai-dropdown-menu__item"
                    data-state={entry.checked ? 'checked' : 'unchecked'}
                    data-active={isActive ? '' : undefined}
                    data-disabled={entry.disabled ? '' : undefined}
                    onMouseEnter={() => {
                      if (!entry.disabled) setActiveIndex(currentIndex);
                    }}
                    onClick={() => {
                      if (entry.disabled) return;
                      entry.onCheckedChange(!entry.checked);
                    }}
                  >
                    <span className="omai-dropdown-menu__check" aria-hidden="true">
                      {entry.checked && <Check size={14} strokeWidth={2} />}
                    </span>
                    <span className="omai-dropdown-menu__item-label">{entry.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={entry.id}
                  ref={(el) => {
                    itemRefs.current[currentIndex] = el;
                  }}
                  type="button"
                  role="menuitem"
                  disabled={entry.disabled}
                  tabIndex={isActive ? 0 : -1}
                  className="omai-dropdown-menu__item"
                  data-active={isActive ? '' : undefined}
                  data-danger={entry.danger ? '' : undefined}
                  data-disabled={entry.disabled ? '' : undefined}
                  onMouseEnter={() => {
                    if (!entry.disabled) setActiveIndex(currentIndex);
                  }}
                  onClick={() => {
                    if (entry.disabled) return;
                    entry.onSelect?.();
                    closeMenu(true);
                  }}
                >
                  {entry.icon && (
                    <span className="omai-dropdown-menu__icon" aria-hidden="true">
                      {entry.icon}
                    </span>
                  )}
                  <span className="omai-dropdown-menu__item-label">{entry.label}</span>
                  {entry.shortcut && entry.shortcut.length > 0 && (
                    <Kbd
                      keys={entry.shortcut}
                      size="sm"
                      className="omai-dropdown-menu__shortcut"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Portal>
      )}
    </>
  );
}
