# API_CONTRACT：前后端接口契约草案

状态：草稿（内部标识：`draft`）
更新时间：2026-05-16

## 说明

本文档是首期 API 契约草案，用于前后端并行开发前对齐字段和边界。最终实现前，`yuan-architect` 需要进一步细化状态码、错误码、鉴权方式和请求限制。

注意：本文档包含 TWA-002 的 Mock / Adapter 契约补充，均为实现前冻结契约，不代表真实 API handler、真实短信通道、真实鉴权或真实数据库实现已落地。

TWA-002 之后，登录与会话契约以“## TWA-002 登录与会话 Mock / Adapter 契约补充（实现前冻结）”为当前实现前冻结基准。TWA-000 与旧账号登录草案仅保留追溯；若路径或字段冲突，以本节为准。

## 通用约定

Base path 建议：`/api`

### 通用成功响应

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### 通用错误响应

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "INVALID_INPUT",
    "message": "参数不合法"
  }
}
```

说明：TWA-002 专属 `ErrorDTO` 可继续扩展 `request_id`、`details`；通用响应与 TWA-002 特化响应并存，逻辑上是“通用基线 + TWA-002 细化”。

## TWA-002 登录与会话 Mock / Adapter 契约补充（实现前冻结）

说明：本节是 TWA-002B / TWA-002C 的唯一实现基准，只定义 Mock / Adapter 约定，不代表真实实现。当前阶段禁止创建真实 API handler、真实短信供应商接入、真实会话存储、数据库 schema / migration 或 secret。

### Endpoint 冻结

- `POST /api/auth/send-code`
- `POST /api/auth/login-phone`
- `GET /api/auth/session`
- `POST /api/auth/logout`

旧 `/api/auth/login`、旧 `/api/auth/sms-code`、camelCase `codeId` / `expiresAt` 仅保留历史追溯，不作为当前实现基准。当前 public DTO 统一使用 snake_case。

### SendCodeRequest / SendCodeResponse

`POST /api/auth/send-code`

请求：

```json
{
  "phone": "13800000000",
  "scene": "login"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "code_id": "mock_code_001",
    "cooldown_seconds": 60,
    "expires_at": "2026-05-16T10:05:00Z",
    "delivery": "mock"
  },
  "error": null
}
```

TypeScript 定稿：

```ts
type SendCodeRequest = {
  phone: string;
  scene: "login";
};

type SendCodeResponse = {
  code_id: string;
  cooldown_seconds: number;
  expires_at: string;
  delivery: "mock";
};
```

当前冻结契约中 `send-code` 不包含 `agree_terms` 或 `captcha_token`。`agree_terms` 由登录提交阶段负责；`captcha_token` 留到真实 provider / 风控阶段。

### LoginPhoneRequest / LoginPhoneResponse

`POST /api/auth/login-phone`

请求：

```json
{
  "phone": "13800000000",
  "code": "123456",
  "code_id": "mock_code_001",
  "agree_terms": true,
  "return_to": "/zh-CN/app/dashboard"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "session": {
      "session_id": "sess_mock_001",
      "user_id": "user_001",
      "status": "active",
      "issued_at": "2026-05-16T10:00:00Z",
      "expires_at": "2026-05-23T10:00:00Z",
      "last_seen_at": "2026-05-16T10:05:00Z",
      "is_mock": true
    },
    "user": {
      "id": "user_001",
      "phone": "13800000000",
      "phone_masked": "138****0000",
      "nickname": "用户001",
      "membership": "free",
      "credits": 20
    },
    "redirect_to": "/zh-CN/app/dashboard"
  },
  "error": null
}
```

TypeScript 定稿：

```ts
type LoginPhoneRequest = {
  phone: string;
  code: string;
  code_id: string;
  agree_terms: boolean;
  return_to?: string | null;
};

