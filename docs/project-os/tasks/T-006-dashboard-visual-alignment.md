---
id: T-006
title: Dev OS Dashboard Visual Alignment / Shell Refactor
owner: yuan-frontend
status: done
priority: P1
progress: 100
created_at: 2026-05-03
updated_at: 2026-05-03
tags:
  - frontend
  - dashboard
  - visual-alignment
  - dev-os
---

# T-006 Dev OS Dashboard Visual Alignment / Shell Refactor

## 目标

把当前 `/dev-dashboard` 从“可用的内部 MVP”调整为更接近设计基准的现代 SaaS dashboard 壳。

当前界面和预期设计差距较大，这个不能放到最后，否则后续任务看板、Agent 状态、风险决策、日报、Wiki 等页面都会继承错误的布局和组件。T-006 先修正 Dashboard shell、视觉语言和组件基础。

## 必须先读取

- `docs/project-os/SOURCE_OF_TRUTH.md`
- `docs/project-os/AGENT_WORKFLOW.md`
- `docs/project-os/DESIGN_SYSTEM.md`
- `docs/project-os/tasks/T-003-dashboard-ui.md`
- `docs/project-os/tasks/T-005-wiki-viewer.md`
- `docs/project-os/dashboard/dashboard.json`
- `pic/dev-os-dashboard.png`
- `pic/brand-logo-identity.png`
- `src/main.tsx`
- `src/styles.css`

## 非目标 / 禁止事项

- 不改变 dashboard schema。
- 不新增 API。
- 不修改数据库 schema。
- 不开发登录 / 生图 / 试卷 / 支付业务功能。
- 不重新规划或返工 T-005 Wiki Viewer 功能。
- 不硬编码任务、Agent、风险、Roadmap、recent updates、wikiLinks 等业务状态数据。
- 不新增重型 UI 依赖；如确有必要，必须先回报 `yuan-control` 确认。

## UI Shell 边界说明

T-006 不涉及新数据结构、API、dashboard schema 或业务系统边界，因此不需要 `yuan-architect` 做复杂架构设计。

本任务只抽象和重构 Dashboard 视觉壳：layout、sidebar、top header、card、badge、KPI、Roadmap、Agent grid、Wiki 快捷入口和 Viewer 的展示结构。所有数据仍来自现有 `dashboard.json` 和 T-005 已建立的只读 Markdown 映射。

## 实现范围

### 整体视觉壳

- 重构 `/dev-dashboard` 的整体视觉壳，更接近 `pic/dev-os-dashboard.png` 的现代 SaaS dashboard。
- 使用白底、紫蓝渐变、轻阴影、圆角卡片、紧凑信息密度。
- 不要再让大面积渐变 hero 抢走主内容空间。
- 页面应更像参考图里的产品级管理台，而不是临时内部页。

### 左侧导航

- 左侧导航改成更紧凑的 sidebar。
- 顶部展示两元店 logo / wordmark。
- 导航包含：总览、任务看板、Agent 状态、项目 Wiki、风险与决策、日报、设置。
- 当前未实现页面仍可显示 Coming soon，但视觉要和参考图一致。
- 底部可保留品牌卡或版本信息，但不要占用过大面积。

### 顶部 Header

- 顶部栏增加或恢复参考图里的顶部 header。
- 包含标题、搜索框、通知 / 帮助 / 用户区域的视觉占位。
- 这些只是 Dev OS 视觉壳，不接真实登录，不做通知功能，不接后端。

### KPI 卡片

- KPI 卡片保持数据来自 `dashboard.json`。
- 整体进度、进行中任务、阻塞任务、活跃 Agent、最近更新都要展示。
- 样式更接近参考图：图标 / 圆形进度 / 轻色块 / 卡片阴影。
- 不硬编码统计数字。

### 项目总览与 Agent 状态

- 项目总览要更接近参考图的信息结构：当前阶段、Sprint、健康状态、阶段进度。
- Agent 状态建议使用紧凑卡片网格，而不是过宽列表。
- Agent 数据仍来自 `dashboard.json`。

