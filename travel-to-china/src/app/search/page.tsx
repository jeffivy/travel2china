'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 2) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      doSearch(query);
    }
  }, [query, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-12">
        <div className="container-content text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Search</h1>
          <p className="text-[var(--muted)] mb-6">Find articles, city guides, and travel tips</p>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for destinations, food, tips..."
              className="w-full pl-12 pr-24 py-4 text-lg border border-[var(--border)] rounded-xl
                         bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-sm" disabled={loading}>
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="container-content py-10">
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--primary)]" />
            <p className="mt-4 text-[var(--muted)]">Searching...</p>
          </div>
        ) : searched ? (
          <>
            <p className="text-sm text-[var(--muted)] mb-6">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            {results.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-12 h-12 mx-auto mb-4 text-[var(--muted)] opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-[var(--muted)]">Try different keywords or browse our city guides.</p>
                <Link href="/cities" className="btn-outline inline-flex mt-4">Browse Cities</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result: any, i: number) => (
                  <Link
                    key={i}
                    href={`/${result.category === 'cities' ? 'cities' : 'country'}/${result.slug}`}
                    className="card p-6 block group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium uppercase bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full">
                        {result.category}
                      </span>
                      <h3 className="text-lg font-bold group-hover:text-[var(--primary)] transition-colors">
                        {result.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[var(--muted)] line-clamp-2">{result.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto mb-4 text-[var(--muted)] opacity-50" />
            <p className="text-[var(--muted)]">Enter a search term to find content.</p>
          </div>
        )}
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <Loader2 className="w-8 h-8 mx-auto animate-spin text-[var(--primary)]" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
