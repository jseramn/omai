import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Terminal,
  X,
} from 'lucide-react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { IconButton } from '../primitives/IconButton';
import type { Tone } from '../types';
import { cn } from '../utils/cn';

export interface AlertProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  tone?: Tone;
  title?: ReactNode;
  icon?: ReactNode | false;
  action?: ReactNode;
  onDismiss?: () => void;
}

function getDefaultAlertIcon(tone: Tone): ReactNode {
  switch (tone) {
    case 'success':
      return <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" />;
    case 'warning':
      return <AlertTriangle size={16} strokeWidth={1.75} aria-hidden="true" />;
    case 'danger':
      return <AlertCircle size={16} strokeWidth={1.75} aria-hidden="true" />;
    case 'brand':
    case 'neutral':
      return <Terminal size={16} strokeWidth={1.75} aria-hidden="true" />;
    case 'info':
    default:
      return <Info size={16} strokeWidth={1.75} aria-hidden="true" />;
  }
}

export function Alert({
  ref,
  className,
  tone = 'info',
  title,
  icon,
  action,
  onDismiss,
  role,
  children,
  ...rest
}: AlertProps) {
  const resolvedRole = role ?? (tone === 'danger' || tone === 'warning' ? 'alert' : 'status');
  const resolvedIcon = icon === false ? null : (icon ?? getDefaultAlertIcon(tone));

  return (
    <div
      ref={ref}
      role={resolvedRole}
      className={cn('omai-alert', className)}
      data-tone={tone}
      {...rest}
    >
      {resolvedIcon && (
        <span className="omai-alert__icon" aria-hidden="true">
          {resolvedIcon}
        </span>
      )}
      <div className="omai-alert__content">
        {title !== undefined && title !== null && <div className="omai-alert__title">{title}</div>}
        {children !== undefined && children !== null && (
          <div className="omai-alert__description">{children}</div>
        )}
      </div>
      {(action || onDismiss) && (
        <div className="omai-alert__actions">
          {action}
          {onDismiss && (
            <IconButton
              aria-label="Dismiss alert"
              size="sm"
              variant="ghost"
              className="omai-alert__dismiss"
              icon={<X size={14} strokeWidth={1.75} aria-hidden="true" />}
              onClick={onDismiss}
            />
          )}
        </div>
      )}
    </div>
  );
}
