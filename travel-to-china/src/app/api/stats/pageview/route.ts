import { NextRequest, NextResponse } from 'next/server';
import { recordPageView, recordPageEvent } from '@/lib/stats';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pagePath, visitorId, sessionId, eventType, referrer, userAgent, duration } = body;

    if (!pagePath || !visitorId) {
      return NextResponse.json({ error: 'pagePath and visitorId are required' }, { status: 400 });
    }

    if (eventType === 'leave') {
      recordPageEvent(pagePath, visitorId, sessionId || 'unknown', 'leave');
    } else {
      recordPageView(pagePath, visitorId, referrer, userAgent);
      if (sessionId) {
        recordPageEvent(pagePath, visitorId, sessionId, 'pageview');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record page view' }, { status: 500 });
  }
}
