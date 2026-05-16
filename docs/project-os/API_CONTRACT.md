# API_CONTRACT：前后端接口契约草案

状态：草稿（内部标识：`draft`）
更新时间：2026-05-16

## 说明

本文档是首期 API 契约草案，用于前后端并行开发前对齐字段和边界。最终实现前，`yuan-architect` 需要进一步细化状态码、错误码、鉴权方式和请求限制。

注意：本文档包含 TWA-002 的 Mock/Adapter 契约补充，均为前置规划草案，不代表真实 API handler、真实短信通道、真实鉴权或真实数据库实现已落地。

TWA-002 之后，登录与会话契约以“## TWA-002 登录与会话 Mock / Adapter 契约补充（草案）”为当前前置规划基准；下方“账号登录”中的旧 `/api/auth/sms-code` 与旧 token 响应保留为历史草案，仅用于追溯，不作为后续实现基准。

## 通用约定

Base path 建议：`/api`

通用响应（`success` 为 API 布尔字段，`true` 表示请求成功，不是任务状态枚举）：

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

错误响应（`success` 为 API 布尔字段，`false` 表示请求失败，不是任务状态枚举）：

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

## 账号登录

### 发送验证码（历史草案，TWA-002 后已由 `/api/auth/send-code` Mock 契约替代）

`POST /api/auth/sms-code`

请求：

```json
{
  "phone": "13800000000"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "cooldown_seconds": 60
  },
  "error": null
}
```

## TWA-002 登录与会话 Mock / Adapter 契约补充（草案）

说明：本节只定义 Mock/Adapter 约定，不代表真实实现。当前阶段禁止创建真实 API handler、真实短信供应商接入和真实会话存储。

### 发送验证码（Mock 约束）

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
    "delivery": "mock"
  },
  "error": null
}
```

### 登录并建立会话（Mock 约束）

`POST /api/auth/login-phone`

请求：

```json
{
  "phone": "13800000000",
  "code": "123456",
  "code_id": "mock_code_001",
  "agree_terms": true
}
```

响应：

```json
{
  "success": true,
  "data": {
    "session": {
      "session_id": "sess_mock_001",
      "status": "active",
      "issued_at": "2026-05-16T10:00:00Z",
      "expires_at": "2026-05-23T10:00:00Z"
    },
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

### 查询当前会话（Mock 约束）

`GET /api/auth/session`

响应：

```json
{
  "success": true,
  "data": {
    "session": {
      "session_id": "sess_mock_001",
      "status": "active",
      "issued_at": "2026-05-16T10:00:00Z",
      "expires_at": "2026-05-23T10:00:00Z",
      "last_seen_at": "2026-05-16T10:05:00Z"
    }
  },
  "error": null
}
```

### 注销会话（Mock 约束）

`POST /api/auth/logout`

请求：

```json
{
  "session_id": "sess_mock_001"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "revoked": true
  },
  "error": null
}
```

### Adapter 接口占位（仅边界说明）

- `SmsAdapter`：后续真实实现可替换 mock 发送逻辑；TWA-002 当前固定 `delivery: "mock"`。
- `SessionAdapter`：后续真实实现可替换 mock 会话存储与过期策略；TWA-002 当前只定义字段，不定义存储实现。

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
