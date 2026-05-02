# AGENT_WORKFLOW：多 Agent 工作流

状态：active
更新时间：2026-05-02

## 总原则

`yuan-control` 是唯一总控入口。其他 Agent 默认作为后台 worker，不直接接入飞书 / Telegram。

所有 Agent 必须以 `/root/eryuandian/docs/project-os` 为事实源，不得只凭聊天上下文执行。

## Profile 列表

| Profile | 角色 | 是否直接写代码 | 是否建议接入聊天平台 |
|---|---|---:|---:|
| `yuan-control` | 总控 / Orchestrator | 少量 | 是 |
| `yuan-architect` | 架构 / 文档 / 项目知识库 | 少量 | 否 |
| `yuan-frontend` | 前端开发 | 是 | 否 |
| `yuan-backend` | 后端与 AI 业务开发 | 是 | 否 |
| `yuan-reviewer` | Review / QA | 少量修复 | 否 |

## 标准任务流

```text
用户提出需求
  ↓
yuan-control 澄清目标和验收标准
  ↓
yuan-control 创建 / 更新 task 文档
  ↓
yuan-architect 定义方案、边界、接口、数据模型
  ↓
yuan-control 按文件范围派给 frontend/backend
  ↓
yuan-frontend / yuan-backend 执行并更新各自进度文档
  ↓
yuan-reviewer 审查、测试、验收
  ↓
yuan-control 汇总结果并更新 dashboard.json / TASK_BOARD.md
```

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

- frontend 实现 UI。
- backend 实现 API。
- architect 补充文档。

禁止并行：

- 两个 Agent 同时修改同一模块。
- reviewer 在代码未稳定时做最终验收。
- 未定义 API 契约前，frontend/backend 各自脑补字段。

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

## 验收规则

一个任务只有在以下条件满足后才能标记为 `done`：

- 任务文档的验收标准全部勾上。
- 相关代码或文档已提交。
- reviewer 或 control 已验证结果。
- dashboard.json / TASK_BOARD.md 已更新。
- 无 Blocker 风险。
