import type { OmaiTheme } from '../types.js';

/**
 * Rosé Pine Dawn — warm paper light theme with violet ink and dusty foam accents.
 * Anchors: omarchy.org/themes (`#faf4ed` / `#fffaf3` / `#575279` / `#56949f`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Rosé Pine Dawn).
 */
export const rosePineDawn: OmaiTheme = {
  id: 'rose-pine-dawn',
  name: 'Rosé Pine Dawn',
  mode: 'light',
  colors: {
    bgDeep: '#f2e9e1',
    bg: '#faf4ed',
    surface: '#fffaf3',
    surface2: '#f2e9e1',
    borderSubtle: '#dfdad9',
    borderStrong: '#cecacd',
    text: '#575279',
    textSecondary: '#676285',
    textMuted: '#6e6a86',
    brand: '#56949f',
    brandInk: '#0f0d17',
    selection: '#dfdad9',
    success: '#286983',
    warning: '#ea9d34',
    danger: '#b4637a',
    info: '#56949f',
    ansi: [
      '#f2e9e1', '#b4637a', '#286983', '#ea9d34', '#56949f', '#907aa9', '#d7827e', '#575279',
      '#9893a5', '#b4637a', '#286983', '#ea9d34', '#56949f', '#907aa9', '#d7827e', '#575279',
    ],
  },
};