### Roadmap / 风险确认 / 最近更新

- 总览页应恢复或强化这些模块。
- Roadmap 尽量接近参考图里的阶段时间线 / 阶段卡片效果。
- 风险与待确认、最近更新应作为右侧或下方卡片展示。
- 数据仍来自 `dashboard.json` 的 `roadmap`、`risks`、`pendingApprovals`、`recentUpdates`。

### Wiki 快捷入口与 Wiki Viewer

- 保留 T-005 已完成的 Project Wiki Viewer。
- Wiki Viewer 仍然只读，仍然只能展示 `docs/project-os/**/*.md`。
- Wiki 首页 / 快捷入口视觉应更接近参考图的“Wiki 快速入口”卡片。
- 不破坏 T-005 的安全边界：不新增 API、不远程拉取 Markdown、不读取 `docs/project-os` 之外文件、不提供编辑 / 保存 / 删除 / 上传。

### 组件与样式

- 可以在 `src/main.tsx` 中拆分更清晰的 React 组件。
- 可以重构 `src/styles.css`，建立基础 design tokens，例如 spacing、radius、shadow、gradient、card、nav、badge。
- 保持 Vite / React / TypeScript 当前技术栈。
- 响应式至少保证 PC 宽屏显示明显改善。
- 移动端可以先保证不崩、不横向严重溢出，不要求完整移动端最终形态。

## 允许修改范围

- `src/main.tsx`
- `src/styles.css`
- 必要的轻量前端静态资源或组件文件
- `docs/project-os/agents/yuan-frontend.md`
- `docs/project-os/tasks/T-006-dashboard-visual-alignment.md`
- `docs/project-os/dashboard/summary.md`
- `docs/project-os/dashboard/dashboard.json`
- `docs/project-os/dashboard.json`

如需修改其他文件，必须先确认是否属于 T-006 范围。

## 验收标准

- [x] `/dev-dashboard` 可访问。
- [x] 视觉明显更接近 `pic/dev-os-dashboard.png`。
- [x] 保留 T-003 总览能力。
- [x] 保留 T-005 Project Wiki Viewer 能力。
- [x] 所有任务、Agent、风险、Roadmap、recent updates、wikiLinks 数据仍来自 `dashboard.json`。
- [x] 不硬编码业务状态数据。
- [x] 不新增 API。
- [x] 不修改 dashboard schema。
- [x] 不修改数据库 schema。
- [x] 不开发登录、生图、试卷、支付业务功能。
- [x] `npm run lint` 通过。
- [x] `npm run typecheck` 通过。
- [x] `npm run build` 通过。
- [x] `jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json` 通过。
- [x] `git diff --check` 通过。
- [x] reviewer 提供截图或文字说明当前界面相对设计基准的改善点，以及仍未完成的后续 polish 项。

## Reviewer 验收重点

- 是否更接近 `pic/dev-os-dashboard.png`。
- 是否破坏了 T-003 总览页。
- 是否破坏了 T-005 Wiki Viewer。
- 是否仍然读取 `dashboard.json`。
- 是否仍然不越界开发业务功能。
- 是否仍然不新增 API / 不改 schema / 不改数据库。

## 进展记录

- 2026-05-03：由 `yuan-control` 创建任务，状态 ready；下一步派 `yuan-frontend` 实现。

- 2026-05-03：`yuan-frontend` 已完成 T-006 实现，重构 Dashboard shell、sidebar、top header、KPI、Agent grid、Roadmap、风险/待确认、最近更新和 Wiki 快捷入口；抽取独立 logo 资源，验证 lint/typecheck/build/jq/diff-check 通过。
- 2026-05-03：`yuan-reviewer` 已完成 T-006 验收，结论 PASS with notes；验证 lint/typecheck/build/jq/diff-check 与浏览器截图通过。Gemini CLI 已调用但服务端返回 429 模型容量不足，无有效二审输出，已按流程记录。
