import type { OmaiTheme } from '../types.js';

/**
 * Hackerman — high-contrast neon phosphor terminal green on deep void.
 * Anchors: omarchy.org/themes (`#0b0c16` / `#10121f` / `#ddf7ff` / `#82fb9c`).
 */
export const hackerman: OmaiTheme = {
  id: 'hackerman',
  name: 'Hackerman',
  mode: 'dark',
  colors: {
    bgDeep: '#06070d',
    bg: '#0b0c16',
    surface: '#10121f',
    surface2: '#171a2d',
    borderSubtle: '#1d2138',
    borderStrong: '#343c5e',
    text: '#ddf7ff',
    textSecondary: '#a8d4e6',
    textMuted: '#7c9bb0',
    brand: '#82fb9c',
    brandInk: '#06070d',
    selection: '#1f2c3f',
    success: '#82fb9c',
    warning: '#f5e050',
    danger: '#ff5572',
    info: '#50d8ff',
    ansi: [
      '#10121f', '#ff5572', '#82fb9c', '#f5e050', '#50d8ff', '#c77dff', '#4df0ff', '#a8d4e6',
      '#343c5e', '#ff758f', '#9effb3', '#fff07c', '#7ee4ff', '#d99eff', '#80f5ff', '#ddf7ff',
    ],
  },
};
