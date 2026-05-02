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

| Profile | SOUL.md 路径 | 状态 | 最后修改时间 | 角色摘要 |
|---|---|---|---|---|
| `yuan-control` | `/root/.hermes/profiles/yuan-control/SOUL.md` | PASS | 2026-05-02T23:38:30+08:00 | 两元店 / eryuandian 项目总控 Agent；Orchestrator / 项目经理 / 调度员。 |
| `yuan-architect` | `/root/.hermes/profiles/yuan-architect/SOUL.md` | PASS | 2026-05-02T23:38:42+08:00 | 两元店 / eryuandian 项目架构与项目知识库 Agent；Architect / Technical Writer / Knowledge Compiler。 |
| `yuan-frontend` | `/root/.hermes/profiles/yuan-frontend/SOUL.md` | PASS | 2026-05-02T23:59:12+08:00 | 两元店 / eryuandian 项目前端开发 Agent；Frontend Engineer / UI Implementer。 |
| `yuan-backend` | `/root/.hermes/profiles/yuan-backend/SOUL.md` | PASS | 2026-05-02T23:39:12+08:00 | 两元店 / eryuandian 项目后端与 AI 业务开发 Agent；Backend Engineer / AI Service Integrator。 |
| `yuan-reviewer` | `/root/.hermes/profiles/yuan-reviewer/SOUL.md` | PASS | 2026-05-02T23:39:34+08:00 | 两元店 / eryuandian 项目 Review / QA Agent；Code Reviewer / QA Engineer / Release Gatekeeper。 |

## 结论

5 个 profile home directory 均已确认，且各自 home 下均存在 `SOUL.md`。本审计记录只保留非敏感摘要，不包含 `.env`、API key、token、auth、password、secret 等凭证信息。

## 后续建议

- 后续如新增 profile，需要同步补充本审计记录。
- 如 `SOUL.md` 调整职责边界，应只更新本文件中的角色摘要与修改时间，不复制敏感或完整配置内容。
