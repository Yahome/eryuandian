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

## Gemini 并行审查规则

- `yuan-reviewer` 做最终验收时，除自身审查外，应尽量调用 Gemini CLI 做第二审查视角。
- Gemini CLI 使用 default/root 已登录配置：`/root/.hermes/profiles/yuan-reviewer/home/.gemini -> /root/.gemini`。
- 标准调用方式：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt "你是第二审查员。请只读审查当前 git diff 与任务验收标准，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。"
```

- Gemini 只能只读审查，不能修改文件、提交、推送、重启服务或执行高风险写操作。
- 最终验收报告必须汇总：`yuan-reviewer` 自身结论、Gemini 结论、冲突项裁决。
- Gemini 不可用时必须记录原因，并继续完成 `yuan-reviewer` 自身验收。

## 当前进度

- 等待 profile 创建。
- 2026-05-03：已完成 T-003 `/dev-dashboard` 第一版实现验收，结论 **PASS with notes**；验证页面访问、JSON 数据源、5 个 Agent 展示、KPI、风险/待确认/最近更新、Logo、业务边界、lint/typecheck/build 与 Git diff 范围。
- 2026-05-03：已接入 Gemini CLI 并行审查规则；`yuan-reviewer` profile HOME 下 `.gemini` 已软链到 default/root 的 `/root/.gemini`，smoke test 返回 `REVIEWER_GEMINI_OK`。

## T-003 `/dev-dashboard` 第一版验收记录（2026-05-03）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS with notes / 建议提交 commit**。

- PASS：`/dev-dashboard` 可通过 Vite dev server 正常访问，返回 `HTTP/1.1 200 OK`。
- PASS：页面通过 `src/main.tsx` 静态导入 `../docs/project-os/dashboard/dashboard.json`，Agent、Roadmap、风险、待确认、最近更新、Wiki 入口均由 JSON map/派生渲染。
- PASS：未发现复制硬编码的 agent、task、risk、roadmap 业务数据；仅有导航标签、页面标题、状态中文映射、Coming soon 等 UI 文案。
- PASS：5 个 Agent 均来自 `dashboard.json` 并展示：`yuan-control`、`yuan-architect`、`yuan-frontend`、`yuan-backend`、`yuan-reviewer`。
- PASS：KPI 与 `dashboard.json` 当前数据一致：任务平均进度 `67%`、进行中任务 `2`、阻塞任务/开放风险计数 `2`、活跃 Agent `2/5`、最近更新 `2026-05-03`。
- PASS：风险、待确认、最近更新均使用 `data.risks`、`data.pendingApprovals`、`data.recentUpdates` 展示。
- PASS：UI 使用 `pic/brand-logo-identity.png` 新版两元店 Logo。
- PASS：未发现登录、生图、试卷、支付业务功能代码；未修改数据库 schema。
- PASS：`npm run lint`、`npm run typecheck`、`npm run build` 均通过。
- PASS：Git diff 范围未越界，变更集中在 Dev OS Dashboard 必需前端文件与相关验收/实现记录文档；未提交 commit。

### 执行命令与结果

```bash
git status --short && git rev-parse --show-toplevel && git diff --stat
# PASS：仓库为 /root/eryuandian；仅有前端工程文件、src、T-003 相关 docs 未提交变更。

npm run lint && npm run typecheck && npm run build
# PASS：eslint、tsc -b、vite build 全部 exit 0。

