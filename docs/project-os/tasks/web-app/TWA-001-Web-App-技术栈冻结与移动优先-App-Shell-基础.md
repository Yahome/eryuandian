id: TWA-001
title: Web App 技术栈冻结与移动优先 App Shell 基础
owner: yuan-frontend
status: in_progress
priority: P0
progress: 70

# TWA-001 Web App 技术栈冻结与移动优先 App Shell 基础

## 任务背景

TWA-000 已完成 MVP 架构冻结与开发基线，多 Agent 已完成 TWA-001 至 TWA-007 合理性评审，四 Agent 多数倾向 B+ 方案。用户明确要求 TWA-001 不能直接进入 App Shell UI 实现，必须先冻结技术选型、数据库方案、部署基准、Mock/Adapter 边界和 100 个用户同时在线的上线基准。

用户同时明确：移动端是主场，预计 95% 客户会在移动端使用。因此移动端必须从项目最开始作为主设计目标，而不是后期补适配。TWA-001 的定位调整为“Web App 技术栈冻结与移动优先 App Shell 基础”：先完成技术基线与移动端基线，再进入 App Shell 实现。

## 任务目标

- 冻结前端技术栈。
- 冻结后端技术栈。
- 冻结数据库和 ORM 方向。
- 明确部署基准。
- 明确 100 用户同时在线 MVP 基准。
- 明确移动端优先设计原则。
- 明确 App Shell / 首页 / 工作台范围。
- 明确路由结构草案。
- 明确 Mock / Adapter 组织方式。
- 明确 TWA-002 至 TWA-007 推荐顺序。
- 输出 yuan-architect 前置架构说明。
- 用户最终确认后，放行 `yuan-frontend` 进入第二阶段静态实现。

## 推荐技术栈草案（已被 deep research 确认路线替代）

本节是 TWA-001 创建时的草案输入，已被用户确认采纳的 deep research 技术路线替代；保留用于追溯。

### 前端

- 候选默认：React + Vite + TypeScript + React Router + TanStack Query。
- CSS：必须给出 Tailwind CSS 与继续沿用当前 CSS 体系的取舍建议；无论选择哪种，都必须支持移动端优先 CSS 架构。
- 理由：当前 MVP 是 Web App，优先快速交付、类型安全、路由清晰、mock/adapter 易切换；React/Vite/TypeScript/TanStack Query 组合对 AI 辅助开发、组件化和接口状态管理友好。

### 后端

- 候选默认：Node.js 单体应用。
- 框架候选：Hono 或 Fastify 二选一。
- API 层：先以 contract / mock / adapter 为主。
- 理由：MVP 阶段优先上线、稳定、可维护，暂不拆微服务，避免把复杂度提前塞满。

### 数据库

- 候选默认：PostgreSQL。
- ORM 候选：Drizzle ORM 或 Prisma，需由 `yuan-architect` 给出推荐方向。
- 取舍：SQLite 可作为本地开发参考，但真实上线建议直接 PostgreSQL，避免后续登录、额度流水、生成任务、作品记录迁移返工；前期不使用复杂分布式数据库。

### 部署

- 候选默认：当前飞牛 OS 虚拟机与当前 VM103 为基准，Docker Compose 部署。
- 反代候选：Nginx 或 Caddy 二选一。
- 数据库：PostgreSQL 单实例部署到飞牛。
- 外网与迁移：参考 llm-wiki 现有内网 / Cloudflare Tunnel 事实源，优先 Cloudflare Tunnel + 反代；方便后续从当前虚拟机迁移到其他服务器。
- 当前不使用 K8s，不使用复杂微服务，不强制 Redis / 队列；真实模型接入前再评估。

### 静态资源 / 资产存储

- MVP mock 阶段可用静态 mock 资源和本地占位。
- 真实生图 / 试卷文件接入前，需要再确认对象存储或本地持久化路径、备份策略、访问控制和生命周期。

### 任务队列

- mock 阶段不引入真实队列。
- 真实模型接入前，再设计队列、重试、限流、扣费预占 / 回滚、失败审计。

### 为什么当前不做复杂架构

当前目标是 MVP 能上线、稳定、可维护，不是大规模商业化架构。过早引入微服务、K8s、复杂分布式数据库、强依赖 Redis / 队列，会拖慢上线并放大运维成本。

