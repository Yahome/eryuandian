---
id: T-004
title: Dashboard JSON Sync
owner: yuan-architect
status: done # 已完成
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

## Phase 0 启动验收（yuan-reviewer，2026-05-03）

结论：**WARN / 可作为 T-003 数据源放行**。

### 验收证据

- `docs/project-os/dashboard/dashboard.json`：已用 Python `json.loads` 实际解析，结果为合法 JSON。
- `docs/project-os/dashboard/SCHEMA.md`：声明顶层字段为 `project`、`agents`、`tasks`、`risks`、`roadmap`、`pendingApprovals`、`recentUpdates`、`wikiLinks`。
- `docs/project-os/dashboard/dashboard.json`：包含上述 8 个顶层字段，`agents` 数量为 5，`tasks` 包含 `T-001`、`T-002`、`T-003`、`T-004`、`T-005`（另含 `T-000` 作为 bootstrap 历史任务）。
- `docs/project-os/dashboard.json`：根部 dashboard JSON 同样是合法 JSON，并包含用户要求的 8 个顶层字段。
- `docs/project-os/tasks/dev-os/T-003-Dev-OS-Dashboard-界面.md`：T-003 owner 为 `yuan-frontend`，`status: "ready"` 表示任务处于“准备中”状态，priority 为 `P0`，progress 为 `0`，数据源指定为 `docs/project-os/dashboard/dashboard.json` 与 `summary.md`。

### 校验范围说明

本次 schema 校验依据当前 `SCHEMA.md` 可用信息执行：

- 校验 JSON 语法合法性。
- 校验 `SCHEMA.md` 声明的 8 个顶层字段是否存在。
- 校验 `dashboard/dashboard.json` 中 5 个 agents 与 T-001 到 T-005 是否存在。

当前 `SCHEMA.md` 未定义深层字段类型、必填字段、枚举值或 JSON Schema 文件，因此未做深层结构类型约束校验。

### 发现的问题

- 已修复：`docs/project-os/TASK_BOARD.md` 中 T-004 已按本文件 frontmatter、`docs/project-os/dashboard/dashboard.json`、`docs/project-os/dashboard.json` 同步为“已完成”（内部枚举：`done`）。
- 已补充审计：5 个 profile 的 home directory 与 `SOUL.md` 存在性已记录到 `docs/project-os/agents/profile-audit.md`；记录只包含路径、角色摘要和最后修改时间，不包含敏感信息。

### T-003 交接判断

可以正式交给 `yuan-frontend` 开发，前置条件：

- 只开发 `/dev-dashboard`，不开发业务功能。
- 必须读取 `docs/project-os/dashboard/dashboard.json`，不得硬编码 Agent、任务、风险、路线图等数据。
- UI 验收以 `docs/project-os/tasks/dev-os/T-003-Dev-OS-Dashboard-界面.md` 的验收标准为准。
- 开工前建议同步 `TASK_BOARD.md` 的 T-004 状态。

## 变更记录

- 2026-05-02：创建任务文档。
- 2026-05-03：读取 `docs/project-os` 事实源，生成 `summary.md` 与 `dashboard.json`，任务状态更新为“已完成”（内部枚举：`done`）。
- 2026-05-03：`yuan-reviewer` 完成 Phase 0 启动验收，实际校验两个 dashboard JSON 与 `SCHEMA.md` 顶层字段；结论 WARN，但 T-003 可在前置条件下交给 `yuan-frontend`。
