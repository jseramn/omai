// Cross-platform `rm -rf` (Windows-safe). Usage: node scripts/clean.mjs <dir> [dir...]
import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

for (const dir of process.argv.slice(2)) {
  rmSync(resolve(process.cwd(), dir), { recursive: true, force: true });
}