## 100 用户同时在线 MVP 基准

- 当前目标：MVP 能稳定服务约 100 个同时在线用户。
- 这不是大规模商业化架构；首期重点是上线、稳定、可维护。
- mock 阶段需要支持：页面访问、登录 mock、额度展示 mock、生成任务状态 mock、作品记录 mock 的基础体验。
- mock 阶段不承诺真实高并发推理；生成任务只模拟状态与结果。
- 真实生图 / 试卷生成接入前，需要补：队列、重试、限流、任务幂等、额度预占、扣费回滚、provider 超时、失败重试、资产存储和审计。
- 当前阶段不得过度设计，不创建真实数据库 schema，不实现真实 API handler。

## 移动端优先设计基线

移动端是主设计，PC 端是增强体验。预计 95% 用户来自移动端，因此所有核心页面先保证移动端可用，再扩展 PC。

- 目标设备宽度至少覆盖：375px、390px、430px。
- 导航原则：移动端底部 Tab 导航优先于 PC sidebar；顶部使用轻量 header。
- 布局原则：单列内容流优先，工作台卡片优先适合竖屏。
- 表单原则：适合手机输入，避免超长表单；生图和试卷工作台后续都必须适合手机操作。
- 触控原则：按钮和点击区域适合触控，建议不小于 44px。
- 交互原则：不依赖 hover；考虑微信 / 手机浏览器 viewport 高度问题；考虑 safe-area。
- PC 扩展原则：PC 端在移动端基础上扩展为双栏或多栏，不反过来把 PC sidebar 缩成手机体验。
- TWA-001 必须先确定移动端 App Shell 基础。
- TWA-007 调整为“账户 / 商业化占位 + 移动端体验回归”，只做回归，不承担第一次移动端适配。

## App Shell 范围边界

### TWA-001 后续允许实现的 UI 范围

- `/zh-CN`
- `/en`
- `/zh-CN/app`
- `/en/app`
- `/zh-CN/app/dashboard`
- `/en/app/dashboard`
- 基础 App Shell
- 首页
- 工作台
- 移动端底部导航
- PC 端增强导航
- 空状态
- loading / error 基础态
- 静态 mock 数据展示

### TWA-001 禁止事项

- 真实登录。
- 真实短信。
- 真实生图。
- 真实试卷生成。
- 真实支付。
- 真实额度扣费。
- 真实数据库 schema。
- 真实 API handler。
- secret / token / key。

## 推荐后续任务顺序

B+ 推荐顺序如下：

- TWA-001：技术栈冻结 + 移动优先 App Shell / 首页 / 工作台基础
- TWA-002：登录与会话 Mock / Adapter
- TWA-003：额度账本 Mock / Adapter
- TWA-004：营销生图工作台 Mock 流程
- TWA-005：试卷生成工作台 Mock 流程
- TWA-006：我的作品 / 生成记录
- TWA-007：账户 / 商业化占位 + 移动端体验回归

该段为历史草案说明；用户最终确认后，B+ 顺序已正式同步 ROADMAP / dashboard JSON。

## Agent 分工

- `yuan-control`：创建任务、同步状态、派发 architect、收集结果，不发表技术意见。
- `yuan-architect`：输出 TWA-001 前置架构说明。
- `yuan-frontend`：用户最终确认后已正式放行，当前负责第二阶段静态实现。
- `yuan-backend`：本轮不实现，只可对技术栈 / mock / adapter 边界提供意见。
- `yuan-reviewer`：后续验收 TWA-001 架构说明和边界。

## 历史阶段记录：第一阶段验收标准

以下内容仅对应 TWA-001 技术冻结前阶段，已被最终确认收口替代，不再表示当前状态。

TWA-001 第一阶段验收标准：

- 已创建 TWA-001 任务文档。
- 已完成 yuan-architect 前置架构说明。
- 技术栈建议清晰。
- 数据库建议清晰。
- ORM 建议清晰。
- 部署建议清晰。
- 100 用户同时在线 MVP 基准清晰。
- 移动端优先设计原则清晰。
- App Shell 范围边界清晰。
- Mock / Adapter 边界清晰。
- 后续 TWA-002 至 TWA-007 推荐顺序清晰。
- 明确哪些内容需要用户确认。
- 未实现 UI。
- 未新增真实 API 文件。
- 未修改数据库 schema。
- 未接真实短信 / 模型 / 支付。
- 未修改 dashboard schema。

