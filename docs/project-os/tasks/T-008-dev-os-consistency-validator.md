---
id: T-008
title: Dev OS 事实源一致性校验脚本 / Closeout Gate
owner: yuan-architect
status: done # 已完成
priority: P1
progress: 100
created_at: 2026-05-06
updated_at: 2026-05-06
tags:
  - dev-os
  - consistency
  - validator
  - closeout-gate
  - architect
---

# T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate

## 当前阶段

`yuan-architect` 前置架构说明已由 `yuan-control` 确认；`scripts/dev-os-validate.mjs` 已实现并通过 `yuan-reviewer` 验收。

> T-008 涉及脚本、事实源一致性规则、closeout gate、dashboard JSON 校验边界，命中 Architect 前置门禁。前置架构说明已确认；`yuan-architect` 已按说明实现只读校验脚本，仍不允许 `yuan-frontend` / `yuan-backend` 开工。

## 目标

建立 Dev OS 第一版只读事实源一致性校验机制，防止以下文件在任务 closeout 后继续漂移：

- `docs/project-os/TASK_BOARD.md`
- `docs/project-os/ROADMAP.md`
- `docs/project-os/dashboard/summary.md`
- `docs/project-os/dashboard/dashboard.json`
- `docs/project-os/dashboard.json`
- `docs/project-os/tasks/T-*.md`

## 初始边界

- 不进入登录 / 生图 / 试卷 / 支付业务功能。
- 不修改数据库 schema。
- 不新增 API。
- 不改 dashboard schema，除非 `yuan-architect` 明确说明必要性并经 `yuan-control` 确认。
- 第一版倾向只读校验，不自动改文件。

## 架构说明要求

`yuan-architect` 必须在本文档追加“前置架构说明”，至少覆盖：

