import type { OmaiTheme } from '../types.js';

/**
 * Ethereal — deep indigo night canvas with warm peach text and periwinkle accent.
 * Anchors: omarchy.org/themes (`#060b1e` / `#0c122c` / `#ffcead` / `#7d82d9`).
 */
export const ethereal: OmaiTheme = {
  id: 'ethereal',
  name: 'Ethereal',
  mode: 'dark',
  colors: {
    bgDeep: '#040714',
    bg: '#060b1e',
    surface: '#0c122c',
    surface2: '#141c3d',
    borderSubtle: '#192248',
    borderStrong: '#343e6e',
    text: '#ffcead',
    textSecondary: '#e6b89c',
    textMuted: '#a59bb8',
    brand: '#7d82d9',
    brandInk: '#060b1e',
    selection: '#222b59',
    success: '#92b89a',
    warning: '#f0c674',
    danger: '#ed5b5a',
    info: '#7d82d9',
    ansi: [
      '#0c122c', '#ed5b5a', '#92b89a', '#f0c674', '#7d82d9', '#c89ec4', '#7dc7d9', '#e6b89c',
      '#343e6e', '#fa7a79', '#a9d1b2', '#f7d694', '#9aa0eb', '#dbb5d8', '#9ad8e8', '#ffcead',
    ],
  },
};
