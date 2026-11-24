import type { OmaiTheme } from '../types.js';

/**
 * Tokyo Night — DEFAULT theme. Reference implementation for all other theme files.
 * Surfaces/text/brand/field: omarchy.org live stylesheet. ANSI: Omarchy `colors.toml`.
 */
export const tokyoNight: OmaiTheme = {
  id: 'tokyo-night',
  name: 'Tokyo Night',
  mode: 'dark',
  colors: {
    bgDeep: '#13141c',
    bg: '#1a1b26',
    surface: '#1f2230',
    surface2: '#24283b',
    borderSubtle: '#24283b',
    borderStrong: '#414868',
    text: '#c0caf5',
    textSecondary: '#a9b1d6',
    textMuted: '#8b93b8',
    brand: '#9ece6a',
    brandInk: '#0c0e10',
    selection: '#292e42',
    success: '#9ece6a',
    warning: '#e0af68',
    danger: '#f7768e',
    info: '#7aa2f7',
    ansi: [
      '#15161e', '#f7768e', '#9ece6a', '#e0af68', '#7aa2f7', '#bb9af7', '#7dcfff', '#a9b1d6',
      '#414868', '#f7768e', '#9ece6a', '#e0af68', '#7aa2f7', '#bb9af7', '#7dcfff', '#c0caf5',
    ],
  },
  overrides: {
    brandSoft: '#9ece6a1f',
    cursor: '#c0caf5',
    scrollThumb: '#ffffff24',
    imgOutline: '#ffffff1a',
    field: {
      bg: '#0e0e14',
      dim: '#39482e',
      mid: '#678549',
      lit: '#9ece6a',
      hover: '#bbdd97',
      crest: '#daecc6',
    },
  },
};