1. 校验目标：防止 `TASK_BOARD.md`、task markdown、`ROADMAP.md`、summary、两个 dashboard JSON 漂移。
2. 校验范围：只读校验，不自动改文件。
3. 校验文件：`TASK_BOARD.md`、`ROADMAP.md`、`dashboard/summary.md`、两个 dashboard JSON、`tasks/T-*.md`。
4. 第一版校验规则：JSON 合法且一致、dashboard tasks 能找到 task markdown、`TASK_BOARD.md` 已完成任务与 dashboard status/progress 一致、roadmap Phase 0 已完成任务不能仍为 `done: false`、不检查业务 API / 数据库 / 登录 / 生图 / 试卷 / 支付。
5. 产物建议：`scripts/dev-os-validate.mjs`；是否新增 `package.json` script `dev-os:validate` 由 architect 判断。
6. reviewer 验收命令：`npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。

## yuan-architect 前置架构说明

### 结论

- T-008 第一版定位为 Dev OS closeout gate 的只读一致性校验，不生成、不格式化、不自动修复任何 Markdown / JSON 文件。
- 校验目标是防止 `TASK_BOARD.md`、task markdown、`ROADMAP.md`、`dashboard/summary.md`、`dashboard/dashboard.json` 与根部 `dashboard.json` 在任务 closeout 后漂移。
- 推荐产物为 `scripts/dev-os-validate.mjs`，使用 Node.js 直接读取本仓库文件并输出校验结果；前置说明阶段只写架构说明，当前实现阶段已落地该脚本。
- 明确不新增 `package.json` script `dev-os:validate`。理由：第一版 closeout gate 先用 `node scripts/dev-os-validate.mjs` 作为 reviewer 显式命令，避免在脚本稳定前扩大 npm scripts 契约；后续如需接入 CI 或常规开发命令，应另走小任务确认。
- 本阶段不修改 dashboard schema，不修改 `docs/project-os/dashboard/SCHEMA.md`，不新增 API，不修改数据库 schema，不进入登录 / 生图 / 试卷 / 支付业务。

### 校验目标与非目标

第一版校验目标：

- 发现两个 dashboard JSON 不合法或内容不一致。
- 发现 dashboard tasks 中的 `T-xxx` 找不到对应 task markdown。
- 发现 `TASK_BOARD.md` 已完成任务与 dashboard task 的 `status` / `progress` 不一致。
- 发现 `ROADMAP.md` Phase 0 已完成项在 dashboard roadmap `phase-0.items` 中仍为 `done: false`。
- 为 `yuan-reviewer` 提供 closeout 前的可重复本地命令，降低人工同步遗漏。

第一版非目标：

- 不自动修改、生成、排序、格式化 Markdown / JSON。
- 不检查业务 API、数据库、登录、生图、试卷、支付。
- 不校验前端 UI 像素、接口可用性、数据库迁移或第三方服务。
- 不改变 dashboard JSON schema，也不新增 schema 字段来适配校验脚本。

### 校验文件

第一版只读取以下文件：

- `docs/project-os/TASK_BOARD.md`
- `docs/project-os/ROADMAP.md`
- `docs/project-os/dashboard/summary.md`
- `docs/project-os/dashboard/dashboard.json`
- `docs/project-os/dashboard.json`
- `docs/project-os/tasks/T-*.md`

脚本不得读取登录、生图、试卷、支付、数据库 schema 或业务 API 文件作为规则输入。

### 第一版规则

1. 两个 dashboard JSON 必须都是合法 JSON，且 `docs/project-os/dashboard/dashboard.json` 与 `docs/project-os/dashboard.json` 内容完全一致。
2. `dashboard.json.tasks[*]` 中每个 `T-xxx` 任务必须能找到对应 task markdown；优先以 task 的 `wiki` 字段为准，同时要求文件名与 `T-xxx` ID 对齐。
3. `TASK_BOARD.md` 中状态为“已完成”的任务，在 dashboard task 中必须为 `status: "done"` 且 `progress: 100`。
4. `ROADMAP.md` Phase 0 中已勾选完成的任务项，在 dashboard roadmap `phase-0.items` 中不能仍为 `done: false`。
5. `dashboard/summary.md` 必须至少能读到当前 T-008 阶段说明，用于确认 closeout gate 的人工汇总没有遗漏本任务状态。
6. 第一版不检查业务 API / 数据库 / 登录 / 生图 / 试卷 / 支付，也不调用网络服务。

### 产物与命令

建议后续实现文件：

- `scripts/dev-os-validate.mjs`

本阶段明确不新增：

- `package.json` script `dev-os:validate`
- dashboard schema 字段
- API route
- 数据库迁移或 schema 变更
- 前端 / 后端业务代码

`yuan-reviewer` 在脚本实现后的验收命令为：

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `node scripts/dev-os-validate.mjs`
- `jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`
- `cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`
- `git diff --check`

前置架构说明阶段不运行 `node scripts/dev-os-validate.mjs`；脚本实现阶段必须运行该命令，并继续运行 JSON 合法性、一致性与 diff whitespace 检查。

### Reviewer 验收关注点

- 本文件存在 `yuan-architect` 前置架构说明，且覆盖目标、范围、文件、第一版规则、产物建议、package script 判断和 reviewer 命令。
- T-008 脚本已实现，未新增 package script，未改 dashboard schema。
- 相关状态记录只在 Project OS 文档与两个 dashboard JSON 中小范围同步。
- 本阶段未修改前端 / 后端代码，未新增 API，未修改数据库 schema，未进入登录 / 生图 / 试卷 / 支付。

## yuan-architect 实现记录

- 新增 `scripts/dev-os-validate.mjs`，作为第一版只读 Dev OS 事实源一致性校验脚本。
- 脚本只读取 `TASK_BOARD.md`、`ROADMAP.md`、`dashboard/summary.md`、两个 dashboard JSON 和 `tasks/T-*.md`，不读取登录 / 生图 / 试卷 / 支付业务文件，不调用网络服务。
- 脚本校验两个 dashboard JSON 合法且内容完全一致、dashboard tasks 的 `T-xxx` 能找到对应 task markdown、`TASK_BOARD.md` 已完成任务与 dashboard `status/progress` 一致、`ROADMAP.md` Phase 0 已完成 T-xxx 不在 dashboard `phase-0.items` 中漂移为未完成、summary 能读到当前 T-008 阶段说明。
- 首次运行脚本发现 `ROADMAP.md` Phase 0 已完成的 T-005 未出现在 dashboard `phase-0.items`；已在两个 dashboard JSON 中补齐 `T-005 Project Wiki Viewer` 的 `done: true` 记录，并保持两个 JSON 完全一致。
- 本地验证已通过：`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。
- 本实现未新增 `package.json` script，未修改 dashboard schema，未新增 API，未修改数据库 schema，未修改前端 / 后端业务代码。

