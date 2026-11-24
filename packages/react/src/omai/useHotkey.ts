import { useEffect, useRef, type RefObject } from 'react';

export interface UseHotkeyOptions {
  enabled?: boolean;
  preventDefault?: boolean;
  target?: 'document' | RefObject<HTMLElement | null>;
  ignoreInputs?: boolean;
}

interface ParsedCombo {
  key: string;
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
  shiftExplicit: boolean;
}

const KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  return: 'enter',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  del: 'delete',
};

function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '');
}

function parseCombo(raw: string): ParsedCombo | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Handle single '+' key vs 'mod+plus'
  const parts = trimmed === '+' ? ['+'] : trimmed.toLowerCase().split('+').filter(Boolean);
  if (parts.length === 0) return null;

  let ctrl = false;
  let meta = false;
  let alt = false;
  let shift = false;
  let shiftExplicit = false;
  let key = '';
  const apple = isApplePlatform();

  for (const part of parts) {
    if (part === 'mod' || part === 'cmdorctrl') {
      if (apple) meta = true;
      else ctrl = true;
    } else if (part === 'ctrl' || part === 'control') {
      ctrl = true;
    } else if (part === 'meta' || part === 'cmd' || part === 'command' || part === 'super') {
      meta = true;
    } else if (part === 'alt' || part === 'option') {
      alt = true;
    } else if (part === 'shift') {
      shift = true;
      shiftExplicit = true;
    } else {
      key = KEY_ALIASES[part] ?? part;
    }
  }

  if (!key) return null;
  return { key, ctrl, meta, alt, shift, shiftExplicit };
}

function matchesCombo(event: KeyboardEvent, combo: ParsedCombo): boolean {
  const eventKey = event.key.toLowerCase();
  if (eventKey !== combo.key) return false;
  if (event.ctrlKey !== combo.ctrl) return false;
  if (event.metaKey !== combo.meta) return false;
  if (event.altKey !== combo.alt) return false;

  // Allow shifted punctuation like '?' when shift wasn't explicitly specified
  const isNonAlphaPunctuation = combo.key.length === 1 && !/[a-z0-9]/.test(combo.key);
  if (combo.shiftExplicit || !isNonAlphaPunctuation) {
    if (event.shiftKey !== combo.shift) return false;
  }

  return true;
}

function isInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  return target.isContentEditable;
}

export function useHotkey(
  combo: string | readonly string[],
  handler: (e: KeyboardEvent) => void,
  options: UseHotkeyOptions = {},
): void {
  const {
    enabled = true,
    preventDefault = true,
    target = 'document',
    ignoreInputs = true,
  } = options;

  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const comboKey = Array.isArray(combo) ? combo.join('|') : combo;

  useEffect(() => {
    if (!enabled) return;
    const rawList = Array.isArray(combo) ? combo : [combo];
    const parsed = rawList.map(parseCombo).filter((c): c is ParsedCombo => c !== null);
    if (parsed.length === 0) return;

    const targetNode: EventTarget | null =
      target === 'document' ? (typeof document !== 'undefined' ? document : null) : target.current;
    if (!targetNode) return;

    const onKeyDown = (event: Event) => {
      const kbEvent = event as KeyboardEvent;
      if (ignoreInputs && isInputTarget(kbEvent.target)) return;
      if (parsed.some((c) => matchesCombo(kbEvent, c))) {
        if (preventDefault) kbEvent.preventDefault();
        handlerRef.current(kbEvent);
      }
    };

    targetNode.addEventListener('keydown', onKeyDown);
    return () => targetNode.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, preventDefault, ignoreInputs, target, comboKey]);
}
