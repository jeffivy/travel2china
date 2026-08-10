import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { recordPageView, recordPageEvent } from '@/lib/stats';

const BOT_UA_PATTERNS = [
  /googlebot/i, /bingbot/i, /baiduspider/i, /yandexbot/i,
  /duckduckbot/i, /facebookexternalhit/i, /twitterbot/i,
  /slurp/i, /crawler/i, /scraper/i, /bot\b/i, /spider/i,
  /sogou/i, /bytespider/i, /petalbot/i, /ahrefsbot/i,
  /semrushbot/i, /dotbot/i, /mj12bot/i, /ia_archiver/i,
  /applebot/i, /linkedinbot/i,
];

// Headless Chrome / SEO rendering service signature
const HEADLESS_CHROME_PATTERN = /Linux.*Chrome\/14[0-9]/;

function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true;
  if (HEADLESS_CHROME_PATTERN.test(userAgent)) return true;
  return BOT_UA_PATTERNS.some(pattern => pattern.test(userAgent));
}

function isAdminPath(pagePath: string): boolean {
  return pagePath.startsWith('/admin') || pagePath.startsWith('/api/');
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const { pagePath, visitorId, sessionId, eventType, duration, referrer, userAgent, utmSource, utmMedium, utmCampaign } = body;

    if (!pagePath || !visitorId) {
      return NextResponse.json({ error: 'pagePath and visitorId are required' }, { status: 400 });
    }

    // Skip bot/crawler traffic and admin/internal paths
    if (isBot(userAgent) || isAdminPath(pagePath)) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (eventType === 'leave') {
      await recordPageEvent(pagePath, visitorId, sessionId || 'unknown', 'leave', duration);
    } else {
      await recordPageView(pagePath, visitorId, referrer, userAgent, utmSource, utmMedium, utmCampaign);
      if (sessionId) {
        await recordPageEvent(pagePath, visitorId, sessionId, 'pageview');
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record page view' }, { status: 500 });
  }
}
