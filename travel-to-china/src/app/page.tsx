import Link from 'next/link';
import { getAllContent } from '@/lib/mdx';
import { Search, MapPin, ArrowRight, Sparkles, Wallet, ScrollText, Wifi, MessageCircle, CheckCircle } from 'lucide-react';
import ScrollReveal from '@/components/layout/ScrollReveal';
import { webpUrl } from '@/lib/image-url';

export default function HomePage() {
  const cities = getAllContent('cities');
  const countryArticles = getAllContent('country');

  return (
    <>
      {/* Hero — full-screen background image with dark overlay */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image + overlay */}
        <div className="absolute inset-0">
          <img
            src={webpUrl('/images/home-hero-default.jpg')}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/50" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[var(--background)]" />
        </div>

        <div className="container-wide relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-[0.85rem] font-medium mb-8 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              Discover the Middle Kingdom
            </div>

            <ScrollReveal style="steady">
              <h1 className="text-[2.75rem] md:text-[4.5rem] leading-[1.1] mb-5 text-white font-display tracking-wide">
                Your Journey to<br />
                <span className="text-white">China</span> Begins Here
              </h1>
            </ScrollReveal>

            <ScrollReveal style="gentle" delay={150}>
              <p className="text-[1.1rem] md:text-[1.2rem] text-white/85 mb-10 leading-relaxed max-w-xl mx-auto">
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
                className="w-full pl-12 pr-24 py-4 text-[1rem] rounded-xl text-white bg-white/10 backdrop-blur-sm border border-white/20
                           shadow-sm placeholder:text-white/50
                           focus:outline-none focus:ring-1 focus:ring-white/60 focus:border-white/60 focus:shadow-md
                           transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-white text-[var(--primary)]
                           font-medium rounded-lg hover:bg-white/90 transition-colors duration-200 text-[0.9rem]"
              >
                Search
              </button>
            </form>

            {/* Quick links — pain-point focus */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.85rem]">
              <span className="text-white/70">Essential guides:</span>
              <Link href="/country/payment-guide-v2" className="text-white hover:text-white/80 underline underline-offset-2 transition-colors">Payment</Link>
              <span className="text-white/30">·</span>
              <Link href="/country/visa-tourist-guide" className="text-white hover:text-white/80 underline underline-offset-2 transition-colors">Visa</Link>
              <span className="text-white/30">·</span>
              <Link href="/country/internet-guide" className="text-white hover:text-white/80 underline underline-offset-2 transition-colors">Internet</Link>
              <span className="text-white/30">·</span>
              <Link href="/country/language-guide" className="text-white hover:text-white/80 underline underline-offset-2 transition-colors">Language</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Before You Go — essential practical guides */}
      <section className="container-wide py-16">
        <div className="text-center mb-10">
          <p className="text-[0.85rem] text-[var(--muted)] uppercase tracking-widest mb-3">Before You Go</p>
          <h2 className="text-[2.25rem] font-display tracking-wide text-[var(--foreground)] leading-tight">
            Everything You Need to Know
          </h2>
          <p className="text-[var(--muted)] mt-3 max-w-xl mx-auto">
            From payments to visas — get the practical stuff sorted before you pack
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Wallet, title: 'Payment Guide', desc: 'WeChat Pay, Alipay & cash tips', href: '/country/payment-guide-v2' },
            { icon: ScrollText, title: 'Visa Guide', desc: 'Tourist visa process made simple', href: '/country/visa-tourist-guide' },
            { icon: Wifi, title: 'Internet & SIM', desc: 'Stay connected in China', href: '/country/internet-guide' },
            { icon: MessageCircle, title: 'Language Guide', desc: 'Essential phrases & translation tools', href: '/country/language-guide' },
          ].map((card) => (
            <Link key={card.href} href={card.href} className="card p-6 group hover:border-[var(--primary)]/20 transition-all">
              <card.icon className="w-8 h-8 mb-3 text-[var(--primary)] group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-[1.05rem] mb-1 group-hover:text-[var(--primary)] transition-colors">{card.title}</h3>
              <p className="text-[0.85rem] text-[var(--muted)]">{card.desc}</p>
            </Link>
          ))}
        </div>
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
            View all {cities.length} cities <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.slice(0, 12).map((city) => (
            <Link key={city.slug} href={`/cities/${city.slug}`} className="card group overflow-hidden">
              <div className="aspect-[16/10] bg-[var(--surface)] relative overflow-hidden">
                {city.meta.image ? (
                  <img
                    src={webpUrl(city.meta.image)}
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

      {/* Plan Your Route */}
      <section className="container-wide py-12">
        <div className="text-center mb-10">
          <p className="text-[0.85rem] text-[var(--muted)] uppercase tracking-widest mb-3">Plan Your Trip</p>
          <h2 className="text-[2.25rem] font-display tracking-wide text-[var(--foreground)] leading-tight">
            Find Your Perfect Route
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { title: 'Golden Route', desc: "Beijing, Xi'an, Shanghai — the classic triangle for first-timers", href: '/routes/golden-route', label: '10-14 Days' },
            { title: '144-Hour Transit', desc: 'Visa-free 6-day trips via Beijing, Shanghai, or Guangzhou', href: '/routes/144-hour-transit', label: '6 Days' },
            { title: 'Food & Culture', desc: 'Eat your way across China with themed culinary routes', href: '/routes/themed/food', label: 'Flexible' },
          ].map((route) => (
            <Link key={route.href} href={route.href} className="card p-6 group text-center">
              <span className="inline-block px-2.5 py-0.5 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-full mb-3">{route.label}</span>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--primary)] transition-colors">{route.title}</h3>
              <p className="text-sm text-[var(--muted)]">{route.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/routes" className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium inline-flex items-center gap-2">
            View all routes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Country Guide — alternating layout */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] py-16">
        <div className="container-wide">
          <p className="text-[0.85rem] text-[var(--muted)] uppercase tracking-widest mb-3">Deep Dive</p>
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

      {/* Bottom CTA — lead magnet */}
      <section className="container-wide py-16">
        <div className="rounded-2xl bg-[var(--foreground)] p-10 md:p-14 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--primary)]/10 -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[var(--gold)]/10 translate-y-1/3 -translate-x-1/4 blur-3xl" />

          <div className="relative">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[var(--gold)]" />
            <h2 className="text-[2rem] md:text-[2.5rem] font-display tracking-wide text-white mb-4">
              Get the Free China Travel Checklist
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-8 text-[1.05rem] leading-relaxed">
              A printable pre-trip checklist: visa deadlines, payment setup, packing list, essential apps, and more. Everything you'll forget if you don't write it down.
            </p>
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--foreground)] px-8 py-3.5 rounded-xl font-medium text-[1rem] hover:bg-[var(--gold)]/90 transition-colors duration-200"
            >
              Get the Checklist <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
