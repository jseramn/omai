/**
 * Theme registry metadata (ids, names, modes, preview swatches).
 * This file is light-weight and dependency-free so UI (ThemeSwitcher, docs) can list
 * themes without pulling every palette. Swatches are inspired by Omarchy themes (MIT).
 */

import type { OmaiMode } from './types.js';

/** The 16 curated OMAI themes supported by this interface system (13 dark + 3 light). */
export const themeIds = [
  'tokyo-night',
  'catppuccin',
  'catppuccin-latte',
  'ethereal',
  'everforest',
  'flexoki-light',
  'gruvbox',
  'hackerman',
  'kanagawa',
  'lumon',
  'matte-black',
  'nord',
  'osaka-jade',
  'ristretto',
  'rose-pine',
  'rose-pine-dawn',
] as const;

export type OmaiThemeId = (typeof themeIds)[number];

export const DEFAULT_THEME_ID: OmaiThemeId = 'tokyo-night';

export interface OmaiThemeMeta {
  id: OmaiThemeId;
  name: string;
  mode: OmaiMode;
  /** Preview swatches for pickers: [bg, surface, text, brand]. */
  swatch: { bg: string; surface: string; text: string; brand: string };
}

export const themeMeta: readonly OmaiThemeMeta[] = [
  { id: 'tokyo-night', name: 'Tokyo Night', mode: 'dark', swatch: { bg: '#1a1b26', surface: '#1f2230', text: '#c0caf5', brand: '#9ece6a' } },
  { id: 'catppuccin', name: 'Catppuccin', mode: 'dark', swatch: { bg: '#1e1e2e', surface: '#282839', text: '#cdd6f4', brand: '#89b4fa' } },
  { id: 'catppuccin-latte', name: 'Catppuccin Latte', mode: 'light', swatch: { bg: '#eff1f5', surface: '#f8f9fb', text: '#4c4f69', brand: '#1e66f5' } },
  { id: 'ethereal', name: 'Ethereal', mode: 'dark', swatch: { bg: '#060b1e', surface: '#0c122c', text: '#ffcead', brand: '#7d82d9' } },
  { id: 'everforest', name: 'Everforest', mode: 'dark', swatch: { bg: '#2d353b', surface: '#303a40', text: '#d3c6aa', brand: '#7fbbb3' } },
  { id: 'flexoki-light', name: 'Flexoki Light', mode: 'light', swatch: { bg: '#fffcf0', surface: '#f9f6ea', text: '#100f0f', brand: '#205ea6' } },
  { id: 'gruvbox', name: 'Gruvbox', mode: 'dark', swatch: { bg: '#282828', surface: '#32302f', text: '#d4be98', brand: '#7daea3' } },
  { id: 'hackerman', name: 'Hackerman', mode: 'dark', swatch: { bg: '#0b0c16', surface: '#10121f', text: '#ddf7ff', brand: '#82fb9c' } },
  { id: 'kanagawa', name: 'Kanagawa', mode: 'dark', swatch: { bg: '#1f1f28', surface: '#202838', text: '#dcd7ba', brand: '#dcd7ba' } },
  { id: 'lumon', name: 'Lumon', mode: 'dark', swatch: { bg: '#16242d', surface: '#182836', text: '#f2fcff', brand: '#8bc9eb' } },
  { id: 'matte-black', name: 'Matte Black', mode: 'dark', swatch: { bg: '#121212', surface: '#181818', text: '#eaeaea', brand: '#e68e0d' } },
  { id: 'nord', name: 'Nord', mode: 'dark', swatch: { bg: '#2e3440', surface: '#343b49', text: '#d8dee9', brand: '#81a1c1' } },
  { id: 'osaka-jade', name: 'Osaka Jade', mode: 'dark', swatch: { bg: '#111c18', surface: '#1a2a22', text: '#f7e8b2', brand: '#509475' } },
  { id: 'ristretto', name: 'Ristretto', mode: 'dark', swatch: { bg: '#2c2525', surface: '#342a28', text: '#e6d9db', brand: '#f38d70' } },
  { id: 'rose-pine', name: 'Rosé Pine', mode: 'dark', swatch: { bg: '#191724', surface: '#1f1d2e', text: '#e0def4', brand: '#9ccfd8' } },
  { id: 'rose-pine-dawn', name: 'Rosé Pine Dawn', mode: 'light', swatch: { bg: '#faf4ed', surface: '#fffaf3', text: '#575279', brand: '#56949f' } },
];

export function isThemeId(value: unknown): value is OmaiThemeId {
  return typeof value === 'string' && (themeIds as readonly string[]).includes(value);
}

export function getThemeMeta(id: OmaiThemeId): OmaiThemeMeta {
  const meta = themeMeta.find((t) => t.id === id);
  if (!meta) throw new Error(`[omai] Unknown theme id "${id}"`);
  return meta;
}
