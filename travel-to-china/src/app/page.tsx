import Link from 'next/link';
import { getAllContent } from '@/lib/mdx';
import { Search, MapPin, Compass, Utensils, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/layout/ScrollReveal';

export default function HomePage() {
  const cities = getAllContent('cities');
  const countryArticles = getAllContent('country');

  return (
    <>
      {/* Hero — magazine editorial style, warm and inviting */}
      <section className="relative overflow-hidden bg-[var(--surface)]">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='1' fill='black'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px',
          }}
        />
        {/* Decorative curve */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--primary)]/3 -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--gold)]/4 translate-y-1/3 -translate-x-1/4 blur-3xl" />

        <div className="container-wide relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-[0.85rem] font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Discover the Middle Kingdom
            </div>

            <ScrollReveal style="steady">
              <h1 className="text-[2.75rem] md:text-[4.5rem] leading-[1.1] mb-5 text-[var(--foreground)] font-display tracking-wide">
                Your Journey to<br />
                <span className="text-[var(--primary)]">China</span> Begins Here
              </h1>
            </ScrollReveal>

            <ScrollReveal style="gentle" delay={150}>
              <p className="text-[1.1rem] md:text-[1.2rem] text-[var(--muted)] mb-10 leading-relaxed max-w-xl mx-auto">
                From ancient imperial capitals to futuristic skylines,<br className="hidden sm:block" />
                fiery Sichuan cuisine to misty karst mountains — all in one place.
              </p>
            </ScrollReveal>

            {/* Search */}
            <form action="/search" className="max-w-lg mx-auto relative mb-8">
              <input
                type="text"
                name="q"
                placeholder="Search destinations, food, tips..."
                className="w-full pl-12 pr-24 py-4 text-[1rem] rounded-xl text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)]
                           shadow-sm placeholder:text-[var(--muted)]/60
                           focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:shadow-md
                           transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]/50" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-[var(--primary)] text-white
                           font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors duration-200 text-[0.9rem]"
              >
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.85rem]">
              <span className="text-[var(--muted)]">Start with:</span>
              <Link href="/cities/beijing" className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline underline-offset-2 transition-colors">Beijing</Link>
              <span className="text-[var(--border)]">·</span>
              <Link href="/cities/shanghai" className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline underline-offset-2 transition-colors">Shanghai</Link>
              <span className="text-[var(--border)]">·</span>
              <Link href="/country/visa-policy" className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline underline-offset-2 transition-colors">Visa Guide</Link>
              <span className="text-[var(--border)]">·</span>
              <Link href="/country/payment-guide" className="text-[var(--primary)] hover:text-[var(--primary-hover)] underline underline-offset-2 transition-colors">Payment Tips</Link>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="relative h-10 md:h-16">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
            <path d="M0 40 Q180 65, 360 40 T720 40 T1080 40 T1440 40 L1440 80 L0 80 Z" fill="var(--background)" />
          </svg>
        </div>
      </section>

      {/* Quick Stats — refined, no card grid monotony */}
      <section className="container-wide py-16">
        <ScrollReveal style="fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-2xl bg-[var(--border)]/20 overflow-hidden">
            {[
              { icon: MapPin, value: '34', label: 'Provincial Regions' },
              { icon: Compass, value: '5,000+', label: 'Years of History' },
              { icon: Utensils, value: '8', label: 'Major Cuisines' },
              { icon: TrendingUp, value: '60M+', label: 'Annual Tourists' },
            ].map((stat, i) => (
              <div key={stat.label} className="bg-[var(--background)] p-8 text-center" style={{ animationDelay: `${i * 100}ms` }}>
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-[var(--primary)]/60" />
                <p className="text-[1.8rem] font-display tracking-wide text-[var(--foreground)]">{stat.value}</p>
                <p className="text-[0.85rem] text-[var(--muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Popular Cities — editorial grid */}
      <section className="container-wide py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[0.85rem] text-[var(--muted)] uppercase tracking-widest mb-3">Destinations</p>
            <h2 className="text-[2.25rem] font-display tracking-wide text-[var(--foreground)] leading-tight">
              Where to Go
            </h2>
          </div>
          <Link href="/cities" className="hidden sm:inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium text-[0.95rem] transition-colors group">
            View all cities <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Link key={city.slug} href={`/cities/${city.slug}`} className="card group overflow-hidden">
              <div className="aspect-[16/10] bg-[var(--surface)] relative overflow-hidden">
                {city.meta.image ? (
                  <img
                    src={city.meta.image}
                    alt={city.meta.title}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5">
                    <MapPin className="w-12 h-12 text-[var(--primary)]/20 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                )}
                {/* Region tag on image */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 text-[0.75rem] font-medium bg-[var(--background)]/90 backdrop-blur-sm text-[var(--foreground)] rounded-md shadow-sm">
                    {city.meta.region}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-[1.15rem] font-display tracking-wide group-hover:text-[var(--primary)] transition-colors mb-1.5">
                  {city.meta.title}
                </h3>
                <p className="text-[0.875rem] text-[var(--muted)] line-clamp-2 leading-relaxed">
                  {city.meta.description}
                </p>
                {city.meta.highlights && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {city.meta.highlights.slice(0, 3).map((h: string) => (
                      <span key={h} className="px-2 py-0.5 text-[0.75rem] text-[var(--muted)] bg-[var(--surface)] rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile "view all" link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/cities" className="inline-flex items-center gap-2 text-[var(--primary)] font-medium">
            View all cities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Country Guide — alternating layout */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] py-16">
        <div className="container-wide">
          <p className="text-[0.85rem] text-[var(--muted)] uppercase tracking-widest mb-3">Essential Reading</p>
          <h2 className="text-[2.25rem] font-display tracking-wide text-[var(--foreground)] leading-tight mb-10">
            China Travel Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/country/${article.slug}`}
                className="group p-6 rounded-xl hover:bg-[var(--card)] transition-all duration-300"
              >
                <h3 className="text-[1.05rem] font-display tracking-wide mb-2 group-hover:text-[var(--primary)] transition-colors">
                  {article.meta.title}
                </h3>
                <p className="text-[0.875rem] text-[var(--muted)] line-clamp-2 leading-relaxed mb-4">
                  {article.meta.description}
                </p>
                <span className="text-[0.875rem] text-[var(--primary)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-wide py-16">
        <div className="rounded-2xl bg-[var(--foreground)] p-10 md:p-14 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--primary)]/10 -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[var(--gold)]/10 translate-y-1/3 -translate-x-1/4 blur-3xl" />

          <div className="relative">
            <h2 className="text-[2rem] md:text-[2.5rem] font-display tracking-wide text-white mb-4">
              Ready to Explore China?
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-8 text-[1.05rem] leading-relaxed">
              Get the latest travel tips, destination guides, and insider recommendations delivered to your inbox.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--foreground)] px-8 py-3.5 rounded-xl font-medium text-[1rem] hover:bg-[var(--gold)]/90 transition-colors duration-200"
            >
              Subscribe Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
