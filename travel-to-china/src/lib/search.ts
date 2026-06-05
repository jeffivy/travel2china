/* eslint-disable @typescript-eslint/no-explicit-any */
import FlexSearch from 'flexsearch';
import { getAllArticles } from './mdx';

let searchIndex: any = null;

function getSearchIndex(): any {
  if (searchIndex) return searchIndex;

  searchIndex = new (FlexSearch as any).Document({
    tokenize: 'forward',
    document: {
      id: 'slug',
      index: ['title', 'description', 'content', 'tags'],
      store: ['title', 'description', 'slug', 'category'],
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true,
    },
  });

  const articles = getAllArticles();
  articles.forEach((article) => {
    searchIndex.add({
      slug: article.slug,
      title: article.meta.title,
      description: article.meta.description,
      content: article.content.slice(0, 5000),
      tags: article.meta.tags?.join(' ') || '',
      category: article.meta.category,
    });
  });

  return searchIndex;
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  highlight?: string;
}

export function search(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];

  try {
    const index = getSearchIndex();
    const results = index.search(query, { limit: 20, enrich: true });

    const seen = new Set<string>();
    const items: SearchResult[] = [];

    results.forEach((result: any) => {
      if (result.result) {
        result.result.forEach((doc: any) => {
          if (!seen.has(doc.slug)) {
            seen.add(doc.slug);
            items.push({
              slug: doc.slug,
              title: doc.title || doc.slug,
              description: doc.description || '',
              category: doc.category || '',
            });
          }
        });
      }
    });

    return items;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export function searchWithSuggest(query: string): { results: SearchResult[]; suggestions: string[] } {
  const results = search(query);
  const suggestions: string[] = [];

  if (query.length >= 2) {
    results.forEach((r) => {
      if (!suggestions.includes(r.title)) {
        suggestions.push(r.title);
      }
    });
  }

  return { results, suggestions: suggestions.slice(0, 5) };
}