## 第二阶段当前不做

当前已允许实现 App Shell / 首页 / 工作台基础静态 mock，但仍禁止以下越界事项：

- 不创建真实 API。
- 不创建数据库迁移。
- 不接短信。
- 不接 AI 模型。
- 不接支付。
- 不做真实额度扣费。
- 不写 secret / token。
- 不修改 dashboard schema。
- 不提前进入 TWA-002 至 TWA-007。

## 当前状态

- status: in_progress
- owner: yuan-frontend
- progress: 70
- 当前阶段：TWA-001A Web App 工程骨架与 locale-aware 最小路由已完成；下一步进入 TWA-001B App Shell / 首页 / 工作台基础静态视觉与移动端响应式实现。

## 前置架构说明

### yuan-architect 前置架构说明摘要

历史结论：TWA-001 在技术冻结前不能直接进入 App Shell UI 实现，必须先冻结技术栈、数据库方向、部署基准、Mock/Adapter 边界、100 用户同时在线 MVP 基准和移动端优先设计基线。该前置阶段已被用户最终确认收口，当前 `yuan-frontend` 已正式放行。

#### 1. 总体结论

- TWA-001 应先完成技术栈冻结与移动端基线，再放行 frontend。
- 当前任务定位应是“Web App 技术栈冻结与移动优先 App Shell 基础”，不是完整 UI 实现。
- 历史阶段要求用户确认前不进入真实 App Shell 实现；当前已确认并进入静态 App Shell 实现。

#### 2. 推荐技术栈

- 前端：React + Vite + TypeScript + React Router + TanStack Query，CSS 方向优先 Tailwind CSS，或沿用现有 CSS 体系但必须明确移动端优先规则。
- 后端：Node.js 单体，Hono 优先、Fastify 备选；API 层以 contract / mock / adapter 为主。
- 数据库：PostgreSQL；ORM 方向优先 Drizzle ORM，Prisma 可作为备选比较项。
- API contract：先用 DTO / contract 文档固定字段与状态枚举，不新增真实 API handler。
- Mock / Adapter：先集中定义替换点，前端只消费 DTO，不直接碰 provider 细节。
- 部署：Docker Compose + 当前飞牛 OS / VM103 基准，反代用 Caddy 或 Nginx；PostgreSQL 单实例部署。
- 静态资源 / 资产存储：mock 阶段用静态 fixture 和本地占位，真实对象存储留到后续任务。
- 任务队列：mock 阶段不强制引入；真实模型接入前再评估 Redis / 队列 / worker。

#### 3. 数据库选择

- PostgreSQL 适合作为 MVP 上线数据库。
- 不建议一开始用复杂分布式数据库，因为当前不是大规模商业化架构。
- SQLite 可作本地开发参考，但不建议作为真实上线主库。
- PostgreSQL 足够支撑 100 用户同时在线的 MVP 目标。
- 登录、额度流水、生成任务、作品记录、账户记录都适合关系型数据库。
- 当前默认禁止创建真实 schema；只保留概念模型和后续建议。

#### 4. 100 用户同时在线 MVP 基准

- 当前目标是稳定服务约 100 个同时在线用户，不是大规模商业化架构。
- mock 阶段应支持页面访问、登录 mock、额度展示 mock、任务状态 mock、作品记录 mock、loading / error / empty 态。
- 真实模型接入前还需要补队列、重试、限流、幂等、额度预占 / 回滚、对象存储、审计和监控。
- 当前阶段不强制 Redis、队列、对象存储或限流实现。

#### 5. 移动端优先设计基线

- 移动端是主设计，PC 是增强。
- 目标宽度至少覆盖 375px / 390px / 430px。
- TWA-001 必须从移动端开始设计 App Shell。
- 底部 Tab 导航优先，顶部轻量 header，单列内容流，触控区域建议不小于 44px。
- 避免 hover-only，考虑手机输入、微信 / 手机浏览器 viewport 和 safe-area。
- PC 端在移动端基础上扩展为双栏或多栏。
- TWA-007 只做移动端体验回归，不承担第一次移动端适配。

#### 6. App Shell / 首页 / 工作台边界

