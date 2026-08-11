---
description: 内容生产流水线 — researcher 研究 → reviewer 审核 → developer 发布
model: sonnet
---

# Content Pipeline — 内容生产流水线

一键触发"从选题到发布"的完整内容生产流程。

## 工作流程

```
用户提供选题/关键词
       │
       ▼
┌─────────────┐
│  Phase 1    │  researcher agent 负责
│  内容研究    │  • WebSearch 搜集资料
│             │  • 竞品分析
│             │  • 关键词确认
│             │  • 撰写内容大纲
│             │  • 输出: memory [[research-{topic}]]
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Phase 2    │  reviewer agent 负责
│  内容评审    │  • SEO 检查清单
│             │  • EEAT 信号检查
│             │  • 事实准确性抽查
│             │  • 输出: memory [[approved-{topic}]] 或 [[revision-needed-{topic}]]
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Phase 3    │  developer agent 负责
│  技术发布    │  • 创建 MDX 文件
│             │  • 更新交叉链接
│             │  • 设置 lastUpdated
│             │  • 构建验证
│             │  • 提交 + 推送
└─────────────┘
```

## 使用方式

```
/content-pipeline "Best Time to Visit China in 2026"
/content-pipeline "how to use Didi in China"
/content-pipeline [URL of competitor article to target]
```

## 中断与审核点

每个 Phase 结束后暂停，展示产出，等待用户确认后再进入下一个 Phase。

## Phase 1 详细指令 (researcher)

1. 用 WebSearch 搜索目标关键词
2. 分析排名前 5 的竞品文章，提取：标题模式、H2 结构、字数范围、独特卖点
3. 搜索 Reddit: `site:reddit.com/r/ChinaTravel {topic}`
4. 生成内容大纲（H2 章节 + 每节核心要点）
5. 收集关键事实（需标注来源 URL 和采集日期）
6. 写入 memory: `[[research-{topic-slug}]]`

## Phase 2 详细指令 (reviewer)

1. 读取 `[[research-{topic-slug}]]` memory
2. 对照片段清单逐项检查（SEO 7 项 + EEAT 5 项 + 内容 5 项 + 技术 3 项）
3. 与已有内容比对查重
4. 出审核报告（APPROVED / REVISION_NEEDED）
5. 写入 memory: `[[approved-content-{slug}]]` 或 `[[revision-needed-{slug}]]`

## Phase 3 详细指令 (developer)

1. 读取审核通过的 research
2. 按 MDX 模板创建文件 `content/{category}/{slug}.mdx`
3. 更新相关的交叉链接（3-5 个已有页面）
4. 如果有新图片引用，确认路径正确
5. `npm run build` 验证
6. 提交并推送

## 快速模式

如果 topic 是已有 research 的补充/更新，可以跳过 Phase 1，直接从 Phase 2 开始：
```
/content-pipeline --skip-research "Update payment guide for 2026 July policy change"
```
