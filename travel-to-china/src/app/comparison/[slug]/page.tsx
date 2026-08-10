import { getContentBySlug, shouldNoindex } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { ArrowLeft } from 'lucide-react';
import { readingTime } from '@/lib/utils';
import { BreadcrumbSchema } from "@/components/layout/StructuredData"

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('comparison', params.slug);
  if (!entry) return {};
  return {
    alternates: { canonical: `/comparison/${params.slug}` },
    title: entry.meta.seoTitle || entry.meta.title,
    description: entry.meta.seoDescription || entry.meta.description,
    keywords: entry.meta.keywords?.join(', '),
    robots: shouldNoindex('comparison', params.slug) ? { index: false } : undefined,
  };
}
const SITE_URL = "https://travels2china.com";

export default function ComparisonSlugPage({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('comparison', params.slug);
  if (!entry) notFound();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Comparisons', href: '/comparison' },
    { label: entry.meta.title, href: `/comparison/${params.slug}` },
  ];

  return (
    <>
      <section className="relative bg-gradient-to-br from-[var(--primary)]/10 via-[var(--gold)]/5 to-transparent py-12 border-b border-[var(--border)]">
        <div className="container-wide">
          <Link href="/comparison" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Comparisons
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{entry.meta.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-3xl">{entry.meta.description}</p>
        </div>
      </section>

      <Breadcrumbs crumbs={breadcrumbs} />
          <BreadcrumbSchema items={breadcrumbs.map((c) => ({ name: c.label, url: SITE_URL + c.href }))} />

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
