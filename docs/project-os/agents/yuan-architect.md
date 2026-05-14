# yuan-architect

状态：活跃（内部标识：`active`）
更新时间：2026-05-14

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
- 已完成 T-007 任务看板详情页 + 进度汇总机制前置架构说明，结论为复用现有 dashboard JSON，不变更 schema、不新增 API、不修改数据库 schema；该历史阶段后续已由 `yuan-control` 确认并交付前端实施。
- 已完成 T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate 前置架构说明；结论为第一版只读校验，不自动改文件，建议后续产物为 `scripts/dev-os-validate.mjs`，本阶段不新增 package script、不变更 dashboard schema、不新增 API、不修改数据库 schema。
- 已实现 T-008 只读校验脚本 `scripts/dev-os-validate.mjs`，并补齐 dashboard roadmap Phase 0 中 T-005 已完成项的结构化记录；当前等待 `yuan-reviewer` 验收。
- 已完成 T-009 reviewer 二审方式调整与复核前置架构说明；后续 reviewer 二审统一改用 Codex CLI `gpt-5.3-codex`，不再使用 Gemini CLI。
- 已完成 T-010 Dev OS Dashboard 信息架构与交互收尾整改前置架构说明；结论为复用现有 dashboard JSON 字段，不变更 dashboard schema，不更新 `SCHEMA.md`，不改 `scripts/dev-os-validate.mjs`，不修改 `src/main.tsx` 或 `src/styles.css`。
- 已完成 T-011 Project OS 文档体系中文化与任务线分离；Dev OS 治理任务使用 `T-xxx` 并放在 `tasks/dev-os/`，Web App 任务线已建立。
- 已完成 TWA-000 Web App MVP 架构冻结与开发基线；冻结 MVP 范围、暂不做范围、前端路由草案、API contract 草案、概念数据模型、Mock/Adapter 边界、Agent 分工和 TWA-001 至 TWA-007 拆分。
- TWA-001 前置架构冻结已完成并收口，国际化 / 双市场版本基线已作为 TWA-001 架构冻结项之一；当前转入实现支持 / 约束监督，重点防止 frontend 越界接真实 API、schema、provider、偏离移动端优先或把 locale / market 差异写死。

## 当前边界

- 只维护事实源、结构化数据和架构/文档边界。
- 不开发业务功能。
- 不修改前端代码。
- 不修改数据库 schema。
- Dashboard 展示数据必须来自 `docs/project-os`，不得硬编码临时数字。

## 下一步

- T-005 Project Wiki Viewer 已完成并验收通过。
- T-006 Dashboard 视觉对齐 / Shell 重构已完成并验收通过。
- T-007 已完成并验收通过。
- T-008 已完成并验收通过。
- T-009 已完成并通过 `yuan-reviewer` 复核。
- T-010 已完成并通过验收。
- T-011 已完成并通过事实源收口。
- TWA-001 前置架构冻结、用户最终确认和国际化 / 双市场版本基线补充均已完成；当前已放行 `yuan-frontend`，后续实现必须预留 locale-aware / market-aware 结构。

## 变更记录

- 2026-05-07：完成 T-010 Dev OS Dashboard 信息架构与交互收尾整改前置架构说明；已覆盖现有结构识别、总览双轨进度、Roadmap 与 Agent 合并、任务看板列表 + 详情、Project Wiki 沉浸式阅读、风险降级、待确认事项和 schema 边界。历史阶段未派 `yuan-frontend`，未修改 `src/main.tsx` / `src/styles.css`；该 T-010 流程后续已完成。

- 2026-05-03：完成 Dashboard Markdown 事实源编译，生成 `summary.md` 与 `dashboard.json`，并更新 T-004 状态。
- 2026-05-03：记录 Architect 前置门禁；T-005 Project Wiki Viewer 开工前必须先输出轻量架构说明。
- 2026-05-03：完成 T-005 Project Wiki Viewer 前置架构说明；结论为复用 `dashboard.json.wikiLinks`，本阶段不变更 dashboard schema。
- 2026-05-03：记录 T-005、T-006 均已完成并验收通过；下一步为 T-007 前置架构说明。
- 2026-05-05：完成 T-007 前置架构说明；结论为复用现有 `/dev-dashboard` shell 与 `docs/project-os/dashboard/dashboard.json`，不变更 dashboard schema，不新增 API，不修改数据库 schema，建议后续新增只读校验脚本 `scripts/dev-os-validate.mjs`。
- 2026-05-05：T-007 已完成 `yuan-frontend` 实现并通过 `yuan-reviewer` 验收；架构边界未发现越界。
- 2026-05-06：完成 T-008 前置架构说明；结论为 Dev OS 事实源一致性校验第一版只读执行，不自动修改 Markdown / JSON，建议后续实现 `scripts/dev-os-validate.mjs`，本阶段不新增 `package.json` script `dev-os:validate`。
- 2026-05-06：实现 T-008 只读校验脚本 `scripts/dev-os-validate.mjs`；脚本不自动改写 Markdown / JSON，不新增 package script，不改 dashboard schema，不新增 API，不修改数据库 schema。
- 2026-05-06：完成 T-009 Gemini CLI Prompt File 二审通道 / Reviewer Smoke Test 前置架构说明；直接长 prompt 改为临时 Markdown prompt file，推荐 `.tmp/gemini-review/T-009-review-prompt.md` 和 reviewer HOME 下的 Gemini `@file` 命令；正常 / 失败均清理临时文件，`.tmp/` 加入 `.gitignore`，不新增 API、不改数据库 schema、不改 dashboard schema。

- 2026-05-07：T-010 前置架构说明已由 `yuan-control` 确认通过；当前交接给 `yuan-frontend` 实施。

- 2026-05-07：T-010 已完成并通过验收；前置架构边界在实现和验收中保持。
- 2026-05-08：完成 T-011 Project OS 文档体系中文化与任务线分离前置架构说明；已覆盖当前结构盘点、目录方案、完整旧到新映射、根文档暂不汉化、引用更新范围、validator 更新要求、`web-app/README.md` 说明、未来 `git mv` 顺序、实现边界与 reviewer 验收要求。当前不执行 `git mv`，不移动 / 重命名既有任务文档，不修改业务代码。
- 2026-05-08：完成 TWA-000 Web App MVP 架构冻结与开发基线；已创建 `docs/project-os/tasks/web-app/TWA-000-Web-App-MVP-架构冻结与开发基线.md`，同步 README 命名规则和事实源，并更新 validator 支持 `T-xxx` / `TWA-xxx`。

- 2026-05-08：TWA-001 前置架构说明已完成；结论为先冻结技术栈、数据库方向、部署基准、100 用户同时在线基准和移动端优先基线，再放行 frontend。

- 2026-05-08：用户已最终确认采纳 TWA-001 deep research 技术路线；事实源已按 Next.js 16 + React 19、NestJS + Fastify、PostgreSQL + Drizzle、Redis + BullMQ、pnpm workspace + Turborepo 等目标栈同步，当前放行 frontend 做静态 App Shell，不创建真实 API / DB schema。

- 2026-05-08：TWA-001 前置架构冻结与用户最终确认已完成，当前支持 `yuan-frontend` 按边界实施。
- 2026-05-14：TWA-001 国际化 / 双市场版本基线已作为架构冻结项之一，确认 `zh-CN` / `en`、locale-aware routing 与 market-aware 内容组织原则；不实现真实多语言运行时、多市场定价、国际支付或 CMS。
