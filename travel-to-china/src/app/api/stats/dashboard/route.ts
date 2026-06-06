import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
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
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '30');

    const summary = getDashboardSummary();
    const dailyPV = getDailyPageViews(days);
    const dailyUV = getDailyUniqueVisitors(days);
    const popularContent = getPopularContent(20);
    const popularSearches = getPopularSearches(20);
    const pageViews = getPageViewsByPath();
    const comments = getAllComments();
    const subscribers = getAllSubscribers();

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
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
