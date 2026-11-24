import type { OmaiTheme } from '../types.js';

/**
 * Kanagawa — poetic woodblock print palette (SumiInk & FujiWhite).
 * Anchors: omarchy.org/themes (`#1f1f28` / `#202838` / `#dcd7ba` / `#dcd7ba`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Kanagawa Wave).
 */
export const kanagawa: OmaiTheme = {
  id: 'kanagawa',
  name: 'Kanagawa',
  mode: 'dark',
  colors: {
    bgDeep: '#16161d',
    bg: '#1f1f28',
    surface: '#202838',
    surface2: '#2a2a37',
    borderSubtle: '#2a2a37',
    borderStrong: '#54546d',
    text: '#dcd7ba',
    textSecondary: '#c8c093',
    textMuted: '#9a9685',
    brand: '#dcd7ba',
    brandInk: '#16161d',
    selection: '#363646',
    success: '#98bb6c',
    warning: '#e6c384',
    danger: '#e46876',
    info: '#7e9cd8',
    ansi: [
      '#090618', '#c34043', '#76946a', '#c0a36e', '#7e9cd8', '#957fb8', '#6a9589', '#c8c093',
      '#727169', '#e82424', '#98bb6c', '#e6c384', '#7fb4ca', '#938aa9', '#7aa89f', '#dcd7ba',
    ],
  },
};
