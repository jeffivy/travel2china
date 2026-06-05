import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface ContentMeta {
  slug: string;
  title: string;
  description: string;
  category: 'country' | 'cities';
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
export function getAllContent(category: 'country' | 'cities'): ContentEntry[] {
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

// Get related articles (same category, excluding current)
export function getRelatedArticles(currentSlug: string, category: string, limit = 3): ContentEntry[] {
  return getAllContent(category as 'country' | 'cities')
    .filter((entry) => entry.slug !== currentSlug)
    .slice(0, limit);
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
