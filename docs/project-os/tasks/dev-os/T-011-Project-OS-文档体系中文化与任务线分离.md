id: T-011
title: Project OS 文档体系中文化与任务线分离
owner: yuan-architect
status: done
priority: P0
progress: 100

# T-011 Project OS 文档体系中文化与任务线分离

## 背景

T-010 已完成 Dev OS Dashboard v1.0 收尾，但当前 `docs/project-os/tasks/` 下的任务文档仍全部平铺在同一层，且文件名多为英文 slug。随着后续 Web App MVP 任务启动，Dev OS 治理任务与 Web App 业务任务会混在同一目录中，容易造成 Dashboard 进度、Project Wiki 目录和人工检索误读。

本任务只做 Dev OS / Project OS 文档治理：先完成前置架构说明，再使用 `git mv` 迁移 Dev OS 任务文档并同步引用。全程禁止修改业务功能代码。

## 当前状态

- 当前状态：已完成（内部枚举：`done`）。
- 当前负责人：`yuan-architect`。
- 当前进度：`100`。
- 当前阶段：迁移、引用更新、validator 适配与验收收尾。
- 当前边界：已执行任务文档迁移；未修改业务代码，未变更 dashboard schema。

## 当前文件结构盘点

### `docs/project-os/`

`docs/project-os/` 是 Project OS Markdown-first 事实源根目录，当前包含根文档、过程管理文档、Agent 文档、任务文档和 Dashboard 数据。根层文件包括：

- `README.md`
- `SOURCE_OF_TRUTH.md`
- `PROJECT_BRIEF.md`
- `PRODUCT_REQUIREMENTS.md`
- `DESIGN_SYSTEM.md`
- `INFORMATION_ARCHITECTURE.md`
- `API_CONTRACT.md`
- `DATA_MODEL.md`
- `TECH_STACK.md`
- `AGENT_WORKFLOW.md`
- `ROADMAP.md`
- `TASK_BOARD.md`
- `DECISIONS.md`
- `RISKS.md`
- `CHANGELOG.md`
- `dashboard.json`

这些文件当前承担事实源入口、路线图、任务板、决策、风险和 Dashboard 根数据职责。第一版不重命名这些根文档，避免牵动大量引用和 Dashboard 快速入口。

### `docs/project-os/tasks/`

当前任务文档全部平铺在 `docs/project-os/tasks/` 第一层：

- `T-000-bootstrap-dev-os.md`
- `T-001-setup-agent-profiles.md`
- `T-002-project-os-docs.md`
- `T-003-dashboard-ui.md`
- `T-004-dashboard-json-sync.md`
- `T-005-wiki-viewer.md`
- `T-006-dashboard-visual-alignment.md`
- `T-007-task-board-progress.md`
- `T-008-dev-os-consistency-validator.md`
- `T-009-gemini-prompt-file-review.md`
- `T-010-dev-os-dashboard-refactor.md`

本任务文档位于 `docs/project-os/tasks/dev-os/T-011-Project-OS-文档体系中文化与任务线分离.md`。T-011 已同步修复 validator，使其递归读取嵌套任务目录。

### `docs/project-os/agents/`

当前 Agent 文档仍在 `docs/project-os/agents/` 第一层：

- `yuan-control.md`
- `yuan-architect.md`
- `yuan-frontend.md`
- `yuan-backend.md`
- `yuan-reviewer.md`
- `profile-audit.md`

第一版不重命名 `agents/*.md`，因为这些文件被 Dashboard JSON、Project Wiki 快速入口和人工流程引用，且不属于任务线拆分的核心问题。

### `docs/project-os/dashboard/`

当前 Dashboard 目录包含：

- `SCHEMA.md`
- `summary.md`
- `dashboard.json`

另有根部镜像数据 `docs/project-os/dashboard.json`。两个 JSON 当前必须保持内容完全一致。第一版不修改 dashboard schema，不新增字段，不更新 `SCHEMA.md` 的结构约束。

### `scripts/dev-os-validate.mjs`

当前 validator 是只读校验脚本，主要检查：

- `TASK_BOARD.md`
- `ROADMAP.md`
- `dashboard/summary.md`
- `dashboard/dashboard.json`
- `dashboard.json`
- `docs/project-os/tasks/T-*.md`

已确认当前实现只读取 `docs/project-os/tasks/` 第一层的 `T-*.md`，暂不递归读取 `tasks/dev-os/` 或 `tasks/web-app/`。T-011 第一阶段会先登记该限制，后续实现迁移前必须更新 validator。

### `src/main.tsx`

`src/main.tsx` 当前通过 `import dashboardData from '../docs/project-os/dashboard/dashboard.json'` 读取 Dashboard 数据，并通过 `import.meta.glob('../docs/project-os/**/*.md', { query: '?raw', import: 'default', eager: true })` 建立 Markdown 只读 registry。

