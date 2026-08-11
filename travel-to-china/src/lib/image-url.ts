/**
 * Converts an image URL to use WebP format.
 * Works with both static paths and dynamic content.
 *
 * Usage:
 *   import { webpUrl } from '@/lib/image-url';
 *   <img src={webpUrl(city.meta.image)} alt={city.meta.title} />
 *
 * Returns a <picture> element-friendly URL or just the WebP path.
 * Example: '/images/beijing.jpg' → '/images/beijing.webp'
 */

export function webpUrl(url: string | undefined): string {
  if (!url) return '';
  // Only convert local images; skip external URLs
  if (url.startsWith('http')) return url;
  return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

/**
 * Returns the original fallback URL (unchanged).
 * Use with <picture> for cross-browser compatibility.
 *
 * Example:
 *   <picture>
 *     <source srcSet={webpUrl(image)} type="image/webp" />
 *     <img src={image} alt="..." />
 *   </picture>
 */
export function originalUrl(url: string | undefined): string {
  return url || '';
}
