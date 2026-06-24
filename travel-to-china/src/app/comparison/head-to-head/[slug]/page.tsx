import { getContentBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { ArrowLeft } from 'lucide-react';
import { readingTime } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('comparison/head-to-head', params.slug);
  if (!entry) return {};
  return { title: entry.meta.seoTitle || entry.meta.title, description: entry.meta.seoDescription || entry.meta.description };
}

export default function HeadToHeadPage({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('comparison/head-to-head', params.slug);
  if (!entry) notFound();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Comparisons', href: '/comparison' },
    { label: 'Head-to-Head', href: '/comparison/cities' },
    { label: entry.meta.title, href: `/comparison/head-to-head/${params.slug}` },
  ];

  return (
    <>
      <section className="relative bg-gradient-to-br from-[var(--primary)]/10 via-[var(--gold)]/5 to-transparent py-12 border-b border-[var(--border)]">
        <div className="container-wide">
          <Link href="/comparison/cities" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> City Comparisons
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{entry.meta.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-3xl">{entry.meta.description}</p>
        </div>
      </section>
      <Breadcrumbs crumbs={breadcrumbs} />
      <article className="container-content py-10">
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>
      </article>
    </>
  );
}
