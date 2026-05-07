# CHANGELOG

## 2026-05-08

- 完成 T-011 Project OS 文档体系中文化与任务线分离：T-000 至 T-010 已使用 `git mv` 迁移到 `docs/project-os/tasks/dev-os/` 中文文件名；T-011 保持在 `docs/project-os/tasks/dev-os/T-011-Project-OS-文档体系中文化与任务线分离.md`。
- 创建 `docs/project-os/tasks/web-app/README.md` 作为 Web App 任务线说明；未创建任何真实 Web App 功能任务，未进入登录 / 生图 / 试卷 / 支付业务。
- 更新 `scripts/dev-os-validate.mjs` 要求：递归读取 `docs/project-os/tasks/**/*.md`，忽略非 T-xxx 的 `web-app/README.md`，校验 dashboard task wiki 与 TASK_BOARD 文档路径存在，并保持两个 dashboard JSON 完全一致。
- 同步 TASK_BOARD、summary、两个 dashboard JSON、ROADMAP、RISKS、README、agents 与任务内部引用到新任务路径；未修改 dashboard schema，未修改业务代码。
- 完成 T-011 `yuan-architect` 前置架构说明：覆盖当前文件结构盘点、`dev-os` / `web-app` 目录方案、完整旧到新任务文档映射、根文档暂不汉化决策、引用更新范围、validator 更新要求、`web-app/README.md` 说明、`git mv` 执行顺序、实现边界、验证命令和 reviewer 验收要求。

## 2026-05-07

- 完成 T-010 Dev OS Dashboard 信息架构与交互收尾整改并通过验收：`/dev-dashboard` 完成顶部、总览双轨进度、Roadmap + Agent、任务列表 + 详情筛选、Project Wiki 沉浸式阅读和风险展示整改；`yuan-reviewer` 与 `gpt-5.3-codex` 二审 PASS；未改 dashboard schema、未新增脚本、未新增业务 API、未修改数据库 schema、未进入登录 / 生图 / 试卷 / 支付。
- 完成 T-010 `yuan-frontend` 实现：`/dev-dashboard` 顶部用户信息移除，总览拆分 Dev OS / Web App MVP 进度，Roadmap 与 Agent 状态合并，任务看板改为列表 + 详情 + 筛选，Project Wiki 改为沉浸式阅读并修复快捷入口联动；验证 lint/typecheck/build/Dev OS validator/JSON 一致性/diff-check 与 `/dev-dashboard` HTTP 访问通过。
- 确认 T-010 `yuan-architect` 前置架构说明通过：已覆盖总览页、任务看板、Project Wiki、导航调整、风险清理、数据来源与 schema 边界；未修改 dashboard schema、未新增业务 API、未修改数据库 schema、未进入登录 / 生图 / 试卷 / 支付。现放行 `yuan-frontend` 按说明修改 `src/main.tsx` 与 `src/styles.css`。
- 完成 T-010 `yuan-architect` 前置架构说明：已识别当前 `/dev-dashboard` 总览页、任务看板、Project Wiki、Wiki 快捷入口、Agent 状态、Roadmap、风险与待确认的数据来源；整改架构覆盖总览双轨进度、Roadmap 与 Agent 合并、任务列表 + 详情面板、Project Wiki 沉浸式阅读、风险降级和 schema 边界。当前仍不派 `yuan-frontend`，不修改 `src/main.tsx` / `src/styles.css`。
- 同步 Roadmap Phase 0 与两个 dashboard JSON：补入 T-010 未完成项，避免 Dev OS 收尾阶段被误读为 Phase 0 已 100% 完成。
- 同步 T-010 Dev OS Dashboard 信息架构与交互收尾整改进入执行状态：`status: in_progress`（进行中）、`progress: 10`；当前阶段为 `yuan-architect` 前置架构说明。架构说明经 `yuan-control` 确认前，`yuan-frontend` 不得修改 `src/main.tsx` 或 `src/styles.css`。本阶段不新增业务 API、不修改数据库 schema、不修改 dashboard schema、不进入登录 / 生图 / 试卷 / 支付真实业务功能。

