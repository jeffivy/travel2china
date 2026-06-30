import Link from 'next/link';
import { Globe, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-24">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <Globe className="w-5 h-5 text-[var(--primary)] group-hover:rotate-12 transition-transform duration-500" />
              <span className="text-lg tracking-wide text-[var(--primary)] font-display">
                Travel to China
              </span>
            </Link>
            <p className="text-[0.9rem] text-[var(--muted)] leading-relaxed mb-4 max-w-xs">
              Your comprehensive guide to traveling in China — from ancient wonders to modern marvels.
            </p>
            <a
              href="mailto:contact@travels2china.com"
              className="inline-flex items-center gap-2 text-[0.9rem] text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@travels2china.com
            </a>
          </div>

          {/* Country */}
          <div>
            <h4 className="font-display text-sm tracking-wide text-[var(--foreground)] mb-5">
              China Guide
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/country/overview" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Overview</Link></li>
              <li><Link href="/country/size-and-regions" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Size & Regions</Link></li>
              <li><Link href="/country/ethnic-groups" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Ethnic Groups</Link></li>
              <li><Link href="/country/food-culture" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Food Culture</Link></li>
              <li><Link href="/country/visa-policy" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Visa Policy</Link></li>
              <li><Link href="/country/travel-tips" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Travel Tips</Link></li>
              <li><Link href="/country/payment-guide" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Payment Guide</Link></li>
              <li><Link href="/country/internet-guide" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Internet Guide</Link></li>
              <li><Link href="/country/language-guide" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Language Guide</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-display text-sm tracking-wide text-[var(--foreground)] mb-5">
              Popular Cities
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/cities/beijing" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Beijing</Link></li>
              <li><Link href="/cities/shanghai" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Shanghai</Link></li>
              <li><Link href="/cities/chengdu" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Chengdu</Link></li>
              <li><Link href="/cities/xian" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Xi&apos;an</Link></li>
              <li><Link href="/cities/guilin" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Guilin</Link></li>
              <li><Link href="/cities/chongqing" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Chongqing</Link></li>
              <li><Link href="/cities/guangzhou" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Guangzhou</Link></li>
              <li><Link href="/cities/hangzhou" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Hangzhou</Link></li>
              <li><Link href="/cities/kunming" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Kunming</Link></li>
              <li><Link href="/cities/xiamen" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Xiamen</Link></li>
              <li><Link href="/cities/nanjing" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Nanjing</Link></li>
              <li><Link href="/cities/suzhou" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Suzhou</Link></li>
            </ul>
          </div>

          {/* More + Subscribe */}
          <div>
            <h4 className="font-display text-sm tracking-wide text-[var(--foreground)] mb-5">
              More
            </h4>
            <ul className="space-y-2.5">
              <li><Link href="/routes" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Routes</Link></li>
              <li><Link href="/by-travel-style" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Travel Styles</Link></li>
              <li><Link href="/comparison" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Compare Cities</Link></li>
              <li><Link href="/about" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">About</Link></li>
              <li><Link href="/search" className="text-[0.9rem] text-[var(--foreground)]/65 hover:text-[var(--primary)] transition-colors">Search</Link></li>
            </ul>

            <h4 className="font-display text-sm tracking-wide text-[var(--foreground)] mt-8 mb-4">
              Subscribe
            </h4>
            <form className="flex gap-2" action="/api/subscribe" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1 px-3 py-2.5 text-[0.9rem] border border-[var(--border)] rounded-lg
                           bg-[var(--background)] text-[var(--foreground)]
                           focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]
                           transition-all duration-200"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-[0.9rem] font-medium bg-[var(--primary)] text-white rounded-lg
                           hover:bg-[var(--primary-hover)] transition-colors duration-200"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[0.85rem] text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Travel to China. All rights reserved.
          </p>
          <p className="text-[0.85rem] text-[var(--muted)] flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-[var(--primary)] fill-current" /> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
