import { MetadataRoute } from 'next';
import { getAllContent } from '@/lib/mdx';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://travels2china.com';

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

  // Themed route pages
  const themedRoutes = getAllContent('routes/themed');
  const themedRoutePages = themedRoutes
    .filter((r) => r.slug !== 'index')
    .map((route) => ({
      url: `/routes/themed/${route.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: route.meta.date ? new Date(route.meta.date) : new Date(),
    }));

  // Comparison pages
  const comparisons = getAllContent('comparison');
  const comparisonPages = comparisons
    .filter((c) => c.slug !== 'index')
    .map((page) => ({
      url: `/comparison/${page.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: page.meta.date ? new Date(page.meta.date) : new Date(),
    }));

  // Head-to-head comparison pages
  const headToHeads = getAllContent('comparison/head-to-head');
  const headToHeadPages = headToHeads
    .filter((c) => c.slug !== 'index')
    .map((page) => ({
      url: `/comparison/head-to-head/${page.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: page.meta.date ? new Date(page.meta.date) : new Date(),
    }));

  // Travel style pages
  const travelStyles = getAllContent('by-travel-style');
  const travelStylePages = travelStyles
    .filter((s) => s.slug !== 'index')
    .map((style) => ({
      url: `/by-travel-style/${style.slug}`,
      priority: 0.7,
      changeFrequency: 'monthly' as const,
      lastModified: style.meta.date ? new Date(style.meta.date) : new Date(),
    }));

  // Tool pages
  const tools = getAllContent('tools');
  const toolPages = tools
    .filter((t) => t.slug !== 'index')
    .map((tool) => ({
      url: `/tools/${tool.slug}`,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
      lastModified: tool.meta.date ? new Date(tool.meta.date) : new Date(),
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
    ...themedRoutePages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...comparisonPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...headToHeadPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...travelStylePages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...toolPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  ];

  return allEntries;
}
