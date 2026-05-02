# Dev OS Dashboard Summary

状态：Phase 0 / Dev OS 闭环建立中
更新时间：2026-05-03

## 结论

两元店 Dev OS 的 Markdown 事实源已经建立，5 个 Hermes Agent 的职责文档已就位，T-001 与 T-002 已完成。当前关键闭环是：`yuan-architect` 已从 `docs/project-os` Markdown 事实源生成 Dashboard 汇总数据，下一步可交给 `yuan-frontend` 基于 `docs/project-os/dashboard/dashboard.json` 开发 `/dev-dashboard`，但不得硬编码任务、风险、Agent 状态等展示数字。

## 当前项目状态

- 中文项目名：两元店
- 英文目录名：`eryuandian`
- 项目目录：`/root/eryuandian`
- 当前阶段：Phase 0 / Dev OS 与项目准备
- 事实源原则：Markdown 文档是事实源，Dashboard 只是可视化层
- 首读入口：`docs/project-os/SOURCE_OF_TRUTH.md`
- Dashboard 数据源：`docs/project-os/dashboard/dashboard.json`

## 已完成

- T-000：Bootstrap Dev OS，已完成。
- T-001：设置 Hermes Agent Profiles，已完成；5 个 profile 已验证能返回职责说明。
- T-002：建立 Project OS 文档事实源，已完成。
- T-004：Dashboard JSON Sync，本次已生成 `summary.md` 与合法 JSON 数据。

## 进行中 / 可开工

- T-003：Dev OS Dashboard UI，状态 ready；可基于本次 JSON 数据源开工。
- T-005：Project Wiki Viewer，状态 ready；优先级 P1，依赖 Dashboard / Wiki 入口展示。
- Phase 0 仍有 Dev Dashboard MVP 与任务看板进度汇总机制待完成。

## 阻塞与风险

- R-001：Codex CLI 与 Hermes OAuth 状态分离，状态 monitoring。
- R-002：多 Agent 并行修改冲突，状态 open。
- R-003：Dashboard 数据硬编码，状态 open；前端必须读取 `dashboard.json`，不得硬编码演示数字。

## 待确认事项

1. 确认 `/dev-dashboard` 前端是否可以基于 `docs/project-os/dashboard/dashboard.json` 开工。
2. 确认 T-003 的验收范围是否只覆盖 Dev OS Dashboard，不进入登录、生图、试卷等业务功能。
3. 确认后续 Dashboard 是否继续由 `yuan-architect` 手动同步，还是增加自动同步脚本。
4. 确认 Phase 1 开工前的技术栈、API 契约、数据模型是否以现有草案为准。

## Wiki 快速入口

- `docs/project-os/README.md`
- `docs/project-os/PROJECT_BRIEF.md`
- `docs/project-os/ROADMAP.md`
- `docs/project-os/TASK_BOARD.md`
- `docs/project-os/DECISIONS.md`
- `docs/project-os/RISKS.md`
- `docs/project-os/agents/`
- `docs/project-os/tasks/`
- `docs/project-os/dashboard/SCHEMA.md`
