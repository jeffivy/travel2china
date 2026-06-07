import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { initializeDatabase } from '@/lib/db';
import {
  getDashboardSummary,
  getDailyPageViews,
  getDailyUniqueVisitors,
  getPopularContent,
  getPopularSearches,
  getPageViewsByPath,
} from '@/lib/stats';
import { getAllComments } from '@/lib/comments';
import { getAllSubscribers } from '@/lib/subscribe';

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const token = await getToken({ req: request });
  if (!token?.email) return false;

  const adminEmails = process.env.ADMIN_EMAILS?.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean) || [];
  if (adminEmails.length === 0) return true;
  return adminEmails.includes(token.email.toLowerCase());
}

export async function GET(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    await initializeDatabase();

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const [
      summary,
      dailyPV,
      dailyUV,
      popularContent,
      popularSearches,
      pageViews,
      comments,
      subscribers,
    ] = await Promise.all([
      getDashboardSummary(),
      getDailyPageViews(days),
      getDailyUniqueVisitors(days),
      getPopularContent(20),
      getPopularSearches(20),
      getPageViewsByPath(),
      getAllComments(),
      getAllSubscribers(),
    ]);

    return NextResponse.json({
      summary,
      dailyPageViews: dailyPV,
      dailyUniqueVisitors: dailyUV,
      popularContent,
      popularSearches,
      pageViews,
      comments,
      subscribers,
    });
  } catch (e) {
    console.error('Dashboard error:', e);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
