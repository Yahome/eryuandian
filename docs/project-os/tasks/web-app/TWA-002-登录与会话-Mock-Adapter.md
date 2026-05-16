id: TWA-002
title: 登录与会话 Mock / Adapter
owner: yuan-architect
status: in_progress
priority: P0
progress: 70

# TWA-002 登录与会话 Mock / Adapter

## 任务背景

TWA-001 已完成技术冻结与 App Shell 基础收口。进入 TWA-002 前，必须先明确“登录与会话”的 Mock/Adapter 边界，避免 frontend/backend 直接越界实现真实短信、真实鉴权或真实数据库能力。

本任务当前仅做前置架构与事实源同步，不写业务代码。

## 当前目标（实现前架构冻结阶段）

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
  - request: 无 body，由当前 mock session context 注销
  - response: `{ success: true, data: { logged_out: true, cleared: true }, error: null }`

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
- TWA-002 任务状态统一：`owner: yuan-architect`、`status: in_progress`、`progress: 70`。
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
- progress: `70`
- 说明：TWA-002A 实现前架构冻结已完成；下一轮可生成 frontend/backend 实现 prompt，但本轮未放行业务代码实现。

## TWA-002A 实现前架构冻结说明

# TWA-002A 登录与会话 Mock / Adapter 实现前架构冻结说明

## 1 总体判断
- 结论：TWA-002 已具备“实现前冻结”条件，建议将进度从 `30` 推进到 `70`（架构与契约冻结完成，尚未进入代码实现）。
- 边界：本阶段仅允许 `Mock / Adapter`，禁止真实登录、真实短信、真实微信授权、真实 API handler、DB schema/migration、secret。
- 基线关系：`TWA-000` 为历史基线；若字段/路径与 `TWA-002` 不一致，以 `TWA-002` 为准。
- 风险口径：`R-007/R-008/R-009/R-010` 视为后续任务持续风险；`R-011` 为本阶段核心风险（Mock/Adapter 边界漂移）。

## 2 Auth 路由与页面信息架构
- 主路由：`/[locale]/login`（同页承载登录/注册 Tab）。
- 暂不新增：`/[locale]/register`（不单独建路由）。
- 查询参数：保留 `return_to`，用于登录成功后跳转。
- 登录成功跳转：优先 `return_to`，否则 `/{locale}/app/dashboard`。
- 受保护页当前策略：未登录访问 `/{locale}/app` 与 `/dashboard` 仍静态可见，仅显示 mock session 状态；真实重定向留到后续真实阶段。
- 设计稿映射：
  - Desktop：左右分栏，右侧 `AuthCard` 承载全部交互。
  - Mobile：单列 `AuthCard`，登录/注册同页切换，微信入口与能力宣传卡保留为 mock/静态态。

## 3 UI 状态机
- 核心状态：`idle`、`editing`、`requesting_code`、`code_cooldown`、`submitting`、`auth_success_mock`、`error`。
- 关键事件：`SWITCH_TAB`、`SEND_CODE`、`SEND_CODE_OK/FAIL`、`SUBMIT_LOGIN`、`LOGIN_OK/FAIL`、`LOGOUT`。
- 约束：
  - 登录/注册 Tab 仅切换表单视图，不切路由。
  - 微信登录入口为 `disabled/coming_later/mock`。
  - 图形验证码与短信验证码均为 mock 交互，不触达真实外部服务。
  - 协议勾选 (`agree_terms`) 未选中时不可提交。

## 4 API契约冻结（endpoints, DTO, session语义, logout语义, error code示例）
- 冻结 endpoints（仅此四个）：
  - `POST /api/auth/send-code`
  - `POST /api/auth/login-phone`
  - `GET /api/auth/session`
  - `POST /api/auth/logout`
- 历史保留但禁用：旧 `POST /api/auth/login` 与 camelCase（`code_id` / `expires_at`）仅作历史参考，不进入实现。
- 字段命名统一：`snake_case`（`code_id`, `cooldown_seconds`, `agree_terms`, `expires_at`）。

```json
POST /api/auth/send-code
req: {
  "phone": "string",
  "agree_terms": true,
  "captcha_token": "string|null"
}
resp: {
  "code_id": "string",
  "cooldown_seconds": 60,
  "expires_at": "ISO-8601 string",
  "delivery": "mock"
}
```

```json
POST /api/auth/login-phone
req: {
  "phone": "string",
  "code": "string",
  "code_id": "string",
  "agree_terms": true,
  "return_to": "string|null"
}
resp: {
  "session": {
    "session_id": "string",
    "user_id": "string",
    "expires_at": "ISO-8601 string",
    "is_mock": true
  },
  "redirect_to": "string"
}
```

```json
GET /api/auth/session
resp(authenticated): {
  "authenticated": true,
  "session": {
    "session_id": "string",
    "user_id": "string",
    "expires_at": "ISO-8601 string",
    "is_mock": true
  }
}
resp(anonymous): {
  "authenticated": false,
  "session": null
}
```

```json
POST /api/auth/logout
req: {}
resp: {
  "cleared": true
}
```

