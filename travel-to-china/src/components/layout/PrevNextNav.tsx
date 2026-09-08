import Link from 'next/link';

interface PrevNextItem {
  slug: string;
  title: string;
}

export default function PrevNextNav({
  items,
  currentSlug,
  basePath,
  prevLabel = 'Previous',
  nextLabel = 'Next',
}: {
  items: PrevNextItem[];
  currentSlug: string;
  basePath: string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const currentIndex = items.findIndex((i) => i.slug === currentSlug);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;
  if (!prev && !next) return null;

  return (
    <nav
      className={`mt-12 grid ${prev && next ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}
      aria-label="Article navigation"
    >
      {prev && (
        <Link
          href={`${basePath}/${prev.slug}`}
          className="card p-4 group flex items-center gap-3"
        >
          <span className="text-2xl" aria-hidden="true">←</span>
          <div className="min-w-0">
            <span className="block text-xs text-[var(--muted)]">{prevLabel}</span>
            <p className="font-semibold group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {prev.title}
            </p>
          </div>
        </Link>
      )}
      {next && (
        <Link
          href={`${basePath}/${next.slug}`}
          className="card p-4 group flex items-center justify-end gap-3 text-right"
        >
          <div className="min-w-0">
            <span className="block text-xs text-[var(--muted)]">{nextLabel}</span>
            <p className="font-semibold group-hover:text-[var(--primary)] transition-colors line-clamp-2">
              {next.title}
            </p>
          </div>
          <span className="text-2xl" aria-hidden="true">→</span>
        </Link>
      )}
    </nav>
  );
}
