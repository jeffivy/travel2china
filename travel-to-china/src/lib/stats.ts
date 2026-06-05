import { getDb, getAll, getOne } from './db';

// Record a page view
export function recordPageView(pagePath: string, visitorId: string, referrer?: string, userAgent?: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO page_views (page_path, visitor_id, referrer, user_agent) VALUES (?, ?, ?, ?)`
  ).run(pagePath, visitorId, referrer || '', userAgent || '');
}

// Record a page event (for duration tracking)
export function recordPageEvent(
  pagePath: string,
  visitorId: string,
  sessionId: string,
  eventType: string
): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO page_events (page_path, visitor_id, session_id, event_type) VALUES (?, ?, ?, ?)`
  ).run(pagePath, visitorId, sessionId, eventType);
}

// Record a search query
export function recordSearchQuery(query: string, resultsCount: number, visitorId?: string): void {
  const db = getDb();
  db.prepare(
    `INSERT INTO search_logs (query, results_count, visitor_id) VALUES (?, ?, ?)`
  ).run(query, resultsCount, visitorId || '');
}

// Get total page views
export function getTotalPageViews(): number {
  const result = getOne<{ count: number }>('SELECT COUNT(*) as count FROM page_views');
  return result?.count || 0;
}

// Get page views by path
export function getPageViewsByPath(pagePath?: string): { page_path: string; count: number }[] {
  if (pagePath) {
    return getAll(
      `SELECT page_path, COUNT(*) as count FROM page_views WHERE page_path = ? GROUP BY page_path`,
      [pagePath]
    );
  }
  return getAll(
    `SELECT page_path, COUNT(*) as count FROM page_views GROUP BY page_path ORDER BY count DESC LIMIT 50`
  );
}

// Get daily page views
export function getDailyPageViews(days: number = 30): { date: string; count: number }[] {
  return getAll(
    `SELECT date(created_at) as date, COUNT(*) as count
     FROM page_views
     WHERE created_at >= datetime('now', ? || ' days')
     GROUP BY date(created_at)
     ORDER BY date DESC`,
    [`-${days}`]
  );
}

// Get unique visitors
export function getUniqueVisitors(): number {
  const result = getOne<{ count: number }>(
    'SELECT COUNT(DISTINCT visitor_id) as count FROM page_views'
  );
  return result?.count || 0;
}

// Get daily unique visitors
export function getDailyUniqueVisitors(days: number = 30): { date: string; count: number }[] {
  return getAll(
    `SELECT date(created_at) as date, COUNT(DISTINCT visitor_id) as count
     FROM page_views
     WHERE created_at >= datetime('now', ? || ' days')
     GROUP BY date(created_at)
     ORDER BY date DESC`,
    [`-${days}`]
  );
}

// Get popular content
export function getPopularContent(limit: number = 10): { page_path: string; views: number }[] {
  return getAll(
    `SELECT page_path, COUNT(*) as views
     FROM page_views
     GROUP BY page_path
     ORDER BY views DESC
     LIMIT ?`,
    [limit]
  );
}

// Get popular search queries
export function getPopularSearches(limit: number = 20): { query: string; count: number }[] {
  return getAll(
    `SELECT query, COUNT(*) as count
     FROM search_logs
     GROUP BY query
     ORDER BY count DESC
     LIMIT ?`,
    [limit]
  );
}

// Get average time on page
export function getAverageTimeOnPage(): { page_path: string; avg_seconds: number }[] {
  return getAll(`
    SELECT page_path,
           AVG(
             (SELECT julianday(e2.created_at) - julianday(e1.created_at)
              FROM page_events e2
              WHERE e2.session_id = e1.session_id
              AND e2.id > e1.id
              AND e2.event_type = 'leave'
              LIMIT 1)
           ) * 86400 as avg_seconds
    FROM page_events e1
    WHERE e1.event_type = 'pageview'
    GROUP BY page_path
    ORDER BY avg_seconds DESC
  `);
}

// Get dashboard summary
export function getDashboardSummary() {
  const totalPV = getTotalPageViews();
  const totalUV = getUniqueVisitors();
  const today = new Date().toISOString().split('T')[0];

  const todayPV = getOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM page_views WHERE date(created_at) = ?`,
    [today]
  );

  const totalComments = getOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM comments'
  );

  const totalSearches = getOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM search_logs'
  );

  const totalSubscribers = getOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM subscribers WHERE status = 'confirmed'"
  );

  return {
    totalPageViews: totalPV,
    uniqueVisitors: totalUV,
    todayPageViews: todayPV?.count || 0,
    totalComments: totalComments?.count || 0,
    totalSearches: totalSearches?.count || 0,
    totalSubscribers: totalSubscribers?.count || 0,
  };
}
