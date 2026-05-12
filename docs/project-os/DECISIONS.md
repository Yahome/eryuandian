# DECISIONS

状态：初始化

## D-001：项目目录英文名

日期：2026-05-02

决策：中文项目名为“两元店”，英文目录名固定使用 `eryuandian`。

原因：用户明确指定，后续所有路径、repo、文档均按此约定执行。

## D-002：开发过程管理采用 Markdown-first

日期：2026-05-02

决策：`docs/project-os` 是开发过程管理的事实源，Dashboard 只读取并展示，不作为主数据源。

原因：便于 Agent 写入、审查、版本控制和后续接入 LLM-Wiki 式汇总。


## D-003：TWA-001 采纳 deep research 技术路线

日期：2026-05-08

决策：TWA-001 技术栈冻结以用户提供并最终确认的 `docs/project-os/research/TWA-001-deep-research-report.md` 为准。Web 主前端采用 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + TanStack Query + React Hook Form + Zod；API 后端采用 Node.js 24 LTS + NestJS + Fastify adapter + OpenAPI；数据与任务层采用 PostgreSQL 17/18 + Drizzle ORM + Redis + BullMQ；部署基准采用 Docker Compose + Caddy + PostgreSQL + Redis + MinIO；工程底座采用 pnpm workspace + Turborepo + Biome + Zod + Storybook + MSW + Playwright；移动端后续采用 Expo + React Native + Expo Router + NativeWind 独立 app 线，共享契约、API client、鉴权和 design token。MinIO 作为上传素材、生成结果、图片、PDF、Word、作品文件和试卷参考仓库原始文件存储层；PostgreSQL 保存试卷元数据，后续使用 pgvector / 全文索引检索。

原因：该路线更适合 AI 协同开发与长期维护，能提供更明确的目录约定、机器可读 schema、OpenAPI / Zod / Storybook / MSW / Playwright 验证链路，并更贴合两元店“表单驱动的生成型业务台 + 移动端高占比”的产品约束。

边界：本决策冻结路线并放行 TWA-001 第二阶段前端静态实现；不代表本轮创建真实 API、修改数据库 schema、接入真实短信 / 生图模型 / 试卷模型 / 支付、真实对象存储或 secret。


## D-004：B+ 任务顺序正式生效

日期：2026-05-08

决策：TWA-001 至 TWA-007 正式采用 B+ 顺序：TWA-001 技术栈冻结 + 移动优先 App Shell / 首页 / 工作台基础；TWA-002 登录与会话 Mock / Adapter；TWA-003 额度账本 Mock / Adapter；TWA-004 营销生图工作台 Mock 流程；TWA-005 试卷生成工作台 Mock 流程；TWA-006 我的作品 / 生成记录；TWA-007 账户 / 商业化占位 + 移动端体验回归。

原因：该顺序先冻结技术栈与移动端基础，再处理登录、额度、生成工作台和记录/账户，能减少后续返工。

边界：TWA-001 只允许实现 App Shell / 首页 / 工作台基础静态 mock，不提前实现 TWA-002 及后续任务。
