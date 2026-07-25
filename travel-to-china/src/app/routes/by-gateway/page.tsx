import { getContentBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { ArrowLeft } from 'lucide-react';
import { readingTime } from '@/lib/utils';
import { BreadcrumbSchema } from "@/components/layout/StructuredData"

export async function generateMetadata() {
  const entry = getContentBySlug('routes/by-gateway', 'index');
  if (!entry) return {};
  return {
    title: entry.meta.seoTitle || entry.meta.title,
    description: entry.meta.seoDescription || entry.meta.description,
  };
}

const SITE_URL = "https://travels2china.com";

export default function ByGatewayPage() {
  const entry = getContentBySlug('routes/by-gateway', 'index');
  if (!entry) notFound();

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Routes', href: '/routes' },
    { label: 'By Gateway City', href: '/routes/by-gateway' },
  ];

  return (
    <>
      <section className="relative bg-gradient-to-br from-[var(--primary)]/10 via-[var(--gold)]/5 to-transparent py-12 border-b border-[var(--border)]">
        <div className="container-wide">
          <Link href="/routes" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Routes
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{entry.meta.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-3xl">{entry.meta.description}</p>
        </div>
      </section>

      <Breadcrumbs crumbs={breadcrumbs} />
          <BreadcrumbSchema items={breadcrumbs.map((c, i) => ({ ...c, url: SITE_URL + (c.href || c.url) }))} />

      <article className="container-content py-10">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)] mb-8">
          <span>{readingTime(entry.content)} min read</span>
        </div>
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>
      </article>
    </>
  );
}
