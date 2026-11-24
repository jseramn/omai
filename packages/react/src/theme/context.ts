import { createContext } from 'react';
import type { OmaiMode, OmaiThemeId, OmaiThemeMeta } from '@jseramn/omai-tokens';

export type OmaiRadius = 'sharp' | 'soft';
export type OmaiGaps = 'default' | 'none' | 'wide';
export type OmaiThemeTransition = 'none' | 'wipe';

export interface OmaiThemeContextValue {
  /** Active theme id (value of `data-omai-theme`). */
  theme: OmaiThemeId;
  /** `dark` | `light`, derived from the theme (value of `data-omai-mode`). */
  mode: OmaiMode;
  /** Metadata for the active theme (name, swatch). */
  meta: OmaiThemeMeta;
  /** All 16 official themes, in display order. */
  themes: readonly OmaiThemeMeta[];
  setTheme: (id: OmaiThemeId) => void;
  /** Step through `themes` (1 = next, -1 = previous), wrapping. Bound to Super+Ctrl+T in demos. */
  cycleTheme: (direction?: 1 | -1) => void;
  radius: OmaiRadius;
  setRadius: (radius: OmaiRadius) => void;
  gaps: OmaiGaps;
  setGaps: (gaps: OmaiGaps) => void;
  /** Where attributes are written: the <html> element or a scoped wrapper <div>. */
  target: 'document' | 'scope';
}

export const OmaiThemeContext = createContext<OmaiThemeContextValue | null>(null);
OmaiThemeContext.displayName = 'OmaiThemeContext';
