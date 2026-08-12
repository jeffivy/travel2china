import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass, Clock, UtensilsCrossed, Landmark, TreePine, ArrowRight,
  MapPin, Calendar, Plane, Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'China Travel Routes & Itineraries – Plan Your Perfect Trip',
  description:
    'Find the best China travel route for your trip. Classic Golden Route, 144-hour transit itineraries, themed tours for food & history, and routes by duration or gateway city.',
  keywords: [
    'China travel routes',
    'China itinerary',
    'plan China trip',
    'best China route',
    'China Golden Route',
    '144-hour transit route',
  ],
};

const ROUTE_STYLES = [
  {
    title: 'Golden Route',
    subtitle: 'Classic First-Timer Journey',
    description:
      'Beijing → Xi\'an → Shanghai. The iconic triangle that covers imperial history, ancient capitals, and futuristic skylines. Perfect for first-time visitors with 10–14 days.',
    icon: Landmark,
    href: '/routes/golden-route',
    region: 'north' as const,
  },
  {
    title: '144-Hour Transit Routes',
    subtitle: 'Visa-Free Quick Trips',
    description:
      'Maximize China\'s 144-hour transit policy. 6-day blitz itineraries in Beijing, Shanghai, Guangzhou, Chengdu, and beyond — no visa required.',
    icon: Clock,
    href: '/routes/144-hour-transit',
    region: 'east' as const,
  },
  {
    title: 'Food Routes',
    subtitle: 'Culinary Journeys',
    description:
      'Eat your way across China. Sichuan spice trail, Cantonese dim sum pilgrimage, Xi\'an Silk Road noodles, and a Shanghai-to-Chengdu hot pot odyssey.',
    icon: UtensilsCrossed,
    href: '/routes/themed/food',
    region: 'south' as const,
  },
  {
    title: 'History & Culture Routes',
    subtitle: 'Ancient Capitals & Silk Roads',
    description:
      'Walk through 3,000 years of civilization. Follow the Silk Road, explore the Four Great Ancient Capitals, and trace the Ming and Qing dynasties.',
    icon: Landmark,
    href: '/routes/themed/history',
    region: 'northwest' as const,
  },
  {
    title: 'Nature & Adventure Routes',
    subtitle: 'Mountains, Rivers & Wild China',
    description:
      'Karst peaks of Guilin, Tiger Leaping Gorge in Yunnan, the grasslands of Inner Mongolia, and the Himalayan borderlands of western Sichuan.',
    icon: TreePine,
    href: '/routes/themed/nature',
    region: 'west' as const,
  },
  {
    title: 'By Duration',
    subtitle: 'Trips for Every Timeline',
    description:
      'Whether you have 3 days, 1 week, 2 weeks, or a month — find itineraries optimized for your available time, with suggested city combinations.',
    icon: Calendar,
    href: '/routes/by-duration',
    region: 'south' as const,
  },
];

const GATEWAY_CITIES = [
  { city: 'Beijing', slug: 'beijing', image: '/images/beijing.jpg', description: 'The capital — Great Wall, Forbidden City, and the most international flight connections' },
  { city: 'Shanghai', slug: 'shanghai', image: '/images/shanghai.jpg', description: 'China\'s global city — direct flights everywhere, 144-hour transit eligible' },
  { city: 'Guangzhou', slug: 'guangzhou', image: '/images/guangzhou.jpg', description: 'Southern gateway — Canton Fair legacy, dim sum capital, excellent ASEAN connections' },
  { city: 'Chengdu', slug: 'chengdu', image: '/images/chengdu.jpg', description: 'Western hub — pandas, spicy food, and growing direct flights from Europe and Asia' },
];

const POPULAR_ROUTES = [
  {
    title: 'Beijing → Xi\'an → Shanghai (12 Days)',
    description: 'The classic triangle. Forbidden City, Great Wall, Terracotta Warriors, and the Bund in one seamless itinerary.',
    image: '/images/beijing.jpg',
    tags: ['First-Timer', 'Classic', '12 Days'],
  },
  {
    title: 'Shanghai 144-Hour Transit (6 Days)',
    description: 'Fly in, explore Shanghai + Suzhou + Hangzhou for 6 days visa-free, then continue to Tokyo or Hong Kong.',
    image: '/images/shanghai.jpg',
    tags: ['Visa-Free', 'Quick Trip', '6 Days'],
  },
  {
    title: 'Chengdu → Chongqing Hot Pot Trail (7 Days)',
    description: 'Pandas in the morning, fiery hot pot at night. Two neighboring megacities, one legendary spice corridor.',
    image: '/images/chengdu.jpg',
    tags: ['Food', 'Spice', '7 Days'],
  },
];

