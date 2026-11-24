import { X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { IconButton } from '../primitives/IconButton';
import { Kbd } from '../primitives/Kbd';
import { useOmaiPortalAttributes } from '../theme';
import type { Tone } from '../types';
import { cn } from '../utils/cn';
import { Portal } from '../utils/Portal';

export interface ToastAction {
  label: ReactNode;
  onClick: () => void;
  shortcut?: string;
}

export interface ToastOptions {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  appName?: string;
  timestamp?: Date | string;
  duration?: number | null;
  actions?: readonly ToastAction[];
  onDismiss?: () => void;
}

export type ToastRecord = ToastOptions & {
  id: string;
  createdAt: number;
};

export type ToastPlacement =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastProviderProps {
  children?: ReactNode;
  placement?: ToastPlacement;
  duration?: number;
  max?: number;
  offset?: number;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  update: (id: string, options: Partial<ToastOptions>) => void;
  dismiss: (id?: string) => void;
  toasts: readonly ToastRecord[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('[omai] useToast() must be used inside <ToastProvider>.');
  }
  return ctx;
}

export interface ToastProps extends ToastOptions {
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
}

function formatTimestamp(ts?: Date | string): string | null {
  if (!ts) return null;
  if (typeof ts === 'string') return ts;
  const h = String(ts.getHours()).padStart(2, '0');
  const m = String(ts.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function Toast({
  title,
  description,
  tone = 'neutral',
  icon,
  appName,
  timestamp,
  duration,
  actions,
  onDismiss,
  onClose,
  className,
  style,
}: ToastProps) {
  const handleClose = onClose ?? onDismiss;
  const formattedTime = formatTimestamp(timestamp);
  const hasHeader = Boolean(appName || formattedTime || handleClose);

  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('omai-toast', className)}
      data-tone={tone}
      style={style}
    >
      {hasHeader && (
        <div className="omai-toast__header">
          <div className="omai-toast__meta">
            {appName && <span className="omai-toast__app">{appName}</span>}
            {formattedTime && <span className="omai-toast__time">{formattedTime}</span>}
          </div>
          {handleClose && (
            <IconButton
              aria-label="Dismiss notification"
              size="sm"
              variant="ghost"
              className="omai-toast__close"
              icon={<X size={12} strokeWidth={1.75} aria-hidden="true" />}
              onClick={handleClose}
            />
          )}
        </div>
      )}
      <div className="omai-toast__body">
        {icon && (
          <span className="omai-toast__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="omai-toast__content">
          <div className="omai-toast__title">{title}</div>
          {description !== undefined && description !== null && (
            <div className="omai-toast__description">{description}</div>
          )}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <div className="omai-toast__actions">
          {actions.map((action, index) => {
            const keyHint = action.shortcut ?? (index < 9 ? String(index + 1) : undefined);
            return (
              <button
                key={index}
                type="button"
                className="omai-toast__action"
                onClick={() => {
                  action.onClick();
                  handleClose?.();
                }}
              >
                {keyHint && <Kbd size="sm">{keyHint}</Kbd>}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
      {typeof duration === 'number' && duration > 0 && (
        <div
          className="omai-toast__progress"
          style={{ '--omai-toast-duration': `${duration}ms` } as CSSProperties}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

let toastCounter = 0;

export function ToastProvider({
  children,
  placement = 'top-right',
  duration: defaultDuration = 5000,
  max = 5,
  offset = 15,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [paused, setPaused] = useState(false);
  const toastsRef = useRef<ToastRecord[]>(toasts);
  toastsRef.current = toasts;
  const portalAttrs = useOmaiPortalAttributes();

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => {
      if (id === undefined) {
        prev.forEach((t) => t.onDismiss?.());
        return [];
      }
      const target = prev.find((t) => t.id === id);
      target?.onDismiss?.();
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const toast = useCallback(
    (options: ToastOptions): string => {
      const id = options.id ?? `omai-toast-${++toastCounter}`;
      const record: ToastRecord = {
        ...options,
        id,
        duration: options.duration === undefined ? defaultDuration : options.duration,
        createdAt: Date.now(),
      };
      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id);
        return [record, ...filtered].slice(0, max);
      });
      return id;
    },
    [defaultDuration, max],
  );

  const update = useCallback((id: string, options: Partial<ToastOptions>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...options, id } : t)));
  }, []);

  useEffect(() => {
    if (paused || toasts.length === 0) return;
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    for (const item of toasts) {
      const dur = item.duration === undefined ? defaultDuration : item.duration;
      if (typeof dur === 'number' && dur > 0) {
        timers.push(
          setTimeout(() => {
            dismiss(item.id);
          }, dur),
        );
      }
    }
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, paused, defaultDuration, dismiss]);

  // Numbered keyboard shortcuts 1..9 for the newest toast with actions
  useEffect(() => {
    if (toasts.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (!/^[1-9]$/.test(e.key)) return;
      const activeToast = toastsRef.current.find((t) => t.actions && t.actions.length > 0);
      if (!activeToast || !activeToast.actions) return;
      const index = Number(e.key) - 1;
      const matched =
        activeToast.actions.find((a) => a.shortcut === e.key) ?? activeToast.actions[index];
      if (matched) {
        e.preventDefault();
        matched.onClick();
        dismiss(activeToast.id);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [toasts.length, dismiss]);

  const ctx = useMemo<ToastContextValue>(
    () => ({ toast, update, dismiss, toasts }),
    [toast, update, dismiss, toasts],
  );

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {toasts.length > 0 && (
        <Portal>
          <ol
            {...portalAttrs}
            aria-live="polite"
            className="omai-toast-viewport"
            data-placement={placement}
            data-expanded={paused ? '' : undefined}
            style={{ '--omai-toast-offset': `${offset}px` } as CSSProperties}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setPaused(false);
              }
            }}
          >
            {toasts.map((item, idx) => (
              <li
                key={item.id}
                className="omai-toast-viewport__item"
                data-index={idx}
                style={{ '--omai-toast-index': idx } as CSSProperties}
              >
                <Toast {...item} onClose={() => dismiss(item.id)} />
              </li>
            ))}
          </ol>
        </Portal>
      )}
    </ToastContext.Provider>
  );
}
