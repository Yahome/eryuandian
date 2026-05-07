---
id: T-009
title: reviewer 二审方式调整与复核（gpt-5.3-codex）
owner: yuan-architect
status: done # 已完成
priority: P1
progress: 100
created_at: 2026-05-06
updated_at: 2026-05-06
tags:
  - dev-os
  - codex
  - gpt-5.3-codex
  - reviewer
  - review
  - architect
---

# T-009 reviewer 二审方式调整与复核（gpt-5.3-codex）

## 当前阶段

T-009 已完成 `yuan-architect` 前置说明、Dev OS 事实源同步与 `yuan-reviewer` 只读复核。当前生效规则：后续 reviewer 二审不再使用 Gemini CLI，统一改为 Codex CLI `gpt-5.3-codex`。

> 本任务仅涉及 reviewer 二审规则与文档同步，命中 Architect 前置门禁；不得派 `yuan-frontend` / `yuan-backend`，不得进入业务功能，不新增 API，不修改数据库 schema，不修改 dashboard schema，不改前端组件结构。

## 目标

- 将 reviewer 第二审查规则从 Gemini CLI 切换为 `gpt-5.3-codex`。
- 固化只读二审命令形态，保留 `yuan-reviewer` 自身验收为主结论。
- 同步任务文档、reviewer 规则、summary、changelog、TASK_BOARD 与两个 dashboard JSON 描述。
- 保持边界：不进入登录/生图/试卷/支付，不新增 API，不改数据库 schema，不改 dashboard schema，不保存敏感信息。

## 非目标

- 不开发或修改前端/后端业务代码。
- 不新增 dashboard JSON 顶层字段，不修改 `docs/project-os/dashboard/SCHEMA.md`。
- 不保存 token/key/auth/secret/bearer token，不保留完整敏感环境信息。

## 当前生效二审规则

推荐命令：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home \
  codex --yolo exec --cd /root/eryuandian -m gpt-5.3-codex \
  "你是第二审查员。请只读审查当前 git diff 与任务验收标准，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。"
```

执行要求：

- 二审只读，不修改文件、不提交、不推送、不执行高风险写操作。
- 最终验收报告必须包含：`yuan-reviewer` 自身结论、`gpt-5.3-codex` 二审结论、冲突裁决。
- 若 `gpt-5.3-codex` 二审不可用，必须记录原因，但不阻塞 `yuan-reviewer` 自身验收。

## 边界与禁止事项

- 不进入登录 / 生图 / 试卷 / 支付业务。
- 不新增 API route、服务端接口或外部服务封装。
- 不修改数据库 schema、迁移文件或数据模型。
- 不修改 dashboard schema；两个 dashboard JSON 仅允许同结构描述同步。
- 不保存 token / key / auth / secret / bearer token。
- 不保留完整敏感环境信息或原始环境变量 dump。

## Reviewer 验收命令

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `node scripts/dev-os-validate.mjs`
- `jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`
- `cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`
- `test ! -e .tmp/gemini-review/T-009-review-prompt.md`
- `git diff --check`

## Reviewer 验收标准

- [x] 事实源已明确后续 reviewer 二审改为 `gpt-5.3-codex`。
- [x] 规则已明确二审只读，且不可用时不阻塞 reviewer 自身验收。
- [x] 未进入登录 / 生图 / 试卷 / 支付业务。
- [x] 未新增 API。
- [x] 未修改数据库 schema。
- [x] 未修改 dashboard schema。
- [x] 未保存 token / key / auth / secret / bearer token。
- [x] 两个 dashboard JSON 保持一致。
- [x] 指定验证命令通过。

## 历史归档说明（Gemini CLI）

- T-009 初版曾验证 Gemini prompt-file 调用链路与临时文件清理，相关临时路径为 `.tmp/gemini-review/T-009-review-prompt.md`。
- 历史 smoke test 在 2026-05-06 遇到 429 / 容量限制并已做脱敏记录；同时确认临时文件清理通过。
- 该历史记录仅作为背景；当前与后续执行统一以 `gpt-5.3-codex` 二审规则为准。
