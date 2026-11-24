import type { OmaiTheme } from '../types.js';

/**
 * Catppuccin (Mocha) — warm pastel dark theme.
 * Anchors: omarchy.org/themes (`#1e1e2e` / `#282839` / `#cdd6f4` / `#89b4fa`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Catppuccin Mocha).
 */
export const catppuccin: OmaiTheme = {
  id: 'catppuccin',
  name: 'Catppuccin',
  mode: 'dark',
  colors: {
    bgDeep: '#181825',
    bg: '#1e1e2e',
    surface: '#282839',
    surface2: '#313244',
    borderSubtle: '#313244',
    borderStrong: '#585b70',
    text: '#cdd6f4',
    textSecondary: '#bac2de',
    textMuted: '#9399b2',
    brand: '#89b4fa',
    brandInk: '#11111b',
    selection: '#45475a',
    success: '#a6e3a1',
    warning: '#f9e2af',
    danger: '#f38ba8',
    info: '#89b4fa',
    ansi: [
      '#45475a', '#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#f5c2e7', '#94e2d5', '#bac2de',
      '#585b70', '#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#f5c2e7', '#94e2d5', '#cdd6f4',
    ],
  },
};
