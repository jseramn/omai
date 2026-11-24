/**
 * Theme -> CSS custom properties generator. Used at build time (dist/themes.css) and
 * available at runtime (e.g. inject a custom theme via inline style).
 *
 * IMPORTANT CASCADE RULE: any variable whose value references another color variable
 * (color-mix(..var(--omai-brand)..)) is emitted INSIDE every theme block, never on a bare
 * :root, so scoped `[data-omai-theme]` containers recompute it correctly.
 */

import type { OmaiTheme, OmaiThemeColors, OmaiThemeOverrides, PixelFieldRamp } from './types.js';
import { DEFAULT_THEME_ID } from './meta.js';

const COLOR_VAR: Record<Exclude<keyof OmaiThemeColors, 'ansi'>, string> = {
  bgDeep: '--omai-bg-deep',
  bg: '--omai-bg',
  surface: '--omai-surface',
  surface2: '--omai-surface-2',
  borderSubtle: '--omai-border-subtle',
  borderStrong: '--omai-border-strong',
  text: '--omai-text',
  textSecondary: '--omai-text-secondary',
  textMuted: '--omai-text-muted',
  brand: '--omai-brand',
  brandInk: '--omai-brand-ink',
  selection: '--omai-selection',
  success: '--omai-success',
  warning: '--omai-warning',
  danger: '--omai-danger',
  info: '--omai-info',
};

const OVERRIDE_VAR: Record<Exclude<keyof OmaiThemeOverrides, 'field'>, string> = {
  brandSoft: '--omai-brand-soft',
  brandHover: '--omai-brand-hover',
  successSoft: '--omai-success-soft',
  warningSoft: '--omai-warning-soft',
  dangerSoft: '--omai-danger-soft',
  infoSoft: '--omai-info-soft',
  focusRing: '--omai-focus-ring',
  cursor: '--omai-cursor',
  scrollThumb: '--omai-scroll-thumb',
  imgOutline: '--omai-img-outline',
  elevation: '--omai-elevation',
  elevationHover: '--omai-elevation-hover',
  elevationOverlay: '--omai-elevation-overlay',
  backdrop: '--omai-backdrop',
};

const FIELD_KEYS: readonly (keyof PixelFieldRamp)[] = ['bg', 'dim', 'mid', 'lit', 'hover', 'crest'];

/** Mode-aware defaults for every optional token. */
export function deriveDefaults(theme: OmaiTheme): Required<Omit<OmaiThemeOverrides, 'field'>> & { field: PixelFieldRamp } {
  const dark = theme.mode === 'dark';
  const soft = (v: string, pct: number) => `color-mix(in oklch, var(${v}) ${pct}%, transparent)`;
  return {
    brandSoft: soft('--omai-brand', 12),
    brandHover: dark
      ? 'color-mix(in oklch, var(--omai-brand), white 14%)'
      : 'color-mix(in oklch, var(--omai-brand), black 10%)',
    successSoft: soft('--omai-success', 14),
    warningSoft: soft('--omai-warning', 14),
    dangerSoft: soft('--omai-danger', 14),
    infoSoft: soft('--omai-info', 14),
    focusRing: 'var(--omai-brand)',
    cursor: 'var(--omai-text)',
    scrollThumb: dark ? '#ffffff24' : '#0000001f',
    imgOutline: dark ? '#ffffff1a' : '#0000001a',
    elevation: dark
      ? '0 0 0 1px oklch(100% 0 0 / .07)'
      : '0 0 0 1px oklch(0% 0 0 / .06), 0 1px 3px oklch(0% 0 0 / .05), 0 4px 10px -4px oklch(0% 0 0 / .05)',
    elevationHover: dark
      ? '0 0 0 1px oklch(100% 0 0 / .13)'
      : '0 0 0 1px oklch(0% 0 0 / .1), 0 2px 6px oklch(0% 0 0 / .07), 0 8px 16px -6px oklch(0% 0 0 / .08)',
    elevationOverlay: dark
      ? '0 0 0 1px oklch(100% 0 0 / .1), 0 16px 48px -12px oklch(0% 0 0 / .7)'
      : '0 0 0 1px oklch(0% 0 0 / .08), 0 16px 48px -12px oklch(0% 0 0 / .25)',
    backdrop: dark ? 'oklch(0% 0 0 / .6)' : 'oklch(0% 0 0 / .3)',
    field: dark
      ? {
          bg: 'color-mix(in oklch, var(--omai-bg-deep), black 30%)',
          dim: 'color-mix(in oklch, var(--omai-brand) 30%, var(--omai-field-bg))',
          mid: 'color-mix(in oklch, var(--omai-brand) 62%, var(--omai-field-bg))',
          lit: 'var(--omai-brand)',
          hover: 'color-mix(in oklch, var(--omai-brand), white 35%)',
          crest: 'color-mix(in oklch, var(--omai-brand), white 65%)',
        }
      : {
          bg: 'color-mix(in oklch, var(--omai-bg-deep), black 4%)',
          dim: 'color-mix(in oklch, var(--omai-brand) 18%, var(--omai-field-bg))',
          mid: 'color-mix(in oklch, var(--omai-brand) 50%, var(--omai-field-bg))',
          lit: 'var(--omai-brand)',
          hover: 'color-mix(in oklch, var(--omai-brand), black 20%)',
          crest: 'color-mix(in oklch, var(--omai-brand), black 40%)',
        },
  };
}

