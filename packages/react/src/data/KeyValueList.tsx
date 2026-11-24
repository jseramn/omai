import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../utils';

export interface KeyValueItem {
  key: string;
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
  copyable?: boolean;
}

export interface KeyValueListProps extends ComponentPropsWithRef<'dl'> {
  items: readonly KeyValueItem[];
  layout?: 'horizontal' | 'stacked';
  dense?: boolean;
  divided?: boolean;
  labelWidth?: string;
}

export function KeyValueList({
  items,
  layout = 'horizontal',
  dense = false,
  divided = true,
  labelWidth = '10rem',
  className,
  style,
  ref,
  ...rest
}: KeyValueListProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async (item: KeyValueItem) => {
    try {
      const text = typeof item.value === 'string' || typeof item.value === 'number'
        ? String(item.value)
        : '';
      await navigator.clipboard?.writeText(text);
      setCopiedKey(item.key);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <dl
      ref={ref}
      className={cn('omai-kv-list', className)}
      data-layout={layout}
      data-dense={dense ? '' : undefined}
      data-divided={divided ? '' : undefined}
      style={{ '--omai-kv-label-width': labelWidth, ...style } as CSSProperties}
      {...rest}
    >
      {items.map((item) => {
        const isCopied = copiedKey === item.key;
        const labelStr = typeof item.label === 'string' ? item.label : item.key;

        return (
          <div key={item.key} className="omai-kv-list__row">
            <dt className="omai-kv-list__label">{item.label}</dt>
            <dd className="omai-kv-list__value" data-mono={item.mono ? 'true' : undefined}>
              <span className="omai-kv-list__value-text">{item.value}</span>
              {item.copyable ? (
                <button
                  type="button"
                  className="omai-kv-list__copy"
                  aria-label={isCopied ? `Copied ${labelStr}` : `Copy ${labelStr}`}
                  data-copied={isCopied ? '' : undefined}
                  onClick={() => handleCopy(item)}
                >
                  {isCopied ? (
                    <Check size={14} strokeWidth={1.75} aria-hidden />
                  ) : (
                    <Copy size={14} strokeWidth={1.75} aria-hidden />
                  )}
                </button>
              ) : null}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
