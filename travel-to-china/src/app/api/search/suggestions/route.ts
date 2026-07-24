import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/search';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }
  const results = search(q);
  const suggestions = results.slice(0, 6).map((r) => ({
    title: r.title,
    slug: r.slug,
    category: r.category,
    description: r.description?.substring(0, 80),
  }));
  return NextResponse.json({ suggestions });
}
