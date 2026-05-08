# Web App 任务线

本目录用于归档 Web App 业务功能任务文档。TWA-000 是 Web App 任务线启动任务，只冻结 MVP 架构与开发基线，不实现真实业务功能。

## 命名规则

- Dev OS / Project OS 治理任务继续使用 `T-xxx`，统一放在 `docs/project-os/tasks/dev-os/`。
- Web App 业务任务统一使用 `TWA-xxx`，统一放在 `docs/project-os/tasks/web-app/`。
- `README.md` 只是任务线说明，不作为任务文档，不进入 dashboard `tasks`。
- `TWA-000` 是 Web App 任务线启动任务，用于冻结 MVP 架构、范围、概念 contract、概念数据模型、Mock/Adapter 边界和后续拆分。

## 后续建议任务

- `TWA-001`：Web App App Shell + 首页 / 工作台 UI。
- `TWA-002`：手机号登录 Mock / Auth Contract。
- `TWA-003`：营销生图工作台 Mock 流程。
- `TWA-004`：试卷生成工作台 Mock 流程。
- `TWA-005`：我的作品 / 生成记录。
- `TWA-006`：额度 / 次数展示与消费 Mock。
- `TWA-007`：Web App 响应式移动端适配第一轮。

## 当前边界

- Phase 1 技术栈、API 契约和数据模型冻结前，本目录不承诺真实 API、数据库 schema、支付方案或第三方 AI 服务接入。
- 本任务线不得复用 Dev OS 的 `T-xxx` 编号，避免治理任务与 Web App 业务任务混用。
