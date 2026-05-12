# Web App 任务线

本目录用于归档 Web App 业务功能任务文档。TWA-000 是 Web App 任务线启动任务，只冻结 MVP 架构与开发基线，不实现真实业务功能。

## 命名规则

- Dev OS / Project OS 治理任务继续使用 `T-xxx`，统一放在 `docs/project-os/tasks/dev-os/`。
- Web App 业务任务统一使用 `TWA-xxx`，统一放在 `docs/project-os/tasks/web-app/`。
- `README.md` 只是任务线说明，不作为任务文档，不进入 dashboard `tasks`。
- `TWA-000` 是 Web App 任务线启动任务，用于冻结 MVP 架构、范围、概念 contract、概念数据模型、Mock/Adapter 边界和后续拆分。

## 后续任务顺序（B+ 已正式生效）

- `TWA-001`：技术栈冻结 + 移动优先 App Shell / 首页 / 工作台基础。
- `TWA-002`：登录与会话 Mock / Adapter。
- `TWA-003`：额度账本 Mock / Adapter。
- `TWA-004`：营销生图工作台 Mock 流程。
- `TWA-005`：试卷生成工作台 Mock 流程。
- `TWA-006`：我的作品 / 生成记录。
- `TWA-007`：账户 / 商业化占位 + 移动端体验回归。

## 当前边界

- TWA-001 已完成技术冻结与用户最终确认，当前只放行 App Shell / 首页 / 工作台基础静态实现；真实 API、数据库 schema、支付方案或第三方 AI 服务接入仍需后续任务明确放行。
- 本任务线不得复用 Dev OS 的 `T-xxx` 编号，避免治理任务与 Web App 业务任务混用。
