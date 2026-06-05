import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as jose from 'jose';
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

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travel-to-china-secret-key-change-in-production'
);

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  // Method 1: NextAuth session
  const token = await getToken({ req: request });
  if (token?.email) {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) || [];
    if (adminEmails.length === 0 || adminEmails.includes(token.email.toLowerCase())) {
      return true;
    }
  }

  // Method 2: admin_token cookie
  const adminToken = request.cookies.get('admin_token')?.value;
  if (adminToken) {
    try {
      const { payload } = await jose.jwtVerify(adminToken, SECRET);
      if (payload.role === 'admin') return true;
    } catch { /* invalid token */ }
  }

  return false;
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
      { error: 'Failed to fetch dashboard data', detail: String(e) },
      { status: 500 }
    );
  }
}