允许：`/`、`/app`、`/app/dashboard`、App Shell、首页、工作台、移动端底部导航、PC 增强导航、空状态、loading / error 基础态、静态 mock 数据。

禁止：真实登录、真实短信、真实生图、真实试卷生成、真实支付、真实额度扣费、真实数据库 schema、真实 API handler、secret / token / key。

#### 7. 推荐后续任务顺序

推荐采用 B+：TWA-001 冻结技术栈与移动优先 App Shell 基础，随后依次是 TWA-002 登录与会话 Mock / Adapter、TWA-003 额度账本 Mock / Adapter、TWA-004 营销生图工作台 Mock 流程、TWA-005 试卷生成工作台 Mock 流程、TWA-006 我的作品 / 生成记录、TWA-007 账户 / 商业化占位 + 移动端体验回归。

该段为前置说明历史记录；用户最终确认后，ROADMAP 已正式同步 B+ 顺序。

#### 8. 对 yuan-frontend 的放行条件

- 用户确认技术栈。
- 用户确认数据库选择。
- 用户确认移动端优先原则。
- 用户确认 App Shell 范围。
- 用户确认后续任务顺序。
- yuan-reviewer 对架构说明无 blocker。

以上条件已满足，`yuan-frontend` 已正式放行。

#### 9. 风险与注意事项

- 技术栈未冻结就写 UI 会导致返工。
- 移动端后置会导致大规模重构。
- 额度账本后置会导致生图 / 试卷流程返工。
- Mock / Adapter 边界不清会误接真实 provider。
- 过度设计会拖慢上线。
- 过早创建数据库 schema 会增加迁移成本。
- dashboard / ROADMAP / TASK_BOARD 事实源漂移会制造错觉。

#### 10. 建议验收标准

- 技术栈、数据库、ORM、部署、100 用户同时在线基准和移动端优先原则都已说明清楚。
- App Shell 允许 / 禁止边界清楚。
- B+ 后续任务顺序清楚。
- frontend 放行条件清楚。
- 风险与边界清楚。
- 不实现 UI、不创建真实 API、不修改数据库 schema、不接真实短信 / 模型 / 支付。

本阶段状态保持 `in_progress`，progress 为 60，已进入 `yuan-frontend` 第二阶段静态实现，不得标记完成。

## 用户确认采纳 deep research 技术路线

用户已确认：“就按这个 deepsearch 文档的步骤来”。因此 TWA-001 的技术栈冻结结论以 `docs/project-os/research/TWA-001-deep-research-report.md` 为准，并替换此前 architect 摘要中的轻量 Vite / Hono 默认建议。

### 冻结后的 Web / API / 工程底座

| 层 | 冻结选择 | 当前边界 |
|---|---|---|
| Web 前端 | Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + TanStack Query | TWA-001 只冻结路线，不安装依赖、不实现 UI |
| API 后端 | Node.js 24 LTS + NestJS + Fastify adapter + OpenAPI | 后续任务再创建 API 工程骨架；本轮不写真实 API handler |
| 数据与任务 | PostgreSQL 17/18 + Drizzle ORM + Redis + BullMQ | PostgreSQL / Redis / BullMQ 作为目标技术栈；本轮不创建 schema、不部署服务 |
| AI 接口层 | provider adapter + Responses API + Structured Outputs | 只冻结 adapter 与结构化输出方向，不接真实 provider |
| 工程化 | pnpm workspace + Turborepo + Biome + Zod + Storybook + MSW + Playwright | 后续工程底座任务再落地；本轮不改 package 依赖 |
| 移动端后续 | Expo + React Native + Expo Router + NativeWind | 作为后续独立 app 线；Web MVP 先行，共享契约、API client、鉴权和 design token |

### 采纳理由

- 该方案优先服务 AI 协同开发：版本匹配文档、目录约定、AGENTS.md、MCP / LLM 文档入口、schema 单一真相和自动化验证链路更完整。
- 设计稿实际是表单驱动的生成型业务台，不是纯内容站：需要表单、上传、异步生成、资产回看、额度、导出、桌面 / 移动差异化导航。
- Web 先做到最好，移动端后续开 Expo 独立 app 线；共享 contract / API client / auth / design token，而不是强求共享复杂 UI。
- 主语言保持 TypeScript，有利于 AI 在 Web、API、schema、client、未来 mobile 之间跨层联动。