type LoginPhoneResponse = {
  session: SessionDTO;
  user: UserDTO;
  redirect_to: string;
};
```

### SessionResponse / SessionDTO / UserDTO

`GET /api/auth/session` 用于“鉴权态探测”；`GET /api/me` 后续仅用于已登录用户资料域读取。

有有效会话时：

```json
{
  "success": true,
  "data": {
    "session": {
      "session_id": "sess_mock_001",
      "user_id": "user_001",
      "status": "active",
      "issued_at": "2026-05-16T10:00:00Z",
      "expires_at": "2026-05-23T10:00:00Z",
      "last_seen_at": "2026-05-16T10:05:00Z",
      "is_mock": true
    },
    "user": {
      "id": "user_001",
      "phone": "13800000000",
      "phone_masked": "138****0000",
      "nickname": "用户001",
      "membership": "free",
      "credits": 20
    }
  },
  "error": null
}
```

无会话时：

```json
{
  "success": true,
  "data": {
    "session": null,
    "user": null
  },
  "error": null
}
```

携带过期会话时：HTTP 401，error code 为 `SESSION_EXPIRED`，并由 mock session context 清理失效标识。

TypeScript 定稿：

```ts
type SessionDTO = {
  session_id: string;
  user_id: string;
  status: "active" | "revoked" | "expired";
  issued_at: string;
  expires_at: string;
  last_seen_at?: string;
  is_mock: true;
};

type UserDTO = {
  id: string;
  phone: string;
  phone_masked: string;
  nickname: string | null;
  membership: "free" | "pro";
  credits: number;
};

type SessionResponse = {
  session: SessionDTO | null;
  user: UserDTO | null;
};
```

当前冻结契约不使用 `authenticated: true` 或 `authenticated: false` 字段。

### LogoutRequest / LogoutResponse

`POST /api/auth/logout` 选择无 body 方案，由当前 session context 注销。理由：更贴近 cookie/session 模式，客户端不传 `session_id` 更安全，也避免多端参数歧义。

请求：无 body。

响应：

```json
{
  "success": true,
  "data": {
    "logged_out": true,
    "cleared": true
  },
  "error": null
}
```

TypeScript 定稿：

```ts
type LogoutRequest = Record<string, never>;

