import { getContentBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import { ArrowLeft } from 'lucide-react';
import { readingTime } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('by-travel-style', params.slug);
  if (!entry) return {};
  return {
    title: entry.meta.seoTitle || entry.meta.title,
    description: entry.meta.seoDescription || entry.meta.description,
  };
}

export default function TravelStyleSlugPage({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('by-travel-style', params.slug);
  if (!entry) notFound();

  return (
    <>
      <section className="relative bg-gradient-to-br from-[var(--primary)]/10 via-[var(--gold)]/5 to-transparent py-12 border-b border-[var(--border)]">
        <div className="container-wide">
          <Link href="/by-travel-style" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Travel Styles
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{entry.meta.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-3xl">{entry.meta.description}</p>
        </div>
      </section>

      <article className="container-content py-10">
        <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-8">
          <span>{readingTime(entry.content)} min read</span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>
      </article>
    </>
  );
}
