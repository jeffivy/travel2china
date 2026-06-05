import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/mdx';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  let articles = getAllArticles();

  if (category) {
    articles = articles.filter((a) => a.meta.category === category);
  }

  if (tag) {
    articles = articles.filter((a) => a.meta.tags?.includes(tag));
  }

  const total = articles.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = articles.slice(offset, offset + limit);

  return NextResponse.json({
    articles: paginated.map((a) => ({
      slug: a.slug,
      title: a.meta.title,
      description: a.meta.description,
      category: a.meta.category,
      tags: a.meta.tags,
      image: a.meta.image,
      date: a.meta.date,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
