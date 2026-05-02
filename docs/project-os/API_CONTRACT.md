# API_CONTRACT：前后端接口契约草案

状态：draft
更新时间：2026-05-02

## 说明

本文档是首期 API 契约草案，用于前后端并行开发前对齐字段和边界。最终实现前，`yuan-architect` 需要进一步细化状态码、错误码、鉴权方式和请求限制。

## 通用约定

Base path 建议：`/api`

通用响应：

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

错误响应：

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

### 发送验证码

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

### 手机号登录 / 注册

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
