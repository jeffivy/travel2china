import Link from 'next/link';
import { getAllContent } from '@/lib/mdx';
import { Search, MapPin, Compass, Utensils, ArrowRight, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const cities = getAllContent('cities');
  const countryArticles = getAllContent('country');

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)] via-red-800 to-red-950 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L55 30 L30 55 L5 30 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
        }} />
        <div className="container-wide relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-medium tracking-wide mb-2 leading-tight text-white/90">
              Discover the Wonders of
            </h1>
            <p className="text-5xl md:text-8xl font-extrabold tracking-tight mb-6 leading-none text-[var(--gold)]">
              China
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
              Your complete travel guide to China — from ancient imperial capitals to futuristic skylines,
              from fiery Sichuan cuisine to misty karst mountains.
            </p>
            <form action="/search" className="max-w-xl mx-auto relative">
              <input
                type="text"
                name="q"
                placeholder="Search destinations, food, tips..."
                className="w-full pl-12 pr-24 py-4 text-lg rounded-xl text-gray-900 bg-white shadow-xl
                           placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[var(--gold)]/40"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-[var(--primary)] text-white
                           font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8 md:h-12">
            <path d="M0 40 C240 60, 480 10, 720 30 C960 50, 1200 15, 1440 40 L1440 60 L0 60 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: MapPin, value: '34', label: 'Provincial Regions' },
            { icon: Compass, value: '5,000+', label: 'Years of History' },
            { icon: Utensils, value: '8', label: 'Major Cuisines' },
            { icon: TrendingUp, value: '60M+', label: 'Annual Tourists' },
          ].map((stat) => (
            <div key={stat.label} className="card p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-[var(--primary)]" />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="container-wide py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Destinations</h2>
            <p className="text-[var(--muted)]">Start your journey from these iconic cities</p>
          </div>
          <Link href="/cities" className="btn-outline hidden sm:inline-flex items-center gap-2">
            All Cities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link key={city.slug} href={`/cities/${city.slug}`} className="card group overflow-hidden">
              <div className="aspect-[16/10] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--gold)]/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-[var(--primary)]/30 group-hover:scale-150 transition-transform duration-500" />
                </div>
                {city.meta.highlights && (
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {city.meta.highlights.slice(0, 2).map((h) => (
                      <span key={h} className="px-2 py-0.5 text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[var(--primary)] rounded-full">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold group-hover:text-[var(--primary)] transition-colors">
                    {city.meta.title}
                  </h3>
                  <span className="text-xs text-[var(--muted)] bg-[var(--card-hover)] px-2 py-0.5 rounded-full">
                    {city.meta.region}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">{city.meta.description}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <span>{city.meta.population}</span>
                  <span>{city.meta.bestTimeToVisit}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Country Guide */}
      <section className="bg-[var(--card)] border-y border-[var(--border)] py-12">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-8">China Travel Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countryArticles.map((article) => (
              <Link key={article.slug} href={`/country/${article.slug}`} className="card p-6 group hover:border-[var(--primary)]/30">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {article.meta.title}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4 line-clamp-3">{article.meta.description}</p>
                <span className="text-sm text-[var(--primary)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-16">
        <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5 border-[var(--gold)]/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore China?</h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto mb-8">
            Get the latest travel tips, destination guides, and insider recommendations delivered to your inbox.
          </p>
          <Link href="/subscribe" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
            Subscribe Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
