'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RecommendCardProps {
  title: string;
  description: string;
  href: string;
  label?: string;
}

export default function RecommendCard({ title, description, href, label = 'Read Next' }: RecommendCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 65 && !visible) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-5">
        <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">You Might Also Like</p>
        <h4 className="font-semibold text-[var(--foreground)] mb-1">{title}</h4>
        <p className="text-sm text-[var(--muted)] mb-3 line-clamp-2">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
          onClick={() => setVisible(false)}
        >
          {label} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-3 text-[var(--muted)] hover:text-[var(--foreground)] text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