由于 glob 已覆盖 `docs/project-os/**/*.md`，Project Wiki 理论上可以读取嵌套任务文档；但任务看板和详情依赖 `dashboard.json.tasks[].wiki`。本任务不修改 `src/main.tsx`，后续实现若只更新 JSON 路径，前端不应需要业务代码改动。

## 目录结构方案

第一版目标是把任务文档按任务线分层，先解决任务目录混用问题：

```text
docs/project-os/
  tasks/
    dev-os/
      T-000-初始化-Dev-OS.md
      T-001-设置-Hermes-Agent-Profiles.md
      T-002-建立-Project-OS-文档事实源.md
      T-003-Dev-OS-Dashboard-界面.md
      T-004-Dashboard-JSON-同步.md
      T-005-Project-Wiki-查看器.md
      T-006-Dashboard-视觉对齐与-Shell-重构.md
      T-007-任务看板详情页与进度汇总机制.md
      T-008-Dev-OS-事实源一致性校验脚本.md
      T-009-reviewer-二审方式调整与复核.md
      T-010-Dev-OS-Dashboard-信息架构与交互收尾整改.md
      T-011-Project-OS-文档体系中文化与任务线分离.md
    web-app/
      README.md
```

后续 Web App MVP 任务创建时进入 `docs/project-os/tasks/web-app/`。在 T-011 第一版实现前，不提前创建业务任务文档，不进入登录 / 生图 / 试卷 / 支付。

## 完整旧到新任务文档映射表

| ID | 当前路径 | 第一版目标路径 | 任务线 |
|---|---|---|---|
| T-000 | `docs/project-os/tasks/T-000-bootstrap-dev-os.md` | `docs/project-os/tasks/dev-os/T-000-初始化-Dev-OS.md` | Dev OS |
| T-001 | `docs/project-os/tasks/T-001-setup-agent-profiles.md` | `docs/project-os/tasks/dev-os/T-001-设置-Hermes-Agent-Profiles.md` | Dev OS |
| T-002 | `docs/project-os/tasks/T-002-project-os-docs.md` | `docs/project-os/tasks/dev-os/T-002-建立-Project-OS-文档事实源.md` | Dev OS |
| T-003 | `docs/project-os/tasks/T-003-dashboard-ui.md` | `docs/project-os/tasks/dev-os/T-003-Dev-OS-Dashboard-界面.md` | Dev OS |
| T-004 | `docs/project-os/tasks/T-004-dashboard-json-sync.md` | `docs/project-os/tasks/dev-os/T-004-Dashboard-JSON-同步.md` | Dev OS |
| T-005 | `docs/project-os/tasks/T-005-wiki-viewer.md` | `docs/project-os/tasks/dev-os/T-005-Project-Wiki-查看器.md` | Dev OS |
| T-006 | `docs/project-os/tasks/T-006-dashboard-visual-alignment.md` | `docs/project-os/tasks/dev-os/T-006-Dashboard-视觉对齐与-Shell-重构.md` | Dev OS |
| T-007 | `docs/project-os/tasks/T-007-task-board-progress.md` | `docs/project-os/tasks/dev-os/T-007-任务看板详情页与进度汇总机制.md` | Dev OS |
| T-008 | `docs/project-os/tasks/T-008-dev-os-consistency-validator.md` | `docs/project-os/tasks/dev-os/T-008-Dev-OS-事实源一致性校验脚本.md` | Dev OS |
| T-009 | `docs/project-os/tasks/T-009-gemini-prompt-file-review.md` | `docs/project-os/tasks/dev-os/T-009-reviewer-二审方式调整与复核.md` | Dev OS |
| T-010 | `docs/project-os/tasks/T-010-dev-os-dashboard-refactor.md` | `docs/project-os/tasks/dev-os/T-010-Dev-OS-Dashboard-信息架构与交互收尾整改.md` | Dev OS |
| T-011 | 无旧路径，本任务直接新建 | `docs/project-os/tasks/dev-os/T-011-Project-OS-文档体系中文化与任务线分离.md` | Dev OS |

## 根文档暂不汉化决策

第一版只处理任务文档文件名和任务线目录，不重命名根文档，原因如下：

- 根文档是现有事实源入口和人工协作入口，`README.md`、`CHANGELOG.md`、`ROADMAP.md`、`RISKS.md`、`DECISIONS.md`、`TASK_BOARD.md`、`SOURCE_OF_TRUTH.md` 等名称稳定性高。
- `docs/project-os/dashboard/SCHEMA.md` 和 `dashboard/summary.md` 被 Dashboard、validator 与人工流程引用，第一版不应扩大影响面。
- `agents/*.md` 是 Agent 身份与流程事实源，和任务线拆分不是同一类问题。
- 保持根文档英文命名有助于工具链、Dashboard 快捷入口和跨语言协作继续稳定。

