import {
  cloneElement,
  useId,
  useRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { useOmaiPortalAttributes } from '../theme';
import type { Align, Side } from '../types';
import { cn } from '../utils/cn';
import { useFocusTrap } from '../utils/focus';
import {
  mergeRefs,
  useControllableState,
  useEscapeKey,
  useOnClickOutside,
} from '../utils/hooks';
import { useFloatingPosition } from '../utils/position';
import { Portal } from '../utils/Portal';

export interface PopoverProps {
  trigger: ReactElement;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  align?: Align;
  offset?: number;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  offset = 6,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  className,
  'aria-label': ariaLabel,
}: PopoverProps) {
  const popoverId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const portalAttrs = useOmaiPortalAttributes();
  const pos = useFloatingPosition({
    open,
    anchorRef: triggerRef,
    floatingRef: panelRef,
    side,
    align,
    offset,
  });

  useFocusTrap(panelRef, { enabled: open, restoreFocus: true });
  useEscapeKey(() => setOpen(false), open && closeOnEscape);
  useOnClickOutside([triggerRef, panelRef], () => setOpen(false), open && closeOnOutsideClick);

  const triggerProps = (trigger.props ?? {}) as Record<string, unknown>;
  const existingRef =
    (triggerProps.ref as Ref<HTMLElement> | undefined) ??
    (trigger as unknown as { ref?: Ref<HTMLElement> }).ref;

  const renderedTrigger = cloneElement(trigger as ReactElement<Record<string, unknown>>, {
    ref: mergeRefs(triggerRef, existingRef),
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? popoverId : undefined,
    onClick: (e: MouseEvent<HTMLElement>) => {
      (triggerProps.onClick as ((ev: MouseEvent<HTMLElement>) => void) | undefined)?.(e);
      if (!e.defaultPrevented) {
        setOpen((prev) => !prev);
      }
    },
  });

  return (
    <>
      {renderedTrigger}
      {open && (
        <Portal>
          <div
            {...portalAttrs}
            ref={panelRef}
            id={popoverId}
            role="dialog"
            aria-label={ariaLabel}
            tabIndex={-1}
            className={cn('omai-popover', className)}
            data-side={pos.side}
            data-align={pos.align}
            data-state="open"
            style={{
              position: 'fixed',
              top: `${pos.top}px`,
              left: `${pos.left}px`,
            }}
          >
            {children}
          </div>
        </Portal>
      )}
    </>
  );
}
