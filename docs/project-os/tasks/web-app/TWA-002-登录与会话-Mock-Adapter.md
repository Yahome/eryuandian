id: TWA-002
title: 登录与会话 Mock / Adapter
owner: yuan-architect
status: in_progress
priority: P0
progress: 30

# TWA-002 登录与会话 Mock / Adapter

## 任务背景

TWA-001 已完成技术冻结与 App Shell 基础收口。进入 TWA-002 前，必须先明确“登录与会话”的 Mock/Adapter 边界，避免 frontend/backend 直接越界实现真实短信、真实鉴权或真实数据库能力。

本任务当前仅做前置架构与事实源同步，不写业务代码。

## 当前目标（前置规划阶段）

- 冻结登录与会话的 Mock/Adapter 分层边界。
- 定义允许 frontend 依赖的最小契约草案（仅 mock）。
- 定义 backend 后续实现时的 adapter 替换点（仅接口概念）。
- 明确允许/禁止范围与 reviewer 验收清单。
- 同步 TASK_BOARD / ROADMAP / SOURCE_OF_TRUTH / dashboard / agent 分工状态。

## Mock / Adapter 边界（草案）

### 分层约定

1. `frontend` 只依赖 DTO 与状态枚举，不依赖真实短信供应商、真实 token 签发或真实存储实现。
2. `backend` 后续先实现 mock auth provider，再通过 adapter 接口替换真实短信/会话存储。
3. adapter 是“替换点”，不是本任务要落地的真实 provider。

### 登录契约草案（仅 Mock）

以下仅是 TWA-002 前置契约草案，不代表真实 API handler 已实现：

- `POST /api/auth/send-code`
  - request: `{ phone: string, scene: "login" }`
  - response: `{ success: true, data: { code_id: string, cooldown_seconds: number, delivery: "mock" }, error: null }`
- `POST /api/auth/login-phone`
  - request: `{ phone: string, code: string, code_id: string, agree_terms: boolean }`
  - response: `{ success: true, data: { user: UserDTO, session: SessionDTO }, error: null }`
- `GET /api/auth/session`
  - response: `{ success: true, data: { session: SessionDTO | null }, error: null }`
- `POST /api/auth/logout`
  - request: `{ session_id: string }`
  - response: `{ success: true, data: { revoked: boolean }, error: null }`

### 会话概念字段（仅概念，不落库）

- `session_id`：会话标识。
- `user_id`：关联用户。
- `status`：`active` / `revoked` / `expired`。
- `issued_at`：签发时间。
- `expires_at`：过期时间。
- `last_seen_at`：最后活跃时间。
- `client_meta`：终端信息摘要（可空）。

## 允许 / 禁止范围

### 允许

- 新建并维护本任务文档。
- 同步 Project OS 事实源与 dashboard 状态。
- 在 `API_CONTRACT.md`、`DATA_MODEL.md` 补充 Mock/Adapter 契约草案和会话概念字段。
- 更新风险、决策、agent 分工的文档层说明。

### 禁止

- 不创建或修改 `apps/web`、后端源码。
- 不创建真实 API handler。
- 不创建数据库 schema/migration。
- 不接真实短信/登录/支付/生图/试卷。
- 不保存 secret/token/key。
- 不修改 dashboard schema。

## 后续分工（TWA-002 放行后）

- `yuan-frontend`
  - 基于已冻结 DTO 与状态枚举实现登录页/会话态 UI 流程（mock 数据源）。
  - 不直连真实短信或真实鉴权服务。
- `yuan-backend`
  - 实现 mock auth service 与 adapter 接口占位。
  - 提供可替换的短信 adapter、会话 adapter 接口定义；默认 provider 为 mock。
- `yuan-reviewer`
  - 按允许/禁止范围验收：无真实 handler、无 DB schema、无 secret、无 dashboard schema 变更。
  - 验证 contract 与数据字段与事实源同步一致。

## 验收标准

- 已创建 `TWA-002` 任务文档并写明 Mock/Adapter 边界。
- `TASK_BOARD`、`ROADMAP`、`SOURCE_OF_TRUTH`、`dashboard/summary`、两个 dashboard JSON 已同步 TWA-002 进行中状态。
- TWA-002 任务状态统一：`owner: yuan-architect`、`status: in_progress`、`progress: 30`（允许 ±5 的文字描述波动）。
- `API_CONTRACT.md`、`DATA_MODEL.md` 仅补“Mock/Adapter 草案 + 会话概念字段”，且明确“不代表真实实现”。
- 未修改业务代码、未新增真实 API、未改数据库 schema、未改 dashboard schema。
- 验证命令通过：
  - `node scripts/dev-os-validate.mjs`
  - `jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`
  - `cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`
  - `git diff --check`

## 当前状态

- status: `in_progress`
- owner: `yuan-architect`
- progress: `30`
- 说明：当前仅前置规划与事实源同步；未放行 frontend/backend 业务实现。
