import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME_ID,
  buildThemesCss,
  getTheme,
  themeIds,
  themeMeta,
  themeToCssVars,
  themes,
} from './index.js';

const HEX = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/i;

function relativeLuminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

describe('theme registry', () => {
  it('registers all 16 official themes with unique, known ids', () => {
    const ids = themes.map((t) => t.id);
    expect(themes).toHaveLength(16);
    expect(new Set(ids).size).toBe(16);
    expect([...ids].sort()).toEqual([...themeIds].sort());
    for (const id of themeIds) {
      expect(getTheme(id)?.id).toBe(id);
    }
  });

  it('meta covers all 16 ids with matching names, modes, and swatches', () => {
    expect(themeMeta.map((m) => m.id).sort()).toEqual([...themeIds].sort());
    for (const theme of themes) {
      const meta = themeMeta.find((m) => m.id === theme.id);
      expect(meta).toBeDefined();
      expect(meta?.name).toBe(theme.name);
      expect(meta?.mode).toBe(theme.mode);
      expect(meta?.swatch).toEqual({
        bg: theme.colors.bg,
        surface: theme.colors.surface,
        text: theme.colors.text,
        brand: theme.colors.brand,
      });
    }
  });

  it.each(themes.map((t) => [t.id, t] as const))(
    '%s: colors are valid hex strings and ansi has 16 entries',
    (_id, theme) => {
      const { ansi, ...rest } = theme.colors;
      for (const value of Object.values(rest)) {
        expect(value).toMatch(HEX);
      }
      expect(ansi).toHaveLength(16);
      for (const value of ansi) {
        expect(value).toMatch(HEX);
      }
    },
  );

  it.each(themes.map((t) => [t.id, t] as const))(
    '%s: satisfies WCAG contrast targets',
    (_id, theme) => {
      const { bg, surface, text, textSecondary, textMuted, brand, brandInk } = theme.colors;
      expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(text, surface)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(textSecondary, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(textMuted, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(brandInk, brand)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it('emits every --omai-* color variable for every theme', () => {
    for (const theme of themes) {
      const vars = themeToCssVars(theme);
      expect(vars['color-scheme']).toBe(theme.mode);
      for (const name of [
        '--omai-bg-deep',
        '--omai-bg',
        '--omai-surface',
        '--omai-brand-soft',
        '--omai-brand-hover',
        '--omai-field-crest',
        '--omai-ansi-0',
        '--omai-ansi-15',
        '--omai-elevation-overlay',
      ]) {
        expect(vars[name]).toBeTruthy();
      }
    }
  });

  it('builds themes.css with scoped blocks, color-scheme, and derived tokens inside every theme block', () => {
    const css = buildThemesCss(themes);

    // Default theme leads and attaches to :root as fallback.
    expect(css).toContain(`:root, [data-omai-theme="${DEFAULT_THEME_ID}"] {`);

    // No separate bare `:root {` block leaking derived tokens outside the default theme selector.
    expect(css).not.toMatch(/(^|\n)\s*:root\s*\{/);

    for (const theme of themes) {
      const selector =
        theme.id === DEFAULT_THEME_ID
          ? `:root, [data-omai-theme="${theme.id}"]`
          : `[data-omai-theme="${theme.id}"]`;
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = css.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`));
      expect(match, `missing CSS block for ${theme.id}`).toBeTruthy();
      const block = match![1]!;
      expect(block).toContain(`color-scheme: ${theme.mode};`);
      expect(block).toContain(`--omai-bg: ${theme.colors.bg};`);
      expect(block).toContain(`--omai-brand: ${theme.colors.brand};`);
      expect(block).toContain('--omai-brand-hover:');
      expect(block).toContain('--omai-brand-soft:');
      expect(block).toContain('--omai-field-crest:');
      expect(block).toContain('--omai-elevation-overlay:');
    }
  });
});
