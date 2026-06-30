import { getContentBySlug } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import MDXContent from '@/components/content/MDXContent';
import { readingTime } from '@/lib/utils';

export async function generateMetadata() {
  const entry = getContentBySlug('by-travel-style', 'index');
  if (!entry) return {};
  return {
    title: entry.meta.seoTitle || entry.meta.title,
    description: entry.meta.seoDescription || entry.meta.description,
  };
}

export default function TravelStylePage() {
  const entry = getContentBySlug('by-travel-style', 'index');
  if (!entry) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-red-800 to-red-950 text-white py-20">
        <div className="container-wide text-center relative z-10">
          <span className="text-5xl mb-4 block">🧭</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{entry.meta.title}</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">{entry.meta.description}</p>
        </div>
      </section>

      <article className="container-content py-10">
        <div className="prose dark:prose-invert max-w-none">
          <MDXContent source={entry.content} />
        </div>
      </article>
    </>
  );
}
