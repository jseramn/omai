import type { OmaiTheme } from '../types.js';

/**
 * Everforest — natural forest-toned dark palette for low-glare reading.
 * Anchors: omarchy.org/themes (`#2d353b` / `#303a40` / `#d3c6aa` / `#7fbbb3`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Everforest Dark Medium).
 */
export const everforest: OmaiTheme = {
  id: 'everforest',
  name: 'Everforest',
  mode: 'dark',
  colors: {
    bgDeep: '#232a2e',
    bg: '#2d353b',
    surface: '#303a40',
    surface2: '#343f44',
    borderSubtle: '#3d484d',
    borderStrong: '#56635f',
    text: '#d3c6aa',
    textSecondary: '#c0b59c',
    textMuted: '#9da9a0',
    brand: '#7fbbb3',
    brandInk: '#1e2326',
    selection: '#475258',
    success: '#a7c080',
    warning: '#dbbc7f',
    danger: '#e67e80',
    info: '#7fbbb3',
    ansi: [
      '#475258', '#e67e80', '#a7c080', '#dbbc7f', '#7fbbb3', '#d699b6', '#83c092', '#d3c6aa',
      '#56635f', '#e67e80', '#a7c080', '#dbbc7f', '#7fbbb3', '#d699b6', '#83c092', '#d3c6aa',
    ],
  },
};