明确结论：第一版不重命名 `README.md`、`CHANGELOG.md`、`ROADMAP.md`、`RISKS.md`、`DECISIONS.md`、`TASK_BOARD.md`、`SCHEMA.md`、`summary.md`、`agents/*.md`。

## 引用更新范围

后续真正执行迁移时，必须同步更新以下引用：

- `docs/project-os/TASK_BOARD.md` 表格中的任务文档路径。
- `docs/project-os/dashboard/dashboard.json` 与 `docs/project-os/dashboard.json` 中 `tasks[].wiki`。
- `docs/project-os/dashboard/dashboard.json` 与 `docs/project-os/dashboard.json` 中 `recentUpdates[].files` 涉及任务文档的路径。
- `docs/project-os/dashboard/dashboard.json` 与 `docs/project-os/dashboard.json` 中 `wikiLinks` 的任务目录入口；目录入口应从 `docs/project-os/tasks/` 调整为更明确的 `docs/project-os/tasks/dev-os/`，并补充 `docs/project-os/tasks/web-app/` 入口时不得新增 schema 字段。
- `docs/project-os/dashboard/summary.md` 中直接提到旧任务路径的段落。
- `docs/project-os/CHANGELOG.md` 中本轮迁移记录与后续 closeout 记录。
- `docs/project-os/agents/yuan-control.md` 与 `docs/project-os/agents/yuan-architect.md` 中当前进度和变更记录。

第一版不更新业务代码引用，不更新数据库 schema，不新增业务 API。

## Validator 更新要求

后续实现迁移前必须先让 `scripts/dev-os-validate.mjs` 支持嵌套任务目录：

- `readTaskMarkdownFiles()` 从只读第一层 `docs/project-os/tasks/T-*.md` 改为递归读取 `docs/project-os/tasks/**/*.md`。
- 仍只接受任务文件名 basename 匹配 `T-xxx*.md`，并继续用文件名 ID 与 dashboard `tasks[].id` 做一致性校验。
- `taskFiles.relPaths` 必须保存仓库相对路径，例如 `docs/project-os/tasks/dev-os/T-011-Project-OS-文档体系中文化与任务线分离.md`。
- `validateDashboardTaskWiki()` 必须继续禁止绝对路径和 `../`，并继续要求路径位于 `docs/project-os/tasks/` 之下。
- 输出文案需从 `docs/project-os/tasks/T-*.md 已读取...` 调整为可覆盖嵌套目录的描述，例如 `docs/project-os/tasks/**/*.md 已读取...`。
- 不新增自动改写能力；validator 仍然只读，失败时只报告问题并 exit 1。
- 不新增 package script，除非后续由 `yuan-control` 单独确认。

当前 T-011 前置阶段不修改 validator；若校验失败且原因是嵌套任务目录未被读取，只记录原因，不通过移动文件规避。

## `web-app/README.md` 说明

后续创建 `docs/project-os/tasks/web-app/README.md` 时，该文件只作为 Web App 任务线说明，不作为产品功能需求文档。建议内容包括：

- Web App 任务线范围：登录、首页工作台、PC / 移动端基础布局、我的作品、生图、试卷、导出、会员、额度、支付等后续任务。
- 前置条件：Phase 1 技术栈、API 契约、数据模型冻结前，不创建具体业务实现任务。
- 与 Dev OS 的关系：Dev OS 任务进入 `tasks/dev-os/`，Web App 业务任务进入 `tasks/web-app/`。
- 禁止事项：README 不承诺具体 API、数据库 schema、支付方案或第三方 AI 服务接入。

当前 T-011 前置阶段不创建 Web App 业务任务，不进入登录 / 生图 / 试卷 / 支付。

## `git mv` 执行顺序

实际文件迁移已按以下顺序执行：

1. 确认工作区干净，并运行 `node scripts/dev-os-validate.mjs` 记录迁移前状态。
2. 更新 validator，使其递归读取 `docs/project-os/tasks/**/*.md`，并确认旧平铺路径下仍可通过。
3. 创建目标目录 `docs/project-os/tasks/dev-os/` 与 `docs/project-os/tasks/web-app/`。
4. 使用 `git mv` 逐个移动 T-000 至 T-010 到 `tasks/dev-os/` 中文文件名目标路径。
5. 确认 T-011 已在 `tasks/dev-os/`，不重复移动。
6. 创建或更新 `docs/project-os/tasks/web-app/README.md`，只写任务线说明。
7. 更新 `TASK_BOARD.md` 的文档路径。
8. 更新两个 dashboard JSON 的 `tasks[].wiki`、`recentUpdates[].files` 和 `wikiLinks` 任务目录入口，保持两个 JSON 完全一致。
9. 更新 `summary.md`、`CHANGELOG.md`、`yuan-control.md`、`yuan-architect.md` 中的状态与路径说明。
10. 运行验证命令，确认没有旧路径遗留和 JSON 不一致。

