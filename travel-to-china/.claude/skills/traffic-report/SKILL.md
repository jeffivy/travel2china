---
name: traffic-report
description: Analyze website access data, generate comprehensive traffic reports with root cause analysis and actionable improvement recommendations. Use whenever the user mentions "traffic analysis", "website analytics", "access report", "visitor data", "site performance", "SEO analysis", "flow analysis" (流量分析/访问量报告/网站分析/访问情况/SEO分析), or wants to understand how their website is performing. Also use when the user asks "how is my site doing" or "check my website stats".
---

# Traffic Report Skill

Analyze website traffic data for `travels2china.com` and produce a comprehensive Chinese-language report with root cause analysis and actionable improvement recommendations.

## Data Source

The website uses a custom Turso (libSQL) database for analytics. Tables: `page_views`, `page_events`, `search_logs`, `subscribers`, `comments`.

Credentials are in `travel-to-china/.env.local`:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

## Report Generation Process

### Step 1: Connect to Database

Read credentials from `e:/GitPrograms/travel-to-china/.env.local` and use the Turso CLI or a Node.js script to query. Example:

```bash
cd e:/GitPrograms/travel-to-china
source .env.local
# Use turso CLI if available, otherwise use a Node.js inline script
```

If Turso CLI is not available, create a temporary Node.js script at `e:/GitPrograms/travel-to-china/.claude/skills/traffic-report/query.js` that uses `@libsql/client` to connect and run queries, then delete it after.

### Step 2: Run Data Cleaning Queries

Execute the following queries in order. ALL queries MUST include these filters:
- `page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'`
- Exclude known bot UAs (see BOT_UA_LIST below)
- Exclude headless Chrome pattern: `user_agent NOT LIKE '%Linux%Chrome/14%'`

**BOT_UA_LIST** for SQL filtering:
```
AND (user_agent IS NULL OR user_agent = ''
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
  AND user_agent NOT LIKE '%Linux%Chrome/14%'))
```

### Step 3: Execute Analytics Queries

Run ALL of the following queries:

**3.1 Overall metrics (cleaned):**
```sql
SELECT
  COUNT(*) as total_pv,
  COUNT(DISTINCT visitor_id) as total_uv,
  ROUND(CAST(COUNT(*) AS REAL) / COUNT(DISTINCT visitor_id), 2) as pv_per_visitor
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND [BOT_FILTER];
```

**3.2 Monthly breakdown:**
```sql
SELECT
  strftime('%Y-%m', created_at) as month,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv,
  ROUND(CAST(COUNT(*) AS REAL) / COUNT(DISTINCT visitor_id), 2) as pv_per_uv
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND [BOT_FILTER]
GROUP BY month ORDER BY month DESC;
```

**3.3 Daily trends (last 60 days):**
```sql
SELECT
  date(created_at) as date,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND created_at >= datetime('now', '-60 days')
  AND [BOT_FILTER]
GROUP BY date ORDER BY date DESC;
```

**3.4 Referrer distribution:**
```sql
SELECT
  CASE
    WHEN referrer = '' OR referrer IS NULL THEN 'direct'
    WHEN referrer LIKE '%google.%' THEN 'Google'
    WHEN referrer LIKE '%bing.%' THEN 'Bing'
    WHEN referrer LIKE '%duckduckgo.%' THEN 'DuckDuckGo'
    WHEN referrer LIKE '%ecosia.%' THEN 'Ecosia'
    WHEN referrer LIKE '%facebook.%' OR referrer LIKE '%twitter.%' OR referrer LIKE '%reddit.%' OR referrer LIKE '%linkedin.%' OR referrer LIKE '%pinterest.%' THEN 'Social Media'
    WHEN referrer LIKE '%t.co%' THEN 'Social Media'
    ELSE 'Other Referral'
  END as source,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND [BOT_FILTER]
GROUP BY source ORDER BY pv DESC;
```

**3.5 Device/browser distribution:**
```sql
SELECT
  CASE
    WHEN LOWER(user_agent) LIKE '%mobile%' OR LOWER(user_agent) LIKE '%android%' OR LOWER(user_agent) LIKE '%iphone%' THEN 'Mobile'
    WHEN LOWER(user_agent) LIKE '%tablet%' OR LOWER(user_agent) LIKE '%ipad%' THEN 'Tablet'
    ELSE 'Desktop'
  END as device_type,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND [BOT_FILTER]
  AND user_agent IS NOT NULL AND user_agent != ''
GROUP BY device_type ORDER BY pv DESC;
```

