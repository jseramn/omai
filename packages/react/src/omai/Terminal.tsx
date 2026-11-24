import { Check, Copy } from 'lucide-react';
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn, usePrefersReducedMotion } from '../utils';

export type AnsiColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;

export type TerminalLine =
  | { type: 'command'; text: string; prompt?: ReactNode }
  | { type: 'output'; text: ReactNode; color?: AnsiColor }
  | { type: 'blank' };

export interface AnsiProps extends Omit<ComponentPropsWithRef<'span'>, 'color'> {
  color?: AnsiColor;
  bg?: AnsiColor;
  bold?: boolean;
  dim?: boolean;
}

export function Ansi({
  color,
  bg,
  bold = false,
  dim = false,
  className,
  style,
  children,
  ref,
  ...rest
}: AnsiProps) {
  const inlineStyle: CSSProperties = {
    ...(color !== undefined ? { color: `var(--omai-ansi-${color})` } : {}),
    ...(bg !== undefined ? { backgroundColor: `var(--omai-ansi-${bg})` } : {}),
    ...(bold ? { fontWeight: 'var(--omai-weight-bold)' } : {}),
    ...(dim ? { opacity: 0.65 } : {}),
    ...style,
  };

  return (
    <span
      ref={ref}
      className={cn('omai-ansi', className)}
      data-color={color}
      data-bg={bg}
      style={inlineStyle}
      {...rest}
    >
      {children}
    </span>
  );
}

interface SgrState {
  color?: AnsiColor;
  bg?: AnsiColor;
  bold: boolean;
  dim: boolean;
}

const SGR_REGEX = /\u001b\[([0-9;]*)m/g;

/** Parses SGR escape sequences (0/1/2/22/30-37/39/90-97/40-47/49/100-107) into `<Ansi>` spans. */
export function ansiToReact(text: string): ReactNode {
  if (!text.includes('\u001b[')) return text;

  const nodes: ReactNode[] = [];
  let state: SgrState = { bold: false, dim: false };
  let lastIndex = 0;
  let keyCounter = 0;

  SGR_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  const pushSegment = (segment: string) => {
    if (!segment) return;
    if (state.color === undefined && state.bg === undefined && !state.bold && !state.dim) {
      nodes.push(segment);
    } else {
      nodes.push(
        <Ansi
          key={`ansi-${keyCounter++}`}
          color={state.color}
          bg={state.bg}
          bold={state.bold}
          dim={state.dim}
        >
          {segment}
        </Ansi>,
      );
    }
  };

  while ((match = SGR_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pushSegment(text.slice(lastIndex, match.index));
    }

    const rawParams = match[1] ?? '';
    const codes = rawParams === '' ? [0] : rawParams.split(';').map((n) => Number(n));

    for (const code of codes) {
      if (Number.isNaN(code)) continue;
      if (code === 0) {
        state = { bold: false, dim: false };
      } else if (code === 1) {
        state = { ...state, bold: true };
      } else if (code === 2) {
        state = { ...state, dim: true };
      } else if (code === 22) {
        state = { ...state, bold: false, dim: false };
      } else if (code >= 30 && code <= 37) {
        state = { ...state, color: (code - 30) as AnsiColor };
      } else if (code === 39) {
        state = { ...state, color: undefined };
      } else if (code >= 90 && code <= 97) {
        state = { ...state, color: (code - 90 + 8) as AnsiColor };
      } else if (code >= 40 && code <= 47) {
        state = { ...state, bg: (code - 40) as AnsiColor };
      } else if (code === 49) {
        state = { ...state, bg: undefined };
      } else if (code >= 100 && code <= 107) {
        state = { ...state, bg: (code - 100 + 8) as AnsiColor };
      }
    }

    lastIndex = SGR_REGEX.lastIndex;
  }

  if (lastIndex < text.length) {
    pushSegment(text.slice(lastIndex));
  }

  return nodes.length === 1 ? nodes[0] : <Fragment>{nodes}</Fragment>;
}

export interface TerminalProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title?: ReactNode;
  lines?: readonly TerminalLine[];
  children?: ReactNode;
  prompt?: ReactNode;
  user?: string;
  host?: string;
  cwd?: string;
  showChrome?: boolean;
  cursor?: 'block' | 'beam' | 'underline' | false;
  typing?: boolean;
  typingSpeed?: number;
  maxHeight?: number | string;
  copyable?: boolean;
}

