import { getContentBySlug, getAllContent, getRelatedArticles, getBreadcrumbs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import MDXContent from '@/components/content/MDXContent';
import Comments from '@/components/comments/Comments';
import { ArrowLeft, Clock, Calendar, User, MapPin, Sun, Thermometer } from 'lucide-react';
import { readingTime } from '@/lib/utils';

export async function generateStaticParams() {
  const cities = getAllContent('cities');
  return cities.map((city) => ({ 'city-slug': city.slug }));
}

export async function generateMetadata({ params }: { params: { 'city-slug': string } }) {
  const entry = getContentBySlug('cities', params['city-slug']);
  if (!entry) return {};
  return {
    title: entry.meta.seoTitle || `${entry.meta.title} Travel Guide`,
    description: entry.meta.seoDescription || entry.meta.description,
    openGraph: {
      title: `${entry.meta.title} — China Travel Guide`,
      description: entry.meta.description,
      type: 'article',
    },
  };
}

export default function CityPage({ params }: { params: { 'city-slug': string } }) {
  const slug = params['city-slug'];
  const entry = getContentBySlug('cities', slug);
  if (!entry) notFound();

  const related = getRelatedArticles(slug, 'cities', 3);
  const breadcrumbs = getBreadcrumbs('cities', slug, entry.meta.title);
  const readTime = readingTime(entry.content);

  return (
    <>
      <Breadcrumbs crumbs={breadcrumbs} />

      {/* City Hero */}
      <section className="relative bg-gradient-to-br from-[var(--primary)]/10 via-[var(--gold)]/5 to-transparent py-12 border-b border-[var(--border)]">
        <div className="container-wide">
          <Link href="/cities" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All Cities
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{entry.meta.title}</h1>
          <p className="text-lg text-[var(--muted)] max-w-3xl mb-6">{entry.meta.description}</p>

          {/* City Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4 text-center">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]" />
              <p className="text-xs text-[var(--muted)]">Region</p>
              <p className="font-semibold text-sm">{entry.meta.region || 'N/A'}</p>
            </div>
            <div className="card p-4 text-center">
              <User className="w-5 h-5 mx-auto mb-1 text-[var(--primary)]" />
              <p className="text-xs text-[var(--muted)]">Population</p>
              <p className="font-semibold text-sm">{entry.meta.population || 'N/A'}</p>
            </div>
            <div className="card p-4 text-center">
              <Sun className="w-5 h-5 mx-auto mb-1 text-[var(--gold)]" />
              <p className="text-xs text-[var(--muted)]">Best Time</p>
              <p className="font-semibold text-sm">{entry.meta.bestTimeToVisit || 'N/A'}</p>
            </div>
            <div className="card p-4 text-center">
              <Thermometer className="w-5 h-5 mx-auto mb-1 text-[var(--gold)]" />
              <p className="text-xs text-[var(--muted)]">Climate</p>
              <p className="font-semibold text-sm truncate">{entry.meta.weather || 'N/A'}</p>
            </div>
          </div>

          {/* Highlights */}
          {entry.meta.highlights && entry.meta.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.meta.highlights.map((h) => (
                <span key={h} className="px-3 py-1.5 text-sm font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full border border-[var(--primary)]/20">
                  ✦ {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="container-content py-10">
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)] mb-8">
          {entry.meta.author && <span className="flex items-center gap-1"><User className="w-4 h-4" /> {entry.meta.author}</span>}
          {entry.meta.date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {entry.meta.date}</span>}
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {readTime} min read</span>
          {entry.meta.tags && entry.meta.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs bg-[var(--card-hover)] text-[var(--muted)] rounded-full">#{tag}</span>
          ))}
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-10">
          <div className="prose dark:prose-invert max-w-none">
            <MDXContent source={entry.content} />
          </div>
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">On this page</h4>
              <nav className="space-y-1 text-sm">
                {entry.content
                  .split('\n')
                  .filter((line) => line.match(/^#{2,3}\s/))
                  .map((line) => {
                    const level = line.match(/^(#{2,3})\s/)?.[1].length || 2;
                    const text = line.replace(/^#{2,3}\s/, '');
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return (
                      <a key={id} href={`#${id}`} className={`block py-1 text-[var(--muted)] hover:text-[var(--primary)] transition-colors ${level === 3 ? 'pl-3' : ''}`}>
                        {text}
                      </a>
                    );
                  })}
              </nav>
            </div>
          </aside>
        </div>

        {/* Related Cities */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[var(--border)]">
            <h3 className="text-2xl font-bold mb-6">More Cities to Explore</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/cities/${rel.slug}`} className="card p-5 group">
                  <h4 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">{rel.meta.title}</h4>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{rel.meta.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="mt-16 pt-10 border-t border-[var(--border)]">
          <Comments articleSlug={`cities/${slug}`} />
        </div>
      </article>
    </>
  );
}
