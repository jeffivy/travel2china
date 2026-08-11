'use client';

import { useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

interface MDXContentProps {
  source: string;
}

/**
 * Post-process HTML to:
 * 1. Add IDs to headings (h2, h3) for anchor navigation
 * 2. Convert local images to <picture> with WebP + original fallback
 */
function postProcessHtml(html: string): string {
  let result = html;

  // Step 1: Add IDs to headings
  result = result.replace(
    /<(h[23])>(.*?)<\/\1>/g,
    (_match: string, tag: string, text: string) => {
      const cleanText = text.replace(/<[^>]*>/g, '');
      const id = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return `<${tag} id="${id}">${text}</${tag}>`;
    }
  );

  // Step 2: Convert local images to <picture> with WebP
  // Matches <img ... src="/images/..." ...> and wraps in <picture>
  result = result.replace(
    /<img\s+([^>]*?)src="(\/images\/[^"]+\.(?:jpg|jpeg|png))"([^>]*?)>/gi,
    (_match: string, before: string, src: string, after: string) => {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

      // Extract alt text from either before or after group
      const altMatch = (before + after).match(/alt="([^"]*)"/);
      const alt = altMatch ? altMatch[1] : '';

      // Build remaining attributes (excluding alt since we put it on <img>)
      const allAttrs = (before + after)
        .replace(/\balt="[^"]*"/, '')
        .replace(/\bsrc="[^"]*"/, '')
        .trim();

      return `<picture>
  <source srcset="${webpSrc}" type="image/webp">
  <img src="${src}" alt="${alt}" loading="lazy" ${allAttrs}>
</picture>`;
    }
  );

  return result;
}

export default function MDXContent({ source }: MDXContentProps) {
  const html = useMemo(() => {
    try {
      const result = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .processSync(source);
      return postProcessHtml(String(result));
    } catch (error) {
      console.error('MDX parsing error:', error);
      return `<p>Error rendering content.</p>`;
    }
  }, [source]);

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
