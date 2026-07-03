import { getAllContent } from '@/lib/mdx';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { readingTime } from '@/lib/utils';

export const metadata = {
  title: 'China Travel Blog – Tips, Guides & Stories',
  description: 'Read our China travel blog — destination guides, itinerary ideas, food recommendations, visa tips, and firsthand travel stories from across China.',
};

export default function BlogIndexPage() {
  const posts = getAllContent('blog').sort(
    (a, b) => new Date(b.meta.date || '').getTime() - new Date(a.meta.date || '').getTime()
  );

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-red-800 to-red-950 text-white py-20">
        <div className="container-wide text-center relative z-10">
          <BookOpen className="w-14 h-14 mx-auto mb-5 opacity-90" />
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Travel Blog</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Practical tips, deep guides, and honest stories from traveling across China.
          </p>
        </div>
      </section>

      <section className="container-wide py-12">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-[var(--muted)]">Check back soon for new articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card group overflow-hidden hover:border-[var(--primary)]/30 transition-all"
              >
                <div className="flex gap-5 p-5">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--gold)]/20">
                    {post.meta.image ? (
                      <img src={post.meta.image} alt={post.meta.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-[var(--primary)]/40 group-hover:scale-125 transition-transform duration-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold mb-1.5 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                      {post.meta.title}
                    </h2>
                    <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">
                      {post.meta.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                      {post.meta.date && <span>{post.meta.date}</span>}
                      <span>{readingTime(post.content)} min read</span>
                      {post.meta.author && <span>By {post.meta.author}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
