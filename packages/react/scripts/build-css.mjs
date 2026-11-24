// Bundles src/styles/index.css (+ every relative @import, recursively) into dist/styles.css.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IMPORT = /^\s*@import\s+(?:url\()?["'](\.{1,2}\/[^"']+)["']\)?\s*;\s*$/gm;
const seen = new Set();

function inline(file) {
  if (seen.has(file)) return '';
  seen.add(file);
  const css = readFileSync(file, 'utf8');
  return css.replace(IMPORT, (_m, rel) => `/* ${rel} */\n${inline(resolve(dirname(file), rel))}`);
}

const out = resolve(root, 'dist/styles.css');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `/* @jseramn/omai/styles.css - GENERATED. */\n${inline(resolve(root, 'src/styles/index.css'))}`, 'utf8');
console.log(`[@jseramn/omai] bundled ${seen.size} css file(s) -> dist/styles.css`);
