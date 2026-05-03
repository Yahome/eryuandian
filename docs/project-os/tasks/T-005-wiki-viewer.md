---
id: T-005
title: Project Wiki Viewer
owner: yuan-frontend
status: in_progress
priority: P1
progress: 40
created_at: 2026-05-02
updated_at: 2026-05-03
tags:
  - frontend
  - wiki
  - dev-os
  - architect-gate
---

# T-005 Project Wiki Viewer

## 目标
在 Dev OS Dashboard 中提供项目 Wiki 快速浏览入口，让用户可以从界面查看核心 Markdown 事实源。

## 流程门禁

本任务涉及新页面 / 新模块 / Wiki 文档索引结构，命中 Architect 前置门禁。

执行顺序：

1. `yuan-architect` 先输出轻量架构说明，只定义结构、数据、边界和验收标准。
2. `yuan-control` 确认架构说明完成后，再派 `yuan-frontend` 实现。
3. `yuan-reviewer` 验收时必须检查 frontend 是否遵守 architect 的设计边界。

`yuan-frontend` 在架构说明完成前不得开工。

## 架构前置状态

- 状态：done，2026-05-03 已由 `yuan-architect` 完成本文件内的轻量架构说明。
- 下一步：等待 `yuan-control` 派 `yuan-frontend` 按本说明实现 Wiki Viewer。
- 验收：`yuan-reviewer` 必须按本说明检查实现是否越界。

## 页面模块
- Wiki 文件列表
- 事实源入口
- 最近更新
- Markdown 预览或外链打开

## 非目标

- 不开发登录、生图、试卷、支付等业务功能。
- 不修改数据库 schema。
- 不新增后端业务 API，除非 architect 说明明确要求且经 `yuan-control` 重新派发。
- `yuan-architect` 本次不写前端代码。
- 不修改 Markdown 事实源内容本身；Viewer 只读展示。

## yuan-architect 前置架构说明

### 目标与非目标

目标：

- 在 `/dev-dashboard` 内提供 Project Wiki Viewer，让用户可以从 Dashboard 快速浏览 `docs/project-os` 的核心 Markdown 事实源。
- 覆盖 README、Roadmap、Task Board、Decisions、Risks、Agent 进度文档入口、任务文档入口等首期 Wiki 入口。
- 保持 Markdown-first 原则：Markdown 是事实源，Dashboard JSON 是索引和展示数据，不在前端硬编码任务状态或 Agent 状态。
- 支持只读 Markdown 预览；无法预览或目录型入口只展示路径与子项入口。

非目标：

- 不开发登录、生图、试卷、支付等业务功能。
- 不修改数据库 schema。
- 不新增后端业务 API，不新增业务 API 契约。
- 不编辑、不保存、不重命名、不删除任何 Markdown 事实源。
- 不做权限系统、全文搜索、版本历史、在线协作评论或文档发布后台。

### Wiki Viewer 信息结构

Wiki Viewer 在 Dev OS Dashboard 内作为只读浏览模块，不另起业务系统。信息结构分为：

- Wiki 入口区：使用 Dashboard 现有 Wiki 快速入口进入浏览模块，可展示当前选中的文档标题、路径和类型。
- Wiki 索引区：按 `type` 对入口分组，至少包含 `overview`、`planning`、`tasks`、`decisions`、`risks`、`schema`、`agents` 等类型；目录型入口用于展示 Agent 文档组和任务文档组。
- 最近更新区：复用 `dashboard.json.recentUpdates`，只展示更新时间、标题、说明和关联文件路径，不从 Markdown 正文推断状态。
- Markdown 预览区：展示只读 Markdown 渲染结果、原始路径和无法预览时的空状态。
- 外链操作区：仅允许打开 Markdown 内部的安全外链或显示 repo-relative 路径，不提供写入类操作。

### 数据来源与字段边界

主数据源：

- `/dev-dashboard` 继续读取 `docs/project-os/dashboard/dashboard.json`。
- `docs/project-os/dashboard.json` 作为根部镜像文件，必须与 `docs/project-os/dashboard/dashboard.json` 保持同一语义内容。
- Wiki 索引复用 `dashboard.json.wikiLinks`。

`wikiLinks` 字段边界：

- 只使用现有字段：`title`、`path`、`type`。
- `title` 仅用于 UI 展示。
- `path` 必须是 repo-relative 路径，且必须位于 `docs/project-os` 下；允许 `.md` 文件路径或以 `/` 结尾的目录路径。
- `type` 只用于分组和视觉标签，不承载权限、状态、进度或业务含义。
- 前端不得在 `wikiLinks` 之外自造任务状态、Agent 状态、风险状态或业务指标。

Markdown 内容边界：

