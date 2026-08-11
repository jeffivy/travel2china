const { createClient } = require('@libsql/client');
const path = require('path');

// Load env manually to avoid dotenv dependency issues
const fs = require('fs');
const envPath = path.join(__dirname, '..', '..', '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const eq = line.indexOf('=');
  if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
});

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

const BOT_FILTER = `(
  user_agent IS NULL OR user_agent = ''
  OR (LOWER(user_agent) NOT LIKE '%googlebot%'
  AND LOWER(user_agent) NOT LIKE '%bingbot%'
  AND LOWER(user_agent) NOT LIKE '%baiduspider%'
  AND LOWER(user_agent) NOT LIKE '%yandexbot%'
  AND LOWER(user_agent) NOT LIKE '%duckduckbot%'
  AND LOWER(user_agent) NOT LIKE '%facebookexternalhit%'
  AND LOWER(user_agent) NOT LIKE '%twitterbot%'
  AND LOWER(user_agent) NOT LIKE '%slurp%'
  AND LOWER(user_agent) NOT LIKE '%crawler%'
  AND LOWER(user_agent) NOT LIKE '%scraper%'
  AND LOWER(user_agent) NOT LIKE '%sogou%'
  AND LOWER(user_agent) NOT LIKE '%bytespider%'
  AND LOWER(user_agent) NOT LIKE '%petalbot%'
  AND LOWER(user_agent) NOT LIKE '%ahrefsbot%'
  AND LOWER(user_agent) NOT LIKE '%semrushbot%'
  AND LOWER(user_agent) NOT LIKE '%dotbot%'
  AND LOWER(user_agent) NOT LIKE '%mj12bot%'
  AND LOWER(user_agent) NOT LIKE '%bot%'
  AND LOWER(user_agent) NOT LIKE '%spider%'
  AND LOWER(user_agent) NOT LIKE '%applebot%'
  AND LOWER(user_agent) NOT LIKE '%linkedinbot%'
  AND user_agent NOT LIKE '%Linux%Chrome/14%')
)`;

const ADMIN_FILTER = "page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'";