## 实现边界

本任务实现阶段只允许新增 / 更新 Dev OS / Project OS 文档事实源：

- 允许新增本 T-011 任务文档。
- 允许更新 `TASK_BOARD.md`、`dashboard/summary.md`、两个 dashboard JSON、`CHANGELOG.md`、`agents/yuan-control.md`、`agents/yuan-architect.md`。
- 允许且已使用 `git mv` 移动 T-000 至 T-010 任务文档。
- 禁止修改 `src/main.tsx`、`src/styles.css` 或任何业务功能代码。
- 禁止新增业务 API。
- 禁止修改数据库 schema。
- 禁止修改 dashboard schema。
- 禁止进入登录 / 生图 / 试卷 / 支付。
- 禁止创建 Web App 业务任务。

## 验证命令

当前收尾验证需要执行：

```bash
node scripts/dev-os-validate.mjs
jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json
cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json
git diff --check
git diff --name-only
```

`scripts/dev-os-validate.mjs` 已支持 `docs/project-os/tasks/**/*.md`，并保持只读校验。

## Reviewer 验收要求

`yuan-reviewer` 验收 T-011 时至少检查：

- T-011 文档存在于 `docs/project-os/tasks/dev-os/`。
- T-011 frontmatter closeout 后为 `owner: yuan-architect`、`status: done`、`priority: P0`、`progress: 100`。
- T-011 架构说明覆盖当前结构盘点、目录结构方案、完整旧到新映射、根文档暂不汉化、引用更新范围、validator 更新要求、`web-app/README.md` 说明、`git mv` 执行顺序、实现边界和验证命令。
- `TASK_BOARD.md`、`dashboard/summary.md`、两个 dashboard JSON、`CHANGELOG.md`、`yuan-control.md`、`yuan-architect.md`、`yuan-reviewer.md` 已同步登记 T-011 完成。
- 两个 dashboard JSON 合法且内容完全一致。
- T-000 至 T-010 使用 `git mv` 移动到 `tasks/dev-os/`，Git 历史保留。
- 未修改业务代码，尤其未修改 `src/main.tsx`。
- 未新增业务 API，未修改数据库 schema，未修改 dashboard schema。
- validator 已支持 `tasks/**/*.md`，且 `web-app/README.md` 不被当作 T-xxx 任务。

## 明确结论

第一版只重命名任务文档并分 `dev-os` / `web-app` 任务线，不重命名 `README.md`、`CHANGELOG.md`、`ROADMAP.md`、`RISKS.md`、`DECISIONS.md`、`TASK_BOARD.md`、`SCHEMA.md`、`summary.md`、`agents/*.md`，不修改 dashboard schema。

当前已完成 T-011 建档、架构说明、`git mv` 迁移、引用更新、validator 适配与本地验证；未修改业务功能代码。


## Closeout 记录

- 移动文件：T-000 至 T-010 均从 `docs/project-os/tasks/` 迁移到 `docs/project-os/tasks/dev-os/`，文件名主体按中文化映射重命名。
- 新增目录：`docs/project-os/tasks/dev-os/` 与 `docs/project-os/tasks/web-app/` 已存在。
- Web App 占位：已创建 `docs/project-os/tasks/web-app/README.md`，仅说明后续 Web App 任务线，不包含真实功能任务。
- Dashboard JSON：已更新 `tasks[].wiki`、`wikiLinks` 与相关文件路径；`docs/project-os/dashboard/dashboard.json` 与 `docs/project-os/dashboard.json` 保持完全一致。
- TASK_BOARD：文档列已指向 `tasks/dev-os/` 新路径。
- Validator：`scripts/dev-os-validate.mjs` 已支持 `docs/project-os/tasks/**/*.md`，不要求 `web-app/README.md` 是 T-xxx 任务，并修复 summary 输出文案。
- 旧路径残留：当前路径型旧引用仅保留在本任务映射表中，作为迁移审计记录；Dashboard JSON、TASK_BOARD、summary 不使用旧路径。
- Dashboard schema：未修改。
- 新增脚本：未新增，仅更新既有 validator。
- 业务功能：未进入登录 / 生图 / 试卷 / 支付，未新增业务 API，未修改数据库 schema。
- 本地验证：`npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty`、`cmp -s`、`git diff --check` 均已通过。
- 二审：`gpt-5.3-codex` 只读二审因长时间输出未自然退出，由 yuan-control 终止；终止前已看到其执行 `node scripts/dev-os-validate.mjs` PASS、`git diff --check` PASS，并确认 dashboard/TASK_BOARD/summary 中无旧当前路径残留。
