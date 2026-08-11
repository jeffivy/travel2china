import { getContentBySlug, getAllContent } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import SubscribeCard from '@/components/ui/SubscribeCard';
import { ArrowLeft, Calendar, User, Clock, RefreshCw } from 'lucide-react';
import { readingTime } from '@/lib/utils';
import { ArticleSchema, BreadcrumbSchema } from "@/components/layout/StructuredData"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://travels2china.com';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('blog', params.slug);
  if (!entry) return {};
  return {
    alternates: { canonical: `/blog/${params.slug}` },
    title: entry.meta.seoTitle || entry.meta.title,
    description: entry.meta.seoDescription || entry.meta.description,
    keywords: entry.meta.keywords?.join(', '),
  };
}
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const entry = getContentBySlug('blog', params.slug);
  if (!entry) notFound();

  // Get related blog posts by shared tags
  const allPosts = getAllContent('blog').filter(p => p.slug !== params.slug);
  const currentTags = entry.meta.tags || [];
  const related = allPosts
    .map(post => {
      const sharedTags = (post.meta.tags || []).filter(t => currentTags.includes(t));
      return { post, score: sharedTags.length };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => r.post);

  // Fallback to recent posts if no tag matches
  const displayedRelated = related.length > 0 ? related : allPosts.slice(0, 3);

  return (
    <>
      <section className="relative bg-gradient-to-br from-[var(--primary)]/5 via-[var(--gold)]/3 to-transparent py-8 border-b border-[var(--border)]">
        <div className="container-content">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{entry.meta.title}</h1>
          <ArticleSchema
            title={entry.meta.seoTitle || entry.meta.title}
            description={entry.meta.seoDescription || entry.meta.description}
            image={entry.meta.image}
            datePublished={entry.meta.date}
            dateModified={entry.meta.lastUpdated}
            author={entry.meta.author}
            url={SITE_URL + "/blog/" + params.slug}
          />
          <BreadcrumbSchema
            items={[
              { name: "Home", url: SITE_URL },
              { name: "Blog", url: SITE_URL + "/blog" },
              { name: entry.meta.title, url: SITE_URL + "/blog/" + params.slug },
            ]}
          />
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            {entry.meta.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {entry.meta.author}
              </span>
            )}
            {entry.meta.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {entry.meta.date}
              </span>
            )}
            {entry.meta.lastUpdated && (
              <span className="flex items-center gap-1 text-[var(--primary)]">
                <RefreshCw className="w-3 h-3" /> Updated {entry.meta.lastUpdated}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {readingTime(entry.content)} min read
            </span>
          </div>
        </div>
      </section>

      <article className="container-content py-8">
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>
        {/* Related Articles */}
        {displayedRelated.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {displayedRelated.map((rel) => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="card p-4 group">
                  <h4 className="font-semibold text-sm mb-1 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {rel.meta.title}
                  </h4>
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{rel.meta.description}</p>
                  {rel.meta.date && (
                    <p className="text-xs text-[var(--muted)] mt-1">{rel.meta.date}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe CTA */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <SubscribeCard
            variant="inline"
            title="Get More China Travel Tips"
            description="Enjoyed this article? Join our newsletter for more practical tips, destination guides, and travel inspiration."
          />
        </div>
      </article>
    </>
  );
}
