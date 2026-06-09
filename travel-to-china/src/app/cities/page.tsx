import { getAllContent } from '@/lib/mdx';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export const metadata = {
  title: 'Popular Cities in China',
  description: 'Explore China\'s most popular travel destinations — Beijing, Shanghai, Chengdu, Xi\'an, Guilin, and more.',
};

export default function CitiesPage() {
  const cities = getAllContent('cities');

  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Popular Cities</h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Discover China's most fascinating cities — each with its own unique character, cuisine, and attractions.
          </p>
        </div>
      </section>

      <section className="container-wide py-12">
        {cities.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" />
            <h3 className="text-xl font-semibold mb-2">No cities found</h3>
            <p className="text-[var(--muted)]">Check back soon for city guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cities.map((city) => (
              <Link key={city.slug} href={`/cities/${city.slug}`} className="card p-6 group hover:border-[var(--primary)]/30">
                <div className="flex gap-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--gold)]/20">
                    {city.meta.image ? (
                      <img src={city.meta.image} alt={city.meta.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-10 h-10 text-[var(--primary)]/40 group-hover:scale-125 transition-transform duration-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold group-hover:text-[var(--primary)] transition-colors">
                        {city.meta.title}
                      </h2>
                      <span className="text-xs bg-[var(--card-hover)] text-[var(--muted)] px-2 py-0.5 rounded-full whitespace-nowrap">
                        {city.meta.region}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">{city.meta.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)] mb-3">
                      <span>Population: {city.meta.population}</span>
                      <span>Best: {city.meta.bestTimeToVisit}</span>
                    </div>
                    {city.meta.highlights && (
                      <div className="flex flex-wrap gap-1.5">
                        {city.meta.highlights.map((h) => (
                          <span key={h} className="px-2 py-0.5 text-xs font-medium bg-[var(--primary)]/5 text-[var(--primary)] rounded-full">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
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
