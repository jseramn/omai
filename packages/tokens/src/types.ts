/**
 * @jseramn/omai-tokens — type contracts.
 *
 * Every theme is authored as an `OmaiTheme` object (source of truth).
 * `scripts/build-css.mjs` turns the registry into `dist/themes.css` using `css.ts`.
 * Property names are camelCase and map 1:1 to `--omai-<kebab-case>` CSS variables
 * (e.g. `surface2` -> `--omai-surface-2`, `textMuted` -> `--omai-text-muted`).
 */

import type { OmaiThemeId } from './meta.js';

export type OmaiMode = 'dark' | 'light';

/** Any valid CSS <color> string. Hex (`#rrggbb` / `#rrggbbaa`) preferred for authored palettes. */
export type CssColor = string;

/** ANSI 16-color terminal palette, index 0..15 (`color0`..`color15` in Omarchy `colors.toml`). */
export type AnsiPalette = readonly [
  CssColor, CssColor, CssColor, CssColor, CssColor, CssColor, CssColor, CssColor,
  CssColor, CssColor, CssColor, CssColor, CssColor, CssColor, CssColor, CssColor,
];

/** Hero pixel-field ramp (`--omai-field-*`). */
export interface PixelFieldRamp {
  bg: CssColor;
  dim: CssColor;
  mid: CssColor;
  lit: CssColor;
  hover: CssColor;
  crest: CssColor;
}

/** REQUIRED per-theme colors. Each maps to one `--omai-*` variable. */
export interface OmaiThemeColors {
  /** --omai-bg-deep: deepest surface (odd sections, <pre> blocks, Waybar backdrop). */
  bgDeep: CssColor;
  /** --omai-bg: page/app canvas. */
  bg: CssColor;
  /** --omai-surface: cards, secondary buttons, table headers, inputs. */
  surface: CssColor;
  /** --omai-surface-2: hover surfaces, inline code / kbd, active rows. */
  surface2: CssColor;
  /** --omai-border-subtle: dividers, card outlines. */
  borderSubtle: CssColor;
  /** --omai-border-strong: interactive control borders, inactive Hyprland borders. */
  borderStrong: CssColor;
  /** --omai-text: primary text. */
  text: CssColor;
  /** --omai-text-secondary: prose / secondary text. */
  textSecondary: CssColor;
  /** --omai-text-muted: captions, placeholders, disabled. Must reach >= 4.5:1 on --omai-bg where possible. */
  textMuted: CssColor;
  /** --omai-brand: primary accent (buttons, focus ring, active pane border, lit pixels). */
  brand: CssColor;
  /** --omai-brand-ink: text/icon color placed ON --omai-brand (primary button label). */
  brandInk: CssColor;
  /** --omai-selection: text selection + selected row/item background. */
  selection: CssColor;
  /** --omai-success (usually ANSI green). */
  success: CssColor;
  /** --omai-warning (usually ANSI yellow). */
  warning: CssColor;
  /** --omai-danger (usually ANSI red). */
  danger: CssColor;
  /** --omai-info (usually ANSI blue). */
  info: CssColor;
  /** --omai-ansi-0 .. --omai-ansi-15 */
  ansi: AnsiPalette;
}

/**
 * OPTIONAL overrides. When omitted, `css.ts` derives them from the required colors + mode
 * (see `deriveDefaults`). Only author these when the derived value is visibly wrong.
 */
export interface OmaiThemeOverrides {
  brandSoft?: CssColor;
  brandHover?: CssColor;
  successSoft?: CssColor;
  warningSoft?: CssColor;
  dangerSoft?: CssColor;
  infoSoft?: CssColor;
  focusRing?: CssColor;
  cursor?: CssColor;
  scrollThumb?: CssColor;
  imgOutline?: CssColor;
  /** box-shadow value */
  elevation?: string;
  /** box-shadow value */
  elevationHover?: string;
  /** box-shadow value for floating overlays (dialog, popover, walker, toast) */
  elevationOverlay?: string;
  /** --omai-backdrop: modal scrim color */
  backdrop?: CssColor;
  field?: Partial<PixelFieldRamp>;
}

export interface OmaiTheme {
  id: OmaiThemeId;
  /** Human display name, e.g. "Tokyo Night", "Rosé Pine Dawn". */
  name: string;
  mode: OmaiMode;
  colors: OmaiThemeColors;
  overrides?: OmaiThemeOverrides;
}
