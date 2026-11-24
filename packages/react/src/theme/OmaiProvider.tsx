import { useCallback, useMemo, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import {
  DEFAULT_THEME_ID,
  getThemeMeta,
  isThemeId,
  themeMeta,
  type OmaiThemeId,
} from '@jseramn/omai-tokens';
import { cn } from '../utils/cn';
import { useControllableState, useIsomorphicLayoutEffect } from '../utils/hooks';
import {
  OmaiThemeContext,
  type OmaiGaps,
  type OmaiRadius,
  type OmaiThemeContextValue,
  type OmaiThemeTransition,
} from './context';

export interface OmaiProviderProps {
  children?: ReactNode;
  /** Controlled theme id. */
  theme?: OmaiThemeId;
  /** Initial theme when uncontrolled (after localStorage). Default `'tokyo-night'`. */
  defaultTheme?: OmaiThemeId;
  onThemeChange?: (id: OmaiThemeId) => void;
  /** Controlled radius mode. */
  radius?: OmaiRadius;
  /** Default `'sharp'` (omarchy.org). `'soft'` = Hyprland 4/6/8px rounding. */
  defaultRadius?: OmaiRadius;
  onRadiusChange?: (radius: OmaiRadius) => void;
  /** Controlled Hyprland gap mode. */
  gaps?: OmaiGaps;
  /** Default `'default'` (gaps_in 5px / gaps_out 10px). */
  defaultGaps?: OmaiGaps;
  onGapsChange?: (gaps: OmaiGaps) => void;
  /**
   * `'document'` (default): write data attributes on `<html>`; renders no wrapper.
   * `'scope'`: render a `<div>` carrying the attributes, theming only its subtree.
   */
  target?: 'document' | 'scope';
  /** localStorage key for persistence (`key`, `key:radius`, `key:gaps`). `null` disables. Default `'omai-theme'`. */
  storageKey?: string | null;
  /** `'wipe'` = omarchy.org diagonal wipe via View Transitions API (falls back to instant). Default `'none'`. */
  transition?: OmaiThemeTransition;
  /** Wrapper props (only used when `target="scope"`). */
  className?: string;
  style?: CSSProperties;
}

function readStorage(key: string | null): string | null {
  if (!key || typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string | null, value: string): void {
  if (!key || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

const isRadius = (v: unknown): v is OmaiRadius => v === 'sharp' || v === 'soft';
const isGaps = (v: unknown): v is OmaiGaps => v === 'default' || v === 'none' || v === 'wide';

/** Theme root. Wrap your app once (or any subtree with `target="scope"`). */
export function OmaiProvider(props: OmaiProviderProps) {
  const {
    children,
    target = 'document',
    storageKey = 'omai-theme',
    transition = 'none',
    className,
    style,
  } = props;

  const [theme, setThemeState] = useControllableState<OmaiThemeId>({
    value: props.theme,
    defaultValue: (() => {
      const stored = readStorage(storageKey);
      return isThemeId(stored) ? stored : (props.defaultTheme ?? DEFAULT_THEME_ID);
    })(),
    onChange: props.onThemeChange,
  });
  const [radius, setRadiusState] = useControllableState<OmaiRadius>({
    value: props.radius,
    defaultValue: (() => {
      const stored = readStorage(storageKey && `${storageKey}:radius`);
      return isRadius(stored) ? stored : (props.defaultRadius ?? 'sharp');
    })(),
    onChange: props.onRadiusChange,
  });
  const [gaps, setGapsState] = useControllableState<OmaiGaps>({
    value: props.gaps,
    defaultValue: (() => {
      const stored = readStorage(storageKey && `${storageKey}:gaps`);
      return isGaps(stored) ? stored : (props.defaultGaps ?? 'default');
    })(),
    onChange: props.onGapsChange,
  });

  const meta = getThemeMeta(theme);

  const setTheme = useCallback(
    (id: OmaiThemeId) => {
      writeStorage(storageKey, id);
      const apply = () => setThemeState(id);
      const doc = typeof document !== 'undefined' ? (document as Document & { startViewTransition?: (cb: () => void) => unknown }) : null;
      const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (transition === 'wipe' && doc?.startViewTransition && !reduced) {
        document.documentElement.dataset.omaiTransition = 'wipe';
        doc.startViewTransition(() => flushSync(apply));
      } else {
        apply();
      }
    },
    [setThemeState, storageKey, transition],
  );

  const cycleTheme = useCallback(
    (direction: 1 | -1 = 1) => {
      const index = themeMeta.findIndex((t) => t.id === theme);
      const next = themeMeta[(index + direction + themeMeta.length) % themeMeta.length]!;
      setTheme(next.id);
    },
    [theme, setTheme],
  );

  const setRadius = useCallback(
    (r: OmaiRadius) => {
      writeStorage(storageKey && `${storageKey}:radius`, r);
      setRadiusState(r);
    },
    [setRadiusState, storageKey],
  );

  const setGaps = useCallback(
    (g: OmaiGaps) => {
      writeStorage(storageKey && `${storageKey}:gaps`, g);
      setGapsState(g);
    },
    [setGapsState, storageKey],
  );

  useIsomorphicLayoutEffect(() => {
    if (target !== 'document') return;
    const el = document.documentElement;
    el.setAttribute('data-omai-theme', theme);
    el.setAttribute('data-omai-mode', meta.mode);
    el.setAttribute('data-omai-radius', radius);
    el.setAttribute('data-omai-gaps', gaps);
  }, [target, theme, meta.mode, radius, gaps]);

  const value = useMemo<OmaiThemeContextValue>(
    () => ({ theme, mode: meta.mode, meta, themes: themeMeta, setTheme, cycleTheme, radius, setRadius, gaps, setGaps, target }),
    [theme, meta, setTheme, cycleTheme, radius, setRadius, gaps, setGaps, target],
  );

  return (
    <OmaiThemeContext.Provider value={value}>
      {target === 'scope' ? (
        <div
          className={cn('omai-theme-scope', className)}
          style={style}
          data-omai-theme={theme}
          data-omai-mode={meta.mode}
          data-omai-radius={radius}
          data-omai-gaps={gaps}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </OmaiThemeContext.Provider>
  );
}