- Session 语义：mock 会话，仅用于前后端联调与 UI 状态驱动，不承诺真实安全属性。
- Logout 语义：幂等；无论是否已有会话，返回结构一致并清空当前 mock 会话态。
- ErrorDTO 与错误码以本节后续“Error Code 冻结（含 endpoint）”为准，统一使用无 `AUTH_` 前缀的 `INVALID_PHONE`、`INVALID_CODE` 等命名。

## 5 Mock/Adapter 分层
- `UI层`：页面与组件，仅消费用例层状态与事件。
- `用例层`：`sendCode/login/getSession/logout` 编排与状态机。
- `契约层`：冻结 DTO、错误码、session 语义（本说明即 API_CONTRACT）。
- `Adapter 接口层`：定义 `AuthAdapter` 抽象，隔离未来真实实现。
- `Mock Provider 层`：内存/本地 mock 数据源，实现 Adapter 接口。
- 冻结要求：本轮不落真实网络 handler，只允许服务层与接口层 mock 实现。

## 6 frontend/backend 分工与并行
- 本轮后可放行下一轮实现 prompt，前提：`API_CONTRACT` 以本说明为唯一冻结源。
- Frontend 并行任务：
  - 实现 locale-aware `/{locale}/login` 同页登录/注册 mock UI（desktop + mobile）。
  - 处理 `return_to`、Tab 切换、协议勾选、禁用/coming later 入口。
  - 在 `/{locale}/app` 与 `/dashboard` 展示 mock session 状态，不做真实鉴权重定向。
- Backend 并行任务：
  - 实现纯服务层 mock 与 `Adapter interfaces`。
  - 输出稳定 DTO 校验与错误码映射。
  - 不创建真实 network handler，不接入外部服务，不落库。

## 7 事实源同步建议
- 将以下内容同步为事实源单一口径：
  - TWA-002 owner/status/progress（建议更新至 `70`）。
  - 四个冻结 endpoints 与 snake_case 字段。
  - `/{locale}/login` 同页双 Tab、`/{locale}/register` 暂不建。
  - `return_to` 与成功跳转规则。
  - `TWA-000` 从属关系与“冲突时以 TWA-002 为准”。
  - `R-007~R-010` 持续风险、`R-011` 边界漂移风险。

## 8 reviewer 验收重点
- 是否严格未越界到真实登录/短信/微信/API handler/DB/secret。
- 是否仅使用冻结 endpoints，且 DTO 全量 snake_case。
- 是否移除新实现中对旧 `/api/auth/login` 与 camelCase 字段的依赖。
- 是否满足同页登录/注册 Tab、`return_to` 跳转、成功默认落 `/{locale}/app/dashboard`。
- 是否保持 `/{locale}/app` 与 `/dashboard` 当前静态可见并显示 mock session 状态。
- 是否保证 frontend/backend 可按本契约并行推进且无接口歧义。

### TWA-002A 架构冻结补充（缺失项）

#### 1. UI 状态机冻结（逐项覆盖）
| 状态 | TWA-002 后续实现要求 | 留到真实 Provider |
|---|---|---|
| 初始态 | 必须实现：页面加载后的默认壳态 | 无 |
| 手机号输入态 | 必须实现：手机号输入、格式本地校验 | 无 |
| 发送验证码中 | 必须实现：调用 `POST /api/auth/send-code` 时禁用按钮与防重复提交 | 无 |
| 冷却倒计时 | 必须实现：按 `cooldown_seconds` 本地倒计时 | 真实风控阈值策略细节 |
| 验证码输入态 | 必须实现：持有 `code_id` 后允许输入验证码并提交 | 无 |
| 未勾选协议 | 必须实现：前端阻断提交并提示；对应错误码 `TERMS_NOT_AGREED` | 无 |
| 提交登录中 | 必须实现：调用 `POST /api/auth/login-phone` 的 loading/禁用态 | 无 |
| 登录成功 | 必须实现：写入会话上下文并跳转已登录页 | 无 |
| 验证码错误 | 必须实现：接收 `INVALID_CODE` 并留在验证码输入态 | 错误次数上限/额外风控 |
| 验证码过期 | 必须实现：接收 `CODE_EXPIRED` 并引导重新发码 | 失效窗口细节 |
| 会话检查中 | 必须实现：启动时调用 `GET /api/auth/session` | 无 |
| 已登录会话态 | 必须实现：有有效 `session + user` 时进入 | 无 |
| 未登录态 | 必须实现：`session=null,user=null` 时进入 | 无 |
| logout 完成态 | 必须实现：调用 `POST /api/auth/logout` 成功后清理前端会话并回未登录态 | 无 |

