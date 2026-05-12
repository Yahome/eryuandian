# TECH_STACK：正式冻结版

状态：已冻结（内部标识：`frozen`）
更新时间：2026-05-08

## 结论

本文件记录“两元店 / eryuandian”Web App 正式技术栈冻结结果。Dev OS Dashboard 仍保持当前既有实现，不要求在本阶段迁移；正式 Web App 采用用户最终确认的 deep research 技术路线。

当前阶段只冻结技术栈和实现边界，不创建真实 API handler，不创建数据库 schema / migration / ORM model，不接真实短信、生图模型、试卷模型、支付或对象存储密钥。

## Web 前端

正式采用：

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod

说明：Web 第一阶段必须同时覆盖手机浏览器响应式布局。手机访问显示 mobile 布局，不是 PC 页面缩放；PC 端是在移动端基础上的增强布局。

## API 后端

正式采用：

- Node.js 24 LTS
- NestJS
- Fastify adapter
- OpenAPI

说明：后端作为独立 API 层规划，服务 Web 和后续移动端。TWA-001 当前不创建真实 API handler。

## 数据库与 ORM

正式采用：

- PostgreSQL 17 / 18
- Drizzle ORM

决策：SQLite 不作为正式上线主库，只可作为本地临时验证或测试参考。TWA-001 当前不创建真实 schema、migration 或 ORM model。

## 数据与任务基础设施

正式采用：

- Redis
- BullMQ

说明：Redis + BullMQ 是生成任务队列目标栈。mock 阶段不做真实高并发推理；真实模型接入前再细化队列、重试、限流、幂等、额度预占 / 回滚、监控与审计。

## 对象存储与试卷参考仓库

正式采用：

- MinIO（S3 兼容对象存储）

使用边界：

- 上传素材原文件。
- 生成结果图片。
- PDF / Word / 作品文件。
- 试卷参考仓库的原始文件存储层。

数据分工：

- MinIO 保存原始文件和二进制资产。
- PostgreSQL 保存试卷元数据。
- 后续使用 pgvector / 全文索引做检索。
- AI 生成试卷前，后端必须先检索同年级、同学科、同教材版本、同考试类型的至少 3 张参考试卷，再开始生成。

TWA-001 当前只冻结架构方向，不实现真实 OCR、embedding、检索、上传、下载或对象存储连接。

## AI 接口层

正式采用：

- Provider Adapter
- Responses API
- Structured Outputs

说明：业务代码不得到处直连真实 provider 或散落 prompt。真实模型接入前必须经过 adapter、结构化输出、失败处理、重试、限流与审计设计。

## 工程化

正式采用：

- pnpm workspace
- Turborepo
- Biome
- Storybook
- MSW
- Playwright
- Zod contracts

说明：后续工程底座任务应优先建立 monorepo / contract / mock / UI 验证闭环。TWA-001 当前事实源收口不安装依赖。

## 部署基准

MVP 单机部署基准：

- Docker Compose
- Caddy
- PostgreSQL
- Redis
- MinIO

说明：当前不过度设计，不使用 K8s，不拆复杂微服务。目标是稳定服务约 100 个同时在线用户。

## 移动端后续路线

后续移动 App 采用：

- Expo
- React Native
- Expo Router
- NativeWind

原则：移动 App 独立 UI，共享契约、API client、鉴权、design token 和少量无平台依赖 domain logic，不强求共享复杂 Web UI。

## TWA-001 实现边界

允许：

- `/`
- `/app`
- `/app/dashboard`
- App Shell
- 首页
- 工作台基础
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
