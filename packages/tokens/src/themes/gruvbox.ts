import type { OmaiTheme } from '../types.js';

/**
 * Gruvbox — retro earthy dark theme with warm stone surfaces.
 * Anchors: omarchy.org/themes (`#282828` / `#32302f` / `#d4be98` / `#7daea3`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Gruvbox Dark).
 */
export const gruvbox: OmaiTheme = {
  id: 'gruvbox',
  name: 'Gruvbox',
  mode: 'dark',
  colors: {
    bgDeep: '#1d2021',
    bg: '#282828',
    surface: '#32302f',
    surface2: '#3c3836',
    borderSubtle: '#3c3836',
    borderStrong: '#665c54',
    text: '#d4be98',
    textSecondary: '#c5b18d',
    textMuted: '#a89984',
    brand: '#7daea3',
    brandInk: '#1d2021',
    selection: '#504945',
    success: '#a9b665',
    warning: '#d8a657',
    danger: '#ea6962',
    info: '#7daea3',
    ansi: [
      '#282828', '#cc241d', '#98971a', '#d79921', '#458588', '#b16286', '#689d6a', '#a89984',
      '#928374', '#fb4934', '#b8bb26', '#fabd2f', '#83a598', '#d3869b', '#8ec07c', '#ebdbb2',
    ],
  },
};
