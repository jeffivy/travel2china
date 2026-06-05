import { Globe, Heart, Map, Camera, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Travel to China',
  description: 'Learn about Travel to China — your comprehensive guide to traveling in China.',
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16">
        <div className="container-wide text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About This Guide</h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Your trusted companion for exploring the Middle Kingdom.
          </p>
        </div>
      </section>

      <section className="container-content py-12">
        {/* Mission */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-4">
            Travel to China was created to help international travelers navigate the incredible diversity of China —
            from planning visas and understanding cultural nuances, to discovering hidden gems beyond the typical
            tourist trail.
          </p>
          <p className="text-[var(--foreground)]/80 leading-relaxed">
            We believe that travel is the best way to bridge cultures. Our goal is to make China accessible,
            understandable, and unforgettable for every visitor.
          </p>
        </div>

        {/* What We Offer */}
        <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Map, title: 'City Guides', desc: 'In-depth guides to China\'s most popular destinations with practical tips on attractions, food, and transportation.' },
            { icon: Globe, title: 'Cultural Insights', desc: 'Understand Chinese customs, etiquette, and traditions to make your trip more meaningful.' },
            { icon: Camera, title: 'Travel Planning', desc: 'Practical advice on visas, best times to visit, packing lists, and itinerary planning.' },
            { icon: Heart, title: 'Local Favorites', desc: 'Curated recommendations from locals — the best restaurants, hidden spots, and authentic experiences.' },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <item.icon className="w-8 h-8 text-[var(--primary)] mb-3" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="card p-8 text-center bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5">
          <Mail className="w-10 h-10 mx-auto mb-4 text-[var(--primary)]" />
          <h2 className="text-2xl font-bold mb-3">Get In Touch</h2>
          <p className="text-[var(--muted)] mb-6">
            Have suggestions, questions, or want to contribute? We'd love to hear from you.
          </p>
          <Link href="/subscribe" className="btn-primary">
            Contact & Subscribe
          </Link>
        </div>
      </section>
    </>
  );
}
