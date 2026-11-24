import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** All tabbable descendants of `container`, in DOM order (skips hidden / inert). */
export function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('inert') && !el.closest('[inert]') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/** Focus the first tabbable element inside `container` (or the container itself). */
export function focusFirst(container: HTMLElement | null): void {
  if (!container) return;
  const [first] = getFocusableElements(container);
  (first ?? container).focus({ preventScroll: true });
}

/** Keep Tab / Shift+Tab cycling inside `container`. Call from a keydown handler. */
export function trapTabKey(event: KeyboardEvent | React.KeyboardEvent, container: HTMLElement | null): void {
  if (event.key !== 'Tab' || !container) return;
  const items = getFocusableElements(container);
  if (items.length === 0) {
    event.preventDefault();
    container.focus();
    return;
  }
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = document.activeElement as HTMLElement | null;
  if (event.shiftKey && (active === first || !container.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !container.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

export interface UseFocusTrapOptions {
  /** Trap is active only while true (e.g. dialog `open`). */
  enabled: boolean;
  /** Element to focus on activation. Defaults to the first tabbable descendant. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Restore focus to the previously focused element on deactivation. Default true. */
  restoreFocus?: boolean;
}

/**
 * Modal focus management for Dialog, Drawer, Walker:
 * focuses on open, traps Tab inside `ref`, restores focus on close.
 * The container should have `tabIndex={-1}` so it can receive focus as a fallback.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, options: UseFocusTrapOptions): void {
  const { enabled, initialFocus, restoreFocus = true } = options;
  const previous = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const container = ref.current;
    previous.current = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => {
      if (initialFocus?.current) initialFocus.current.focus({ preventScroll: true });
      else focusFirst(container);
    });
    const onKeyDown = (e: KeyboardEvent) => trapTabKey(e, ref.current);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      if (restoreFocus && previous.current && document.contains(previous.current)) {
        previous.current.focus({ preventScroll: true });
      }
    };
  }, [enabled, ref, initialFocus, restoreFocus]);
}

/**
 * Roving index helper for listboxes / menus / tabs / radio groups.
 * Returns the next enabled index moving by `delta`, wrapping when `loop` (default true).
 */
export function getNextIndex(
  current: number,
  delta: number,
  length: number,
  options: { loop?: boolean; isDisabled?: (index: number) => boolean } = {},
): number {
  const { loop = true, isDisabled } = options;
  if (length <= 0) return -1;
  let index = current;
  for (let step = 0; step < length; step++) {
    index += delta;
    if (index < 0 || index >= length) {
      if (!loop) return current;
      index = (index + length) % length;
    }
    if (!isDisabled?.(index)) return index;
  }
  return current;
}

/** Map a keyboard event to a roving delta. Returns null for unrelated keys. */
export function getNavigationDelta(
  key: string,
  orientation: 'vertical' | 'horizontal' | 'both' = 'vertical',
): 'first' | 'last' | 1 | -1 | null {
  if (key === 'Home') return 'first';
  if (key === 'End') return 'last';
  const vertical = orientation !== 'horizontal';
  const horizontal = orientation !== 'vertical';
  if ((vertical && key === 'ArrowDown') || (horizontal && key === 'ArrowRight')) return 1;
  if ((vertical && key === 'ArrowUp') || (horizontal && key === 'ArrowLeft')) return -1;
  return null;
}
