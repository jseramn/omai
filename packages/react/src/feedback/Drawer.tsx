import { X } from 'lucide-react';
import {
  cloneElement,
  useId,
  useRef,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { IconButton } from '../primitives/IconButton';
import { useOmaiPortalAttributes } from '../theme';
import type { Side } from '../types';
import { cn } from '../utils/cn';
import { useFocusTrap } from '../utils/focus';
import { useControllableState, useEscapeKey, useScrollLock } from '../utils/hooks';
import { Portal } from '../utils/Portal';
import type { DialogProps } from './Dialog';

export interface DrawerProps extends Omit<DialogProps, 'size'> {
  side?: Side;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showClose = true,
  initialFocus,
  className,
}: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const portalAttrs = useOmaiPortalAttributes();

  useFocusTrap(panelRef, { enabled: open, initialFocus, restoreFocus: true });
  useScrollLock(open);
  useEscapeKey(() => setOpen(false), open && closeOnEscape);

  const triggerProps = (trigger?.props ?? {}) as Record<string, unknown>;
  const renderedTrigger = trigger
    ? cloneElement(trigger as ReactElement<Record<string, unknown>>, {
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        onClick: (e: MouseEvent<HTMLElement>) => {
          (triggerProps.onClick as ((ev: MouseEvent<HTMLElement>) => void) | undefined)?.(e);
          if (!e.defaultPrevented) {
            setOpen(true);
          }
        },
      })
    : null;

  const hasDescription = description !== undefined && description !== null && description !== false;

  return (
    <>
      {renderedTrigger}
      {open && (
        <Portal>
          <div {...portalAttrs} className="omai-drawer-root" data-side={side} data-state="open">
            <div
              className="omai-drawer__backdrop"
              data-testid="drawer-backdrop"
              onClick={() => {
                if (closeOnOverlayClick) setOpen(false);
              }}
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={hasDescription ? descriptionId : undefined}
              tabIndex={-1}
              className={cn('omai-drawer', className)}
              data-side={side}
              data-size={size}
              data-state="open"
            >
              <div className="omai-drawer__header">
                <div className="omai-drawer__titles">
                  <h2 id={titleId} className="omai-drawer__title">
                    {title}
                  </h2>
                  {hasDescription && (
                    <p id={descriptionId} className="omai-drawer__description">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <IconButton
                    aria-label="Close drawer"
                    size="sm"
                    variant="ghost"
                    className="omai-drawer__close"
                    icon={<X size={16} strokeWidth={1.75} aria-hidden="true" />}
                    onClick={() => setOpen(false)}
                  />
                )}
              </div>
              {children !== undefined && children !== null && (
                <div className="omai-drawer__body">{children}</div>
              )}
              {footer !== undefined && footer !== null && (
                <div className="omai-drawer__footer">{footer}</div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
