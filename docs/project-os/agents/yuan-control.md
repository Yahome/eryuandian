# yuan-control

状态：活跃（内部标识：`active`）
更新时间：2026-05-08

## 角色

总控 / Orchestrator。

## 职责

- 接收用户需求
- 拆解任务
- 指派给其他 Agent
- 维护 `TASK_BOARD.md`
- 汇总验收结果
- 控制并行开发冲突
- 判断任务是否触发 Architect 前置门禁，并保证 frontend/backend 不在架构说明完成前开工

## 派发规则

`yuan-control` 派发任务时必须先判断是否涉及以下内容：

- 新页面
- 新模块
- 数据结构
- `dashboard.json` / schema 变更
- API / 接口协议
- Wiki / 文档索引结构
- 业务系统边界
- 前后端协作边界

若命中，必须先派 `yuan-architect` 输出轻量架构说明，再派 `yuan-frontend` 或 `yuan-backend` 实现。

状态同步、文档小修、拼写修复、链接修正、reviewer 发现的小范围问题修复，可以由 `yuan-control` 或 `yuan-reviewer` 直接处理，不强制经过 `yuan-architect`。

## 固定流程

```text
用户
  ↓
yuan-control
  ↓
yuan-architect：先定结构 / 数据 / 边界
  ↓
yuan-frontend 或 yuan-backend：按架构实现
  ↓
yuan-reviewer：按架构和任务要求验收
  ↓
yuan-control：同步状态和派发下一步
```

## 当前进度

- profile 已创建。
- `SOUL.md` 已写入角色规则。
- Dev OS bootstrap 已完成。
- GitHub repo 已完成远端同步，公开前敏感信息预检通过。
- 已完成 Dev OS 流程纠偏：把 Architect 前置门禁写入事实源。
- 已完成 T-005 Project Wiki Viewer：`yuan-architect` 前置架构、`yuan-frontend` 实现、`yuan-reviewer` 验收通过。
- 已完成 T-006 Dashboard 视觉对齐 / Shell 重构并完成验收收口。
- 已完成 T-007 closeout 小漂移修复。
- 已完成 T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate 并通过 `yuan-reviewer` 验收。
- 已完成 T-009 reviewer 二审方式调整与复核；后续 reviewer 第二审查统一使用 Codex CLI `gpt-5.3-codex`。
- 已完成 T-010 Dev OS Dashboard 信息架构与交互收尾整改并通过验收；Dev OS Dashboard v1.0 收尾完成。
- 已完成 T-011 Project OS 文档体系中文化与任务线分离；Dev OS / Web App 任务线已拆分。
- 已完成 TWA-000 Web App MVP 架构冻结与开发基线；Web App 业务任务统一使用 `TWA-xxx`。
- 已创建 TWA-001 Web App 技术栈冻结与移动优先 App Shell 基础，当前派发 `yuan-architect` 前置架构说明；`yuan-control` 不参与技术判断，只调度和收口。

## 当前边界

- 不开发登录、生图、试卷、支付等业务功能。
- 不修改数据库 schema。
- 不让 `yuan-architect` 写前端代码。
- 不保存 token/key/auth/secret/bearer token，不保留完整敏感环境信息。
- 不允许 Web App 业务任务继续使用 Dev OS 的 `T-xxx` 编号。

## 变更记录

- 2026-05-07：已同步 T-010 进入执行状态（已完成 / `in_progress`，progress 10%），当前等待 `yuan-architect` 前置架构说明；说明确认前不放行 `yuan-frontend` 修改 Dashboard 前端文件。
- 2026-05-07：`yuan-architect` 已完成 T-010 前置架构说明并同步必要事实源；确认是否放行前，仍不派 `yuan-frontend` 修改 `src/main.tsx` 或 `src/styles.css`。

- 2026-05-07：已确认 T-010 前置架构说明通过，放行 `yuan-frontend` 实施 Dev OS Dashboard v1.0 收尾整改；继续禁止业务功能、API、数据库 schema 和 dashboard schema 越界。

- 2026-05-07：完成 T-010 closeout，Dev OS Dashboard v1.0 收尾完成；不直接进入 Web App 开发。
- 2026-05-08：已完成 T-011 Project OS 文档体系中文化与任务线分离（已完成 / `done`，progress 100%）；T-000 至 T-010 已使用 `git mv` 迁入 `tasks/dev-os/` 中文文件名，`tasks/web-app/README.md` 仅作为任务线说明，未修改业务代码。
- 2026-05-08：已完成 TWA-000 Web App MVP 架构冻结与开发基线（已完成 / `done`，progress 100%）；已同步 TWA 命名规则、任务板、dashboard JSON、summary、roadmap、risks 与 validator，未进入真实业务功能。

- 2026-05-08：已创建 TWA-001（进行中 / `in_progress`，progress 40%），当前已完成 `yuan-architect` 前置架构说明并等待用户确认；确认前不放行 `yuan-frontend`，不实现 UI、不新增真实 API、不修改数据库 schema。
