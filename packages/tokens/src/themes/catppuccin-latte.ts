import type { OmaiTheme } from '../types.js';

/**
 * Catppuccin Latte — clean daylight pastel light theme.
 * Anchors: omarchy.org/themes (`#eff1f5` / `#f8f9fb` / `#4c4f69` / `#1e66f5`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Catppuccin Latte).
 */
export const catppuccinLatte: OmaiTheme = {
  id: 'catppuccin-latte',
  name: 'Catppuccin Latte',
  mode: 'light',
  colors: {
    bgDeep: '#e6e9ef',
    bg: '#eff1f5',
    surface: '#f8f9fb',
    surface2: '#dce0e8',
    borderSubtle: '#dce0e8',
    borderStrong: '#acb0be',
    text: '#4c4f69',
    textSecondary: '#5c5f77',
    textMuted: '#66697e',
    brand: '#1e66f5',
    brandInk: '#ffffff',
    selection: '#ccd0da',
    success: '#40a02b',
    warning: '#df8e1d',
    danger: '#d20f39',
    info: '#1e66f5',
    ansi: [
      '#5c5f77', '#d20f39', '#40a02b', '#df8e1d', '#1e66f5', '#ea76cb', '#179299', '#acb0be',
      '#6c6f85', '#d20f39', '#40a02b', '#df8e1d', '#1e66f5', '#ea76cb', '#179299', '#bcc0cc',
    ],
  },
};
