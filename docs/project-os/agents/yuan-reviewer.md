# yuan-reviewer

状态：planned

## 角色

Review / QA Agent。

## 职责

- 代码审查
- 类型检查
- lint / test / build 验证
- 回归测试
- 安全风险检查
- 验收标准核对

## 当前进度

- 等待 profile 创建。

## Phase 0 启动验收记录（2026-05-03）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS with notes**：Phase 0 可进入 T-003 前端开发交接。此前发现的 T-004 状态不一致已修复；5 个 profile 的 `SOUL.md` 已通过 `hermes profile show` 和 profile home 检查补充审计。

1. 5 个 Hermes profiles 均已通过 `hermes -p <profile>` 实际调用并能返回职责说明，说明 profile 规则已生效。
2. `docs/project-os/TASK_BOARD.md` 中 T-004 已按 `docs/project-os/tasks/T-004-dashboard-json-sync.md`、`docs/project-os/dashboard/dashboard.json`、`docs/project-os/dashboard.json` 同步为 `done`。

### 检查项与证据

| 检查项 | 结论 | 证据 |
|---|---|---|
| 5 个 profiles 职责是否清晰 | PASS | `docs/project-os/agents/yuan-control.md`、`yuan-architect.md`、`yuan-frontend.md`、`yuan-backend.md`、`yuan-reviewer.md` 均有 `## 角色` 与 `## 职责`；实际执行 `hermes -p yuan-control/yuan-architect/yuan-frontend/yuan-backend/yuan-reviewer chat -Q -q ...` 均返回对应职责说明。 |
| 5 个 SOUL.md 是否存在并符合分工 | PASS | 已执行 `hermes profile show yuan-control/yuan-architect/yuan-frontend/yuan-backend/yuan-reviewer` 确认 home directory；5 个 profile home 下均存在 `SOUL.md`。审计摘要见 `docs/project-os/agents/profile-audit.md`，未复制敏感信息。 |
| `docs/project-os` 目录完整性 | PASS | 已存在 `README.md`、`PROJECT_BRIEF.md`、`ROADMAP.md`、`TASK_BOARD.md`、`DECISIONS.md`、`RISKS.md`、`CHANGELOG.md`、`SOURCE_OF_TRUTH.md`、产品/架构草案、`agents/`、`tasks/`、`dashboard/`、根部 `dashboard.json` 等 22 个预期入口。 |
| T-001 到 T-005 必填字段与验收标准 | PASS | `docs/project-os/tasks/T-001-setup-agent-profiles.md` 到 `T-005-wiki-viewer.md` 均包含 frontmatter `owner`、`status`、`priority`、`progress`，且均有 `## 验收标准`。 |
| `dashboard/dashboard.json` 是否符合 `SCHEMA.md` | PASS | Python 实际读取 `docs/project-os/dashboard/SCHEMA.md` 抽取顶层字段，并解析 `docs/project-os/dashboard/dashboard.json`：JSON 合法，包含 `project`、`agents`、`tasks`、`risks`、`roadmap`、`pendingApprovals`、`recentUpdates`、`wikiLinks`；`agents=5`；tasks 含 `T-001` 至 `T-005`。校验范围：合法 JSON、SCHEMA.md 声明的顶层字段、关键数组数量/ID，不包含深层 JSON Schema 类型约束（当前 SCHEMA.md 未定义深层类型）。 |
| 根部 `dashboard.json` 顶层字段 | PASS | `docs/project-os/dashboard.json` 为合法 JSON，包含用户要求的 8 个顶层字段：`project`、`agents`、`tasks`、`risks`、`roadmap`、`pendingApprovals`、`recentUpdates`、`wikiLinks`。 |
| T-003 是否可交给 `yuan-frontend` | PASS with prerequisites | `docs/project-os/tasks/T-003-dashboard-ui.md` 状态 `ready`、owner `yuan-frontend`、数据源为 `docs/project-os/dashboard/dashboard.json` 与 `summary.md`；`dashboard/dashboard.json` 校验通过。前置条件见下。 |

### T-003 放行建议

**建议放行给 `yuan-frontend` 开发 `/dev-dashboard`**，前置条件：

- 仅开发 Dev OS Dashboard，不进入登录、生图、试卷、支付等业务功能。
- 前端必须读取 `docs/project-os/dashboard/dashboard.json`，不得硬编码任务数量、Agent 状态、风险、路线图等展示数据。
- 以 `docs/project-os/tasks/T-003-dashboard-ui.md` 的验收标准为 UI 验收依据。
- `TASK_BOARD.md` 中 T-004 状态已同步为 `done`，当前不再阻塞看板事实源。
- `SOUL.md` 实体文件位置已审计到 `docs/project-os/agents/profile-audit.md`；该审计只记录路径、角色摘要和最后修改时间。

### 验证命令 / 方式

```bash
# 5 个 profile 实际职责响应验证
for p in yuan-control yuan-architect yuan-frontend yuan-backend yuan-reviewer; do
  hermes -p "$p" chat -Q -q "请用一句话说明你的角色职责"
done

# dashboard JSON / SCHEMA 顶层字段结构核对
python3 - <<'PY'
import json, pathlib, re
root = pathlib.Path('/root/eryuandian')
required = ['project','agents','tasks','risks','roadmap','pendingApprovals','recentUpdates','wikiLinks']
schema = (root/'docs/project-os/dashboard/SCHEMA.md').read_text()
print(re.findall(r'- `([^`]+)`：', schema))
for rel in ['docs/project-os/dashboard/dashboard.json','docs/project-os/dashboard.json']:
    data = json.loads((root/rel).read_text())
    print(rel, 'missing=', [k for k in required if k not in data])
PY
```

### 后续问题

- 已修复：`docs/project-os/TASK_BOARD.md` 中 T-004 状态已同步为 `done`。
- 已补充：5 个 profile 的 `SOUL.md` 审计记录已写入 `docs/project-os/agents/profile-audit.md`，只包含路径、角色摘要和最后修改时间，不包含敏感信息。