npm run dev
curl -I -s http://127.0.0.1:5173/dev-dashboard
# PASS：返回 HTTP/1.1 200 OK。
```

### Notes / 后续建议

- 当前 `/dev-dashboard` 是单页总览 MVP，左侧非总览导航为 `Coming soon`，符合第一版范围；后续 T-005 或任务看板详情页可继续扩展。
- `dist/` 与 `*.tsbuildinfo` 已存在且本次 build 后未显示新增未提交 diff；提交前仍建议总控确认是否需要纳入或忽略构建产物。

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

## T-005 Project Wiki Viewer 验收记录（2026-05-03）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS with notes / 可交给 `yuan-control` 做后续状态同步与提交前确认**。

- PASS：已先读取 `SOURCE_OF_TRUTH.md`、`AGENT_WORKFLOW.md`、`TASK_BOARD.md`、`tasks/T-005-wiki-viewer.md`、本文件、两个 dashboard JSON、`src/main.tsx`、`src/styles.css`。
- PASS：T-005 已有 `yuan-architect` 前置架构说明，明确复用 `dashboard.json.wikiLinks`、不新增 API、不修改 schema、不修改数据库、不开发登录/生图/试卷/支付业务。
- PASS：`/dev-dashboard` 中 Project Wiki Viewer 可用；浏览器脚本验证可见 `Project Wiki`、`只读预览`、README、Roadmap、Task Board、Decisions、Risks、Agent 进度目录、任务文档目录，并可切换到 `docs/project-os/tasks/T-005-wiki-viewer.md` 与 `docs/project-os/agents/yuan-reviewer.md`。
- PASS：Wiki 索引来自 `dashboardData.wikiLinks`；Markdown 正文通过 Vite raw glob 固定映射到 `docs/project-os/**/*.md`，并通过 `wikiLinks` 文件路径或目录前缀生成可选入口。
- PASS：路径边界符合要求：只接受 `docs/project-os/` 下的 `.md` 文件或目录，拒绝 `..`，内部 Markdown 链接也必须落在 `wikiModel.allowedPaths` 后才允许切换。
- PASS：Markdown 只读渲染，未使用 `dangerouslySetInnerHTML`；浏览器检查 `#project-wiki` 内 `input`、`textarea`、`contenteditable`、保存/编辑/上传/删除/重命名按钮数量均为 0。
- PASS：外链只允许 `http:` / `https:`，并使用 `target="_blank"` 与 `rel="noreferrer noopener"`；`javascript:`、`data:`、`file:` 等协议不会打开。
- PASS：未新增依赖、未新增后端 API、未修改 `docs/project-os/dashboard/SCHEMA.md`、未修改数据库 schema，未开发登录/生图/试卷/支付业务功能。
- PASS：未发现前端硬编码 Agent / Task / Risk / Roadmap / Wiki 业务数据；状态中文映射、类型标签和导航文案属于 UI 展示文案。
- NOTE：`docs/project-os/TASK_BOARD.md` 仍显示 T-005 为 `in_progress` 且“等待按架构实现”，与 T-005 任务文档和两个 dashboard JSON 的 `review` 状态不一致。该问题不阻断 Wiki Viewer 功能验收，但建议 `yuan-control` 后续做事实源状态同步。

### 验证命令与结果

```bash
npm run lint
# PASS：exit 0

npm run typecheck
# PASS：exit 0

npm run build
# PASS：exit 0，Vite build 成功

jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json
# PASS：exit 0

git diff --check
# PASS：exit 0

curl -I -s http://127.0.0.1:5173/dev-dashboard
# PASS：HTTP/1.1 200 OK
```

补充页面验证：使用本机 Chrome + Playwright 只读访问 `http://127.0.0.1:5173/dev-dashboard`，确认 Wiki 入口、目录展开、文档切换、只读控件边界均符合预期。

### Gemini 第二审查结论

调用命令：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt '你是第二审查员。请只读审查当前 git diff 与 T-005 Project Wiki Viewer 验收标准，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。'
```

Gemini 结论：**Review Pass**。

- Blocker：无。
- Major：无。
- Minor：图片 Markdown 被降级为文本占位；轻量 Markdown 解析器不支持复杂表格和复杂嵌套列表。
- Nit：目录展开仅支持直属 Markdown 文件；安全过滤与未使用 `dangerouslySetInnerHTML` 符合架构边界。

### 冲突裁决

- `yuan-reviewer` 与 Gemini 对 T-005 主结论一致：无 Blocker/Major，符合架构边界，可通过验收。
- Gemini 的 Minor/Nit 均属于后续体验或扩展能力，不影响当前 T-005 验收标准；当前任务没有要求完整 Markdown 引擎、远程图片渲染或递归目录。
- `yuan-reviewer` 额外记录的 `TASK_BOARD.md` 状态滞后属于事实源同步 note，建议由 `yuan-control` 处理；不改变本次 T-005 Wiki Viewer 实现验收结论。
