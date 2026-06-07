import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { recordPageView, recordPageEvent } from '@/lib/stats';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const { pagePath, visitorId, sessionId, eventType, referrer, userAgent } = body;

    if (!pagePath || !visitorId) {
      return NextResponse.json({ error: 'pagePath and visitorId are required' }, { status: 400 });
    }

    if (eventType === 'leave') {
      await recordPageEvent(pagePath, visitorId, sessionId || 'unknown', 'leave');
    } else {
      await recordPageView(pagePath, visitorId, referrer, userAgent);
      if (sessionId) {
        await recordPageEvent(pagePath, visitorId, sessionId, 'pageview');
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record page view' }, { status: 500 });
  }
}
