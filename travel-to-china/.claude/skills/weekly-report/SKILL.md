---
description: 周报 — analyst 分析流量 → 识别内容缺口 → 输出行动建议
model: sonnet
---

# Weekly Report — 网站运营周报

每周自动分析网站流量，识别问题和机会，输出可执行的行动清单。

## 工作流程

```
┌─────────────┐
│  Step 1      │  analyst agent
│  数据收集    │  • 运行 query.js 拉取 DB 数据
│             │  • 分析 PV/UV/跳出率/订阅转化
│             │  • 识别流量 Top 10 页面和 Bottom 10 页面
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Step 2      │  analyst agent
│  问题诊断    │  • 高跳出率页面 → 写入 [[needs-review-{slug}]]
│             │  • 404/失效链接检测
│             │  • UTM 归因分析
│             │  • 搜索日志发现未覆盖的关键词
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Step 3      │  协调输出
│  行动清单    │  • 内容缺口 → 写入 [[content-gap-{topic}]]
│             │  • 技术问题 → 写入 [[bug-found-{issue}]]
│             │  • 需评审页面 → 写入 [[needs-review-{slug}]]
│             │  • 生成本周工作总结
└─────────────┘
```

## 使用方式

```
/weekly-report          # 分析最近 7 天
/weekly-report 30       # 分析最近 30 天
```

## 报告结构

1. **流量概况** — PV/UV 趋势，Bot 过滤率
2. **Top 10 页面** — 流量分布，与上周对比
3. **Bottom 10 页面** — 零流量页面，考虑优化或删除
4. **搜索分析** — 站内搜索日志关键词，发现内容缺口
5. **转化漏斗** — 订阅转化率，哪个页面转化最好
6. **技术健康** — 404 错误、性能问题、追踪缺失
7. **行动清单** — 分 priority 的 tasks

## 输出到 Memory 的自动标记

| 发现 | Memory 标记 | 接手 Agent |
|------|-------------|------------|
| 用户搜索"how to use Alipay"但无对应页面 | `[[content-gap-how-to-use-alipay]]` | researcher |
| 页面 `/blog/old-post` 跳出率 > 95% | `[[needs-review-blog/old-post]]` | reviewer |
| UTM 参数缺失导致归因失败 | `[[bug-found-utm-tracking]]` | developer |
| 某页面日均 PV 增长 > 50% | `[[trending-page-{slug}]]` | researcher (跟进) |

## 自动调度建议

设置为每周一自动运行：
```
/cron "0 9 * * 1" "/weekly-report"    # 每周一早 9 点
```

或在 Claude Code 设置 Cron:
```
CronCreate: cron="0 9 * * 1", prompt="/weekly-report", durable=true
```
