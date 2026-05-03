# TASK_BOARD

状态：Phase 0 / Dev OS 闭环建立中
更新时间：2026-05-03

| ID | 标题 | 负责人 | 状态 | 优先级 | 文档 |
|---|---|---|---|---|---|
| T-000 | Bootstrap Dev OS | yuan-control | done | P0 | `tasks/T-000-bootstrap-dev-os.md` |
| T-001 | 设置 Hermes Agent Profiles | yuan-control | done | P0 | `tasks/T-001-setup-agent-profiles.md` |
| T-002 | 建立 Project OS 文档事实源 | yuan-architect | done | P0 | `tasks/T-002-project-os-docs.md` |
| T-003 | Dev OS Dashboard UI | yuan-frontend | done | P0 | `tasks/T-003-dashboard-ui.md` |
| T-004 | Dashboard JSON Sync | yuan-architect | done | P0 | `tasks/T-004-dashboard-json-sync.md` |
| T-005 | Project Wiki Viewer | yuan-frontend | done | P1 | `tasks/T-005-wiki-viewer.md` |

## 状态枚举

- pending
- ready
- in_progress
- blocked
- review
- done
- cancelled

## 当前执行顺序

1. Dev OS 流程纠偏已写入事实源：新页面 / 新模块 / 数据结构 / 接口协议 / Wiki 索引 / 系统边界 / 前后端协作边界，必须先由 `yuan-architect` 输出轻量架构说明。
2. T-005 Project Wiki Viewer 已完成：`yuan-architect` 前置架构、`yuan-frontend` 实现、`yuan-reviewer` 验收均已通过。
3. 下一步创建并派发 T-006 Dev OS Dashboard 视觉对齐 / Shell 重构；完成后再继续 Dev OS 任务看板详情页与进度汇总机制。

## Architect 前置门禁

必须先经过 `yuan-architect`：

- 新页面。
- 新模块。
- 数据结构。
- `dashboard.json` / schema 变更。
- API / 接口协议。
- Wiki / 文档索引结构。
- 业务系统边界。
- 前后端协作边界。

可不经过 `yuan-architect`：

- 状态同步。
- 文档小修、拼写修复、链接修正。
- reviewer 发现的小范围问题修复。
- 与既有事实一致的任务状态同步。

## 今天不做

- 不接真实短信。
- 不接真实生图模型。
- 不接支付。
- 不让所有 agent 都进群。
- 不直接开发业务功能。
- 不开发登录、生图、试卷、支付等业务功能。
- 不修改数据库 schema。
