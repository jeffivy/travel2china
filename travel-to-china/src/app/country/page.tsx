import { getAllContent } from '@/lib/mdx';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'China Overview — Country Guide',
  description: 'Comprehensive guide to China — geography, ethnic groups, food culture, and visa policies.',
};

export default function CountryPage() {
  const articles = getAllContent('country');

  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">China Country Guide</h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Everything you need to know about China before your trip — from geography and culture to practical visa information.
          </p>
        </div>
      </section>

      <section className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link key={article.slug} href={`/country/${article.slug}`} className="card p-8 group hover:border-[var(--primary)]/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--primary)]/20 transition-colors">
                  <BookOpen className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {article.meta.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mb-4">{article.meta.description}</p>
                  <span className="text-sm text-[var(--primary)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
