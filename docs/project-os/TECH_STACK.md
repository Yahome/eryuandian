# TECH_STACK：技术栈草案

状态：draft
更新时间：2026-05-02

## 说明

本文档是首期技术栈草案，尚未最终锁定。正式开发前应由 `yuan-architect` 基于部署环境、开发效率、维护成本做一次确认。

## 推荐方向

### 前端

推荐：

- React / Next.js 或 Vite + React
- TypeScript
- Tailwind CSS 或等价原子化 CSS
- 组件化卡片与表单系统

理由：

- 适合快速实现 PC / 移动端响应式界面。
- 适合还原当前设计稿中的卡片式 SaaS 风格。
- 与 Codex 辅助开发兼容度高。

### 后端

候选：

- Next.js API Routes / Route Handlers
- 或 FastAPI

首期若追求速度，可以先采用前后端同仓、同部署的 Next.js 方案；若 AI 服务、文件导出、异步任务较复杂，可拆 FastAPI。

### 数据库

候选：

- PostgreSQL：正式业务数据。
- SQLite：本地原型或轻量 MVP。

首期数据模型必须先稳定，再决定数据库。

### 文件存储

候选：

- 本地文件存储：开发阶段。
- S3 兼容对象存储：生产阶段。

### AI 服务

生图：

- 通过已有 CPA / OpenAI-compatible endpoint 接入。
- 模型能力以实际接口返回为准。

试卷生成：

- 使用文本模型生成结构化 Markdown / JSON。
- 后续再接 Word / PDF 导出。

## Dev OS Dashboard

首期推荐静态读取：

- `docs/project-os/dashboard.json`
- Markdown 文件解析

不要一开始上复杂数据库。

## 待确认问题

- 是否采用 Next.js 全栈。
- 是否需要独立后端服务。
- 生产部署环境。
- 短信验证码服务供应商。
- 文件存储方案。
- Word / PDF 导出方案。
- 生图模型最终选择。

## 决策规则

任何技术栈定稿必须写入 `DECISIONS.md`。
