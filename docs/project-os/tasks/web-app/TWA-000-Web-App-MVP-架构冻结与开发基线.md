id: TWA-000
title: Web App MVP 架构冻结与开发基线
owner: yuan-architect
status: done
priority: P0
progress: 100

# TWA-000 Web App MVP 架构冻结与开发基线

## 任务背景

T-011 已完成 Project OS 文档体系中文化与任务线分离：Dev OS / Project OS 治理任务进入 `docs/project-os/tasks/dev-os/`，Web App 业务任务进入 `docs/project-os/tasks/web-app/`。Web App 即将从 Dev OS 收尾转入 MVP 业务开发，如果直接进入登录、生图、试卷、额度或支付实现，会在技术栈、API contract、概念数据模型和 Mock/Adapter 边界未冻结时产生返工风险。

本任务是 Web App 任务线第一个任务，只冻结 MVP 架构与开发基线。它不新增真实业务功能，不新增真实 API 文件，不修改数据库 schema，不接真实短信、真实模型或支付。

## 任务目标

- 明确 Web App 业务任务统一使用 `TWA-xxx`，并放在 `docs/project-os/tasks/web-app/`。
- 冻结 MVP 第一版业务范围、暂不做范围、前端路由草案、API contract 草案和概念数据模型草案。
- 明确 Mock/Adapter 边界，确保后续功能可先用 mock 跑通体验，再替换真实服务。
- 明确 Agent 分工，避免 frontend/backend 在架构基线未确认时越界实现。
- 拆出 TWA-001 至 TWA-007，给后续 Web App MVP 开发提供任务入口。

## MVP 范围

- 公开首页与 App 工作台入口。
- 手机号登录体验的前端流程与后端 contract 基线，首期可用 mock login code，不接真实短信。
- 用户会话、用户基础信息、额度展示和额度流水的概念模型。
- 商家营销生图工作台：输入营销诉求、选择场景/风格、提交生成任务、查看生成状态和生成资产。
- 智能生成试卷工作台：输入学段/科目/知识点/题型/数量，生成试卷任务，查看试卷结果。
- 我的作品：统一展示生图资产与试卷产物。
- 账户页：展示用户资料、额度、账本摘要和后续付费入口占位。
- `/dev-dashboard` 保留为 Dev OS Dashboard，不混入 Web App 业务信息。

## MVP 暂不做范围

- 不接真实短信供应商。
- 不接真实 AI 生图模型或试卷生成模型。
- 不接真实支付、会员套餐、订单系统或发票能力。
- 不实现真实数据库 schema、迁移文件或 ORM model。
- 不做复杂组织、多租户、团队协作、后台运营系统。
- 不做移动端原生 App、小程序或浏览器插件。
- 不做完整风控、内容审核、素材版权自动识别。
- 不做 PDF / Word 高保真导出实现，只保留 contract 与后续任务入口。

## 前端架构草案路由

| 路由 | 用途 | 第一版边界 |
|---|---|---|
| `/` | 公开首页 / 产品入口 | 展示产品定位与进入 App 的入口；不做营销落地页扩展 |
| `/app` | App Shell 默认入口 | 登录后进入工作台；可重定向到 `/app/dashboard` |
| `/app/dashboard` | 用户工作台 | 展示额度、最近生成任务、快捷入口和状态摘要 |
| `/app/image` | 商家营销生图工作台 | 表单、生成任务状态、生成资产列表 |
| `/app/exam` | 智能生成试卷工作台 | 表单、试卷任务状态、试卷结果预览 |
| `/app/assets` | 我的作品 | 聚合 `GeneratedAsset` 与 `ExamPaper` |
| `/app/account` | 账户页 | 用户资料、额度、账本摘要、付费占位 |
| `/dev-dashboard` | Dev OS Dashboard | 继续读取 Project OS dashboard JSON；不混入 Web App 业务状态 |

## API contract 草案

本节只写 contract，不新增 API 文件，不实现 handler，不修改数据库 schema。

### Auth

- `POST /api/auth/send-code`
  - request：`{ phone: string, scene: "login" }`
  - response：`{ codeId: string, expiresAt: string, delivery: "mock" | "sms" }`
  - MVP mock：返回 mock `codeId`，不发送真实短信。
- `POST /api/auth/login`
  - request：`{ phone: string, code: string, codeId: string }`
  - response：`{ user: UserDTO, session: AuthSessionDTO }`
  - MVP mock：固定验证码策略由 TWA-002 再定。

### Account / Quota

- `GET /api/me`
  - response：`{ user: UserDTO, quota: QuotaSummaryDTO }`
- `GET /api/quota`
  - response：`{ quota: QuotaSummaryDTO, ledgerPreview: CreditLedgerDTO[] }`

### Image Generation

