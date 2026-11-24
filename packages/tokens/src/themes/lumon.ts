import type { OmaiTheme } from '../types.js';

/**
 * Lumon — sterile Severance-inspired corporate slate-blue dark theme.
 * Anchors: omarchy.org/themes (`#16242d` / `#182836` / `#f2fcff` / `#8bc9eb`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Lumon).
 */
export const lumon: OmaiTheme = {
  id: 'lumon',
  name: 'Lumon',
  mode: 'dark',
  colors: {
    bgDeep: '#101c24',
    bg: '#16242d',
    surface: '#182836',
    surface2: '#20333f',
    borderSubtle: '#20333f',
    borderStrong: '#37536b',
    text: '#f2fcff',
    textSecondary: '#c8dce8',
    textMuted: '#8aa6b8',
    brand: '#8bc9eb',
    brandInk: '#0b141a',
    selection: '#243d56',
    success: '#98c379',
    warning: '#e5c07b',
    danger: '#e06c75',
    info: '#8bc9eb',
    ansi: [
      '#101c24', '#e06c75', '#98c379', '#e5c07b', '#8bc9eb', '#c678dd', '#56b6c2', '#c8dce8',
      '#37536b', '#e88388', '#a8d38b', '#edd092', '#a3d6f2', '#d291e4', '#72c8d3', '#f2fcff',
    ],
  },
};
