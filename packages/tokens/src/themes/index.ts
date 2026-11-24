/**
 * Theme registry for all 16 curated OMAI themes (inspired by Omarchy).
 * Order mirrors `themeIds` in `../meta.ts`.
 */

import type { OmaiTheme } from '../types.js';
import type { OmaiThemeId } from '../meta.js';
import { tokyoNight } from './tokyo-night.js';
import { catppuccin } from './catppuccin.js';
import { catppuccinLatte } from './catppuccin-latte.js';
import { ethereal } from './ethereal.js';
import { everforest } from './everforest.js';
import { flexokiLight } from './flexoki-light.js';
import { gruvbox } from './gruvbox.js';
import { hackerman } from './hackerman.js';
import { kanagawa } from './kanagawa.js';
import { lumon } from './lumon.js';
import { matteBlack } from './matte-black.js';
import { nord } from './nord.js';
import { osakaJade } from './osaka-jade.js';
import { ristretto } from './ristretto.js';
import { rosePine } from './rose-pine.js';
import { rosePineDawn } from './rose-pine-dawn.js';

export {
  tokyoNight,
  catppuccin,
  catppuccinLatte,
  ethereal,
  everforest,
  flexokiLight,
  gruvbox,
  hackerman,
  kanagawa,
  lumon,
  matteBlack,
  nord,
  osakaJade,
  ristretto,
  rosePine,
  rosePineDawn,
};

export const themes: readonly OmaiTheme[] = [
  tokyoNight,
  catppuccin,
  catppuccinLatte,
  ethereal,
  everforest,
  flexokiLight,
  gruvbox,
  hackerman,
  kanagawa,
  lumon,
  matteBlack,
  nord,
  osakaJade,
  ristretto,
  rosePine,
  rosePineDawn,
];

export function getTheme(id: OmaiThemeId): OmaiTheme | undefined {
  return themes.find((t) => t.id === id);
}
