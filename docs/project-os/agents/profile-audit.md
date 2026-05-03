# Hermes Profile SOUL.md 审计记录

更新时间：2026-05-03
执行角色：yuan-control

## 审计范围

本次只审计 5 个两元店项目 Hermes profiles 的 home directory 与 `SOUL.md` 存在性：

- `yuan-control`
- `yuan-architect`
- `yuan-frontend`
- `yuan-backend`
- `yuan-reviewer`

## 审计规则

- 使用 `hermes profile show <profile>` 确认 profile home directory。
- 检查每个 profile home 下是否存在 `SOUL.md`。
- 只记录路径、角色摘要、最后修改时间。
- 不复制 `SOUL.md` 全文。
- 不写入 `.env`、API key、token、auth、password、secret 或其他凭证信息。

## `hermes profile show` 结果摘要

| Profile | Home directory | SOUL.md | 备注 |
|---|---|---|---|
| `yuan-control` | `/root/.hermes/profiles/yuan-control` | exists | Gateway: running |
| `yuan-architect` | `/root/.hermes/profiles/yuan-architect` | exists | Gateway: stopped |
| `yuan-frontend` | `/root/.hermes/profiles/yuan-frontend` | exists | Gateway: stopped |
| `yuan-backend` | `/root/.hermes/profiles/yuan-backend` | exists | Gateway: stopped |
| `yuan-reviewer` | `/root/.hermes/profiles/yuan-reviewer` | exists | Gateway: stopped |

## SOUL.md 审计明细

| Profile | SOUL.md 路径 | 状态 | 最后修改时间 | Codex 执行规范 | 角色摘要 |
|---|---|---|---|---|---|
| `yuan-control` | `/root/.hermes/profiles/yuan-control/SOUL.md` | PASS | 2026-05-02T23:38:30+08:00 | N/A | 总控 profile；负责调度与复核，不长期亲自写业务代码。 |
| `yuan-architect` | `/root/.hermes/profiles/yuan-architect/SOUL.md` | PASS | 2026-05-03T14:02:37+08:00 | PASS | 架构/文档 profile；文档可直接处理，涉及脚本/工程代码时必须调用 Codex CLI：`codex --yolo exec`。 |
| `yuan-frontend` | `/root/.hermes/profiles/yuan-frontend/SOUL.md` | PASS | 2026-05-03T14:02:21+08:00 | PASS | 干活 profile；编码/工程改文件必须调用 Codex CLI：`codex --yolo exec`。 |
| `yuan-backend` | `/root/.hermes/profiles/yuan-backend/SOUL.md` | PASS | 2026-05-03T14:02:29+08:00 | PASS | 干活 profile；编码/工程改文件必须调用 Codex CLI：`codex --yolo exec`。 |
| `yuan-reviewer` | `/root/.hermes/profiles/yuan-reviewer/SOUL.md` | PASS | 2026-05-03T14:02:44+08:00 | PASS | 验收 profile；只读验证可直接执行，若需修复工程代码必须调用 Codex CLI：`codex --yolo exec`。 |

## Codex 执行规范补充（2026-05-03）

- `yuan-frontend`、`yuan-backend`：编码或工程改文件时，必须在 `/root/eryuandian` git repo 内通过 `codex --yolo exec "<任务说明>"` 让 Codex 完成实际修改；Hermes 聊天模型只做任务理解、上下文准备、调用 Codex、复核结果。
- `yuan-architect`：纯文档/架构汇总可直接处理；涉及脚本、工程代码、自动化生成器或应用代码修改时，必须走 `codex --yolo exec`。
- `yuan-reviewer`：只读验收可直接运行检查命令；若被要求修复工程代码，必须走 `codex --yolo exec`。
- 5 个 yuan profiles 的 Codex 配置入口已统一到共享配置目录；各 profile 直接运行 `codex --yolo exec --cd /root/eryuandian "<任务说明>"` 会读取同一套非仓库内配置。
- `codex login status` 可能显示未登录；本项目以仓库外共享配置中的 CPA provider 为准，判断可用性应跑只读 smoke test，而不是只看登录状态。审计记录不保存 bearer token 或配置文件内容。
- 如果 Codex CLI 不可用、CPA smoke test 失败、或 Codex 执行失败，干活 profile 必须停止并向 `yuan-control` 报告，不得改用聊天模型直接手写业务代码。

## 结论

5 个 profile home directory 均已确认，且各自 home 下均存在 `SOUL.md`。本审计记录只保留非敏感摘要，不包含 `.env`、API key、token、auth、password、secret、bearer token 或配置文件内容。本次已补充干活 profile 的 Codex `--yolo` 执行规范，并确认各 profile 使用仓库外共享 Codex 配置入口。

## 后续建议

- 后续如新增 profile，需要同步补充本审计记录。
- 如 `SOUL.md` 调整职责边界，应只更新本文件中的角色摘要与修改时间，不复制敏感或完整配置内容。
