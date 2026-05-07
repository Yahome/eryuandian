# TASK_BOARD

状态：Phase 1 / Web App MVP 架构基线已冻结
更新时间：2026-05-08

## Dev OS / Project OS 治理任务

Dev OS / Project OS 治理任务继续使用 `T-xxx`，任务文档统一放在 `docs/project-os/tasks/dev-os/`。

| ID | 标题 | 负责人 | 状态 | 优先级 | 文档 |
|---|---|---|---|---|---|
| T-000 | Bootstrap Dev OS | yuan-control | 已完成 | P0 | `tasks/dev-os/T-000-初始化-Dev-OS.md` |
| T-001 | 设置 Hermes Agent Profiles | yuan-control | 已完成 | P0 | `tasks/dev-os/T-001-设置-Hermes-Agent-Profiles.md` |
| T-002 | 建立 Project OS 文档事实源 | yuan-architect | 已完成 | P0 | `tasks/dev-os/T-002-建立-Project-OS-文档事实源.md` |
| T-003 | Dev OS Dashboard UI | yuan-frontend | 已完成 | P0 | `tasks/dev-os/T-003-Dev-OS-Dashboard-界面.md` |
| T-004 | Dashboard JSON Sync | yuan-architect | 已完成 | P0 | `tasks/dev-os/T-004-Dashboard-JSON-同步.md` |
| T-005 | Project Wiki Viewer | yuan-frontend | 已完成 | P1 | `tasks/dev-os/T-005-Project-Wiki-查看器.md` |
| T-006 | Dev OS Dashboard Visual Alignment / Shell Refactor | yuan-frontend | 已完成 | P1 | `tasks/dev-os/T-006-Dashboard-视觉对齐与-Shell-重构.md` |
| T-007 | Dev OS 任务看板详情页 + 进度汇总机制 | yuan-frontend | 已完成 | P1 | `tasks/dev-os/T-007-任务看板详情页与进度汇总机制.md` |
| T-008 | Dev OS 事实源一致性校验脚本 / Closeout Gate | yuan-architect | 已完成 | P1 | `tasks/dev-os/T-008-Dev-OS-事实源一致性校验脚本.md` |
| T-009 | reviewer 二审方式调整与复核（gpt-5.3-codex） | yuan-architect | 已完成 | P1 | `tasks/dev-os/T-009-reviewer-二审方式调整与复核.md` |
| T-010 | Dev OS Dashboard 信息架构与交互收尾整改 | yuan-architect | 已完成 | P0 | `tasks/dev-os/T-010-Dev-OS-Dashboard-信息架构与交互收尾整改.md` |
| T-011 | Project OS 文档体系中文化与任务线分离 | yuan-architect | 已完成 | P0 | `tasks/dev-os/T-011-Project-OS-文档体系中文化与任务线分离.md` |

## Web App 业务任务

Web App 业务任务统一使用 `TWA-xxx`，任务文档统一放在 `docs/project-os/tasks/web-app/`。`TWA-000` 是 Web App 任务线启动任务，用于冻结 MVP 架构与开发基线。

| ID | 标题 | 负责人 | 状态 | 优先级 | 文档 |
|---|---|---|---|---|---|
| TWA-000 | Web App MVP 架构冻结与开发基线 | yuan-architect | 已完成 | P0 | `tasks/web-app/TWA-000-Web-App-MVP-架构冻结与开发基线.md` |

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
7. T-010 Dev OS Dashboard 信息架构与交互收尾整改已完成，并通过 `yuan-reviewer` 与 `gpt-5.3-codex` 二审；Dev OS Dashboard v1.0 收尾完成，后续 Web App 正式开发需新任务承接。
8. T-011 Project OS 文档体系中文化与任务线分离已完成：T-000 至 T-010 已使用 `git mv` 迁移到 `tasks/dev-os/` 中文文件名，`tasks/web-app/README.md` 仅作为任务线说明创建；未修改 dashboard schema 或业务代码。
9. TWA-000 Web App MVP 架构冻结与开发基线已完成：Web App 任务线命名规则、MVP 范围、路由草案、API contract 草案、概念数据模型、Mock/Adapter 边界、Agent 分工和 TWA-001 至 TWA-007 拆分已冻结；未新增真实 API 文件、未修改数据库 schema、未进入真实业务功能。

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
- Web App 业务任务不再使用 `T-xxx`，统一使用 `TWA-xxx`。
