'use client';

import { useMemo } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
  const html = useMemo(() => {
    try {
      const result = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .processSync(source);
      return String(result);
    } catch (error) {
      console.error('MDX parsing error:', error);
      return `<p>Error rendering content.</p>`;
    }
  }, [source]);

  // Post-process HTML to add IDs to headings for anchor navigation
  const processedHtml = useMemo(() => {
    return html.replace(
      /<(h[23])>(.*?)<\/\1>/g,
      (match: string, tag: string, text: string) => {
        const cleanText = text.replace(/<[^>]*>/g, '');
        const id = cleanText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        return `<${tag} id="${id}">${text}</${tag}>`;
      }
    );
  }, [html]);

  return (
    <div
      className="prose dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
