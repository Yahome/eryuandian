# Dashboard JSON Schema

状态：活跃（内部标识：`active`）
更新时间：2026-05-03

## 文件

`docs/project-os/dashboard/dashboard.json`

该文件是 `/dev-dashboard` 的第一数据源，由 `yuan-architect` 从 Markdown 事实源汇总生成。

## 顶层字段

- `project`：项目概要。
- `agents`：5 个 Hermes profiles 状态。
- `tasks`：Dev OS 的 `T-xxx` 与 Web App 的 `TWA-xxx` 任务状态。
- `risks`：当前风险。
- `roadmap`：Phase 0 到 Phase 4 路线图。
- `pendingApprovals`：待用户确认事项（字段名保留英文，不属于任务状态枚举 `pending`）。
- `recentUpdates`：最近更新。
- `wikiLinks`：Dashboard 快速入口。

## 约束

- 不得写入与 Markdown 事实源冲突的信息。
- 前端不得硬编码 KPI 和任务状态，必须读取此 JSON。
- 若字段变更，必须同步更新本文件和 T-004。
