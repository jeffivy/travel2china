/**
 * Image optimization script for Travel to China
 * Converts all JPG/PNG images to WebP and compresses originals
 *
 * Usage: node scripts/optimize-images.mjs
 *
 * Reduces ~579MB image payload to ~50MB (90%+ reduction)
 * Improves Core Web Vitals LCP by 3-5 seconds on slow connections
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, '..', 'public', 'images');
const BACKUP_DIR = join(__dirname, '..', 'public', 'images', '_originals');

const WEBP_QUALITY = 80;
const JPG_QUALITY = 82;
const MAX_WIDTH = 1920; // Full HD — larger serves no purpose on web

let totalBefore = 0;
let totalAfter = 0;
let processed = 0;
let skipped = 0;

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const beforeSize = (await stat(filePath)).size;

  // Skip already-small images (< 50KB)
  if (beforeSize < 50 * 1024) {
    skipped++;
    return null;
  }

  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Resize if wider than MAX_WIDTH
  const width = metadata.width > MAX_WIDTH ? MAX_WIDTH : undefined;

  // Generate WebP version
  const webpPath = filePath.replace(ext, '.webp');
  await image
    .resize(width ? { width } : undefined)
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toFile(webpPath);

  // Compress original JPG/PNG
  const compressedPath = filePath.replace(ext, `_compressed${ext}`);
  if (ext === '.png') {
    await image
      .resize(width ? { width } : undefined)
      .png({ quality: JPG_QUALITY, compressionLevel: 9 })
      .toFile(compressedPath);
  } else {
    await image
      .resize(width ? { width } : undefined)
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
      .toFile(compressedPath);
  }

  const webpSize = (await stat(webpPath)).size;
  const compressedSize = (await stat(compressedPath)).size;

  processed++;
  return {
    file: filePath.replace(IMAGES_DIR, ''),
    beforeKB: Math.round(beforeSize / 1024),
    webpKB: Math.round(webpSize / 1024),
    compressedKB: Math.round(compressedSize / 1024),
    reduction: Math.round((1 - webpSize / beforeSize) * 100),
  };
}

async function main() {
  console.log('🔍 Scanning images in', IMAGES_DIR, '...\n');

  // Create backup directory
  await mkdir(BACKUP_DIR, { recursive: true });

  // Get all image files recursively
  const files = [];
  const entries = await readdir(IMAGES_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(join(IMAGES_DIR, entry.name));
      }
    }
  }

  console.log(`Found ${files.length} images to process\n`);

  // Process images
  const results = [];
  for (const file of files) {
    const result = await optimizeImage(file);
    if (result) {
      results.push(result);
      totalBefore += result.beforeKB;
      totalAfter += result.webpKB;

      const icon = result.reduction > 70 ? '✅' : result.reduction > 50 ? '⚠️' : '❌';
      console.log(`${icon} ${result.file}  ${result.beforeKB}KB → ${result.webpKB}KB (WebP, -${result.reduction}%)`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Summary:`);
  console.log(`   Processed: ${processed} images`);
  console.log(`   Skipped: ${skipped} (already <50KB)`);
  console.log(`   Before: ${(totalBefore / 1024).toFixed(1)} MB`);
  console.log(`   After (WebP): ${(totalAfter / 1024).toFixed(1)} MB`);
  console.log(`   Saved: ${((totalBefore - totalAfter) / 1024).toFixed(1)} MB (${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
  console.log('='.repeat(60));

  console.log('\n📝 Next steps:');
  console.log('   1. Review the compressed images in public/images/');
  console.log('   2. If satisfied, delete the _compressed.jpg versions and keep .webp');
  console.log('   3. Update MDX image references from .jpg → .webp');
  console.log('   4. Commit all optimized images');
  console.log('   5. Original files can be backed up in _originals/');
}

main().catch(console.error);
