import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { useOmaiPortalAttributes } from '../theme';
import type { Align, KeyCombo, Side } from '../types';
import { cn } from '../utils/cn';
import { mergeRefs, useControllableState, useEscapeKey } from '../utils/hooks';
import { useFloatingPosition } from '../utils/position';
import { Portal } from '../utils/Portal';
import { Kbd } from './Kbd';

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  side?: Side;
  align?: Align;
  delay?: number;
  shortcut?: KeyCombo;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 400,
  shortcut,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
}: TooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const floatingRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const isOpen = !disabled && open;
  const portalAttrs = useOmaiPortalAttributes();
  const pos = useFloatingPosition({
    open: isOpen,
    anchorRef: triggerRef,
    floatingRef,
    side,
    align,
    offset: 6,
  });

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => clearTimer, []);

  useEscapeKey(() => {
    clearTimer();
    setOpen(false);
  }, isOpen);

  const handleOpenWithDelay = () => {
    if (disabled) return;
    clearTimer();
    if (delay <= 0) {
      setOpen(true);
    } else {
      timerRef.current = setTimeout(() => {
        setOpen(true);
      }, delay);
    }
  };

  const handleOpenImmediate = () => {
    if (disabled) return;
    clearTimer();
    setOpen(true);
  };

  const handleClose = () => {
    clearTimer();
    setOpen(false);
  };

  const childProps = (children.props ?? {}) as Record<string, unknown>;
  const existingRef =
    (childProps.ref as Ref<HTMLElement> | undefined) ??
    (children as unknown as { ref?: Ref<HTMLElement> }).ref;
  const existingDescribedBy = childProps['aria-describedby'] as string | undefined;
  const describedBy = isOpen
    ? [existingDescribedBy, tooltipId].filter(Boolean).join(' ')
    : existingDescribedBy;

  const trigger = cloneElement(children as ReactElement<Record<string, unknown>>, {
    ref: mergeRefs(triggerRef, existingRef),
    'aria-describedby': describedBy,
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      (childProps.onMouseEnter as ((ev: MouseEvent<HTMLElement>) => void) | undefined)?.(e);
      handleOpenWithDelay();
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      (childProps.onMouseLeave as ((ev: MouseEvent<HTMLElement>) => void) | undefined)?.(e);
      handleClose();
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      (childProps.onFocus as ((ev: FocusEvent<HTMLElement>) => void) | undefined)?.(e);
      handleOpenImmediate();
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      (childProps.onBlur as ((ev: FocusEvent<HTMLElement>) => void) | undefined)?.(e);
      handleClose();
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      (childProps.onKeyDown as ((ev: KeyboardEvent<HTMLElement>) => void) | undefined)?.(e);
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    },
  });

  return (
    <>
      {trigger}
      {isOpen && (
        <Portal>
          <div
            {...portalAttrs}
            ref={floatingRef}
            id={tooltipId}
            role="tooltip"
            className={cn('omai-tooltip', className)}
            data-side={pos.side}
            data-align={pos.align}
            data-state="open"
            style={{
              position: 'fixed',
              top: `${pos.top}px`,
              left: `${pos.left}px`,
            }}
          >
            <span className="omai-tooltip__content">{content}</span>
            {shortcut && shortcut.length > 0 && (
              <Kbd keys={shortcut} size="sm" className="omai-tooltip__kbd" />
            )}
          </div>
        </Portal>
      )}
    </>
  );
}