**3.6 Top 20 popular pages:**
```sql
SELECT
  page_path,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv,
  ROUND(CAST(COUNT(*) AS REAL) / COUNT(DISTINCT visitor_id), 2) as pv_per_uv
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND [BOT_FILTER]
GROUP BY page_path ORDER BY pv DESC LIMIT 20;
```

**3.7 Content category distribution:**
```sql
SELECT
  CASE
    WHEN page_path = '/' THEN 'Homepage'
    WHEN page_path LIKE '/country/%' THEN 'Country Guide'
    WHEN page_path LIKE '/cities/%' THEN 'City Guide'
    WHEN page_path LIKE '/blog/%' THEN 'Blog'
    WHEN page_path LIKE '/routes/%' THEN 'Routes'
    WHEN page_path LIKE '/comparison/%' THEN 'Comparison'
    WHEN page_path LIKE '/tools/%' THEN 'Tools'
    WHEN page_path LIKE '/by-travel-style/%' THEN 'Travel Style'
    WHEN page_path LIKE '/search%' THEN 'Search'
    WHEN page_path LIKE '/subscribe%' THEN 'Subscribe'
    ELSE 'Other'
  END as category,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
  AND [BOT_FILTER]
GROUP BY category ORDER BY pv DESC;
```

**3.8 Content depth analysis — single-page sessions:**
```sql
WITH visitor_pages AS (
  SELECT visitor_id, COUNT(*) as page_count
  FROM page_views
  WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
    AND [BOT_FILTER]
  GROUP BY visitor_id
)
SELECT
  CASE WHEN page_count = 1 THEN '1 page (bounce)' ELSE page_count || ' pages' END as depth,
  COUNT(*) as visitors
FROM visitor_pages
GROUP BY page_count ORDER BY page_count;
```

**3.9 Average session duration:**
```sql
SELECT
  ROUND(AVG(duration), 1) as avg_duration_seconds,
  COUNT(*) as leave_events,
  ROUND(AVG(duration) / 60, 1) as avg_duration_minutes
FROM page_events
WHERE event_type = 'leave' AND duration IS NOT NULL AND duration > 0
  AND page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%';
```

**3.10 Page with highest bot traffic (for pollution detection):**
```sql
SELECT
  page_path,
  COUNT(*) as pv,
  COUNT(DISTINCT visitor_id) as uv,
  ROUND(CAST(COUNT(*) AS REAL) / COUNT(DISTINCT visitor_id), 2) as pv_uv_ratio
FROM page_views
WHERE page_path NOT LIKE '/admin%' AND page_path NOT LIKE '/api%'
GROUP BY page_path
HAVING CAST(COUNT(*) AS REAL) / COUNT(DISTINCT visitor_id) > 1.01
ORDER BY pv DESC LIMIT 10;
```

**3.11 Top search queries:**
```sql
SELECT query, COUNT(*) as count
FROM search_logs
GROUP BY query ORDER BY count DESC LIMIT 15;
```

**3.12 Subscriber stats:**
```sql
SELECT
  status,
  COUNT(*) as count
FROM subscribers
GROUP BY status;
```
Also get total and recent (last 30 days) counts.

**3.13 Comment stats:**
```sql
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN is_approved = 1 THEN 1 ELSE 0 END) as approved,
  SUM(CASE WHEN is_spam = 1 THEN 1 ELSE 0 END) as spam
FROM comments;
```

### Step 4: Compile Report

Using the query results above, produce a structured Chinese-language report. ALWAYS use this exact format:

---

# 🌏 Travels2China.com 网站访问量分析报告

**报告时间**：[当前日期]
**数据范围**：[根据查询结果确定的时间范围]

---

## 一、执行摘要

- 清洗后总 PV：[数字] | 总 UV：[数字] | PV/UV 比：[数字]
- 月均 PV：[数字] | 日均 PV：[数字]
- 流量趋势：[上涨/持平/下降，用数据说明]
- 核心问题：[一句话总结最关键的问题]

---

## 二、流量总体趋势

### 2.1 月度趋势

| 月份 | PV | UV | PV/UV | 环比变化 |
|------|-----|-----|--------|----------|
| [from query 3.2] |

### 2.2 日度趋势（近 60 天）

描述每日 PV 变化趋势，标注明显峰值和谷值，分析原因。

---

## 三、流量来源分析

### 3.1 来源渠道分布

| 来源 | PV | UV | 占比 |
|------|-----|-----|------|
| [from query 3.4] |

### 3.2 来源质量评估

