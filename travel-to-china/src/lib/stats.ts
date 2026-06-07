import { getDb, getAll, getOne } from './db';

export async function recordPageView(
  pagePath: string,
  visitorId: string,
  referrer?: string,
  userAgent?: string
): Promise<void> {
  await getDb().execute({
    sql: `INSERT INTO page_views (page_path, visitor_id, referrer, user_agent) VALUES (?, ?, ?, ?)`,
    args: [pagePath, visitorId, referrer || '', userAgent || ''],
  });
}

export async function recordPageEvent(
  pagePath: string,
  visitorId: string,
  sessionId: string,
  eventType: string
): Promise<void> {
  await getDb().execute({
    sql: `INSERT INTO page_events (page_path, visitor_id, session_id, event_type) VALUES (?, ?, ?, ?)`,
    args: [pagePath, visitorId, sessionId, eventType],
  });
}

export async function recordSearchQuery(query: string, resultsCount: number, visitorId?: string): Promise<void> {
  await getDb().execute({
    sql: `INSERT INTO search_logs (query, results_count, visitor_id) VALUES (?, ?, ?)`,
    args: [query, resultsCount, visitorId || ''],
  });
}

export async function getTotalPageViews(): Promise<number> {
  const result = await getOne<{ count: number }>('SELECT COUNT(*) as count FROM page_views');
  return result?.count || 0;
}

export async function getPageViewsByPath(pagePath?: string): Promise<{ page_path: string; count: number }[]> {
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

export async function getDailyPageViews(days: number = 30): Promise<{ date: string; count: number }[]> {
  return getAll(
    `SELECT date(created_at) as date, COUNT(*) as count
     FROM page_views
     WHERE created_at >= datetime('now', ? || ' days')
     GROUP BY date(created_at)
     ORDER BY date DESC`,
    [`-${days}`]
  );
}

export async function getUniqueVisitors(): Promise<number> {
  const result = await getOne<{ count: number }>(
    'SELECT COUNT(DISTINCT visitor_id) as count FROM page_views'
  );
  return result?.count || 0;
}

export async function getDailyUniqueVisitors(days: number = 30): Promise<{ date: string; count: number }[]> {
  return getAll(
    `SELECT date(created_at) as date, COUNT(DISTINCT visitor_id) as count
     FROM page_views
     WHERE created_at >= datetime('now', ? || ' days')
     GROUP BY date(created_at)
     ORDER BY date DESC`,
    [`-${days}`]
  );
}

export async function getPopularContent(limit: number = 10): Promise<{ page_path: string; views: number }[]> {
  return getAll(
    `SELECT page_path, COUNT(*) as views
     FROM page_views
     GROUP BY page_path
     ORDER BY views DESC
     LIMIT ?`,
    [limit]
  );
}

export async function getPopularSearches(limit: number = 20): Promise<{ query: string; count: number }[]> {
  return getAll(
    `SELECT query, COUNT(*) as count
     FROM search_logs
     GROUP BY query
     ORDER BY count DESC
     LIMIT ?`,
    [limit]
  );
}

export async function getDashboardSummary() {
  const totalPV = await getTotalPageViews();
  const totalUV = await getUniqueVisitors();
  const today = new Date().toISOString().split('T')[0];

  const todayPV = await getOne<{ count: number }>(
    `SELECT COUNT(*) as count FROM page_views WHERE date(created_at) = ?`,
    [today]
  );

  const totalComments = await getOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM comments'
  );

  const totalSearches = await getOne<{ count: number }>(
    'SELECT COUNT(*) as count FROM search_logs'
  );

  const totalSubscribers = await getOne<{ count: number }>(
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