type LogoutResponse = {
  logged_out: true;
  cleared: true;
};
```

### ErrorDTO 与错误码

```ts
type ErrorDTO = {
  code:
    | "INVALID_PHONE"
    | "UNSUPPORTED_SCENE"
    | "SEND_CODE_TOO_FREQUENT"
    | "CODE_ID_NOT_FOUND"
    | "INVALID_CODE"
    | "CODE_EXPIRED"
    | "TERMS_NOT_AGREED"
    | "SESSION_NOT_FOUND"
    | "SESSION_EXPIRED";
  message: string;
  request_id: string;
  details?: Record<string, string | number | boolean | null>;
};
```

统一错误结构示例：

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

| Error Code | 适用 Endpoint |
|---|---|
| `INVALID_PHONE` | `POST /api/auth/send-code`, `POST /api/auth/login-phone` |
| `UNSUPPORTED_SCENE` | `POST /api/auth/send-code` |
| `SEND_CODE_TOO_FREQUENT` | `POST /api/auth/send-code` |
| `CODE_ID_NOT_FOUND` | `POST /api/auth/login-phone` |
| `INVALID_CODE` | `POST /api/auth/login-phone` |
| `CODE_EXPIRED` | `POST /api/auth/login-phone` |
| `TERMS_NOT_AGREED` | `POST /api/auth/login-phone` |
| `SESSION_NOT_FOUND` | `GET /api/me` |
| `SESSION_EXPIRED` | `GET /api/auth/session`, `GET /api/me` |

### Public DTO 与内部概念模型边界

Public DTO 是前后端共享的稳定契约；`DATA_MODEL.md` 中的 `AuthLoginCode` / `AuthSession` 是内部概念模型，可能包含验证码摘要、尝试次数、provider 原始回包、风控标签、存储 key 等字段，不等价于 API 暴露字段，不得直接外露。

### Adapter 接口冻结

`SmsAdapter`：

- `sendCode(input: { phone: string; scene: "login"; code_id: string; ttl_seconds: number }): Promise<{ accepted: true; provider_message_id: string }>`
- `verifyCode(input: { phone: string; scene: "login"; code_id: string; code: string }): Promise<{ ok: true } | { ok: false; reason: "CODE_ID_NOT_FOUND" | "INVALID_CODE" | "CODE_EXPIRED" }>`
- 责任边界：处理验证码 provider 交互与结果归一化，不负责会话创建、协议校验或 HTTP 响应封装。

`SessionAdapter`：

- `create(input: { user_id: string; ttl_seconds: number; context: { ip?: string; ua?: string } }): Promise<SessionDTO>`
- `getCurrent(input: { session_token?: string }): Promise<{ state: "active" | "not_found" | "expired"; session: SessionDTO | null; user: UserDTO | null }>`
- `revokeCurrent(input: { session_token?: string }): Promise<{ revoked: boolean }>`
- 责任边界：处理会话生命周期，不处理短信验证码逻辑。

### 手机号登录 / 注册（历史草案，TWA-002 后以“登录并建立会话”Mock 契约为准）

`POST /api/auth/login-phone`

请求：

```json
{
  "phone": "13800000000",
  "code": "123456",
  "agree_terms": true
}
```

响应：

```json
{
  "success": true,
  "data": {
    "token": "jwt-or-session-token",
    "user": {
      "id": "user_001",
      "phone": "13800000000",
      "nickname": "用户001",
      "membership": "free",
      "credits": 20
    }
  },
  "error": null
}
```

## 当前用户

`GET /api/me`

响应：

```json
{
  "success": true,
  "data": {
    "id": "user_001",
    "nickname": "用户001",
    "phone": "13800000000",
    "membership": "free",
    "credits": 20,
    "today_usage": 3
  },
  "error": null
}
```

## 商家营销生图

### 创建生图任务

`POST /api/generations/images`

请求：

```json
{
  "ratio": "1:1",
  "scene": "节日促销",
  "industry": "餐饮",
  "prompt": "生成一张五一小龙虾活动海报",
  "style": "现代清新",
  "source_image_ids": ["file_001"]
}
```

响应：

```json
{
  "success": true,
  "data": {
    "job_id": "img_job_001",
    "status": "queued"
  },
  "error": null
}
```

说明：响应中的 `status: "queued"` 保留 API 枚举值，表示任务处于“排队中”状态。

### 查询生图任务

`GET /api/generations/images/{job_id}`

响应：

```json
{
  "success": true,
  "data": {
    "job_id": "img_job_001",
    "status": "succeeded",
    "results": [
      {"id": "asset_001", "url": "/assets/asset_001.png"}
    ],
    "credits_used": 1
  },
  "error": null
}
```

说明：响应中的 `status: "succeeded"` 保留 API 枚举值，表示任务已完成。

## 智能生成试卷

### 创建试卷任务

`POST /api/generations/papers`

请求：

```json
{
  "grade": "三年级",
  "subject": "数学",
  "textbook_version": "人教版",
  "scope": "第二单元",
  "exam_type": "单元测试",
  "difficulty": "medium",
  "question_count": 20,
  "question_types": ["选择题", "填空题", "应用题"]
}
```

响应：

```json
{
  "success": true,
  "data": {
    "job_id": "paper_job_001",
    "status": "queued"
  },
  "error": null
}
```

说明：响应中的 `status: "queued"` 保留 API 枚举值，表示任务处于“排队中”状态。

### 查询试卷任务

`GET /api/generations/papers/{job_id}`

响应：

```json
{
  "success": true,
  "data": {
    "job_id": "paper_job_001",
    "status": "succeeded",
    "preview_markdown": "# 三年级数学第二单元测试...",
    "export_urls": {
      "word": "/exports/paper_job_001.docx",
      "pdf": "/exports/paper_job_001.pdf"
    },
    "credits_used": 1
  },
  "error": null
}
```

说明：响应中的 `status: "succeeded"` 保留 API 枚举值，表示任务已完成。

## 生成记录

`GET /api/history?type=image|paper&page=1&page_size=20`

响应：

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "record_001",
        "type": "image",
        "title": "五一小龙虾活动海报",
        "created_at": "2026-05-02T12:00:00Z",
        "thumbnail_url": "/assets/asset_001.png"
      }
    ],
    "page": 1,
    "page_size": 20,
    "total": 1
  },
  "error": null
}
```

## Dev OS Dashboard

`GET /api/dev-os/dashboard`

数据来源：

- `docs/project-os/dashboard.json`
- `docs/project-os/TASK_BOARD.md`
- `docs/project-os/agents/*.md`
- `docs/project-os/RISKS.md`
- `docs/project-os/DECISIONS.md`

首期可由静态构建脚本生成 JSON，不需要一开始接数据库。
