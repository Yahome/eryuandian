# TASK_BOARD

状态：Phase 0 / Dev OS 闭环建立中

| ID | 标题 | 负责人 | 状态 | 优先级 | 文档 |
|---|---|---|---|---|---|
| T-000 | Bootstrap Dev OS | yuan-control | done | P0 | `tasks/T-000-bootstrap-dev-os.md` |
| T-001 | 设置 Hermes Agent Profiles | yuan-control | done | P0 | `tasks/T-001-setup-agent-profiles.md` |
| T-002 | 建立 Project OS 文档事实源 | yuan-architect | done | P0 | `tasks/T-002-project-os-docs.md` |
| T-003 | Dev OS Dashboard UI | yuan-frontend | ready | P0 | `tasks/T-003-dashboard-ui.md` |
| T-004 | Dashboard JSON Sync | yuan-architect | done | P0 | `tasks/T-004-dashboard-json-sync.md` |
| T-005 | Project Wiki Viewer | yuan-frontend | ready | P1 | `tasks/T-005-wiki-viewer.md` |

## 状态枚举

- pending
- ready
- in_progress
- blocked
- review
- done
- cancelled

## 当前执行顺序

1. 测试 5 个 Hermes profiles 响应。
2. 让 `yuan-control` 读取任务并确认 Phase 0 计划。
3. 让 `yuan-architect` 生成 `docs/project-os/dashboard/dashboard.json`。
4. 确认数据源后再让 `yuan-frontend` 开发 `/dev-dashboard`。

## 今天不做

- 不接真实短信。
- 不接真实生图模型。
- 不接支付。
- 不让所有 agent 都进群。
- 不直接开发业务功能。
- 不使用 `--yolo`。
