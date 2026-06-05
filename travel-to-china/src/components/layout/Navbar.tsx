'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X, Search, Globe, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  {
    label: 'Country',
    href: '/country',
    children: [
      { label: 'Overview', href: '/country/overview' },
      { label: 'Size & Regions', href: '/country/size-and-regions' },
      { label: 'Ethnic Groups', href: '/country/ethnic-groups' },
      { label: 'Food Culture', href: '/country/food-culture' },
      { label: 'Visa Policy', href: '/country/visa-policy' },
    ],
  },
  {
    label: 'Cities',
    href: '/cities',
  },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--background)]/95 backdrop-blur-md shadow-lg border-b border-[var(--border)]'
          : 'bg-[var(--background)] border-b border-transparent'
      }`}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="w-7 h-7 text-[var(--primary)] group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--gold)] bg-clip-text text-transparent">
              Travel to China
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                      pathname.startsWith(item.href)
                        ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                        : 'text-[var(--foreground)]/80 hover:text-[var(--primary)] hover:bg-[var(--card-hover)]'
                    }`}
                  >
                    {item.label}
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            pathname === child.href
                              ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                              : 'text-[var(--foreground)]/80 hover:bg-[var(--card-hover)] hover:text-[var(--primary)]'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                      : 'text-[var(--foreground)]/80 hover:text-[var(--primary)] hover:bg-[var(--card-hover)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Search */}
            <form onSubmit={handleSearch} className="relative ml-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-40 pl-9 pr-3 py-2 text-sm border border-[var(--border)] rounded-lg
                           bg-[var(--card)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                           focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                           transition-all duration-200"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[var(--muted)]" />
            </form>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth */}
            {session ? (
              <div className="relative ml-2" onMouseEnter={() => setOpenDropdown('user')} onMouseLeave={() => setOpenDropdown(null)}>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                                   bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--card-hover)]
                                   transition-colors">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  <span className="max-w-[100px] truncate">{session.user?.name}</span>
                </button>
                {openDropdown === 'user' && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl py-2 animate-in fade-in duration-200">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="ml-2 px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg
                           hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Toggles */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/search" className="p-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-[var(--border)] py-4 animate-in slide-in-from-top-2 duration-200">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div key={item.href} className="mb-2">
                  <p className="px-4 py-2 text-sm font-semibold text-[var(--muted)] uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-4 py-2 text-sm rounded-lg mx-2 ${
                        pathname === child.href
                          ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                          : 'text-[var(--foreground)]/80 hover:bg-[var(--card-hover)]'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg mx-2 ${
                    pathname === item.href
                      ? 'text-[var(--primary)] bg-[var(--primary)]/10'
                      : 'text-[var(--foreground)]/80 hover:bg-[var(--card-hover)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="border-t border-[var(--border)] mt-2 pt-2">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 rounded-lg mx-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-[var(--primary)] rounded-lg mx-2 hover:bg-[var(--card-hover)]"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