## Reviewer 验收标准

- [x] T-008 已有 `yuan-architect` 前置说明并经 `yuan-control` 确认。
- [x] 校验脚本如实现，必须只读，不自动改写 Markdown / JSON。
- [x] 校验范围只覆盖 Dev OS 事实源一致性，不检查业务 API / 数据库 / 登录 / 生图 / 试卷 / 支付。
- [x] 不新增 API。
- [x] 不修改数据库 schema。
- [x] 不修改 dashboard schema，除非前置说明明确必要性并完成同步规划。
- [x] `npm run lint` 通过。
- [x] `npm run typecheck` 通过。
- [x] `npm run build` 通过。
- [x] `node scripts/dev-os-validate.mjs` 通过。
- [x] `jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json` 通过。
- [x] `cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json` 通过。
- [x] `git diff --check` 通过。

## 进展记录

- 2026-05-06：由 `yuan-control` 创建任务，状态“准备中”（内部枚举：`ready`），当前阶段为 `yuan-architect` 前置架构说明。`yuan-frontend` / `yuan-backend` 在说明确认前不得开工。
- 2026-05-06：`yuan-architect` 已完成本文件内的前置架构说明；结论为第一版只读校验、不自动改文件，建议后续产物为 `scripts/dev-os-validate.mjs`，本阶段不新增 `package.json` script `dev-os:validate`，不改 dashboard schema，不新增 API，不改数据库 schema，不进入登录 / 生图 / 试卷 / 支付。下一步等待 `yuan-control` 确认。

- 2026-05-06：`yuan-control` 已确认 T-008 前置架构说明覆盖校验目标、范围、文件、第一版规则、产物建议、package script 判断和 reviewer 命令；T-008 推进为“进行中”（内部枚举：`in_progress`），仅允许 `yuan-architect` 实现只读校验脚本。
- 2026-05-06：`yuan-architect` 已实现 `scripts/dev-os-validate.mjs` 只读校验脚本；首次校验发现并收口 dashboard roadmap Phase 0 的 T-005 漂移记录，当前推进为“审核中”（内部枚举：`review`），等待 `yuan-reviewer` 验收。
- 2026-05-06：指定本地验证通过：`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。
- 2026-05-06：`yuan-reviewer` 验收通过，结论 PASS。已核对脚本只读、不自动改写 Markdown / JSON，只读取 `TASK_BOARD.md`、`ROADMAP.md`、`dashboard/summary.md`、两个 dashboard JSON 与 `tasks/T-*.md`；未新增 package script、API、数据库 schema、dashboard schema，未修改前端 / 后端业务代码，未进入登录 / 生图 / 试卷 / 支付。完整验证通过：`npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。Gemini CLI 二审已按 reviewer 规则调用，但遇到 CLI 工具不可用提示、一次 `429 RESOURCE_EXHAUSTED / MODEL_CAPACITY_EXHAUSTED` 以及网络断连，无有效二审结论，已记录且不阻塞自身验收。
