import { getContentBySlug, getBreadcrumbs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import { ArrowLeft } from 'lucide-react';
import { readingTime } from '@/lib/utils';
import { ArticleSchema, BreadcrumbSchema } from "@/components/layout/StructuredData"

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

  return (
    <>
      <section className="relative bg-gradient-to-br from-[var(--primary)]/5 via-[var(--gold)]/3 to-transparent py-8 border-b border-[var(--border)]">
        <div className="container-content">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Blog
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{entry.meta.title}</h1>
          <ArticleSchema
            title={entry.meta.seoTitle || entry.meta.title}
            description={entry.meta.seoDescription || entry.meta.description}
            image={entry.meta.image}
            datePublished={entry.meta.date}
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
          <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
            {entry.meta.date && <span>{entry.meta.date}</span>}
            {entry.meta.author && <span>By {entry.meta.author}</span>}
            <span>{readingTime(entry.content)} min read</span>
          </div>
        </div>
      </section>

      <article className="container-content py-8">
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>
      </article>
    </>
  );
}
