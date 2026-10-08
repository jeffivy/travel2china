import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { recordPageView, recordPageEvent, getDistinctVisitorsForIp } from '@/lib/stats';

const BOT_UA_PATTERNS = [
  /googlebot/i, /bingbot/i, /baiduspider/i, /yandexbot/i,
  /duckduckbot/i, /facebookexternalhit/i, /twitterbot/i,
  /slurp/i, /crawler/i, /scraper/i, /bot\b/i, /spider/i,
  /sogou/i, /bytespider/i, /petalbot/i, /ahrefsbot/i,
  /semrushbot/i, /dotbot/i, /mj12bot/i, /ia_archiver/i,
  /applebot/i, /linkedinbot/i,
];

// Desktop Linux Chrome is the classic headless/automation signature — real
// desktop visitors are on Windows/macOS, and scrapers overwhelmingly run
// headless Chrome on Linux x86_64. Scoped to x86_64 so it does NOT match
// Android WebViews (their UA is "Linux; Android ...").
const HEADLESS_CHROME_PATTERN = /Linux x86_64.*Chrome\//i;

// Cap "time on page": over 2h means a tab was left open, not real engagement.
const MAX_PAGE_DURATION_S = 2 * 60 * 60;

// A real visitor persists one visitor_id (localStorage) and browses a few
// pages; a cookie-less scraper mints a new visitor_id per request (PV/UV ≈ 1).
// One IP producing this many distinct visitor_ids in 24h is treated as a
// scraper and dropped. (Tune up/down; 10 sits between ~1-3 for real users and
// ~15-27/day for the observed scraper.)
const MAX_DISTINCT_VISITORS_PER_IP = 10;

function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true;
  if (HEADLESS_CHROME_PATTERN.test(userAgent)) return true;
  return BOT_UA_PATTERNS.some(pattern => pattern.test(userAgent));
}

function isAdminPath(pagePath: string): boolean {
  return pagePath.startsWith('/admin') || pagePath.startsWith('/api/');
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || '';
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

    // Slow-scraper guard: one IP minting many distinct visitor_ids is a
    // cookie-less crawler, not a human browsing session.
    const ip = getClientIp(request);
    if (ip && (await getDistinctVisitorsForIp(ip)) >= MAX_DISTINCT_VISITORS_PER_IP) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (eventType === 'leave') {
      // Ignore implausible durations (tab left open) so they don't skew the
      // session-duration average.
      const validDuration =
        typeof duration === 'number' &&
        Number.isFinite(duration) &&
        duration >= 0 &&
        duration <= MAX_PAGE_DURATION_S
          ? duration
          : undefined;
      await recordPageEvent(pagePath, visitorId, sessionId || 'unknown', 'leave', validDuration);
    } else {
      await recordPageView(pagePath, visitorId, referrer, userAgent, utmSource, utmMedium, utmCampaign, ip);
      if (sessionId) {
        await recordPageEvent(pagePath, visitorId, sessionId, 'pageview');
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record page view' }, { status: 500 });
  }
}
