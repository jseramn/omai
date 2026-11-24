import type { OmaiTheme } from '../types.js';

/**
 * Ristretto — dark roast espresso and warm cream (Monokai Pro Ristretto).
 * Anchors: omarchy.org/themes (`#2c2525` / `#342a28` / `#e6d9db` / `#f38d70`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Ristretto).
 */
export const ristretto: OmaiTheme = {
  id: 'ristretto',
  name: 'Ristretto',
  mode: 'dark',
  colors: {
    bgDeep: '#211c1c',
    bg: '#2c2525',
    surface: '#342a28',
    surface2: '#3e3332',
    borderSubtle: '#403636',
    borderStrong: '#5b5353',
    text: '#e6d9db',
    textSecondary: '#c3b7b8',
    textMuted: '#a59899',
    brand: '#f38d70',
    brandInk: '#191515',
    selection: '#4a3e3e',
    success: '#adda78',
    warning: '#f9cc6c',
    danger: '#fd6883',
    info: '#85dacc',
    ansi: [
      '#2c2525', '#fd6883', '#adda78', '#f9cc6c', '#f38d70', '#a8a9eb', '#85dacc', '#e6d9db',
      '#72696a', '#fd6883', '#adda78', '#f9cc6c', '#f38d70', '#a8a9eb', '#85dacc', '#fff1f3',
    ],
  },
};
