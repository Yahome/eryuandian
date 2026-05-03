# AGENT_WORKFLOW：多 Agent 工作流

状态：active
更新时间：2026-05-03

## 总原则

`yuan-control` 是唯一总控入口。其他 Agent 默认作为后台 worker，不直接接入飞书 / Telegram。

所有 Agent 必须以 `/root/eryuandian/docs/project-os` 为事实源，不得只凭聊天上下文执行。

`yuan-architect` 不是“事后补文档”角色。凡涉及结构、数据、接口、系统边界的新工作，必须在 frontend/backend 开工前先输出轻量架构说明。

## Profile 列表

| Profile | 角色 | 是否直接写代码 | 是否建议接入聊天平台 |
|---|---|---:|---:|
| `yuan-control` | 总控 / Orchestrator | 少量 | 是 |
| `yuan-architect` | 架构 / 文档 / 项目知识库 | 少量文档，不写前端业务代码 | 否 |
| `yuan-frontend` | 前端开发 | 是 | 否 |
| `yuan-backend` | 后端与 AI 业务开发 | 是 | 否 |
| `yuan-reviewer` | Review / QA | 少量修复 | 否 |

## 标准任务流

```text
用户
  ↓
yuan-control：澄清目标 / 拆任务 / 写入事实源
  ↓
yuan-architect：先定结构 / 数据 / 边界 / 验收标准
  ↓
yuan-frontend 或 yuan-backend：按架构实现
  ↓
yuan-reviewer：按架构和任务要求验收
  ↓
yuan-control：同步状态和派发下一步
```

## Architect 前置门禁

以下任务类型必须先经过 `yuan-architect`，在任务文档或专题文档中输出轻量架构说明后，`yuan-frontend` / `yuan-backend` 才能开工：

- 新页面。
- 新模块。
- 数据结构。
- `dashboard.json` / schema 变更。
- API / 接口协议。
- Wiki / 文档索引结构。
- 业务系统边界。
- 前后端协作边界。

轻量架构说明至少包含：

- 目标与非目标。
- 页面 / 模块结构。
- 数据来源与字段边界。
- 接口或文件协议；无后端接口时也要明确“不新增 API”。
- frontend/backend 的文件边界和禁止事项。
- reviewer 验收点。

例外：以下小事不强制经过 `yuan-architect`，避免把 architect 变成瓶颈：

- 状态同步。
- 文档小修、拼写修复、链接修正。
- reviewer 发现的小范围问题修复。
- `TASK_BOARD.md` / `dashboard.json` 中与既有事实一致的状态同步。

## 任务文档要求

每个任务应放在：

`docs/project-os/tasks/T-xxx-*.md`

必须包含：

- 目标
- 背景
- 文件范围
- 非目标
- 执行人
- 验收标准
- 风险
- 验证命令
- 进展记录

涉及 Architect 前置门禁的任务，还必须包含：

- `yuan-architect` 的轻量架构说明，或指向对应专题文档的链接。
- 明确 frontend/backend 不得超出架构说明自作主张扩字段、扩接口、扩业务范围。
- reviewer 验收时必须检查实现是否遵守架构边界。

## Codex 使用规则

- 必须在 git repo 内执行。
- 必须使用 `--yolo`。
- 复杂开发任务优先使用隔离 worktree。
- 分派给 Codex 的 prompt 必须包含：任务目标、文件范围、禁止事项、验收标准、需要更新的文档。

示例：

```bash
codex --yolo exec "按 docs/project-os/tasks/T-xxx.md 实现前端页面，只允许修改 src/frontend 和 docs/project-os/agents/yuan-frontend.md，完成后运行验证命令。"
```

## 并行规则

允许并行：

- architect 在独立文档范围内补充架构或事实源。
- frontend / backend 在 API、数据结构、页面边界已由 architect 明确后，按互不重叠文件范围实现。
- reviewer 对已稳定的代码或文档做验收。

禁止并行：

- 两个 Agent 同时修改同一模块。
- reviewer 在代码未稳定时做最终验收。
- 未定义 API 契约前，frontend/backend 各自脑补字段。
- 触发 Architect 前置门禁的任务，在 architect 说明完成前交给 frontend/backend 实现。

## 文档更新规则

每个 Agent 完成任务后必须更新自己的进度文档：

- `agents/yuan-control.md`
- `agents/yuan-architect.md`
- `agents/yuan-frontend.md`
- `agents/yuan-backend.md`
- `agents/yuan-reviewer.md`

`yuan-control` 负责更新：

- `TASK_BOARD.md`
- `dashboard.json`
- `CHANGELOG.md`

`yuan-architect` 负责更新：

- `SOURCE_OF_TRUTH.md`
- `PRODUCT_REQUIREMENTS.md`
- `API_CONTRACT.md`
- `DATA_MODEL.md`
- `DECISIONS.md`
- `RISKS.md`
- 涉及 Wiki / 文档索引 / Dashboard 数据结构的轻量架构说明

## 验收规则

一个任务只有在以下条件满足后才能标记为 `done`：

- 任务文档的验收标准全部勾上。
- 相关代码或文档已提交。
- reviewer 或 control 已验证结果。
- 若任务触发 Architect 前置门禁，reviewer 已确认实现遵守 `yuan-architect` 的结构、数据、接口和边界说明。
- dashboard.json / TASK_BOARD.md 已更新。
- 无 Blocker 风险。
