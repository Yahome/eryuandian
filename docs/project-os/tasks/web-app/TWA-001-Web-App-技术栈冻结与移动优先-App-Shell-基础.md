id: TWA-001
title: Web App 技术栈冻结与移动优先 App Shell 基础
owner: yuan-architect
status: in_progress
priority: P0
progress: 60

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
- 经用户确认后，才允许 yuan-frontend 开工。

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

- `/`
- `/app`
- `/app/dashboard`
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

该顺序是推荐方案，是否正式同步 ROADMAP / dashboard JSON，等待用户确认。本轮不把 ROADMAP 全量改成 B+，只允许最小同步 TWA-001 标题。

## Agent 分工

- `yuan-control`：创建任务、同步状态、派发 architect、收集结果，不发表技术意见。
- `yuan-architect`：输出 TWA-001 前置架构说明。
- `yuan-frontend`：等待架构说明和用户确认后才能实现。
- `yuan-backend`：本轮不实现，只可对技术栈 / mock / adapter 边界提供意见。
- `yuan-reviewer`：后续验收 TWA-001 架构说明和边界。

## 验收标准

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

## 本轮不做

- 不实现 App Shell。
- 不创建真实 API。
- 不创建数据库迁移。
- 不接短信。
- 不接 AI 模型。
- 不接支付。
- 不做真实额度扣费。
- 不写 secret / token。
- 不修改 dashboard schema。
- 不直接让 frontend 开工。

## 当前状态

- status: in_progress
- progress: 60
- 当前阶段：用户已确认采纳 deep research 技术路线；等待事实源同步、reviewer 无 blocker 后再拆实现任务。

## 前置架构说明

### yuan-architect 前置架构说明摘要

结论：TWA-001 不能直接进入 App Shell UI 实现，必须先冻结技术栈、数据库方向、部署基准、Mock/Adapter 边界、100 用户同时在线 MVP 基准和移动端优先设计基线。确认前，`yuan-frontend` 不得开工。

#### 1. 总体结论

- TWA-001 应先完成技术栈冻结与移动端基线，再放行 frontend。
- 当前任务定位应是“Web App 技术栈冻结与移动优先 App Shell 基础”，不是完整 UI 实现。
- 用户确认前，不进入真实 App Shell 实现。

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

ROADMAP 建议等待用户确认 B+ 后再集中修改，不在本轮偷偷改全量顺序。

#### 8. 对 yuan-frontend 的放行条件

- 用户确认技术栈。
- 用户确认数据库选择。
- 用户确认移动端优先原则。
- 用户确认 App Shell 范围。
- 用户确认后续任务顺序。
- yuan-reviewer 对架构说明无 blocker。

满足以上条件后，才允许 yuan-frontend 开工。

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

本阶段状态保持 `in_progress`，progress 可推进到 40，等待用户确认，不得标记完成。

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

- 本轮不实现 UI。
- 本轮不安装依赖。
- 本轮不创建真实 API handler。
- 本轮不创建数据库 schema / migration / ORM model。
- 本轮不部署 PostgreSQL / Redis / BullMQ / MinIO。
- 本轮不接真实短信、生图模型、试卷模型、支付或对象存储。
- 本轮不写 secret / token / key。
- `yuan-frontend` 仍需等 TWA-001 进入实现任务并通过 reviewer 无 blocker 后才开工。