### 对此前 architect 建议的调整

- 前端：从 `React + Vite` 调整为 `Next.js 16 + React 19`；Vite 只保留为可行但不优先的备选。
- 后端：从 `Hono/Fastify 轻量单体` 调整为 `NestJS + Fastify adapter`。
- 队列：从“真实模型接入前再评估”调整为目标工程底座包含 `Redis + BullMQ`，但本轮仍不安装、不部署、不写真实任务。
- 工程化：明确采用 `pnpm workspace + Turborepo + Biome + Zod + Storybook + MSW + Playwright`。
- 移动端：明确后续采用 `Expo + React Native + Expo Router + NativeWind` 独立 app 线。

### 仍然保持的硬边界

当前已进入第二阶段静态 UI 实现，但仍然保持以下硬边界：

- 不安装真实业务依赖，除非实现 App Shell 静态结构所必需并经任务边界允许。
- 不创建真实 API handler。
- 不创建数据库 schema / migration / ORM model。
- 不部署 PostgreSQL / Redis / BullMQ / MinIO。
- 不接真实短信、生图模型、试卷模型、支付或对象存储。
- 不写 secret / token / key。
- 不提前进入 TWA-002 至 TWA-007。

## 技术冻结最终确认

用户已最终确认 TWA-001 采用 deep research 技术路线，不再处于待确认状态。

### Web

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

### API

- Node.js 24 LTS
- NestJS
- Fastify adapter
- OpenAPI

### 数据与任务

- PostgreSQL 17 / 18
- Drizzle ORM
- Redis
- BullMQ

### AI 接口层

- Provider Adapter
- Responses API
- Structured Outputs

### 工程化

- pnpm workspace
- Turborepo
- Biome
- Storybook
- MSW
- Playwright

### 移动端后续路线

- Expo
- React Native
- Expo Router
- NativeWind

## 国际化与双市场版本基线（第 11 项最终确认）

TWA-001 正式新增第 11 项架构冻结：Web App 首期架构需要支持 `zh-CN` 与 `en`，且这不是单纯文案翻译，而是同时预留两层能力。

### Locale 与 Market Variant 分层

- Locale：语言层，首期支持 `zh-CN` 与 `en`。
- Market / Site Variant：市场版本层，首期按中文市场版本与国际市场版本预留。

中文版与英文版未来允许在以下方面存在差异：

- 首页主文案。
- CTA。
- 定价展示。
- 功能展示顺序。
- 可见功能。
- 商业化策略。
- 后续支付方式。
- 运营内容组织。

### 路由建议

优先采用 locale-aware 子路径：

- `/zh-CN`
- `/en`
- `/zh-CN/app`
- `/en/app`
- `/zh-CN/app/dashboard`
- `/en/app/dashboard`

当前只是架构冻结，不落地代码。后续 TWA-001A / TWA-001B 或重新派发 `yuan-frontend` 实现时，应按该方向预留目录与导航设计。是否采用具体 i18n 库，后续工程落地时再结合 Next.js 16 生态细化，但不得偏离 locale-aware routing 目标。

### 内容组织建议

普通 UI 文案层建议预留：

- `messages/zh-CN`
- `messages/en`

用于通用按钮、导航文案、表单标签、空状态、loading / error 基础态等。

市场版本配置层建议预留：

- `market-config/china`
- `market-config/global`

用于首页模块差异、CTA 差异、价格展示策略差异、功能可见性差异和市场级运营文案差异。

当前只冻结组织原则，不创建真实目录文件。后续实现时不应把定价、CTA、首页模块差异直接硬编码进页面组件。

### 当前冻结与不实现边界

TWA-001 当前只冻结：

- 国际化路由方向。
- 文案组织原则。
- market config 组织原则。
- frontend 实现 App Shell 时不得把核心文案写死。
- 后续页面应能区分 locale 与 market variant。

TWA-001 当前不实现：

- 真实多语言运行时代码。
- 真实动态切换。
- 真实多市场定价系统。
- 真实国际支付。
- 复杂 CMS。
- 真实运营配置后台。

### 对第二阶段 frontend 的新增约束

`yuan-frontend` 后续实现 App Shell / 首页 / 工作台基础静态 mock 时：

