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
    { url: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/routes', priority: 0.8, changeFrequency: 'weekly' as const },
    { url: '/comparison', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/by-travel-style', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/tools', priority: 0.7, changeFrequency: 'monthly' as const },
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

  // Blog posts
  const blogPosts = getAllContent('blog');
  const blogPages = blogPosts
    .filter((p) => p.slug !== 'index')
    .map((post) => ({
      url: `/blog/${post.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: post.meta.date ? new Date(post.meta.date) : new Date(),
    }));

  // Route pages
  const routes = getAllContent('routes');
  const routePages = routes
    .filter((r) => r.slug !== 'index')
    .map((route) => ({
      url: `/routes/${route.slug}`,
      priority: 0.8,
      changeFrequency: 'monthly' as const,
      lastModified: route.meta.date ? new Date(route.meta.date) : new Date(),
    }));

  // Themed route pages — excluded (noindex)

  // Comparison pages — list page only (sub-pages are noindex)
  // Head-to-head comparison pages — excluded (noindex)
  // Travel style pages — list page only (sub-pages are noindex)
  // Tool pages — list page only (sub-pages are noindex)

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
    ...blogPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...routePages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  ];

  return allEntries;
}
