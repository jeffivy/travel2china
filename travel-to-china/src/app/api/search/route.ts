import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/search';
import { recordSearchQuery } from '@/lib/stats';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  const visitorId = request.nextUrl.searchParams.get('visitor_id') || undefined;

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], suggestions: [] });
  }

  const results = search(query);

  // Record search query
  if (query.length >= 2) {
    try {
      recordSearchQuery(query, results.length, visitorId);
    } catch (e) {
      // Silently fail
    }
  }

  return NextResponse.json({
    results,
    query,
    total: results.length,
  });
}
