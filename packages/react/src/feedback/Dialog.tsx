import { X } from 'lucide-react';
import {
  cloneElement,
  useId,
  useRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { IconButton } from '../primitives/IconButton';
import { useOmaiPortalAttributes } from '../theme';
import { cn } from '../utils/cn';
import { useFocusTrap } from '../utils/focus';
import { useControllableState, useEscapeKey, useScrollLock } from '../utils/hooks';
import { Portal } from '../utils/Portal';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  showClose?: boolean;
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;
}

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showClose = true,
  initialFocus,
  className,
}: DialogProps) {
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
          <div {...portalAttrs} className="omai-dialog-root" data-state="open">
            <div
              className="omai-dialog__backdrop"
              data-testid="dialog-backdrop"
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
              className={cn('omai-dialog', className)}
              data-size={size}
              data-state="open"
            >
              <div className="omai-dialog__header">
                <div className="omai-dialog__titles">
                  <h2 id={titleId} className="omai-dialog__title">
                    {title}
                  </h2>
                  {hasDescription && (
                    <p id={descriptionId} className="omai-dialog__description">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <IconButton
                    aria-label="Close dialog"
                    size="sm"
                    variant="ghost"
                    className="omai-dialog__close"
                    icon={<X size={16} strokeWidth={1.75} aria-hidden="true" />}
                    onClick={() => setOpen(false)}
                  />
                )}
              </div>
              {children !== undefined && children !== null && (
                <div className="omai-dialog__body">{children}</div>
              )}
              {footer !== undefined && footer !== null && (
                <div className="omai-dialog__footer">{footer}</div>
              )}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