- Markdown 预览内容只能来自 repo 内 `docs/project-os/**/*.md` 的静态只读内容。
- 前端可以用构建工具的 raw Markdown import / glob 建立只读内容映射，但可展示的入口仍必须受 `dashboard.json.wikiLinks` 及其目录前缀限制。
- 目录型入口如 `docs/project-os/agents/` 和 `docs/project-os/tasks/` 可以展开为该目录下的 Markdown 文件列表；派生标题可来自文件名或文档 front matter，但不得写回 JSON 或 Markdown。
- 禁止根据用户输入拼接任意文件路径，禁止读取 `docs/project-os` 之外的文件，禁止远程拉取 Markdown 正文。

### dashboard.json.wikiLinks 与 schema 结论

- 本阶段复用现有 `dashboard.json.wikiLinks`。
- 本阶段不新增 `wikiLinks` 字段，不修改 `docs/project-os/dashboard/SCHEMA.md`，不触发 dashboard schema 变更。
- 现有 `wikiLinks` 已覆盖 T-005 验收所需的 README、Roadmap、Task Board、Decisions、Risks、Agent 进度目录和任务文档目录。
- 若后续需要 `order`、`children`、`description`、`previewable` 等字段，必须重新走 `yuan-architect` 前置门禁，并同步更新 `SCHEMA.md`、T-004 与两个 dashboard JSON。

### Markdown 预览 / 外链打开边界

- Markdown 预览为只读渲染，不显示编辑器、保存按钮、上传入口或删除入口。
- Markdown 渲染必须禁用或转义原始 HTML 中的脚本能力，不允许执行 `<script>`、内联事件、iframe 或远程脚本。
- Markdown 内部指向 `docs/project-os/*.md` 的相对链接，优先解析为 Viewer 内部文档切换；无法解析时展示路径，不做任意 fetch。
- `http` / `https` 外链可以新标签打开，必须使用 `target="_blank"` 和 `rel="noreferrer noopener"`。
- 禁止打开 `javascript:`、`data:`、`file:` 等危险协议链接。
- 禁止把外链内容嵌入 iframe 或作为 Markdown 正文远程加载。

### yuan-frontend 文件范围和禁止事项

允许范围：

- 仅修改 Dev OS Dashboard 相关前端文件。
- 当前 T-003 的主要实现面是 `src/main.tsx` 与 `src/styles.css`；如需拆分组件，只能新增或修改 Dev OS Dashboard / Wiki Viewer 专用组件和样式文件。
- 可以新增只读 Markdown 渲染所需的前端依赖或类型声明，但必须由 `yuan-control` 在具体实现任务中确认依赖变更范围。

禁止事项：

- 禁止修改 `docs/project-os` Markdown 事实源内容来适配 UI。
- 禁止修改数据库 schema。
- 禁止新增后端业务 API 或服务端文件。
- 禁止开发登录、生图、试卷、支付、额度、订单、生成记录等业务功能。
- 禁止硬编码 Agent / Task / Risk / Roadmap 状态；这些展示数据必须来自 dashboard JSON。
- 禁止把用户输入当作文件路径读取，禁止展示 `docs/project-os` 之外的文件。

### yuan-reviewer 验收点

- T-005 文档存在本 `yuan-architect` 前置架构说明，且任务整体仍处于待实现状态而非误标 done。
- `/dev-dashboard` 的 Wiki Viewer 使用 `dashboard.json.wikiLinks` 作为索引来源，未新增 dashboard schema 字段。
- README、Roadmap、Task Board、Decisions、Risks 可见；Agent 进度文档入口和任务文档入口可见。
- Markdown 预览为只读，不能编辑或写回 Markdown 事实源。
- 外链打开符合安全边界：新标签、`noreferrer noopener`、无危险协议、无 iframe 远程正文加载。
- 前端改动只落在 Dev OS Dashboard / Wiki Viewer 范围内，未开发登录、生图、试卷、支付等业务功能。
- 未修改数据库 schema，未新增后端业务 API。
- 两个 dashboard JSON 仍是合法 JSON，并与任务状态保持一致。

## 验证命令

- `jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`

## 验收标准
- [x] 已有 `yuan-architect` 前置架构说明。
- [ ] 能看到 README、Roadmap、Task Board、Decisions、Risks
- [ ] 能看到 Agent 进度文档入口
- [ ] 能看到任务文档入口
- [ ] 不修改 Markdown 事实源内容
- [ ] 与 Dashboard UI 风格一致
- [ ] reviewer 已检查 frontend 是否遵守 architect 的结构、数据和边界说明

## 进展记录

- 2026-05-03：Dev OS 流程纠偏后，本任务调整为先由 `yuan-architect` 做前置架构说明，再交给 `yuan-frontend` 实现。
- 2026-05-03：`yuan-architect` 已完成 T-005 轻量架构说明，明确复用 `dashboard.json.wikiLinks`、不变更 schema、不新增 API、不改数据库 schema；下一步等待 `yuan-frontend` 实现。