## 2026-05-06

- 完成 T-009 二审规则调整复核：后续 reviewer 第二审查统一改为 Codex CLI `gpt-5.3-codex`，不再使用 Gemini CLI；相关规则已同步 `yuan-reviewer`、T-009 任务文档、summary、TASK_BOARD、CHANGELOG 与两个 dashboard JSON 描述。
- 完成 T-009 yuan-reviewer 复核，结论 PASS：确认边界保持不变（不进入登录/生图/试卷/支付、不新增 API、不改数据库 schema、不改 dashboard schema、不保存敏感信息）；验证 `npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`test ! -e .tmp/gemini-review/T-009-review-prompt.md`、`git diff --check` 均 exit 0。
- 完成 T-008 yuan-reviewer 验收，结论 PASS：确认 `scripts/dev-os-validate.mjs` 只读、不自动改写 Markdown / JSON，读取范围限于 Project OS 事实源文件；未新增 package script、API、dashboard schema、数据库 schema，未修改前端 / 后端业务代码；验证 `npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check` 均通过；Gemini 二审因 CLI 工具提示、429 / 网络错误无有效输出，已记录且不阻塞。
- 实现 T-008 Dev OS 事实源一致性校验脚本 `scripts/dev-os-validate.mjs`；脚本只读检查 Project OS 事实源，输出 PASS/FAIL 与问题列表，失败 exit 1、通过 exit 0；未新增 package script，未修改 dashboard schema，未新增 API，未修改数据库 schema。
- T-008 首次校验发现 `ROADMAP.md` Phase 0 已完成的 T-005 未出现在 dashboard `phase-0.items`；已在两个 dashboard JSON 中补齐 `T-005 Project Wiki Viewer` 的 `done: true` 记录并保持两个 JSON 完全一致。
- T-008 指定本地验证通过：`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。
- T-008 状态推进为“审核中”（内部枚举：`review`），等待 `yuan-reviewer` 验收只读校验脚本。
- 确认 T-008 前置架构说明覆盖校验目标、范围、文件、第一版规则、产物建议、package script 判断和 reviewer 命令；状态推进为“进行中”（内部枚举：`in_progress`），由 `yuan-architect` 实现只读校验脚本。
- 修复 T-007 closeout 小漂移：`ROADMAP.md` 标记 T-007 已完成，两个 dashboard JSON 中 phase-0 roadmap item 的 T-007 改为 `done: true`，并保持两个 JSON 完全一致。
- 追加 `profile-audit.md` 的 2026-05-06 SOUL.md 审计补记，只记录 5 个 profile 的存在性、角色边界与 Codex 执行规范，不复制全文、不记录敏感信息。
- 创建 T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate，当前状态“准备中”（内部枚举：`ready`），等待 `yuan-architect` 前置架构说明。
- 完成 T-008 `yuan-architect` 前置架构说明：第一版只读校验，不自动改文件；建议后续产物为 `scripts/dev-os-validate.mjs`；本阶段不新增 `package.json` script、不改 dashboard schema、不新增 API、不改数据库 schema、不进入登录 / 生图 / 试卷 / 支付。

## 2026-05-05

- 完成 T-007 Dev OS 任务看板详情页 + 进度汇总机制验收；`yuan-reviewer` 结论 PASS，Gemini CLI 二审因 429 模型容量不足无有效输出，已记录且不阻塞验收。
- 完成 T-007 只读任务看板前端实现；`/dev-dashboard` sidebar “任务看板”进入真实 `#task-board`，任务数据与统计来自 dashboard JSON，任务详情可切换 Project Wiki Viewer。
- 确认 T-007 前置架构说明覆盖页面 / 信息架构、数据来源、schema 结论、第一版任务看板功能、进度汇总机制、frontend 边界和 reviewer 验收标准；状态推进为“进行中”（内部枚举：`in_progress`），交给 `yuan-frontend` 实现。
- 创建 T-007 Dev OS 任务看板详情页 + 进度汇总机制；状态为“准备中”（内部枚举：`ready`），当前阶段为 `yuan-architect` 前置架构说明，说明确认前 `yuan-frontend` 不得开工。
- 同步 TASK_BOARD、summary 与两个 dashboard JSON，保持 T-007 初始事实源一致；本次尚未变更 dashboard schema，尚未新增校验脚本。

