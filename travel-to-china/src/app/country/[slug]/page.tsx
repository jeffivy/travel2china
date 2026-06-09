import { getContentBySlug, getAllContent, getRelatedArticles, getBreadcrumbs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import MDXContent from '@/components/content/MDXContent';
import Comments from '@/components/comments/Comments';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { readingTime } from '@/lib/utils';

export async function generateStaticParams() {
  const articles = getAllContent('country');
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('country', params.slug);
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

export default function CountryArticlePage({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('country', params.slug);
  if (!entry) notFound();

  const related = getRelatedArticles(params.slug, 'country', 3);
  const breadcrumbs = getBreadcrumbs('country', params.slug, entry.meta.title);
  const readTime = readingTime(entry.content);

  return (
    <>
      <Breadcrumbs crumbs={breadcrumbs} />

      <article className="container-content py-8">
        {/* Article Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-[var(--muted)] mb-4">
            <Link href="/country" className="hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Country Guide
            </Link>
          </div>
          {entry.meta.image && (
            <img
              src={entry.meta.image}
              alt={entry.meta.title}
              className="w-full h-48 md:h-64 object-cover rounded-xl mb-6 shadow-lg"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {entry.meta.title}
          </h1>
          <p className="text-xl text-[var(--muted)] mb-6">{entry.meta.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
            {entry.meta.author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {entry.meta.author}
              </span>
            )}
            {entry.meta.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {entry.meta.date}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {readTime} min read
            </span>
          </div>
          {entry.meta.tags && entry.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {entry.meta.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Table of Contents (side anchor nav) */}
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-10">
          {/* Main Content */}
          <div className="prose dark:prose-invert max-w-none">
            <MDXContent source={entry.content} />
          </div>

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
                On this page
              </h4>
              <nav className="space-y-1 text-sm" aria-label="Table of contents">
                {entry.content
                  .split('\n')
                  .filter((line) => line.match(/^#{2,3}\s/))
                  .map((line) => {
                    const level = line.match(/^(#{2,3})\s/)?.[1].length || 2;
                    const text = line.replace(/^#{2,3}\s/, '');
                    const id = text
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)/g, '');
                    return (
                      <a
                        key={id}
                        href={`#${id}`}
                        className={`block py-1 text-[var(--muted)] hover:text-[var(--primary)] transition-colors ${
                          level === 3 ? 'pl-3' : ''
                        }`}
                      >
                        {text}
                      </a>
                    );
                  })}
              </nav>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[var(--border)]">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/country/${rel.slug}`} className="card p-5 group">
                  <h4 className="font-semibold mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {rel.meta.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{rel.meta.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 pt-10 border-t border-[var(--border)]">
          <Comments articleSlug={`country/${params.slug}`} />
        </div>
      </article>
    </>
  );
}
