'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X, Search, Globe, User, LogOut, ChevronDown } from 'lucide-react';
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
      { label: 'Travel Tips', href: '/country/travel-tips' },
      { label: 'Payment Guide', href: '/country/payment-guide-v2' },
      { label: 'Tourist Visa Guide', href: '/country/visa-tourist-guide' },
      { label: 'Internet Guide', href: '/country/internet-guide' },
      { label: 'Language Guide', href: '/country/language-guide' },
    ],
  },
  { label: 'Routes', href: '/routes' },
  { label: 'Blog', href: '/blog' },
  { label: 'Travel Styles', href: '/by-travel-style' },
  { label: 'Compare', href: '/comparison' },
  { label: 'Tools', href: '/tools' },
  {
    label: 'Cities',
    href: '/cities',
    children: [
      { label: 'Beijing', href: '/cities/beijing' },
      { label: 'Shanghai', href: '/cities/shanghai' },
      { label: 'Chengdu', href: '/cities/chengdu' },
      { label: "Xi'an", href: '/cities/xian' },
      { label: 'Guilin', href: '/cities/guilin' },
      { label: 'Chongqing', href: '/cities/chongqing' },
      { label: 'Guangzhou', href: '/cities/guangzhou' },
      { label: 'Shenzhen', href: '/cities/shenzhen' },
      { label: 'Hangzhou', href: '/cities/hangzhou' },
      { label: 'Kunming', href: '/cities/kunming' },
      { label: 'Qingdao', href: '/cities/qingdao' },
      { label: 'Harbin', href: '/cities/harbin' },
      { label: 'Xiamen', href: '/cities/xiamen' },
      { label: 'Suzhou', href: '/cities/suzhou' },
      { label: 'Nanjing', href: '/cities/nanjing' },
      { label: 'Zhuhai', href: '/cities/zhuhai' },
      { label: 'Lijiang', href: '/cities/lijiang' },
      { label: 'Zhangjiajie', href: '/cities/zhangjiajie' },
      { label: 'Luoyang', href: '/cities/luoyang' },
      { label: 'Dunhuang', href: '/cities/dunhuang' },
      { label: 'Huangshan', href: '/cities/huangshan' },
      { label: 'Wuhan', href: '/cities/wuhan' },
      { label: 'Dali', href: '/cities/dali' },
      { label: 'Jiuzhaigou', href: '/cities/jiuzhaigou' },
      { label: 'Lhasa', href: '/cities/lhasa' },
      { label: 'Changbaishan', href: '/cities/changbaishan' },
      { label: 'Kashgar', href: '/cities/kashgar' },
      { label: 'Hong Kong', href: '/cities/hongkong' },
      { label: 'Sanya', href: '/cities/sanya' },
    ],
  },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<{ title: string; slug: string; category: string; description?: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      // Debounce suggestions fetch
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(value.trim())}`);
          if (res.ok) {
            const data = await res.json();
            setSearchSuggestions(data.suggestions || []);
            setShowSuggestions(true);
          }
        } catch { /* ignore */ }
      }, 200);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const isActive = (href: string, checkChildren = false) => {
    if (pathname === href) return true;
    if (checkChildren && pathname.startsWith(href + '/')) return true;
    return false;
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[var(--background)] backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-[var(--border)]'
          : 'bg-[var(--background)] border-b border-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-[4.25rem]">
          {/* Logo — solid color, no gradient (gral compliant) */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Globe className="w-6 h-6 text-[var(--primary)] group-hover:rotate-12 transition-transform duration-500" />
            <span className="text-[1.35rem] tracking-wide text-[var(--primary)] font-display">
              Travel to China
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimer.current) clearTimeout(closeTimer.current);
                    setOpenDropdown(item.label);
                  }}
                  onMouseLeave={() => {
                    closeTimer.current = setTimeout(() => setOpenDropdown(null), 200);
                  }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-3.5 py-2 text-[0.9rem] font-medium transition-colors flex items-center gap-1
                      ${isActive(item.href, true)
                        ? 'text-[var(--primary)]'
                        : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                      }`}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    {/* Active underline */}
                    {isActive(item.href, true) && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[var(--primary)] rounded-full" />
                    )}
                  </Link>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-56 max-h-[70vh] overflow-y-auto bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="absolute -top-1.5 left-5 w-3 h-3 bg-[var(--card)] border-t border-l border-[var(--border)] rotate-45" />
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-[0.9rem] transition-colors ${
                            pathname === child.href
                              ? 'text-[var(--primary)] font-medium bg-[var(--primary-light)]'
                              : 'text-[var(--muted)] hover:bg-[var(--card-hover)] hover:text-[var(--foreground)]'
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
                  className={`relative px-3.5 py-2 text-[0.9rem] font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-[var(--primary)]'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] bg-[var(--primary)] rounded-full" />
                  )}
                </Link>
              )
            )}

            {/* Search */}
            <form onSubmit={handleSearch} className="relative ml-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => { if (searchSuggestions.length > 0) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search..."
                aria-label="Search cities and routes"
                role="search"
                className="w-36 pl-9 pr-3 py-2 text-[0.9rem] border border-[var(--border)] rounded-lg
                           bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                           focus:outline-none focus:ring-1 focus:ring-[var(--primary)] focus:border-[var(--primary)]
                           focus:w-52 transition-all duration-300"
              />
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-[var(--muted)]" />
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 w-72 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 z-50">
                  {searchSuggestions.map((s, i) => {
                    const href = s.category === 'cities' ? `/cities/${s.slug}` :
                                 s.category === 'country' ? `/country/${s.slug}` :
                                 `/search?q=${encodeURIComponent(s.title)}`;
                    return (
                      <a
                        key={i}
                        href={href}
                        className="block px-4 py-2 text-sm hover:bg-[var(--card-hover)] transition-colors"
                      >
                        <span className="font-medium text-[var(--foreground)]">{s.title}</span>
                        <span className="ml-2 text-xs text-[var(--muted)] capitalize">{s.category}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </form>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth */}
            {session ? (
              <div
                className="relative ml-1"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setOpenDropdown('user');
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setOpenDropdown(null), 200);
                }}
              >
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.9rem] font-medium
                                   border border-transparent hover:border-[var(--border)] hover:bg-[var(--card-hover)]
                                   transition-all duration-200">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-6 h-6 rounded-full ring-2 ring-[var(--primary-light)]" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="max-w-[90px] truncate">{session.user?.name}</span>
                </button>
                {openDropdown === 'user' && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 animate-in fade-in duration-200">
                    <div className="absolute -top-1.5 right-5 w-3 h-3 bg-[var(--card)] border-t border-l border-[var(--border)] rotate-45" />
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[0.9rem] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/admin' })}
                className="ml-2 px-4 py-2 text-[0.9rem] font-medium bg-[var(--primary)] text-white rounded-lg
                           hover:bg-[var(--primary-hover)] transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Toggles */}
          <div className="flex lg:hidden items-center gap-1">
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
                <div key={item.href} className="mb-3">
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-[0.9rem] font-medium text-[var(--muted)]"
                  >
                    {item.label} →
                  </Link>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block px-6 py-2.5 text-[0.9rem] mx-2 rounded-lg ${
                        pathname === child.href
                          ? 'text-[var(--primary)] font-medium bg-[var(--primary-light)]'
                          : 'text-[var(--muted)] hover:bg-[var(--card-hover)]'
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
                  className={`block px-4 py-3 text-[0.9rem] font-medium mx-2 rounded-lg ${
                    pathname === item.href
                      ? 'text-[var(--primary)] bg-[var(--primary-light)]'
                      : 'text-[var(--muted)] hover:bg-[var(--card-hover)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="border-t border-[var(--border)] mt-3 pt-3">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-3 text-[0.9rem] font-medium text-red-600 mx-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn(undefined, { callbackUrl: '/admin' })}
                  className="w-full text-left px-4 py-3 text-[0.9rem] font-medium text-[var(--primary)] mx-2 rounded-lg hover:bg-[var(--card-hover)]"
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
