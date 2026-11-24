import type { OmaiTheme } from '../types.js';

/**
 * Matte Black — stealth monochrome dark theme with amber-orange accent.
 * Anchors: omarchy.org/themes (`#121212` / `#181818` / `#eaeaea` / `#e68e0d`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Matte Black).
 */
export const matteBlack: OmaiTheme = {
  id: 'matte-black',
  name: 'Matte Black',
  mode: 'dark',
  colors: {
    bgDeep: '#0a0a0a',
    bg: '#121212',
    surface: '#181818',
    surface2: '#222222',
    borderSubtle: '#262626',
    borderStrong: '#444444',
    text: '#eaeaea',
    textSecondary: '#b8b8b8',
    textMuted: '#8e8e8e',
    brand: '#e68e0d',
    brandInk: '#0a0a0a',
    selection: '#2e2e2e',
    success: '#22c55e',
    warning: '#eab308',
    danger: '#ef4444',
    info: '#3b82f6',
    ansi: [
      '#181818', '#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#06b6d4', '#b8b8b8',
      '#525252', '#f87171', '#4ade80', '#facc15', '#60a5fa', '#c084fc', '#22d3ee', '#eaeaea',
    ],
  },
};