async function run() {
  const results = {};

  // Run migrations first (idempotent - safe to run multiple times)
  await db.execute("ALTER TABLE page_events ADD COLUMN duration INTEGER").catch(() => {});
  await db.execute("ALTER TABLE page_views ADD COLUMN utm_source TEXT").catch(() => {});
  await db.execute("ALTER TABLE page_views ADD COLUMN utm_medium TEXT").catch(() => {});
  await db.execute("ALTER TABLE page_views ADD COLUMN utm_campaign TEXT").catch(() => {});

  // 3.1 Overall
  const r1 = await db.execute(`SELECT COUNT(*) as total_pv, COUNT(DISTINCT visitor_id) as total_uv, ROUND(CAST(COUNT(*) AS REAL)/MAX(COUNT(DISTINCT visitor_id),1),2) as pv_uv_ratio FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER}`);
  results.overall = r1.rows[0];

  // 3.2 Monthly
  const r2 = await db.execute(`SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} GROUP BY month ORDER BY month DESC`);
  results.monthly = r2.rows;

  // 3.3 Daily (last 60)
  const r3 = await db.execute(`SELECT date(created_at) as date, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} AND created_at >= datetime('now','-60 days') GROUP BY date ORDER BY date DESC`);
  results.daily = r3.rows;

  // 3.4 Referrer
  const r4 = await db.execute(`SELECT CASE WHEN referrer='' OR referrer IS NULL THEN 'direct' WHEN referrer LIKE '%google.%' THEN 'Google' WHEN referrer LIKE '%bing.%' THEN 'Bing' WHEN referrer LIKE '%duckduckgo.%' THEN 'DuckDuckGo' WHEN referrer LIKE '%ecosia.%' THEN 'Ecosia' WHEN referrer LIKE '%facebook.%' OR referrer LIKE '%twitter.%' OR referrer LIKE '%reddit.%' OR referrer LIKE '%linkedin.%' OR referrer LIKE '%pinterest.%' OR referrer LIKE '%t.co%' THEN 'Social Media' ELSE 'Other Referral' END as source, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} GROUP BY source ORDER BY pv DESC`);
  results.referrer = r4.rows;

  // 3.5 Device
  const r5 = await db.execute(`SELECT CASE WHEN LOWER(user_agent) LIKE '%mobile%' OR LOWER(user_agent) LIKE '%android%' OR LOWER(user_agent) LIKE '%iphone%' THEN 'Mobile' WHEN LOWER(user_agent) LIKE '%tablet%' OR LOWER(user_agent) LIKE '%ipad%' THEN 'Tablet' ELSE 'Desktop' END as device, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} AND user_agent IS NOT NULL AND user_agent!='' GROUP BY device ORDER BY pv DESC`);
  results.device = r5.rows;

  // 3.6 Top pages
  const r6 = await db.execute(`SELECT page_path, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} GROUP BY page_path ORDER BY pv DESC LIMIT 20`);
  results.topPages = r6.rows;

  // 3.7 Categories
  const r7 = await db.execute(`SELECT CASE WHEN page_path='/' THEN 'Homepage' WHEN page_path LIKE '/country/%' THEN 'Country Guide' WHEN page_path LIKE '/cities/%' THEN 'City Guide' WHEN page_path LIKE '/blog/%' THEN 'Blog' WHEN page_path LIKE '/routes/%' THEN 'Routes' WHEN page_path LIKE '/comparison/%' THEN 'Comparison' WHEN page_path LIKE '/tools/%' THEN 'Tools' WHEN page_path LIKE '/by-travel-style/%' THEN 'Travel Style' WHEN page_path LIKE '/search%' THEN 'Search' WHEN page_path LIKE '/subscribe%' THEN 'Subscribe' ELSE 'Other' END as category, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} GROUP BY category ORDER BY pv DESC`);
  results.categories = r7.rows;

  // 3.8 Depth
  const r8 = await db.execute(`WITH v AS (SELECT visitor_id, COUNT(*) as cnt FROM page_views WHERE ${ADMIN_FILTER} AND ${BOT_FILTER} GROUP BY visitor_id) SELECT CASE WHEN cnt=1 THEN '1 page (bounce)' WHEN cnt=2 THEN '2 pages' WHEN cnt BETWEEN 3 AND 5 THEN '3-5 pages' ELSE '6+ pages' END as depth, COUNT(*) as visitors FROM v GROUP BY depth ORDER BY MIN(cnt)`);
  results.depth = r8.rows;

  // 3.9 Duration
  const r9 = await db.execute(`SELECT ROUND(AVG(duration),1) as avg_sec, COUNT(*) as events FROM page_events WHERE event_type='leave' AND duration IS NOT NULL AND duration>0 AND duration<3600 AND ${ADMIN_FILTER}`);
  results.duration = r9.rows[0];

  // 3.10 Anomaly detection (without bot filter to find pollution)
  const r10 = await db.execute(`SELECT page_path, COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv, ROUND(CAST(COUNT(*) AS REAL)/MAX(COUNT(DISTINCT visitor_id),1),2) as ratio FROM page_views WHERE ${ADMIN_FILTER} GROUP BY page_path HAVING CAST(COUNT(*) AS REAL)/MAX(COUNT(DISTINCT visitor_id),1)>1.01 ORDER BY pv DESC LIMIT 10`);
  results.anomaly = r10.rows;

  // 3.11 Search
  const r11 = await db.execute('SELECT query, COUNT(*) as cnt FROM search_logs GROUP BY query ORDER BY cnt DESC LIMIT 15');
  results.search = r11.rows;

  // 3.12 Subscribers
  const r12 = await db.execute('SELECT status, COUNT(*) as cnt FROM subscribers GROUP BY status');
  results.subs = r12.rows;
  const r12b = await db.execute("SELECT COUNT(*) as total, COUNT(CASE WHEN created_at>=datetime('now','-30 days') THEN 1 END) as recent FROM subscribers");
  results.subsTotal = r12b.rows[0];

  // 3.13 Comments
  const r13 = await db.execute('SELECT COUNT(*) as total, SUM(CASE WHEN is_approved=1 THEN 1 ELSE 0 END) as approved, SUM(CASE WHEN is_spam=1 THEN 1 ELSE 0 END) as spam FROM comments');
  results.comments = r13.rows[0];

  // Raw total for pollution %
  const rRaw = await db.execute("SELECT COUNT(*) as total FROM page_views WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'");
  results.rawTotal = rRaw.rows[0].total;

  console.log(JSON.stringify(results, null, 2));
}

run().catch(e => { console.error(e.message); process.exit(1); });
