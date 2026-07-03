import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbSchema } from './StructuredData';

export interface Crumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://travels2china.com';
  const schemaItems = crumbs.map(crumb => ({
    name: crumb.label,
    url: `${baseUrl}${crumb.href}`,
  }));
 
  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <nav aria-label="Breadcrumb" className="container-wide py-3">
      <ol className="flex items-center gap-1.5 text-sm flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5" itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
              )}
              {isLast ? (
                <span className="text-[var(--foreground)]/90 font-medium" itemProp="name">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">
                    {index === 0 ? <Home className="w-4 h-4" /> : crumb.label}
                  </span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
      </nav>
    </>
  );
}
