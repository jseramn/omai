import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Ref,
  type RefCallback,
  type RefObject,
} from 'react';

/** useLayoutEffect on the client, useEffect on the server (no SSR warning). */
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Controlled/uncontrolled state in one hook (the standard `value` / `defaultValue` / `onChange` triple).
 *
 *   const [open, setOpen] = useControllableState({ value: props.open, defaultValue: props.defaultOpen ?? false, onChange: props.onOpenChange });
 */
export function useControllableState<T>(params: {
  value: T | undefined;
  defaultValue: T;
  onChange?: ((value: T) => void) | undefined;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { value, defaultValue, onChange } = params;
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : internal;
  const currentRef = useRef(current);
  currentRef.current = current;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(currentRef.current) : next;
      if (Object.is(resolved, currentRef.current)) return;
      if (!controlled) setInternal(resolved);
      onChangeRef.current?.(resolved);
    },
    [controlled],
  );

  return [current, setValue];
}

/** Call `handler` on Escape while `enabled`. */
export function useEscapeKey(handler: (event: KeyboardEvent) => void, enabled = true): void {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ref.current(e);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}

/** Call `handler` on pointerdown outside every element in `refs` while `enabled`. */
export function useOnClickOutside(
  refs: ReadonlyArray<RefObject<HTMLElement | null>>,
  handler: (event: PointerEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;
  const refsRef = useRef(refs);
  refsRef.current = refs;
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (refsRef.current.some((r) => r.current && target && r.current.contains(target))) return;
      handlerRef.current(e);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [enabled]);
}

/** Lock <body> scroll while `enabled` (Dialog, Drawer, Walker). Ref-counted for nesting. */
let scrollLocks = 0;
let previousOverflow = '';
export function useScrollLock(enabled: boolean): void {
  useIsomorphicLayoutEffect(() => {
    if (!enabled) return;
    if (scrollLocks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
    };
  }, [enabled]);
}

/** Merge several refs (object or callback) into one callback ref. */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}

/** Respect `prefers-reduced-motion` (PixelField, Toast, wipe transition). */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}