export function Terminal({
  title = 'ghostty',
  lines,
  children,
  prompt = '❯',
  user,
  host,
  cwd,
  showChrome = true,
  cursor = 'block',
  typing = false,
  typingSpeed = 30,
  maxHeight,
  copyable = false,
  className,
  ref,
  ...rest
}: TerminalProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = typing && !prefersReducedMotion && Boolean(lines?.length);

  const totalChars = useMemo(() => {
    if (!lines) return 0;
    return lines.reduce(
      (sum, line) => sum + (line.type === 'command' ? line.text.length : 0),
      0,
    );
  }, [lines]);

  const [revealedChars, setRevealedChars] = useState<number>(() =>
    shouldAnimate ? 0 : totalChars,
  );

  useEffect(() => {
    if (!shouldAnimate) {
      setRevealedChars(totalChars);
      return;
    }
    setRevealedChars(0);
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      setRevealedChars(current);
      if (current >= totalChars) {
        clearInterval(id);
      }
    }, Math.max(10, typingSpeed));
    return () => clearInterval(id);
  }, [shouldAnimate, totalChars, typingSpeed]);

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const raw = (lines ?? [])
      .map((line) => {
        if (line.type === 'blank') return '';
        if (line.type === 'command') return line.text;
        return typeof line.text === 'string' ? line.text : '';
      })
      .join('\n');
    try {
      await navigator.clipboard?.writeText(raw);
      setCopied(true);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  const renderPrompt = (customPrompt?: ReactNode) => {
    if (customPrompt !== undefined) {
      return <span className="omai-terminal__prompt">{customPrompt}</span>;
    }
    return (
      <span className="omai-terminal__prompt">
        {user || host ? (
          <span className="omai-terminal__userhost">
            {user ?? 'omai'}
            {host ? `@${host}` : ''}
          </span>
        ) : null}
        {cwd ? <span className="omai-terminal__cwd">{cwd}</span> : null}
        <span className="omai-terminal__glyph">{prompt}</span>
      </span>
    );
  };

  let remainingBudget = shouldAnimate ? revealedChars : Infinity;
  let lastCommandLineIdx = -1;
  lines?.forEach((line, idx) => {
    if (line.type === 'command') lastCommandLineIdx = idx;
  });

  return (
    <div ref={ref} className={cn('omai-terminal', className)} {...rest}>
      {showChrome ? (
        <div className="omai-terminal__header">
          <div className="omai-terminal__dots" aria-hidden="true">
            <span className="omai-terminal__dot" />
            <span className="omai-terminal__dot" />
            <span className="omai-terminal__dot" />
          </div>
          <span className="omai-terminal__title">{title}</span>
          {copyable ? (
            <button
              type="button"
              className="omai-terminal__copy"
              aria-label={copied ? 'Copied terminal output' : 'Copy terminal output'}
              data-copied={copied ? '' : undefined}
              onClick={handleCopy}
            >
              {copied ? (
                <Check size={14} strokeWidth={1.75} aria-hidden />
              ) : (
                <Copy size={14} strokeWidth={1.75} aria-hidden />
              )}
            </button>
          ) : (
            <span className="omai-terminal__spacer" aria-hidden="true" />
          )}
        </div>
      ) : null}

      <div
        className="omai-terminal__body"
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        {lines?.map((line, index) => {
          if (line.type === 'blank') {
            if (shouldAnimate && remainingBudget <= 0) return null;
            return <div key={index} className="omai-terminal__line omai-terminal__line--blank" />;
          }

          if (line.type === 'command') {
            if (shouldAnimate && remainingBudget < 0) return null;
            const visibleCount = Math.min(line.text.length, Math.max(0, remainingBudget));
            const shownText = line.text.slice(0, visibleCount);
            const isTypingHere =
              shouldAnimate && remainingBudget >= 0 && remainingBudget < line.text.length;
            remainingBudget -= line.text.length;

            const showCursorHere =
              cursor !== false &&
              (isTypingHere || (!shouldAnimate && index === lastCommandLineIdx && !children));

            return (
              <div key={index} className="omai-terminal__line omai-terminal__line--command">
                {renderPrompt(line.prompt)}
                <span className="omai-terminal__command">{shownText}</span>
                {showCursorHere ? (
                  <span className="omai-terminal__cursor" data-cursor={cursor} aria-hidden="true" />
                ) : null}
              </div>
            );
          }

          // Output line
          if (shouldAnimate && remainingBudget < 0) return null;

          return (
            <div key={index} className="omai-terminal__line omai-terminal__line--output">
              {line.color !== undefined ? (
                <Ansi color={line.color}>
                  {typeof line.text === 'string' ? ansiToReact(line.text) : line.text}
                </Ansi>
              ) : typeof line.text === 'string' ? (
                ansiToReact(line.text)
              ) : (
                line.text
              )}
            </div>
          );
        })}

        {children}

        {cursor !== false && (!lines || lines.length === 0 || (shouldAnimate && revealedChars >= totalChars)) ? (
          <div className="omai-terminal__line omai-terminal__line--command">
            {renderPrompt()}
            <span className="omai-terminal__cursor" data-cursor={cursor} aria-hidden="true" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
