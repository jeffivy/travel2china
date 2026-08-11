import { Globe, Heart, Map, Camera, Mail, Edit3, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Travel to China — Our Story, Mission & Editorial Standards',
  description: 'Learn about the Travel to China team, our editorial process, how we research and fact-check our guides, and why thousands of travelers trust us for their China trip planning.',
  openGraph: {
    title: 'About Travel to China — Our Story, Mission & Editorial Standards',
    description: 'Meet the team behind Travel to China and learn how we create accurate, up-to-date guides for travelers.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16 border-b border-[var(--border)]">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide">About Travel to China</h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl">
            We build the guide we wish we'd had before our first trip to China — accurate, practical, and written from real experience.
          </p>
        </div>
      </section>

      <section className="container-content py-12 space-y-12">
        {/* Our Story */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4 font-display tracking-wide">Our Story</h2>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-4">
            Travel to China started with a frustrating experience: planning a trip to China was overwhelming.
            Scattered information across dozens of forums, outdated blog posts, conflicting advice about payments and visas,
            and government websites that assumed you already knew how everything worked.
          </p>
          <p className="text-[var(--foreground)]/80 leading-relaxed mb-4">
            We built Travel to China to solve that problem — a single, well-organized resource that covers everything
            a foreign traveler needs: from setting up Alipay before you fly, to choosing which section of the Great Wall to visit,
            to understanding the difference between a tourist L visa and the 144-hour transit policy.
          </p>
          <p className="text-[var(--foreground)]/80 leading-relaxed">
            Our guides are used by travelers from <strong>the United States, United Kingdom, Australia, and across Europe</strong> —
            first-timers nervous about the language barrier, seasoned travelers looking for off-the-beaten-path destinations,
            families planning multi-city itineraries, and business travelers squeezing sightseeing between meetings.
          </p>
        </div>

        {/* Editorial Standards */}
        <div>
          <h2 className="text-2xl font-bold mb-6 font-display tracking-wide">How We Create Our Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Edit3,
                title: 'Research-Driven',
                desc: 'Every guide starts with extensive research: official government sources, first-hand traveler reports, local Chinese-language resources, and cross-referencing multiple sources to verify accuracy.',
              },
              {
                icon: ShieldCheck,
                title: 'Fact-Checked & Updated',
                desc: 'We regularly review and update our content. When China\'s visa policy changes or a new payment regulation rolls out, we update the relevant guides — usually within 48 hours.',
              },
              {
                icon: Users,
                title: 'Traveler-Verified',
                desc: 'We incorporate real feedback from travelers on the ground. Comments, emails, and community input help us catch changes before official sources announce them.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon className="w-8 h-8 text-[var(--primary)] mb-3" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Cover */}
        <div>
          <h2 className="text-2xl font-bold mb-6 font-display tracking-wide">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Map,
                title: 'City & Destination Guides',
                desc: '30+ cities covered with attraction rankings, month-by-month weather tables, suggested itineraries, food guides with restaurant recommendations, and honest tourist trap warnings.',
              },
              {
                icon: Globe,
                title: 'Practical Country Info',
                desc: 'Detailed guides on China\'s visa policies, mobile payment setup (Alipay & WeChat Pay), internet access and VPNs, SIM cards, language tips, transportation, and cultural etiquette.',
              },
              {
                icon: Camera,
                title: 'Route Planning',
                desc: 'Pre-built itineraries like the Golden Route (Beijing–Xi\'an–Shanghai), 144-hour transit routes, themed food journeys, and region-specific routes through Yunnan, Xinjiang, and Sichuan.',
              },
              {
                icon: Heart,
                title: 'Travel Style Guides',
                desc: 'Tailored advice for budget backpackers, family travelers, business visitors, and senior travelers — because a 22-year-old hostel-hopper has different needs than a family of four.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon className="w-8 h-8 text-[var(--primary)] mb-3" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency */}
        <div className="card p-8 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5">
          <h2 className="text-2xl font-bold mb-4 font-display tracking-wide">Transparency</h2>
          <div className="space-y-4 text-[var(--foreground)]/80 leading-relaxed">
            <p>
              <strong>How we fund this site:</strong> Travel to China is reader-supported. We may earn a commission
              when you book hotels or buy products through affiliate links on our site, at no extra cost to you.
              We never accept payment for positive coverage, and our recommendations are based on research and traveler feedback — not advertiser relationships.
            </p>
            <p>
              <strong>AI usage disclosure:</strong> We use AI tools to assist with research, drafting, and content organization.
              However, every guide is reviewed, fact-checked, and edited by humans before publication.
              AI helps us cover more destinations and keep information current — it does not replace editorial judgment.
            </p>
            <p>
              <strong>Corrections policy:</strong> If you find an error or outdated information, please let us know
              via the contact form below. We correct verified errors promptly and note the update date on the page.
            </p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="card p-8 text-center">
          <Mail className="w-10 h-10 mx-auto mb-4 text-[var(--primary)]" />
          <h2 className="text-2xl font-bold mb-3 font-display tracking-wide">Get In Touch</h2>
          <p className="text-[var(--muted)] mb-6 max-w-lg mx-auto">
            Have a question about traveling in China? Found something that needs updating?
            Want to share your own China travel experience? We read every message.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/subscribe" className="btn-primary px-8 py-3">
              Subscribe & Contact
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium transition-colors">
              Start exploring →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
