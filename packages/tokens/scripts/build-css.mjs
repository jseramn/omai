// Generates dist/themes.css from the compiled theme registry (run after `tsc -p tsconfig.build.json`).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildThemesCss, themes, DEFAULT_THEME_ID } from '../dist/index.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'dist/themes.css');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buildThemesCss(themes, DEFAULT_THEME_ID), 'utf8');
console.log(`[@jseramn/omai-tokens] wrote ${themes.length} theme(s) -> dist/themes.css`);