- 不得把核心导航、首页 Hero、CTA、价格型占位文案硬编码为单一中文版本。
- 至少应在设计和任务说明上保留 locale / market 拆分空间。
- 如果当前仍未创建代码，则只写入文档与约束，不提前实现。
- 下一轮真正派发 frontend 时，应在 prompt 中明确要求按 locale-aware 架构推进。

## TWA-001A 实现级前置架构说明

`yuan-architect` 已完成 TWA-001A “Web App 工程骨架 + locale-aware 最小可运行路由”的实现级前置架构说明。本轮可以正式创建 `pnpm workspace`、`apps/web` 与 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 最小 App Router 工程，但只能做最小骨架与 localized route skeleton。

### 1. 总体结论

- 可以创建 `pnpm-workspace.yaml`、`apps/web` 和 Next.js 16 最小 App Router 工程。
- 现有根目录 Dev OS Vite 工程必须保留，不得被 Next.js 替换，不得删除或迁移 `/dev-dashboard` 相关代码。
- 本轮不做完整视觉，不还原 `pic/` 设计稿。
- 本轮不进入 TWA-002，不实现登录、短信、session adapter、auth middleware、额度、生图、试卷、支付、API handler、DB schema / migration 或 secret。

### 2. 推荐最小目录结构

建议本轮最小结构：

```text
/root/eryuandian/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── vite.config.ts
├── src/                         # 现有 Dev OS Vite 工程，必须保留
└── apps/
    └── web/
        ├── package.json
        ├── next.config.ts
        ├── tsconfig.json
        ├── postcss.config.mjs
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   └── [locale]/
        │       ├── layout.tsx
        │       ├── page.tsx
        │       └── app/
        │           ├── page.tsx
        │           └── dashboard/
        │               └── page.tsx
        └── src/
            └── i18n/
                └── routing.ts
```

本轮建议创建最小 `turbo.json`，但只覆盖 `build`、`lint`、`typecheck`、`dev` 等基础任务，不启用 remote cache，不提前铺开 `packages/`。暂不创建 `packages/contracts`、`packages/api-client`、`packages/design-tokens` 或 `packages/ui`。

### 3. 根 Dev OS Vite 与新 Web App 共存策略

根 `package.json` 可以最小修改，但只能新增 workspace / packageManager 信息和 `web:*` scripts。现有 `npm run lint`、`npm run typecheck`、`npm run build` 必须继续验证根 Dev OS Vite 工程并保持通过。不得把根 `dev/build/lint/typecheck` 改成只跑 Next.js，不得删除 Vite / React Dev OS 依赖，不得用 Next.js 接管 `/dev-dashboard`。

### 4. apps/web 最小工程建议

`apps/web` 本轮只建立最小文件：`package.json`、`tsconfig.json`、`next.config.ts`、`postcss.config.mjs`、`app/layout.tsx`、`app/page.tsx`、`app/[locale]/layout.tsx`、`app/[locale]/page.tsx`、`app/[locale]/app/page.tsx`、`app/[locale]/app/dashboard/page.tsx`、`app/globals.css` 和 `src/i18n/routing.ts`。

本轮不建立完整设计系统、`shadcn/ui`、`components.json`、Storybook、MSW、Playwright、TanStack Query、React Hook Form、Zod contracts、真实 API client、auth/session adapter、数据库 schema、Drizzle config、NestJS API app、Redis / BullMQ / MinIO 配置。

### 5. locale-aware 路由结构建议

本轮必须跑通：

- `/zh-CN`
- `/en`
- `/zh-CN/app`
- `/en/app`
- `/zh-CN/app/dashboard`
- `/en/app/dashboard`

推荐 App Router 结构为 `apps/web/app/[locale]/...`。根 `/` 建议 redirect 到默认 locale `/zh-CN`。`[locale]` 需要最小校验，只允许 `zh-CN` 与 `en`，非法 locale 建议 `notFound()`。本轮暂不引入 `next-intl`、`i18next` 或自研 message loader，不实现真实 i18n runtime 或动态语言切换。

### 6. locale 与 market variant 的最小预留

`locale` 与 `market variant` 必须在代码概念上分离。可以在 `apps/web/src/i18n/routing.ts` 创建最小常量：

- `SUPPORTED_LOCALES`
- `DEFAULT_LOCALE`
- `SUPPORTED_MARKETS`

