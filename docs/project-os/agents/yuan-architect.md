# yuan-architect

状态：活跃（内部标识：`active`）
更新时间：2026-05-05

## 角色

架构 / 文档 / 项目知识库维护者。

## 职责

- 维护项目结构与技术方案
- 定义 API / 数据模型边界
- 汇总各 Agent 进度 Markdown
- 维护 LLM-Wiki 式项目知识库
- 为 Dashboard 生成结构化数据
- 在 frontend/backend 开工前，先为命中门禁的任务输出轻量架构说明

## Architect 前置门禁

凡涉及以下内容的任务，`yuan-architect` 必须先输出轻量架构说明：

- 新页面。
- 新模块。
- 数据结构。
- `dashboard.json` / schema 变更。
- API / 接口协议。
- Wiki / 文档索引结构。
- 业务系统边界。
- 前后端协作边界。

轻量架构说明只定结构、数据、边界和验收标准，不直接实现前端 / 后端业务代码。

说明至少包含：

- 目标与非目标。
- 页面 / 模块结构。
- 数据来源与字段边界。
- 接口或文件协议；无新增 API 时明确写出。
- frontend/backend 文件边界与禁止事项。
- reviewer 验收点。

## 当前进度

- profile 已创建。
- `SOUL.md` 已写入角色规则。
- 已建立项目事实源 Markdown 文件集：
  - `SOURCE_OF_TRUTH.md`
  - `PRODUCT_REQUIREMENTS.md`
  - `DESIGN_SYSTEM.md`
  - `INFORMATION_ARCHITECTURE.md`
  - `API_CONTRACT.md`
  - `DATA_MODEL.md`
  - `TECH_STACK.md`
  - `AGENT_WORKFLOW.md`
- 已读取并汇总 `docs/project-os` 下的 README、ROADMAP、TASK_BOARD、agents、tasks、RISKS、DECISIONS 等事实源。
- 已生成 / 更新 Dashboard 汇总文件：
  - `docs/project-os/dashboard/summary.md`
  - `docs/project-os/dashboard/dashboard.json`
- 已把 T-004 状态推进为“已完成”（内部枚举：`done`），并记录本次验收结果。
- Dev OS 流程已纠偏：后续新页面 / 新模块 / 数据结构 / 接口协议 / Wiki 索引 / 边界类任务，必须先由本 profile 输出轻量架构说明。
- 已完成 T-005 Project Wiki Viewer 前置架构说明，明确复用 `dashboard.json.wikiLinks`、不变更 schema、不新增 API、不修改数据库 schema。
- 已完成 T-007 任务看板详情页 + 进度汇总机制前置架构说明，结论为复用现有 dashboard JSON，不变更 schema、不新增 API、不修改数据库 schema；等待 `yuan-control` 确认后才能交给 `yuan-frontend`。

## 当前边界

- 只维护事实源、结构化数据和架构/文档边界。
- 不开发业务功能。
- 不修改前端代码。
- 不修改数据库 schema。
- Dashboard 展示数据必须来自 `docs/project-os`，不得硬编码临时数字。

## 下一步

- T-005 Project Wiki Viewer 已完成并验收通过。
- T-006 Dashboard 视觉对齐 / Shell 重构已完成并验收通过。
- T-007 已完成前置架构说明，并已由 `yuan-control` 确认后交给 `yuan-frontend` 实现；当前 T-007 已通过 `yuan-reviewer` 验收。

## 变更记录

- 2026-05-03：完成 Dashboard Markdown 事实源编译，生成 `summary.md` 与 `dashboard.json`，并更新 T-004 状态。
- 2026-05-03：记录 Architect 前置门禁；T-005 Project Wiki Viewer 开工前必须先输出轻量架构说明。
- 2026-05-03：完成 T-005 Project Wiki Viewer 前置架构说明；结论为复用 `dashboard.json.wikiLinks`，本阶段不变更 dashboard schema。
- 2026-05-03：记录 T-005、T-006 均已完成并验收通过；下一步为 T-007 前置架构说明。
- 2026-05-05：完成 T-007 前置架构说明；结论为复用现有 `/dev-dashboard` shell 与 `docs/project-os/dashboard/dashboard.json`，不变更 dashboard schema，不新增 API，不修改数据库 schema，建议后续新增只读校验脚本 `scripts/dev-os-validate.mjs`。
- 2026-05-05：T-007 已完成 `yuan-frontend` 实现并通过 `yuan-reviewer` 验收；架构边界未发现越界。
