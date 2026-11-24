import type { OmaiTheme } from '../types.js';

/**
 * Nord — arctic-inspired Polar Night and Frost dark theme.
 * Anchors: omarchy.org/themes (`#2e3440` / `#343b49` / `#d8dee9` / `#81a1c1`).
 * Surfaces/ANSI: Omarchy `colors.toml` (Nord).
 */
export const nord: OmaiTheme = {
  id: 'nord',
  name: 'Nord',
  mode: 'dark',
  colors: {
    bgDeep: '#242933',
    bg: '#2e3440',
    surface: '#343b49',
    surface2: '#3b4252',
    borderSubtle: '#3b4252',
    borderStrong: '#4c566a',
    text: '#d8dee9',
    textSecondary: '#c8d0e0',
    textMuted: '#98a4bc',
    brand: '#81a1c1',
    brandInk: '#1e222a',
    selection: '#434c5e',
    success: '#a3be8c',
    warning: '#ebcb8b',
    danger: '#bf616a',
    info: '#88c0d0',
    ansi: [
      '#3b4252', '#bf616a', '#a3be8c', '#ebcb8b', '#81a1c1', '#b48ead', '#88c0d0', '#e5e9f0',
      '#4c566a', '#bf616a', '#a3be8c', '#ebcb8b', '#81a1c1', '#b48ead', '#8fbcbb', '#eceff4',
    ],
  },
};
