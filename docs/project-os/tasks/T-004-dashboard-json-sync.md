---
id: T-004
title: Dashboard JSON Sync
owner: yuan-architect
status: done
priority: P0
progress: 100
created_at: 2026-05-02
updated_at: 2026-05-03
tags:
  - dashboard
  - json
  - wiki
---

# T-004 Dashboard JSON Sync

## 目标

从 `docs/project-os` Markdown 事实源生成第一版 Dashboard 汇总数据。

## 输入事实源

- `docs/project-os/README.md`
- `docs/project-os/PROJECT_BRIEF.md`
- `docs/project-os/ROADMAP.md`
- `docs/project-os/TASK_BOARD.md`
- `docs/project-os/DECISIONS.md`
- `docs/project-os/RISKS.md`
- `docs/project-os/agents/*.md`
- `docs/project-os/tasks/*.md`
- `docs/project-os/dashboard/SCHEMA.md`

## 输出

- `docs/project-os/dashboard/summary.md`
- `docs/project-os/dashboard/dashboard.json`

## dashboard.json 字段

- `project`
- `agents`
- `tasks`
- `risks`
- `roadmap`
- `pendingApprovals`
- `recentUpdates`
- `wikiLinks`

## 验收标准

- [x] `summary.md` 存在并总结 Phase 0 状态
- [x] `dashboard.json` 是合法 JSON
- [x] 包含 5 个 Agent
- [x] 包含 T-001 到 T-005，并补充 T-000 作为 bootstrap 历史任务
- [x] 包含风险与待确认事项
- [x] 包含 roadmap、recentUpdates、wikiLinks
- [x] 不硬编码与事实源冲突的信息
- [x] 不开发业务功能
- [x] 不修改前端代码

## 当前结果

已完成第一版 Dashboard 数据同步。`dashboard/dashboard.json` 现在可作为 `/dev-dashboard` 的数据源，前端应从该 JSON 读取项目状态、Agent 状态、任务、风险、路线图、待确认事项、最近更新和 Wiki 入口。

## 后续规则

- 若 Markdown 事实源更新，必须重新同步 `dashboard/summary.md` 与 `dashboard/dashboard.json`。
- 若 `dashboard.json` 顶层字段或结构变更，必须同步更新 `docs/project-os/dashboard/SCHEMA.md`。
- 前端不得用硬编码演示数据替代本文件。

## 变更记录

- 2026-05-02：创建任务文档。
- 2026-05-03：读取 `docs/project-os` 事实源，生成 `summary.md` 与 `dashboard.json`，任务状态更新为 done。