/** Flat map of every `--omai-*` color variable for a theme (plus `color-scheme`). */
export function themeToCssVars(theme: OmaiTheme): Record<string, string> {
  const vars: Record<string, string> = { 'color-scheme': theme.mode };
  for (const [key, name] of Object.entries(COLOR_VAR) as [keyof typeof COLOR_VAR, string][]) {
    vars[name] = theme.colors[key];
  }
  theme.colors.ansi.forEach((c, i) => {
    vars[`--omai-ansi-${i}`] = c;
  });
  const defaults = deriveDefaults(theme);
  const overrides = theme.overrides ?? {};
  for (const [key, name] of Object.entries(OVERRIDE_VAR) as [keyof typeof OVERRIDE_VAR, string][]) {
    vars[name] = overrides[key] ?? defaults[key];
  }
  for (const k of FIELD_KEYS) {
    vars[`--omai-field-${k}`] = overrides.field?.[k] ?? defaults.field[k];
  }
  return vars;
}

export function themeSelector(theme: OmaiTheme, defaultThemeId = DEFAULT_THEME_ID): string {
  const attr = `[data-omai-theme="${theme.id}"]`;
  return theme.id === defaultThemeId ? `:root, ${attr}` : attr;
}

export function themeToCss(theme: OmaiTheme, selector = themeSelector(theme)): string {
  const body = Object.entries(themeToCssVars(theme))
    .map(([k, v]) => `    ${k}: ${v};`)
    .join('\n');
  return `  ${selector} {\n${body}\n  }`;
}

/** Full `themes.css` contents. The default theme is emitted first so later selectors win. */
export function buildThemesCss(themes: readonly OmaiTheme[], defaultThemeId = DEFAULT_THEME_ID): string {
  const ordered = [...themes].sort((a, b) => Number(b.id === defaultThemeId) - Number(a.id === defaultThemeId));
  const blocks = ordered.map((t) => `  /* ${t.name} (${t.mode}) */\n${themeToCss(t, themeSelector(t, defaultThemeId))}`);
  return [
    '/* @jseramn/omai-tokens/themes.css - GENERATED by scripts/build-css.mjs. Do not edit. */',
    '@layer theme, base, components, utilities;',
    '@layer theme {',
    blocks.join('\n\n'),
    '}',
    '',
  ].join('\n');
}