不得创建 `getMarketByLocale()`，不得写死 `en === global` 或 `zh-CN === china`，不得出现 `locale === "zh-CN" ? "china" : "global"` 之类自动映射。本轮不建议创建真实 `messages/` 或 `market-config/` 目录，避免诱导提前实现文案 runtime、首页模块、CTA、定价、功能显隐、支付方式或 CMS。

### 7. frontend 实施边界

`yuan-frontend` 必须：

- 保留现有根 Vite Dev OS 工程。
- 创建 `pnpm-workspace.yaml`。
- 创建 `apps/web` Next.js 16 最小工程。
- 创建 locale-aware 最小路由骨架。
- 让根 `/` redirect 到 `/zh-CN`。
- 做最小 locale 校验。
- 创建最小 locale / market 常量并保持二者分离。
- 保持根 `npm run lint`、`npm run typecheck`、`npm run build` 通过。
- 让 `pnpm --filter @eryuandian/web typecheck`、`pnpm --filter @eryuandian/web build` 通过；如定义 web lint，也必须通过。

`yuan-frontend` 可以创建最小 `turbo.json`、根层 `web:*` scripts、极简 placeholder 页面和少量基础样式。

`yuan-frontend` 禁止替换根 Vite、破坏 `/dev-dashboard`、实现完整视觉、初始化 shadcn/ui、创建 Storybook / MSW / Playwright / TanStack Query / React Hook Form / Zod contracts、创建 API handler / NestJS API / DB schema / Drizzle model / Redis / BullMQ / MinIO、实现登录 / 短信 / 生图 / 试卷 / 支付 / 额度扣费、写 secret / token / key，或提前进入 TWA-002 至 TWA-007。

### 8. reviewer 验收重点

`yuan-reviewer` 必须检查：根 Dev OS Vite 工程是否保留；根命令 `npm run lint`、`npm run typecheck`、`npm run build` 是否继续通过；`apps/web` 是否存在并可 `typecheck/build/lint`；六个 locale-aware 路由是否存在；根 `/` 是否 redirect 到 `/zh-CN`；非法 locale 是否不能正常渲染为合法页面；`SUPPORTED_LOCALES` 是否仅包含 `zh-CN` / `en`；market 常量是否独立且没有从 locale 自动推导；是否没有完整视觉、真实业务、API handler、DB schema、secret 或 TWA-002 越界。

### 9. 建议事实源同步方式

TWA-001A 经 reviewer PASS / PASS with notes 且无 Blocker / Major 后，TWA-001 可保持 `owner: yuan-frontend`、`status: in_progress`，progress 从 `60` 更新到 `70`。`summary.md`、两个 dashboard JSON、`TASK_BOARD.md`、`CHANGELOG.md` 和本任务文档做最小同步：记录已完成 workspace / `apps/web` / locale-aware route skeleton，下一步进入 TWA-001B 静态视觉与移动端响应式实现；不得标记 TWA-001 done，不得修改 dashboard schema。

## 用户最终确认结果

以下事项已全部正式确认：

1. TWA-001 继续遵循先架构冻结、后 UI 实现；前置确认完成后允许进入实现阶段。
2. deep research 技术栈正式采用。
3. 数据库与 ORM 正式采用 PostgreSQL + Drizzle ORM；SQLite 不作为正式上线主库。
4. 部署基准为 Docker Compose + Caddy + PostgreSQL + Redis + MinIO 的单机 MVP。
5. MinIO 作为生成资产和试卷参考仓库原始文件层。
6. MVP 目标是稳定服务约 100 个同时在线用户，当前不过度设计。
7. 移动端优先基线正式生效，Web 第一阶段必须覆盖手机浏览器响应式布局。
8. TWA-001 实现范围只包含 App Shell / 首页 / 工作台基础静态 mock。
9. 后续任务顺序正式采用 B+。
10. `yuan-frontend` 已正式放行，开始 TWA-001 第二阶段实现。
11. 国际化 / 中英文双市场版本基线正式纳入 TWA-001 架构冻结；当前只冻结 locale-aware 与 market-aware 方向，不实现真实多语言运行时、多市场定价或国际支付。

## MinIO + 试卷参考仓库方向

MinIO 正式作为对象存储层：

- 上传素材。
- 生成结果。
- 图片。
- PDF。
- Word。
- 作品文件。
- 试卷参考仓库原始文件。

