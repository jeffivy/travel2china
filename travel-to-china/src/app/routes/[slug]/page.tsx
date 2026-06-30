import { getContentBySlug, getRelatedArticles, getBreadcrumbs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { ArrowLeft, Clock, Calendar, MapPin } from 'lucide-react';
import { readingTime } from '@/lib/utils';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('routes', params.slug);
  if (!entry) return {};
  return {
    title: entry.meta.seoTitle || entry.meta.title,
    description: entry.meta.seoDescription || entry.meta.description,
    openGraph: {
      title: entry.meta.seoTitle || entry.meta.title,
      description: entry.meta.seoDescription || entry.meta.description,
      type: 'article',
    },
  };
}

export default function RoutePage({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('routes', params.slug);
  if (!entry) notFound();

  const related = getRelatedArticles(params.slug, 'routes', 3);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Routes', href: '/routes' },
    { label: entry.meta.title, href: `/routes/${params.slug}` },
  ];
  const readTime = readingTime(entry.content);

  return (
    <>
      {/* Route Hero */}
      <section className="relative bg-gradient-to-br from-[var(--primary)]/10 via-[var(--gold)]/5 to-transparent py-12 border-b border-[var(--border)]">
        <div className="container-wide">
          <Link href="/routes" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Routes
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{entry.meta.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-3xl mb-6">{entry.meta.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {entry.meta.route && (
              <div className="card p-4 text-center">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]" />
                <p className="text-xs text-[var(--muted)]">Route</p>
                <p className="font-semibold text-xs">{entry.meta.route}</p>
              </div>
            )}
            {entry.meta.duration && (
              <div className="card p-4 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]" />
                <p className="text-xs text-[var(--muted)]">Duration</p>
                <p className="font-semibold text-sm">{entry.meta.duration}</p>
              </div>
            )}
            {entry.meta.difficulty && (
              <div className="card p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]" />
                <p className="text-xs text-[var(--muted)]">Difficulty</p>
                <p className="font-semibold text-sm">{entry.meta.difficulty}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Breadcrumbs crumbs={breadcrumbs} />

      <article className="container-content py-10">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)] mb-8">
          {entry.meta.author && <span>By {entry.meta.author}</span>}
          {entry.meta.date && <span>{entry.meta.date}</span>}
          <span>{readTime} min read</span>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[var(--border)]">
            <h3 className="text-2xl font-bold mb-6">Related Routes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/routes/${rel.slug}`} className="card p-5 group">
                  <h4 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {rel.meta.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{rel.meta.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
