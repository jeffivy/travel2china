/**
 * Generate .webp twins for any .jpg/.jpeg/.png in public/images that lack one.
 * Runtime (<picture> + webpUrl) serves webp-first, so every raster image needs a .webp.
 *
 * Usage: node scripts/gen-missing-webp.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const dir = join(process.cwd(), 'public', 'images');
const EXTS = ['.jpg', '.jpeg', '.png'];

const entries = await readdir(dir, { withFileTypes: true });
let generated = 0;
let skipped = 0;

for (const e of entries) {
  if (!e.isFile()) continue;
  const ext = extname(e.name).toLowerCase();
  if (!EXTS.includes(ext)) continue;
  const base = e.name.slice(0, -ext.length);
  const webp = join(dir, `${base}.webp`);
  // Already has a webp twin → skip
  try {
    await stat(webp);
    skipped++;
    continue;
  } catch {}

  const jpg = join(dir, e.name);
  const meta = await sharp(jpg).metadata();
  const width = meta.width > 1920 ? 1920 : undefined;
  await sharp(jpg)
    .resize(width ? { width } : undefined)
    .webp({ quality: 80, effort: 6 })
    .toFile(webp);
  const kb = Math.round((await stat(webp)).size / 1024);
  console.log(`✅ ${base}.webp (${kb}KB, ${meta.width}px→${width || meta.width}px)`);
  generated++;
}

console.log(`\ngenerated: ${generated}, skipped (already have webp): ${skipped}`);
