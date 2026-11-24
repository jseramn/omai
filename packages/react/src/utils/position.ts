import { useCallback, useEffect, useState, type RefObject } from 'react';
import type { Align, Side } from '../types';
import { useIsomorphicLayoutEffect } from './hooks';

export interface RectLike {
  top: number;
  left: number;
  right?: number;
  bottom?: number;
  width: number;
  height: number;
}

export interface SizeLike {
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  side?: Side;
  align?: Align;
  offset?: number;
  viewport?: SizeLike;
  padding?: number;
}

export interface ComputedPosition {
  top: number;
  left: number;
  side: Side;
  align: Align;
}

const OPPOSITE_SIDE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

function getSideCoords(
  anchor: { top: number; left: number; right: number; bottom: number; width: number; height: number },
  floating: SizeLike,
  side: Side,
  align: Align,
  offset: number,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  if (side === 'top') {
    top = anchor.top - floating.height - offset;
  } else if (side === 'bottom') {
    top = anchor.bottom + offset;
  } else if (side === 'left') {
    left = anchor.left - floating.width - offset;
  } else {
    left = anchor.right + offset;
  }

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') left = anchor.left;
    else if (align === 'end') left = anchor.right - floating.width;
    else left = anchor.left + (anchor.width - floating.width) / 2;
  } else {
    if (align === 'start') top = anchor.top;
    else if (align === 'end') top = anchor.bottom - floating.height;
    else top = anchor.top + (anchor.height - floating.height) / 2;
  }

  return { top, left };
}

/**
 * Pure floating position calculator with automatic viewport collision flip.
 */
export function computePosition(
  anchorRect: RectLike,
  floatingSize: SizeLike,
  options: ComputePositionOptions = {},
): ComputedPosition {
  const {
    side: preferredSide = 'bottom',
    align = 'start',
    offset = 6,
    viewport = typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 0, height: 0 },
    padding = 8,
  } = options;

  const anchor = {
    top: anchorRect.top,
    left: anchorRect.left,
    width: anchorRect.width,
    height: anchorRect.height,
    right: anchorRect.right ?? anchorRect.left + anchorRect.width,
    bottom: anchorRect.bottom ?? anchorRect.top + anchorRect.height,
  };

  let side = preferredSide;
  let coords = getSideCoords(anchor, floatingSize, side, align, offset);

  const hasViewport = viewport.width > 0 && viewport.height > 0 && (floatingSize.width > 0 || floatingSize.height > 0);
  if (hasViewport) {
    const overflows =
      (side === 'top' && coords.top < padding && viewport.height - anchor.bottom > anchor.top) ||
      (side === 'bottom' &&
        coords.top + floatingSize.height > viewport.height - padding &&
        anchor.top > viewport.height - anchor.bottom) ||
      (side === 'left' && coords.left < padding && viewport.width - anchor.right > anchor.left) ||
      (side === 'right' &&
        coords.left + floatingSize.width > viewport.width - padding &&
        anchor.left > viewport.width - anchor.right);

    if (overflows) {
      side = OPPOSITE_SIDE[side];
      coords = getSideCoords(anchor, floatingSize, side, align, offset);
    }

    const maxLeft = Math.max(padding, viewport.width - floatingSize.width - padding);
    const maxTop = Math.max(padding, viewport.height - floatingSize.height - padding);
    coords.left = Math.min(Math.max(coords.left, padding), maxLeft);
    coords.top = Math.min(Math.max(coords.top, padding), maxTop);
  }

  return {
    top: Math.round(coords.top),
    left: Math.round(coords.left),
    side,
    align,
  };
}

export interface UseFloatingPositionOptions {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  side?: Side;
  align?: Align;
  offset?: number;
}

export function useFloatingPosition(options: UseFloatingPositionOptions): ComputedPosition & {
  ready: boolean;
  update: () => void;
} {
  const { open, anchorRef, floatingRef, side = 'bottom', align = 'start', offset = 6 } = options;
  const [state, setState] = useState<ComputedPosition & { ready: boolean }>({
    top: 0,
    left: 0,
    side,
    align,
    ready: false,
  });

  const update = useCallback(() => {
    const anchorEl = anchorRef.current;
    const floatingEl = floatingRef.current;
    if (!anchorEl) return;
    const anchorRect = anchorEl.getBoundingClientRect();
    const floatingRect = floatingEl?.getBoundingClientRect() ?? { width: 0, height: 0 };
    const next = computePosition(
      anchorRect,
      { width: floatingRect.width, height: floatingRect.height },
      { side, align, offset },
    );
    setState({ ...next, ready: true });
  }, [anchorRef, floatingRef, side, align, offset]);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setState((prev) => (prev.ready ? { ...prev, ready: false } : prev));
      return;
    }
    update();
  }, [open, update]);

  useEffect(() => {
    if (!open || typeof window === 'undefined') return;
    const onUpdate = () => update();
    window.addEventListener('resize', onUpdate);
    window.addEventListener('scroll', onUpdate, true);
    return () => {
      window.removeEventListener('resize', onUpdate);
      window.removeEventListener('scroll', onUpdate, true);
    };
  }, [open, update]);

  return { ...state, update };
}