#### 2. DTO 冻结（Public Contract）
```ts
type SendCodeRequest = { phone: string; scene: "login" };
type SendCodeResponse = { code_id: string; cooldown_seconds: number; expires_at: string; delivery: "mock" };

type LoginPhoneRequest = { phone: string; code_id: string; code: string; agree_terms: boolean };
type LoginPhoneResponse = { session: SessionDTO; user: UserDTO };

type SessionDTO = { session_id: string; user_id: string; status: "active" | "revoked" | "expired"; issued_at: string; expires_at: string; last_seen_at?: string; is_mock: true };
type UserDTO = { id: string; phone: string; phone_masked: string; nickname: string | null; membership: "free" | "pro"; credits: number };

type LogoutRequest = Record<string, never>; // A 语义：无 body
type LogoutResponse = { logged_out: true; cleared: true };

type ErrorDTO = {
  code:
    | "INVALID_PHONE" | "UNSUPPORTED_SCENE" | "SEND_CODE_TOO_FREQUENT"
    | "CODE_ID_NOT_FOUND" | "INVALID_CODE" | "CODE_EXPIRED"
    | "TERMS_NOT_AGREED" | "SESSION_NOT_FOUND" | "SESSION_EXPIRED";
  message: string;
  request_id: string;
  details?: Record<string, string | number | boolean | null>;
};
```
`Public DTO` 是对外 API 稳定契约；`DATA_MODEL` 是内部概念模型（如验证码哈希、尝试次数、provider 原始回包、风控标签、会话存储键），不可直接外露。

#### 3. Session 查询语义冻结
1. `GET /api/auth/session`：无会话时返回 `200`，`success: true`，`data: { session: null, user: null }`。
2. 若请求携带会话但已过期：返回 `401` + `SESSION_EXPIRED`，并清理失效会话标识。
3. `/api/auth/session` 成功态默认附带 `user`（避免首屏二次请求）。
4. `/api/me` 仅用于已登录用户资料读取；未登录/过期分别返回 `SESSION_NOT_FOUND` / `SESSION_EXPIRED`。`/api/auth/session` 负责“鉴权态探测”，`/api/me` 负责“用户资料域”。

#### 4. Logout 语义冻结（选择 A）
- 选择：`POST /api/auth/logout`，**无 body**，由当前 session context 注销。
- 理由：与 cookie/session 模式一致、客户端不传 sessionId 更安全、接口更简洁、避免多端参数歧义。

#### 5. Error Code 冻结（含 endpoint）
| Error Code | 适用 Endpoint |
|---|---|
| INVALID_PHONE | `POST /api/auth/send-code`, `POST /api/auth/login-phone` |
| UNSUPPORTED_SCENE | `POST /api/auth/send-code` |
| SEND_CODE_TOO_FREQUENT | `POST /api/auth/send-code` |
| CODE_ID_NOT_FOUND | `POST /api/auth/login-phone` |
| INVALID_CODE | `POST /api/auth/login-phone` |
| CODE_EXPIRED | `POST /api/auth/login-phone` |
| TERMS_NOT_AGREED | `POST /api/auth/login-phone` |
| SESSION_NOT_FOUND | `GET /api/me` |
| SESSION_EXPIRED | `GET /api/auth/session`, `GET /api/me` |

统一 `ErrorDTO` JSON 示例：
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_CODE",
    "message": "Verification code is invalid.",
    "request_id": "req_20260516_01",
    "details": {
      "endpoint": "/api/auth/login-phone"
    }
  }
}
```

#### 6. Adapter 粒度冻结

`SmsAdapter`
- `sendCode(input: { phone: string; scene: "login"; code_id: string; ttl_seconds: number }): Promise<{ accepted: true; provider_message_id: string }>`
- `verifyCode(input: { phone: string; scene: "login"; code_id: string; code: string }): Promise<{ ok: true } | { ok: false; reason: "CODE_ID_NOT_FOUND" | "INVALID_CODE" | "CODE_EXPIRED" }>`
- 责任边界：仅处理短信/验证码 provider 交互与结果归一化，不负责会话创建、协议校验、HTTP 响应封装。

`SessionAdapter`
- `create(input: { user_id: string; ttl_seconds: number; context: { ip?: string; ua?: string } }): Promise<SessionDTO>`
- `getCurrent(input: { session_token?: string }): Promise<{ state: "active" | "not_found" | "expired"; session: SessionDTO | null; user: UserDTO | null }>`
- `revokeCurrent(input: { session_token?: string }): Promise<{ revoked: boolean }>`
- 责任边界：仅处理会话生命周期（创建/查询/失效/过期判定）；不处理验证码逻辑与短信发送。

#### 7. contracts 目录/package 决策
TWA-002B 阶段先在 `apps/web` 内维护本地 `types + docs contract`，本轮不新建共享 `packages/contracts`。待 backend mock/service 并行开发开始后再评估抽离共享包，避免当前超前工程化。

### yuan-control 收口结论

- TWA-002A 已完成实现前架构冻结。
- TWA-002 从 `progress: 30` 推进到 `progress: 70`。
- owner 仍为 `yuan-architect`，status 仍为 `in_progress`。
- 下一轮可生成 `yuan-frontend` 与 `yuan-backend` 实现 prompt；允许并行，但必须以本节与 `API_CONTRACT.md` 为共享契约。
- 本轮未创建业务代码、真实 API handler、数据库 schema / migration、短信 provider、真实会话存储或 secret。
