# TASK_BOARD

状态：Phase 0 / Dev OS 闭环建立中
更新时间：2026-05-06

| ID | 标题 | 负责人 | 状态 | 优先级 | 文档 |
|---|---|---|---|---|---|
| T-000 | Bootstrap Dev OS | yuan-control | 已完成 | P0 | `tasks/T-000-bootstrap-dev-os.md` |
| T-001 | 设置 Hermes Agent Profiles | yuan-control | 已完成 | P0 | `tasks/T-001-setup-agent-profiles.md` |
| T-002 | 建立 Project OS 文档事实源 | yuan-architect | 已完成 | P0 | `tasks/T-002-project-os-docs.md` |
| T-003 | Dev OS Dashboard UI | yuan-frontend | 已完成 | P0 | `tasks/T-003-dashboard-ui.md` |
| T-004 | Dashboard JSON Sync | yuan-architect | 已完成 | P0 | `tasks/T-004-dashboard-json-sync.md` |
| T-005 | Project Wiki Viewer | yuan-frontend | 已完成 | P1 | `tasks/T-005-wiki-viewer.md` |
| T-006 | Dev OS Dashboard Visual Alignment / Shell Refactor | yuan-frontend | 已完成 | P1 | `tasks/T-006-dashboard-visual-alignment.md` |
| T-007 | Dev OS 任务看板详情页 + 进度汇总机制 | yuan-frontend | 已完成 | P1 | `tasks/T-007-task-board-progress.md` |
| T-008 | Dev OS 事实源一致性校验脚本 / Closeout Gate | yuan-architect | 已完成 | P1 | `tasks/T-008-dev-os-consistency-validator.md` |
| T-009 | reviewer 二审方式调整与复核（gpt-5.3-codex） | yuan-architect | 已完成 | P1 | `tasks/T-009-gemini-prompt-file-review.md` |

## 状态枚举

- `pending`：待处理
- `ready`：准备中
- `in_progress`：进行中
- `blocked`：已阻塞
- `review`：审核中
- `done`：已完成
- `cancelled`：已取消

## 当前执行顺序

1. Dev OS 流程纠偏已写入事实源：新页面 / 新模块 / 数据结构 / 接口协议 / Wiki 索引 / 系统边界 / 前后端协作边界，必须先由 `yuan-architect` 输出轻量架构说明。
2. T-005 Project Wiki Viewer 已完成：`yuan-architect` 前置架构、`yuan-frontend` 实现、`yuan-reviewer` 验收均已通过。
3. T-006 Dev OS Dashboard 视觉对齐 / Shell 重构已完成并验收通过。
4. T-007 Dev OS 任务看板详情页 + 进度汇总机制已完成 `yuan-frontend` 实现并通过 `yuan-reviewer` 验收；Gemini 二审因服务端 429 无有效输出，已记录且不阻塞验收结论。
5. T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate 已完成 `yuan-architect` 实现并通过 `yuan-reviewer` 验收，新增只读脚本 `scripts/dev-os-validate.mjs`；Gemini 二审因 429 / 网络错误无有效输出，已记录且不阻塞验收结论。
6. T-009 reviewer 二审方式调整与复核（`gpt-5.3-codex`）已完成：后续 reviewer 第二审查统一使用 Codex CLI `gpt-5.3-codex`，不再使用 Gemini CLI；不派 `yuan-frontend` / `yuan-backend`，不进入业务功能。

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
- 不保存 token/key/auth/secret/bearer token。
