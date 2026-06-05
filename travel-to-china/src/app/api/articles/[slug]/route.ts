import { NextRequest, NextResponse } from 'next/server';
import { getAllArticles } from '@/lib/mdx';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const articles = getAllArticles();
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json({
    slug: article.slug,
    title: article.meta.title,
    description: article.meta.description,
    content: article.content,
    category: article.meta.category,
    tags: article.meta.tags,
    image: article.meta.image,
    author: article.meta.author,
    date: article.meta.date,
  });
}