## 2026-05-03

- 创建 `project-os-closeout-review` skill，并将任务完成后的事实源收口检查明确为 `yuan-reviewer` 职责；完成 T-006 closeout 事实源漂移修正。
- 完成 T-006 Dev OS Dashboard 视觉对齐 / Shell 重构：重构 sidebar、top header、KPI、Agent grid、Roadmap、Wiki 快捷入口和只读 Viewer 视觉，`yuan-reviewer` 验收通过。
- 创建 T-006 Dev OS Dashboard Visual Alignment / Shell Refactor，准备由 `yuan-frontend` 进行 Dashboard 视觉壳对齐。
- 完成 T-005 closeout 事实源同步：summary、Roadmap、TASK_BOARD、dashboard JSON 中 T-005 统一为“已完成”（内部枚举：`done`），owner 统一为 `yuan-frontend`，移除 PA-005。
- 完成 T-005 Project Wiki Viewer：`yuan-frontend` 在 `/dev-dashboard` 内实现只读 Wiki Viewer，`yuan-reviewer` 与 Gemini 双审查通过，验证 lint/typecheck/build/jq/diff-check 通过。
- 修正 T-005 派发前事实源漂移：整理 `--yolo` 执行边界、同步 Roadmap 中 Dev Dashboard MVP 状态、更新 T-005 下一步为 frontend 实现。
- 为 `yuan-reviewer` 接入 Gemini CLI 并行审查规则：profile HOME 的 `.gemini` 软链到 default/root `/root/.gemini`，最终验收需汇总 reviewer 自身结论、Gemini 结论和冲突裁决。
- 完成 Dev OS 流程纠偏：凡涉及新页面、新模块、数据结构、`dashboard.json` / schema 变更、API / 接口协议、Wiki / 文档索引结构、业务系统边界、前后端协作边界的任务，frontend/backend 开工前必须先由 `yuan-architect` 输出轻量架构说明。
- 明确例外：状态同步、文档小修、拼写修复、链接修正、reviewer 发现的小范围问题修复，不强制经过 `yuan-architect`。
- 将 T-005 Project Wiki Viewer 调整为 `yuan-architect` 架构前置 → `yuan-frontend` 实现 → `yuan-reviewer` 按架构验收。
- 完成 T-005 Project Wiki Viewer 前置架构说明：复用 `dashboard.json.wikiLinks`，本阶段不变更 dashboard schema，不新增 API，不修改数据库 schema；下一步等待 `yuan-frontend` 实现。
- 明确当前阶段不开发登录、生图、试卷、支付等业务功能，不修改数据库 schema。

## 2026-05-02

- 初始化 `/root/eryuandian` 项目目录。
- 初始化 git repo，默认分支为 `main`。
- 创建 `docs/project-os` 文档事实源骨架。
- 记录“两元店”英文目录名为 `eryuandian`。
- 从 default clone 创建 5 个 Hermes profiles：`yuan-control`、`yuan-architect`、`yuan-frontend`、`yuan-backend`、`yuan-reviewer`。
- 为 5 个 profiles 写入角色规则 `SOUL.md`。
- 将 `/root/eryuandian/pic` 设计稿按内容重命名。
- 将设计稿基准写入 `yuan-frontend` 的 `SOUL.md`。
- 创建 GitHub repo：`https://github.com/Yahome/eryuandian`。
- 推送初始 commit：`3c17b0737775`。
- 建立项目事实源 Markdown 文件集：`SOURCE_OF_TRUTH.md`、`PRODUCT_REQUIREMENTS.md`、`DESIGN_SYSTEM.md`、`INFORMATION_ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`、`TECH_STACK.md`、`AGENT_WORKFLOW.md`。