PostgreSQL 保存试卷元数据。后续使用 pgvector / 全文索引做检索。AI 生成试卷前，后端必须先检索同年级、同学科、同教材版本、同考试类型的至少 3 张参考试卷，再开始生成。

TWA-001 当前只冻结架构方向，不实现真实 OCR、embedding、检索、上传、下载或对象存储连接。

## 100 用户同时在线 MVP 基准（最终确认）

- 目标是稳定服务约 100 个同时在线用户。
- 当前不是大规模商业化架构。
- mock 阶段不做真实高并发推理。
- 真实模型接入前再细化队列、重试、限流、幂等、额度预占 / 回滚、监控与审计。

## 移动端优先响应式 Web 基线（最终确认）

- Web 第一阶段必须同时覆盖手机浏览器响应式布局。
- 手机访问显示 mobile 布局，不是 PC 页面缩放。
- 核心尺寸至少覆盖 375px / 390px / 430px。
- 移动端底部 Tab、顶部轻量 header、单列内容流。
- 触控区域建议不小于 44px。
- 不依赖 hover-only。
- 考虑 safe-area 与移动浏览器 viewport。
- PC 端是在移动端基础上的增强布局。
- TWA-007 仅做移动端体验回归，不承担第一次适配。

## B+ 顺序正式生效

- TWA-001：技术栈冻结 + 移动优先 App Shell / 首页 / 工作台基础
- TWA-002：登录与会话 Mock / Adapter
- TWA-003：额度账本 Mock / Adapter
- TWA-004：营销生图工作台 Mock 流程
- TWA-005：试卷生成工作台 Mock 流程
- TWA-006：我的作品 / 生成记录
- TWA-007：账户 / 商业化占位 + 移动端体验回归

## yuan-frontend 已正式放行

frontend 放行条件已满足：

- 用户确认技术栈。
- 用户确认数据库选择。
- 用户确认移动端优先原则。
- 用户确认 App Shell 范围。
- 用户确认后续任务顺序。

当前 TWA-001 进入第二阶段：移动端优先 App Shell / 首页 / 工作台基础静态实现。

## 第二阶段允许 / 禁止边界

允许：

- `/zh-CN`
- `/en`
- `/zh-CN/app`
- `/en/app`
- `/zh-CN/app/dashboard`
- `/en/app/dashboard`
- App Shell
- 首页
- 工作台基础
- locale-aware / market-aware 结构预留
- 移动端底部 Tab
- PC 增强导航
- Empty / Loading / Error 基础态
- 静态 mock 数据展示

禁止：

- 真实登录
- 真实短信
- 真实生图
- 真实试卷生成
- 真实支付
- 真实额度扣费
- 真实数据库 schema / migration
- 真实 API handler
- secret / token / key

## TWA-001A 完成记录

TWA-001A 已经完成并通过 `yuan-reviewer` 验收，结论为 PASS with notes，无 Blocker / Major。

已完成：

- 已建立 `pnpm workspace`。
- 已建立 `apps/web`。
- 已建立 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 最小 App Router 工程。
- 已建立 locale-aware 最小路由：
  - `/zh-CN`
  - `/en`
  - `/zh-CN/app`
  - `/en/app`
  - `/zh-CN/app/dashboard`
  - `/en/app/dashboard`
- 根 `/` 已 redirect 到 `/zh-CN`。
- 已创建最小 `SUPPORTED_LOCALES`、`DEFAULT_LOCALE`、`SUPPORTED_MARKETS` 常量，且未创建 `getMarketByLocale()`，未把 locale 与 market variant 强绑定。
- 已保留根目录 Dev OS Vite 工程；根 `npm run lint`、`npm run typecheck`、`npm run build` 仍通过。

仍未进入：

- 完整首页视觉。
- 完整 App Shell 视觉。
- 完整 Dashboard 视觉。
- 真实 i18n runtime / 动态语言切换。
- 真实 market 定价系统。
- 登录、短信、生图、试卷、支付、额度扣费。
- API handler。
- DB schema / migration。
- NestJS API 工程。
- TWA-002 至 TWA-007。

当前 TWA-001 仍为 `in_progress`，owner 仍为 `yuan-frontend`，progress 更新为 `70`。下一步是 TWA-001B：App Shell / 首页 / 工作台基础静态视觉 + 移动端响应式布局。
