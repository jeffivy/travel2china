import Link from 'next/link';
import { Globe, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] mt-20">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-[var(--primary)]" />
              <span className="text-lg font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--gold)] bg-clip-text text-transparent">
                Travel to China
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">
              Your comprehensive guide to traveling in China — from ancient wonders to modern marvels.
            </p>
            <a
              href="mailto:contact@travels2china.com"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@travels2china.com
            </a>
          </div>

          {/* Country */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted)] mb-4">
              China Guide
            </h4>
            <ul className="space-y-2">
              <li><Link href="/country/overview" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Overview</Link></li>
              <li><Link href="/country/size-and-regions" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Size & Regions</Link></li>
              <li><Link href="/country/ethnic-groups" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Ethnic Groups</Link></li>
              <li><Link href="/country/food-culture" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Food Culture</Link></li>
              <li><Link href="/country/visa-policy" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Visa Policy</Link></li>
              <li><Link href="/country/travel-tips" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Travel Tips</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted)] mb-4">
              Popular Cities
            </h4>
            <ul className="space-y-2">
              <li><Link href="/cities/beijing" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Beijing</Link></li>
              <li><Link href="/cities/shanghai" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Shanghai</Link></li>
              <li><Link href="/cities/chengdu" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Chengdu</Link></li>
              <li><Link href="/cities/xian" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Xi&apos;an</Link></li>
              <li><Link href="/cities/guilin" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Guilin</Link></li>
              <li><Link href="/cities/chongqing" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Chongqing</Link></li>
              <li><Link href="/cities/guangzhou" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Guangzhou</Link></li>
              <li><Link href="/cities/shenzhen" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Shenzhen</Link></li>
              <li><Link href="/cities/hangzhou" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Hangzhou</Link></li>
              <li><Link href="/cities/kunming" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Kunming</Link></li>
              <li><Link href="/cities/qingdao" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Qingdao</Link></li>
              <li><Link href="/cities/harbin" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Harbin</Link></li>
              <li><Link href="/cities/xiamen" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Xiamen</Link></li>
              <li><Link href="/cities/suzhou" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Suzhou</Link></li>
              <li><Link href="/cities/nanjing" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Nanjing</Link></li>
              <li><Link href="/cities/zhuhai" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Zhuhai</Link></li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted)] mb-4">
              More
            </h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">About</Link></li>
              <li><Link href="/search" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Search</Link></li>
              <li><Link href="/subscribe" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Subscribe</Link></li>
              <li><Link href="/privacy" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-[var(--foreground)]/70 hover:text-[var(--primary)] transition-colors">Terms of Use</Link></li>
            </ul>

            <h4 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted)] mt-6 mb-4">
              Subscribe
            </h4>
            <form className="flex gap-2" action="/api/subscribe" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Your email"
                required
                className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg
                           bg-[var(--background)] text-[var(--foreground)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg
                           hover:opacity-90 transition-opacity"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Travel to China. All rights reserved.
          </p>
          <p className="text-sm text-[var(--muted)] flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[var(--primary)] fill-current" /> for travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