- 直接访问占比 [x%] → [分析：品牌认知度、用户习惯]
- 搜索引擎占比 [x%] → [分析：SEO 表现、关键词覆盖]
- 社交媒体占比 [x%] → [分析：内容传播力]

---

## 四、用户行为分析

### 4.1 设备分布

| 设备类型 | PV | UV | 占比 |
|----------|-----|-----|------|
| [from query 3.5] |

### 4.2 访问深度

| 访问页数 | 访客数 | 占比 |
|----------|--------|------|
| [from query 3.8] |

### 4.3 会话时长

平均会话时长：[from query 3.9]
- [分析：用户是否有深度阅读行为]

### 4.4 热门搜索词

Top 搜索词列表 [from query 3.11]，分析用户真实需求。

---

## 五、内容表现分析

### 5.1 热门页面 Top 20

| 排名 | 页面 | PV | UV | PV/UV |
|------|------|-----|-----|--------|
| [from query 3.6] |

### 5.2 内容栏目分布

| 栏目 | PV | UV | 占比 |
|------|-----|-----|------|
| [from query 3.7] |

### 5.3 内容效率评估

- 各栏目的 PV/页面数比率
- 零流量或极低流量页面清单
- 流量集中度分析（多少页面贡献了 80% 流量）

---

## 六、转化数据分析

### 6.1 订阅数据

| 状态 | 数量 |
|------|------|
| [from query 3.12] |

### 6.2 评论数据

| 指标 | 数量 |
|------|------|
| [from query 3.13] |

---

## 七、爬虫/异常流量检测

### 7.1 流量污染分析

| 页面 | PV | UV | PV/UV 异常比 |
|------|-----|-----|-------------|
| [from query 3.10] |

### 7.2 风险评估

- 被污染的流量约占总量 [x]%
- 主要污染来源特征：[UA 模式、时间集中度、Referrer 特征]
- 对运营决策的影响：[如果不排除爬虫数据会导致什么误判]

---

## 八、关键发现与问题诊断

基于以上数据，列出 3-5 个最重要的发现，每个包含：
1. **问题描述**：具体数据支撑
2. **根本原因**：为什么会出现这个问题
3. **影响程度**：对网站成长的阻碍有多大

---

## 九、提升建议与行动计划（讲义）

这是报告的核心部分。按优先级分为三个层级：

### 第一优先级：立即执行（本周）

1. **数据基建**：确保每次看的是清洗后的数据
2. **高意向内容优化**：更新/合并有外部流量的页面
3. **[其他根据数据分析出的紧急事项]**

### 第二优先级：短期执行（30 天内）

1. **SEO 基础优化**：Search Console 配置、sitemap 提交、结构化数据检查
2. **内容层级重构**：建立内部链接网络
3. **转化路径设计**：在关键页面嵌入 CTA

### 第三优先级：中期建设（90 天内）

1. **内容策略**：基于搜索词数据规划新内容
2. **外链建设**：可执行的 backlink 获取策略
3. **社交媒体布局**：Pinterest/Reddit/YouTube 等适合旅游内容的平台

### 可量化目标

| 指标 | 当前值 | 30 天目标 | 90 天目标 |
|------|--------|-----------|-----------|
| 日均 SEO PV | [x] | [y] | [z] |
| 订阅转化率 | [x]% | [y]% | [z]% |
| 平均会话时长 | [x]s | [y]s | [z]s |

---

## 十、附录

- 数据清洗规则说明
- 查询 SQL 记录
- 后续跟踪建议

---

### Step 5: Present Report

Output the report directly to the user as a Markdown message. Do NOT write it to a file unless asked.

Highlight 3 key takeaways at the very top before diving into the full report.

## Important Rules

1. **Always clean data**: All queries MUST use bot/admin path filters. Never report raw numbers from the database.
2. **Compare with context**: If historical data is available, always show trends and changes.
3. **Be specific in recommendations**: Don't say "improve SEO". Say "the payment guide page has zero organic Google traffic despite 52 real PV — check Search Console for which queries it ranks for, optimize the title tag to include 'China payment 2026', and add FAQ structured data."
4. **Contextualize for the site**: This is a China travel guide site in cold-start phase. Recommendations must account for: English content about China, primarily Western audience, practical info (payment/visa/internet) is highest intent, city guides are aspirational but lower intent.
5. **Detect anomalies**: Look for PV/UV ratios > 1.01, traffic spikes on specific dates, unusual UA patterns, all-Chinese referrers, etc. Flag these explicitly.
6. **Clean up**: Delete any temporary scripts created during analysis.