export default function RoutesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 py-20 border-b border-[var(--border)]">
        <div className="container-wide text-center relative z-10">
          <Compass className="w-14 h-14 mx-auto mb-5 text-[var(--primary)]" />
          <h1 className="text-4xl md:text-6xl mb-4 text-[var(--foreground)]">
            China Travel Routes & Itineraries
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto">
            From a 6-day visa-free blitz to a month-long Silk Road odyssey — find the perfect China route for your trip style, timeline, and starting city.
          </p>
        </div>
      </section>

      {/* Route Styles Card Grid */}
      <section className="container-wide py-16">
        <h2 className="text-3xl font-bold mb-3">Choose Your Route by Style</h2>
        <p className="text-[var(--muted)] mb-8">Every traveler is different. Pick the approach that fits you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROUTE_STYLES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              data-region={route.region}
              className="card p-6 group border-2 transition-all duration-300 hover:shadow-lg
                         bg-[var(--region-surface)] border-[var(--region-primary)]/20
                         hover:border-[var(--region-primary)]/40"
            >
              <route.icon className="w-10 h-10 mb-4 text-[var(--region-primary)] group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-1 group-hover:text-[var(--region-primary)] transition-colors">
                {route.title}
              </h3>
              <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-3">
                {route.subtitle}
              </p>
              <p className="text-sm text-[var(--muted)] mb-4 line-clamp-3">
                {route.description}
              </p>
              <span className="text-sm text-[var(--primary)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                View Routes <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Not Sure Where to Start */}
      <section className="bg-[var(--card)] border-y border-[var(--border)] py-16">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-8 text-center">Not Sure Where to Start?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'First time in China?',
                a: 'Start with the Golden Route — Beijing → Xi\'an → Shanghai. It\'s the classic for a reason: imperial history, ancient capitals, and modern China in one perfectly connected loop.',
                href: '/routes/golden-route',
              },
              {
                q: 'Only have 6 days (no visa)?',
                a: 'Use the 144-hour transit policy. Fly into Shanghai, Beijing, or Guangzhou, explore for 6 days visa-free, then continue to a third country. Quick, legal, and surprisingly rich.',
                href: '/routes/144-hour-transit',
              },
              {
                q: 'Been to China before?',
                a: 'Go deeper with themed routes — a Sichuan-Yunnan food journey, a Silk Road history expedition, or a Guilin-Zhangjiajie nature immersion.',
                href: '/routes/themed/food',
              },
            ].map((item) => (
              <Link key={item.q} href={item.href} className="card p-6 group text-center">
                <Sparkles className="w-8 h-8 mx-auto mb-3 text-[var(--gold)]" />
                <p className="font-bold text-lg mb-2">{item.q}</p>
                <p className="text-sm text-[var(--muted)] mb-4">{item.a}</p>
                <span className="text-sm text-[var(--primary)] font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes This Month */}
      <section className="container-wide py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popular Routes This Month</h2>
            <p className="text-[var(--muted)]">What travelers are planning right now</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route) => (
            <Link key={route.title} href="/routes/golden-route" className="card group overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--gold)]/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-[var(--primary)]/30 group-hover:scale-125 transition-transform duration-500" />
                </div>
                <div className="absolute bottom-3 left-3 flex gap-1.5">
                  {route.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-[var(--primary)] rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                  {route.title}
                </h3>
                <p className="text-sm text-[var(--muted)] line-clamp-2">{route.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* By Gateway City */}
      <section className="bg-[var(--card)] border-y border-[var(--border)] py-16">
        <div className="container-wide">
          <h2 className="text-3xl font-bold mb-8">Plan by Gateway City</h2>
          <p className="text-[var(--muted)] mb-8">
            Already know which city you're flying into? Start there and build outward.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GATEWAY_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="card group overflow-hidden"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--gold)]/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plane className="w-10 h-10 text-[var(--primary)]/30 group-hover:scale-125 transition-transform duration-500" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold group-hover:text-[var(--primary)] transition-colors">
                    {city.city}
                  </h3>
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{city.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-16">
        <div className="card p-8 md:p-12 text-center bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5 border-[var(--gold)]/20">
          <h2 className="text-3xl font-bold mb-4">Still Planning Your Route?</h2>
          <p className="text-[var(--muted)] max-w-xl mx-auto mb-8">
            Each route page includes day-by-day itineraries, recommended hotels, transport options, and estimated budgets. Pick a style and start exploring.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/routes/golden-route" className="btn-primary">Golden Route</Link>
            <Link href="/routes/144-hour-transit" className="btn-outline">144-Hour Transit</Link>
            <Link href="/cities" className="btn-outline">Browse All Cities</Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="container-wide pb-16">
        <div className="border-t border-[var(--border)] pt-10">
          <h3 className="text-lg font-bold mb-4">Essential Reading Before You Plan</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Link href="/country/visa-tourist-guide" className="text-[var(--primary)] hover:underline">Visa Guide 2026</Link>
            <Link href="/country/payment-guide-v2" className="text-[var(--primary)] hover:underline">Payment Guide</Link>
            <Link href="/country/internet-guide" className="text-[var(--primary)] hover:underline">Internet & SIM Guide</Link>
            <Link href="/country/language-guide" className="text-[var(--primary)] hover:underline">Language Guide</Link>
            <Link href="/country/travel-tips" className="text-[var(--primary)] hover:underline">Travel Tips</Link>
            <Link href="/country/overview" className="text-[var(--primary)] hover:underline">China Overview</Link>
            <Link href="/cities/beijing" className="text-[var(--primary)] hover:underline">Beijing Guide</Link>
            <Link href="/cities/shanghai" className="text-[var(--primary)] hover:underline">Shanghai Guide</Link>
          </div>
        </div>
      </section>
    </>
  );
}
