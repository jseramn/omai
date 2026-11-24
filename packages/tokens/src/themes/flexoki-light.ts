import type { OmaiTheme } from '../types.js';

/**
 * Flexoki Light — inky paper-inspired typographic light theme.
 * Anchors: omarchy.org/themes (`#fffcf0` / `#f9f6ea` / `#100f0f` / `#205ea6`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Flexoki Light).
 */
export const flexokiLight: OmaiTheme = {
  id: 'flexoki-light',
  name: 'Flexoki Light',
  mode: 'light',
  colors: {
    bgDeep: '#f2f0e5',
    bg: '#fffcf0',
    surface: '#f9f6ea',
    surface2: '#e6e4d9',
    borderSubtle: '#e6e4d9',
    borderStrong: '#b7b5ac',
    text: '#100f0f',
    textSecondary: '#403e3c',
    textMuted: '#6f6e69',
    brand: '#205ea6',
    brandInk: '#fffcf0',
    selection: '#e6e4d9',
    success: '#66800b',
    warning: '#ad8301',
    danger: '#af3029',
    info: '#205ea6',
    ansi: [
      '#100f0f', '#af3029', '#66800b', '#ad8301', '#205ea6', '#a02f6f', '#24837b', '#e6e4d9',
      '#575653', '#d14d41', '#879a39', '#d0a215', '#4385be', '#ce5d97', '#3aa99f', '#fffcf0',
    ],
  },
};
