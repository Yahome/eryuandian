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

## Codex / Hermes 执行权限规则

- 默认允许开发 Agent 在明确任务边界内使用 `--yolo` 执行。
- `--yolo` 只代表减少中途确认，不代表允许越界。
- Agent 使用 `--yolo` 时仍必须遵守：
  - 不提交 `.env`、API key、token、auth、cookie、私钥等敏感信息。
  - 不删除 repo 外文件。
  - 不执行破坏性系统命令。
  - 不 force push。
  - 不擅自修改数据库 schema。
  - 不擅自接入真实短信、支付、生图模型、外部计费服务。
  - 不越界开发登录、生图、试卷、支付等业务功能。
  - 不改任务范围外的大批文件。
- 如果任务需要突破上述边界，Agent 必须停止并回报 `yuan-control`，由 `yuan-control` 汇总给用户确认。
- 小范围 lint/typecheck/build 修复，在任务边界内可以直接处理，不需要逐条询问。
- 每个 Codex 任务启动时，优先使用 `/goal` 设置当前任务目标。

标准格式：

```text
codex --yolo exec --cd /root/eryuandian "/goal <当前任务 ID + 角色 + 本次目标 + 非目标 / 禁止事项 + 验证命令 + 完成后交付物>"
```

对实现完成的任务，交给 `yuan-reviewer` 做验收。

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

## Reviewer 并行审查规则

`yuan-reviewer` 做最终验收时，默认采用“双审查视角”：

1. `yuan-reviewer` 自身按任务文档、架构边界、验收标准、lint/typecheck/test/build、Git diff 范围做主审查。
2. 同时或随后调用 Gemini CLI 做只读第二审查：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt "你是第二审查员。请只读审查当前 git diff 与任务验收标准，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。"
```

约束：

- Gemini CLI 使用 default/root 已登录配置，通过 `/root/.hermes/profiles/yuan-reviewer/home/.gemini -> /root/.gemini` 共享。
- Gemini 只能只读审查，不能修改文件、提交、推送、重启服务或执行高风险写操作。
- `yuan-reviewer` 最终报告必须汇总自身结论、Gemini 结论、冲突项裁决。
- Gemini 不可用、未登录、超时或输出无效时，必须记录原因，但不能替代或阻塞 `yuan-reviewer` 自身验收。

## 验收规则

一个任务只有在以下条件满足后才能标记为 `done`：

- 任务文档的验收标准全部勾上。
- 相关代码或文档已提交。
- reviewer 或 control 已验证结果。
- 若任务触发 Architect 前置门禁，reviewer 已确认实现遵守 `yuan-architect` 的结构、数据、接口和边界说明。
- dashboard.json / TASK_BOARD.md 已更新。
- 无 Blocker 风险。
