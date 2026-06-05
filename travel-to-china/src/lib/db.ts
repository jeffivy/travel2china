import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'travel-to-china.db');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Singleton database instance
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database): void {
  db.exec(`
    -- Comments table
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

    -- Comment likes tracking (who liked which comment)
    CREATE TABLE IF NOT EXISTS comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
      user_email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(comment_id, user_email)
    );

    -- Page views
    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      referrer TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Page view events for duration tracking
    CREATE TABLE IF NOT EXISTS page_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_path TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL DEFAULT 'pageview',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Search queries log
    CREATE TABLE IF NOT EXISTS search_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      visitor_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Email subscribers
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

    -- Favorites/bookmarks
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_slug TEXT NOT NULL,
      user_email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(article_slug, user_email)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_slug);
    CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
    CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
    CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_page_events_session ON page_events(session_id);
  `);
}

// Helper: Get a prepared statement
export function getStmt(sql: string) {
  return getDb().prepare(sql);
}

// Helper: Run a query
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runQuery(sql: string, params: any[] = []) {
  return getDb().prepare(sql).run(...params);
}

// Helper: Get all rows
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAll<T = any>(sql: string, params: any[] = []): T[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getDb().prepare(sql).all(...params) as T[];
}

// Helper: Get single row
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOne<T = any>(sql: string, params: any[] = []): T | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getDb().prepare(sql).get(...params) as T | undefined;
}
