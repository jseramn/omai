import type { OmaiTheme } from '../types.js';

/**
 * Osaka Jade — deep botanical jade-green dark theme with pale parchment text.
 * Anchors: omarchy.org/themes (`#111c18` / `#1a2a22` / `#f7e8b2` / `#509475`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Osaka Jade).
 */
export const osakaJade: OmaiTheme = {
  id: 'osaka-jade',
  name: 'Osaka Jade',
  mode: 'dark',
  colors: {
    bgDeep: '#0a120f',
    bg: '#111c18',
    surface: '#1a2a22',
    surface2: '#21362c',
    borderSubtle: '#21362c',
    borderStrong: '#3d5c4e',
    text: '#f7e8b2',
    textSecondary: '#c1c497',
    textMuted: '#889e8f',
    brand: '#509475',
    brandInk: '#08100d',
    selection: '#253c33',
    success: '#5bb98c',
    warning: '#d29922',
    danger: '#e5534b',
    info: '#388bfd',
    ansi: [
      '#1a2a22', '#e5534b', '#5bb98c', '#d29922', '#388bfd', '#bc8cff', '#39c5cf', '#c1c497',
      '#526055', '#f47067', '#75d1a4', '#e3b341', '#58a6ff', '#d2a8ff', '#56d4dd', '#f7e8b2',
    ],
  },
};
