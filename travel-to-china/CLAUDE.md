# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**Travel to China** (`travels2china.com`) — A comprehensive travel guide website for English-speaking travelers planning trips to China. Covers 16 cities, country guides, route planning, travel style recommendations, city comparisons, and practical tools.

## Tech Stack

- **Framework**: Next.js 14 (Pages Router + App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + CSS custom properties
- **Database**: Turso (libSQL) + Drizzle ORM
- **Auth**: NextAuth.js (Google + GitHub OAuth)
- **Content**: MDX with gray-matter, loaded at build time from `content/`
- **Search**: FlexSearch (client-side)
- **Icons**: Lucide React
- **Package Manager**: npm

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
npm run db:push  # Push database schema changes
```

## Design Context

> 由 `/magistero teach` 生成，用于指导所有前端设计工作。
> 最后更新：2026-06-26

### Users

**目标用户**：所有计划来中国旅行的人——背包客、商务旅客、家庭出游、首次来华的新手、以及重返中国的有经验旅行者。

**使用场景**：
- **主要场景**：在家做攻略，桌面端为主，仔细浏览、对比城市、规划路线
- **次要场景**：旅途中手机查阅，需要快速找到实用信息（支付、交通、语言）

**核心任务**：发现目的地灵感 → 了解实用信息 → 做出旅行决策 → 旅途中随时查阅

### Brand Personality

**三个关键词**：温暖 · 博学 · 激发向往

- **温暖友好**：像一个热情的中国朋友在分享家乡的美好，不是冰冷的官方指南
- **内容丰富**：想找的信息都能找到，但组织有序、不让人感到 overwhelming
- **激发向往**：看完就想订机票——把中国的美传递给更多人

**情感目标**：让用户在浏览过程中产生"哇，我好想去"的冲动，同时感到"这网站靠谱，信息很全"

### Aesthetic Direction

**核心视觉理念：现代东方 — Modern Orient**

将中国的现代化成就与传统文化美学融合：
- **现代的一面**：摩天大楼、高铁、移动支付、繁华都市夜景——展现中国的发达与便利
- **传统的一面**：山水意境、园林留白、书法韵味、非遗色彩——展现中国的文化底蕴

**视觉语调**：
- 不是刻板的"政府官网"风格——不要公务感
- 不是西方对中国的刻板印象（灯笼、龙、大红色堆砌）
- 是一个**懂中国、爱中国的人**在向世界分享真实的中国

**参考方向**：
- **杂志编辑风**：大图、留白、有节奏的排版——像一本精美的旅行杂志
- **东方留白美学**：不堆砌信息，有呼吸感，画面有重心
- **地域色彩叙事**：每个城市/地区有自己的色彩标签

**反例参考（绝对不能像）**：
- ❌ 政府旅游局官网风格（刻板、公文腔、信息罗列）
- ❌ 典型的 SaaS 落地页（紫蓝渐变、网格卡片、居中大标题）
- ❌ 千篇一律的 AI 设计风格（cyan-on-dark、玻璃态、霓虹发光）

### Design Principles

1. **用视觉讲故事（Show, Don't Tell）**：每个目的地页面让人一眼就想出发
2. **地域即色彩（Region = Palette）**：北京朱红+琉璃金，江南水墨灰+柳绿，西南云南蓝+翡翠绿
3. **留白是奢侈（Whitespace is Luxury）**：杂志式排版，呼吸感，不堆砌
4. **动效传达情绪（Motion with Meaning）**：北京的沉稳、江南的温婉、川渝的鲜活
5. **移动即实用（Mobile is Utility）**：桌面"种草"，移动"办事"

### Color Direction

| 用途 | 方向 |
|---|---|
| **主品牌色** | 朱砂/故宫红质感，减少"警示红" |
| **辅助色** | 哑光金/香槟金，避免"暴发户金" |
| **地域色板** | 每个目的地拥有色彩标签（江南青绿、西北赭石、西南靛蓝等） |
| **中性色** | 暖灰色调，微偏红/金，呼应品牌色 |

### Typography Direction

- 替换当前 Inter 字体，寻找有东方气质但不刻板的字体配对
- 标题字体：现代无衬线体带有微妙人文细节
- 正文字体：清晰易读，适合长文阅读
- 中文字体：为中文地名/术语预留展示字体

### Motion Direction

- **页面入场**：基于地域特色的差异化动效
- **图片展示**：视差滚动、渐进式加载
- **页面过渡**：平滑的地域色彩渐变过渡
- **交互反馈**：微妙但有触感
