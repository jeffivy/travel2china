import { MetadataRoute } from 'next';
import { getAllContent } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travels2china.com';

  // Static pages
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { url: '/country', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/cities', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/search', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/subscribe', priority: 0.5, changeFrequency: 'monthly' as const },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Country articles
  const countryArticles = getAllContent('country');
  const countryPages = countryArticles.map((article) => ({
    url: `/country/${article.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    lastModified: article.meta.date ? new Date(article.meta.date) : new Date(),
  }));

  // City guides
  const cities = getAllContent('cities');
  const cityPages = cities.map((city) => ({
    url: `/cities/${city.slug}`,
    priority: 0.8,
    changeFrequency: 'monthly' as const,
    lastModified: city.meta.date ? new Date(city.meta.date) : new Date(),
  }));

  // Combine all entries
  const allEntries = [
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...countryPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...cityPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  ];

  return allEntries;
}
