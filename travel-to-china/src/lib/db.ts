import { createClient, Client, InValue } from '@libsql/client';

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (url && authToken) {
      client = createClient({ url, authToken });
    } else {
      throw new Error(
        'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables are required.'
      );
    }
  }
  return client;
}

export async function initializeDatabase(): Promise<void> {
  const db = getDb();

  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_slug TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_email TEXT,
      author_image TEXT,
      content TEXT NOT NULL,
      parent_id INTEGER REFERENCES comments(id),
      is_approved INTEGER DEFAULT 1,
      is_spam INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(comment_id, user_email)
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'pageview',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS search_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      visitor_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      status TEXT DEFAULT 'pending',
      confirmation_token TEXT,
      confirmed_at TEXT,
      unsubscribed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_slug TEXT NOT NULL,
      user_email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(article_slug, user_email)
    );

    CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_slug);
    CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
    CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_page_events_session ON page_events(session_id);
  `);
}

export async function getAll<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T[]> {
  const result = await getDb().execute({ sql, args });
  return result.rows as unknown as T[];
}

export async function getOne<T = Record<string, unknown>>(sql: string, args: InValue[] = []): Promise<T | undefined> {
  const result = await getDb().execute({ sql, args });
  return result.rows[0] as unknown as T | undefined;
}

export async function runQuery(sql: string, args: InValue[] = []): Promise<{ lastInsertRowid: bigint | undefined; changes: number }> {
  const result = await getDb().execute({ sql, args });
  return { lastInsertRowid: result.lastInsertRowid, changes: result.rowsAffected };
}
