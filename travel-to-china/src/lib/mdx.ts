import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  category: 'country' | 'cities' | 'routes' | 'routes/themed' | 'blog';
  // Route-specific fields
  route?: string;
  duration?: string;
  difficulty?: string;
  bestTime?: string;
  estimatedBudget?: string;
  tags?: string[];
  image?: string;
  author?: string;
  date?: string;
  order?: number;
  // City-specific fields
  region?: string;
  population?: string;
  bestTimeToVisit?: string;
  weather?: string;
  highlights?: string[];
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface ContentEntry {
  meta: ContentMeta;
  content: string;
  slug: string;
}

// Get all content files from a directory
function getContentFiles(dir: string): string[] {
  const fullPath = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  return fs
    .readdirSync(fullPath)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(dir, f));
}

// Parse a single MDX file and extract frontmatter
export function getContentBySlug(category: string, slug: string): ContentEntry | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    meta: {
      slug,
      title: data.title || slug,
      description: data.description || '',
      category: data.category || category,
      tags: data.tags || [],
      image: data.image || '',
      author: data.author || '',
      date: data.date || '',
      order: data.order || 999,
      region: data.region || '',
      population: data.population || '',
      bestTimeToVisit: data.bestTimeToVisit || '',
      weather: data.weather || '',
      highlights: data.highlights || [],
      seoTitle: data.seoTitle || data.title || '',
      seoDescription: data.seoDescription || data.description || '',
    },
    content,
    slug,
  };
}

// Get all content of a specific category
export function getAllContent(category: 'country' | 'cities' | 'blog'): ContentEntry[] {
  const files = getContentFiles(category);
  return files
    .map((file) => {
      const slug = path.basename(file, '.mdx');
      return getContentBySlug(category, slug);
    })
    .filter((entry): entry is ContentEntry => entry !== null)
    .sort((a, b) => (a.meta.order || 999) - (b.meta.order || 999));
}

// Get all content across all categories
export function getAllArticles(): ContentEntry[] {
  return [...getAllContent('country'), ...getAllContent('cities')];
}

// Get content by tag
export function getContentByTag(tag: string): ContentEntry[] {
  return getAllArticles().filter((entry) => entry.meta.tags?.includes(tag));
}

// Get related articles by matching tags (and region for cities)
export function getRelatedArticles(currentSlug: string, category: string, limit = 3): ContentEntry[] {
  const current = getContentBySlug(category, currentSlug);
  if (!current) return [];

  const allOthers = getAllContent(category as 'country' | 'cities').filter(
    (entry) => entry.slug !== currentSlug
  );

  // Score each article by shared tags + shared region
  const currentTags = current.meta.tags || [];
  const currentRegion = (current.meta as any).region || '';

  const scored = allOthers.map((entry) => {
    let score = 0;
    const entryTags = entry.meta.tags || [];
    // Shared tags
    currentTags.forEach((t) => {
      if (entryTags.includes(t)) score += 3;
    });
    // Shared region (for cities)
    const entryRegion = (entry.meta as any).region || '';
    if (currentRegion && entryRegion && currentRegion === entryRegion) score += 5;
    // Bonus for same order range
    const orderDiff = Math.abs((current.meta.order || 999) - (entry.meta.order || 999));
    if (orderDiff <= 2) score += 1;

    return { entry, score };
  });

  // Sort by score descending, then take top results
  scored.sort((a, b) => b.score - a.score);

  // If no good matches (all score 0), return first N
  if (scored.length === 0 || scored[0].score === 0) {
    return allOthers.slice(0, limit);
  }

  return scored.slice(0, limit).map((s) => s.entry);
}

// Search articles by title and description
export function searchContent(query: string): ContentEntry[] {
  const lowerQuery = query.toLowerCase();
  return getAllArticles().filter((entry) => {
    return (
      entry.meta.title.toLowerCase().includes(lowerQuery) ||
      entry.meta.description.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.meta.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  });
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllArticles().forEach((entry) => {
    entry.meta.tags?.forEach((t) => tags.add(t));
  });
  return Array.from(tags).sort();
}

// Get breadcrumbs for a page
export function getBreadcrumbs(category?: string, slug?: string, title?: string) {
  const crumbs: { label: string; href: string }[] = [
    { label: 'Home', href: '/' },
  ];

  if (category === 'country') {
    crumbs.push({ label: 'China Overview', href: '/country' });
    if (slug && title) {
      crumbs.push({ label: title, href: `/country/${slug}` });
    }
  } else if (category === 'cities') {
    crumbs.push({ label: 'Cities', href: '/cities' });
    if (slug && title) {
      crumbs.push({ label: title, href: `/cities/${slug}` });
    }
  }

  return crumbs;
}