- `POST /api/generation/image`
  - request：`{ prompt: string, scene: string, style?: string, size?: string, referenceAssetIds?: string[] }`
  - response：`{ job: GenerationJobDTO }`
- `GET /api/generation/jobs/:id`
  - response：`{ job: GenerationJobDTO, assets: GeneratedAssetDTO[] }`
- `GET /api/generation/jobs`
  - query：`{ cursor?: string, limit?: number }`
  - response：`{ items: GenerationJobDTO[], nextCursor?: string }`
- `GET /api/assets`
  - query：`{ type?: "image" | "exam", cursor?: string, limit?: number }`
  - response：`{ items: Array<GeneratedAssetDTO | ExamPaperDTO>, nextCursor?: string }`

### Exam Generation

- `POST /api/exam/jobs`
  - request：`{ grade: string, subject: string, knowledgePoints: string[], questionTypes: string[], count: number, difficulty?: string }`
  - response：`{ job: ExamJobDTO }`
- `GET /api/exam/jobs/:id`
  - response：`{ job: ExamJobDTO, paper?: ExamPaperDTO }`
- `GET /api/exam/jobs`
  - query：`{ cursor?: string, limit?: number }`
  - response：`{ items: ExamJobDTO[], nextCursor?: string }`

## 概念数据模型草案

本节只定义概念字段，不创建真实 schema、迁移或 ORM model。

### User

- `id`：用户 ID。
- `phone`：手机号，真实落库前需脱敏展示。
- `displayName`：展示名。
- `avatarUrl`：头像地址，可为空。
- `status`：`active` / `disabled`。
- `createdAt`：创建时间。
- `updatedAt`：更新时间。

### AuthSession

- `id`：会话 ID。
- `userId`：关联用户。
- `tokenHash`：会话 token 摘要，不保存明文 token。
- `expiresAt`：过期时间。
- `createdAt`：创建时间。
- `revokedAt`：撤销时间，可为空。

### LoginCode

- `id`：验证码记录 ID。
- `phone`：手机号。
- `codeHash`：验证码摘要，不保存明文验证码。
- `scene`：`login`。
- `delivery`：`mock` / `sms`。
- `expiresAt`：过期时间。
- `consumedAt`：使用时间，可为空。
- `createdAt`：创建时间。

### QuotaRecord

- `id`：额度快照 ID。
- `userId`：关联用户。
- `availableCredits`：当前可用额度。
- `reservedCredits`：已预占额度。
- `lifetimeCredits`：累计获得额度。
- `updatedAt`：更新时间。

### GenerationJob

- `id`：生图任务 ID。
- `userId`：关联用户。
- `prompt`：用户输入。
- `scene`：营销场景。
- `style`：风格，可为空。
- `status`：`queued` / `running` / `succeeded` / `failed` / `cancelled`。
- `costCredits`：消耗额度。
- `provider`：`mock` / 后续真实 provider。
- `errorMessage`：失败原因，可为空。
- `createdAt`：创建时间。
- `completedAt`：完成时间，可为空。

### GeneratedAsset

- `id`：资产 ID。
- `userId`：关联用户。
- `jobId`：关联 `GenerationJob`。
- `type`：`image`。
- `url`：资产地址。
- `thumbnailUrl`：缩略图地址，可为空。
- `width`：宽度。
- `height`：高度。
- `metadata`：生成参数摘要。
- `createdAt`：创建时间。

### ExamJob

- `id`：试卷生成任务 ID。
- `userId`：关联用户。
- `grade`：学段 / 年级。
- `subject`：科目。
- `knowledgePoints`：知识点。
- `questionTypes`：题型。
- `count`：题目数量。
- `difficulty`：难度，可为空。
- `status`：`queued` / `running` / `succeeded` / `failed` / `cancelled`。
- `costCredits`：消耗额度。
- `provider`：`mock` / 后续真实 provider。
- `errorMessage`：失败原因，可为空。
- `createdAt`：创建时间。
- `completedAt`：完成时间，可为空。

### ExamPaper

- `id`：试卷 ID。
- `userId`：关联用户。
- `jobId`：关联 `ExamJob`。
- `title`：试卷标题。
- `grade`：学段 / 年级。
- `subject`：科目。
- `questions`：题目结构化 JSON 草案。
- `answerKey`：答案与解析结构化 JSON 草案。
- `exportUrls`：后续导出文件地址集合，MVP 可为空。
- `createdAt`：创建时间。

### CreditLedger

- `id`：账本流水 ID。
- `userId`：关联用户。
- `direction`：`credit` / `debit` / `reserve` / `release`。
- `amount`：额度变化数量。
- `reason`：`signup_bonus` / `image_generation` / `exam_generation` / `manual_adjustment` / `refund`。
- `refType`：关联对象类型，可为空。
- `refId`：关联对象 ID，可为空。
- `balanceAfter`：变更后余额。
- `createdAt`：创建时间。

