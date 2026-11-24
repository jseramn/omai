import type { OmaiTheme } from '../types.js';

/**
 * Rosé Pine — warm midnight aesthetic with soft pine, gold, and foam accents.
 * Anchors: `meta.ts` (`#191724` / `#1f1d2e` / `#e0def4` / `#9ccfd8`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Rosé Pine dark).
 */
export const rosePine: OmaiTheme = {
  id: 'rose-pine',
  name: 'Rosé Pine',
  mode: 'dark',
  colors: {
    bgDeep: '#12101b',
    bg: '#191724',
    surface: '#1f1d2e',
    surface2: '#26233a',
    borderSubtle: '#26233a',
    borderStrong: '#524f67',
    text: '#e0def4',
    textSecondary: '#c4c0dc',
    textMuted: '#908caa',
    brand: '#9ccfd8',
    brandInk: '#12101b',
    selection: '#403d52',
    success: '#31748f',
    warning: '#f6c177',
    danger: '#eb6f92',
    info: '#9ccfd8',
    ansi: [
      '#26233a', '#eb6f92', '#31748f', '#f6c177', '#9ccfd8', '#c4a7e7', '#ebbcba', '#e0def4',
      '#6e6a86', '#eb6f92', '#31748f', '#f6c177', '#9ccfd8', '#c4a7e7', '#ebbcba', '#e0def4',
    ],
  },
};
