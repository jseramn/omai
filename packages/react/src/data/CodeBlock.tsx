import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cn } from '../utils';

export interface CodeBlockProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  code: string;
  language?: string;
  title?: ReactNode;
  showLineNumbers?: boolean;
  highlightLines?: readonly number[];
  copyable?: boolean;
  wrap?: boolean;
  maxHeight?: number | string;
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  highlightLines,
  copyable = true,
  wrap = false,
  maxHeight,
  className,
  ref,
  ...rest
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(code);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable in restricted contexts
    }
  };

  const normalized = code.endsWith('\n') && code.length > 1 ? code.slice(0, -1) : code;
  const lines = normalized.split('\n');
  const highlightSet = highlightLines ? new Set(highlightLines) : null;
  const hasHeader = Boolean(title || language || copyable);

  return (
    <div
      ref={ref}
      className={cn('omai-code-block', className)}
      data-wrap={wrap ? '' : undefined}
      {...rest}
    >
      {hasHeader ? (
        <div className="omai-code-block__header">
          <div className="omai-code-block__meta">
            {title ? <span className="omai-code-block__title">{title}</span> : null}
            {language ? <span className="omai-code-block__lang">{language}</span> : null}
          </div>
          {copyable ? (
            <button
              type="button"
              className="omai-code-block__copy"
              aria-label={copied ? 'Copied' : 'Copy code'}
              data-copied={copied ? '' : undefined}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check size={14} strokeWidth={1.75} aria-hidden />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} strokeWidth={1.75} aria-hidden />
                  <span>Copy</span>
                </>
              )}
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className="omai-code-block__body"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        <pre className="omai-code-block__pre">
          <code className="omai-code-block__code">
            {lines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightSet?.has(lineNumber) ?? false;

              return (
                <span
                  key={lineNumber}
                  className="omai-code-block__line"
                  data-highlighted={isHighlighted ? '' : undefined}
                >
                  {showLineNumbers ? (
                    <span className="omai-code-block__ln" aria-hidden="true">
                      {lineNumber}
                    </span>
                  ) : null}
                  <span className="omai-code-block__line-text">
                    {line}
                    {index < lines.length - 1 ? '\n' : ''}
                  </span>
                </span>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