## DTO 草案

- `UserDTO`：`id`、`phoneMasked`、`displayName`、`avatarUrl`。
- `AuthSessionDTO`：`expiresAt`、`isAuthenticated`。
- `QuotaSummaryDTO`：`availableCredits`、`reservedCredits`、`lifetimeCredits`。
- `GenerationJobDTO`：`id`、`status`、`prompt`、`scene`、`style`、`costCredits`、`createdAt`、`completedAt`、`errorMessage`。
- `GeneratedAssetDTO`：`id`、`jobId`、`url`、`thumbnailUrl`、`width`、`height`、`createdAt`。
- `ExamJobDTO`：`id`、`status`、`grade`、`subject`、`knowledgePoints`、`questionTypes`、`count`、`difficulty`、`costCredits`、`createdAt`、`completedAt`、`errorMessage`。
- `ExamPaperDTO`：`id`、`jobId`、`title`、`grade`、`subject`、`questions`、`answerKey`、`exportUrls`、`createdAt`。
- `CreditLedgerDTO`：`id`、`direction`、`amount`、`reason`、`refType`、`refId`、`balanceAfter`、`createdAt`。

## Mock / Adapter 边界

- `mock` 层用于本地和早期 MVP：固定验证码、固定用户、内存或静态 JSON 数据、模拟任务状态、模拟生成资产和试卷结果。
- `adapter` 层定义真实服务替换点：短信、auth session、额度账本、AI 生图、试卷生成、资产存储和支付。
- frontend 只依赖 DTO 与状态枚举，不依赖 provider 细节。
- backend 后续实现时必须先保留 mock provider，再逐步替换真实 provider。
- 真实 provider 的密钥、token、secret 不写入文档、代码或 dashboard JSON。
- 真实失败重试、幂等、扣费回滚和审计策略留给后续任务细化。

## Agent 分工

- `yuan-control`：维护任务节奏、确认 TWA 编号、阻止 Dev OS 治理任务与 Web App 业务任务混用。
- `yuan-architect`：维护本架构基线、API contract、概念数据模型、Mock/Adapter 边界和事实源同步。
- `yuan-frontend`：在 TWA-001 之后按已冻结路由与 DTO 实现 App Shell 和业务 UI；不得自行新增 API contract 或 schema。
- `yuan-backend`：在 TWA-002 之后按 contract 实现 mock/adapter 后端；不得跳过 mock 直接接真实短信、模型或支付。
- `yuan-reviewer`：按任务文档、事实源和验证命令审查边界，重点检查未新增真实业务能力、未修改 dashboard schema、未修改数据库 schema。

## 后续拆分

- `TWA-001`：Web App App Shell + 首页 / 工作台 UI。
- `TWA-002`：手机号登录 Mock / Auth Contract。
- `TWA-003`：营销生图工作台 Mock 流程。
- `TWA-004`：试卷生成工作台 Mock 流程。
- `TWA-005`：我的作品 / 生成记录。
- `TWA-006`：额度 / 次数展示与消费 Mock。
- `TWA-007`：Web App 响应式移动端适配第一轮。

## 实现边界

- 不实现真实业务功能。
- 不新增真实 API 文件。
- 不修改数据库 schema。
- 不接真实短信、真实模型或支付。
- 不做 UI shell 实现。
- 不修改 dashboard schema。
- 不提交、不 push。

## Closeout 记录

- 已创建 TWA-000 文档：`docs/project-os/tasks/web-app/TWA-000-Web-App-MVP-架构冻结与开发基线.md`。
- 已更新 `docs/project-os/tasks/web-app/README.md`，明确 Web App 任务统一使用 `TWA-xxx`，Dev OS / Project OS 治理任务继续使用 `T-xxx`。
- 已同步 `TASK_BOARD.md`、dashboard summary、两份 dashboard JSON、`CHANGELOG.md`、`ROADMAP.md`、`RISKS.md`、`yuan-control.md`、`yuan-architect.md`。
- 已更新 `scripts/dev-os-validate.mjs` 支持 `T-xxx` 与 `TWA-xxx`，并继续忽略 `web-app/README.md` 这类非任务文档。
- dashboard schema：未修改。
- 新增脚本：未新增，仅更新既有 validator。
- 业务功能：未进入真实登录 / 生图 / 试卷 / 支付；未新增真实 API 文件；未修改数据库 schema；未做 UI shell 实现。
- 验证命令：`npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty`、`cmp -s`、`git diff --check` 已由 yuan-control 执行通过。
- reviewer / gpt-5.3-codex 二审结果：只读二审发现 dashboard roadmap / risk / SCHEMA 文案漂移与后续任务命名不一致；yuan-control 已修复并重跑验证。
- commit / push 结果：7ed43d6 创建 TWA-000 Web App MVP 架构冻结与开发基线，已 push 到 origin/main。
