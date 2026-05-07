# yuan-reviewer

状态：活跃（内部标识：`active`）

## 角色

Review / QA Agent。

## 职责

- 代码审查
- 类型检查
- lint / test / build 验证
- 回归测试
- 安全风险检查
- 验收标准核对
- 任务完成后使用 `project-os-closeout-review` skill 做事实源收口检查

## 任务完成事实源收口职责

- 每次确认任务完成后，必须使用 `project-os-closeout-review` skill 排查事实源漂移。
- 检查范围包括 `SOURCE_OF_TRUTH.md`、`ROADMAP.md`、`TASK_BOARD.md`、任务文档、agent 文档、`dashboard/summary.md`、两个 dashboard JSON 和 `CHANGELOG.md`。
- 若只是小型状态同步 / 文档小修，可直接修正；若涉及新页面、新模块、数据结构、接口协议或业务边界，必须交回 `yuan-control` 按 Architect 前置门禁派发。

## gpt-5.3-codex 并行审查规则

- `yuan-reviewer` 做最终验收时，除自身审查外，应调用 Codex CLI 的 `gpt-5.3-codex` 模型做第二审查视角。
- 标准调用方式：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home \
  codex --yolo exec --cd /root/eryuandian -m gpt-5.3-codex \
  "你是第二审查员。请只读审查当前 git diff 与任务验收标准，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。"
```

- 二审只能只读审查，不能修改文件、提交、推送、重启服务或执行高风险写操作。
- 最终验收报告必须汇总：`yuan-reviewer` 自身结论、`gpt-5.3-codex` 结论、冲突项裁决。
- `gpt-5.3-codex` 二审不可用时必须记录原因，并继续完成 `yuan-reviewer` 自身验收。

## 当前进度

- profile 已创建。
- 2026-05-03：已完成 T-003 `/dev-dashboard` 第一版实现验收，结论 **PASS with notes**；验证页面访问、JSON 数据源、5 个 Agent 展示、KPI、风险/待确认/最近更新、Logo、业务边界、lint/typecheck/build 与 Git diff 范围。
- 2026-05-03：已接入 Gemini CLI 并行审查规则；`yuan-reviewer` profile HOME 下 `.gemini` 已软链到 default/root 的 `/root/.gemini`，smoke test 返回 `REVIEWER_GEMINI_OK`。
- 2026-05-03：已完成 T-005 Project Wiki Viewer 验收，结论 PASS with notes；Gemini 二审通过。
- 2026-05-03：已完成 T-006 Dashboard 视觉对齐 / Shell 重构验收，结论 PASS with notes；Gemini 二审因 429 无有效输出，不阻塞自身验收。
- 2026-05-05：已完成 T-007 Dev OS 任务看板详情页 + 进度汇总机制验收，结论 PASS；Gemini 二审因 429 无有效输出，不阻塞自身验收。
- 2026-05-06：已完成 T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate 验收，结论 PASS；Gemini 二审因 CLI 工具提示、429 / 网络错误无有效输出，不阻塞自身验收。
- 2026-05-06：已完成 T-009 Gemini CLI Prompt File 二审通道 / Reviewer Smoke Test 验收，结论 PASS；Gemini prompt-file smoke test 因 429 / 模型容量不可用未返回 marker，已记录脱敏摘要且临时文件清理通过。
- 2026-05-06：按 T-009 二审方式调整，后续统一使用 Codex CLI `gpt-5.3-codex` 做 reviewer 第二审查，不再依赖 Gemini CLI。

## T-009 Gemini CLI Prompt File 二审通道验收记录（2026-05-06）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS / 无 Blocker**。

- PASS：T-009 任务文档存在，并包含 `yuan-architect` 前置架构说明；说明覆盖长 prompt 不稳定原因、临时 Markdown prompt file、固定 reviewer HOME 命令、失败清理与脱敏记录。
- PASS：事实源已同步到任务文档、TASK_BOARD、summary、CHANGELOG、本 reviewer 记录和两个 dashboard JSON；两个 dashboard JSON 内容一致。
- PASS：`.tmp/` 已加入 `.gitignore`；Gemini smoke test 使用 `.tmp/gemini-review/T-009-review-prompt.md`，执行后 `test ! -e .tmp/gemini-review/T-009-review-prompt.md` exit 0。
- PASS：未派 `yuan-frontend` / `yuan-backend`，未新增 API，未修改数据库 schema，未修改 dashboard schema，未进入登录 / 生图 / 试卷 / 支付业务，未修改前端组件结构。
- PASS：未保存 token / key / auth / secret / bearer token，未保留完整敏感环境信息。

### 验证命令与结果

| 命令 | exit code | 结果 |
|---|---:|---|
| `npm run lint` | 0 | PASS |
| `npm run typecheck` | 0 | PASS |
| `npm run build` | 0 | PASS |
| `node scripts/dev-os-validate.mjs` | 0 | PASS |
| Gemini prompt-file smoke test | 0 | 已执行；未返回 marker，脱敏错误类别为 429 / capacity_or_rate_limit |
| `test ! -e .tmp/gemini-review/T-009-review-prompt.md` | 0 | PASS，临时 prompt 文件已删除 |
| `git diff --check` | 0 | PASS |

### Gemini Prompt-File Smoke Test

已按要求调用：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt '@.tmp/gemini-review/T-009-review-prompt.md'
```

脱敏结果：Gemini CLI 接受 prompt-file 调用并启动请求，但服务端返回 `429 RESOURCE_EXHAUSTED / MODEL_CAPACITY_EXHAUSTED`，提示模型容量不可用；未获得 `T-009_PROMPT_FILE_SMOKE_OK` marker。按 T-009 验收定义，smoke test 只要求验证调用路径、错误记录和临时文件清理，不要求 Gemini 返回 PASS，因此不阻塞 `yuan-reviewer` 自身验收。

### 冲突裁决

无可裁决冲突；Gemini 未产出有效审查意见，最终以 `yuan-reviewer` 本地审查、事实源核对和验证命令结果为准。

## T-008 Dev OS 事实源一致性校验脚本验收记录（2026-05-06）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS / 无 Blocker**。

- PASS：T-008 已有 `yuan-architect` 前置架构说明，并记录 `yuan-control` 已确认。
- PASS：`scripts/dev-os-validate.mjs` 只 import `readFile` / `readdir`，未发现写文件、执行子进程、网络请求或自动改写 Markdown / JSON 的逻辑。
- PASS：脚本读取范围限于 `TASK_BOARD.md`、`ROADMAP.md`、`dashboard/summary.md`、`dashboard/dashboard.json`、根部 `dashboard.json` 与 `tasks/T-*.md`。
- PASS：校验规则只覆盖 Dev OS 事实源一致性；未检查业务 API / 数据库 / 登录 / 生图 / 试卷 / 支付。
- PASS：未新增 `package.json` script `dev-os:validate`，未修改 dashboard schema，未新增 API，未修改数据库 schema，未修改前端 / 后端业务代码。
- PASS：两个 dashboard JSON 合法且内容完全一致；`node scripts/dev-os-validate.mjs` 对当前事实源输出 `PASS`。

### 验证命令与结果

```bash
npm run lint
npm run typecheck
npm run build
node scripts/dev-os-validate.mjs
jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json
cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json
git diff --check
```

以上命令均 exit 0。

### Gemini 第二审查结论

已按要求调用：

```bash
cd /root/eryuandian && HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt '...'
```

Gemini CLI 未返回有效二审结论：启动后提示 `run_shell_command` 工具不可用，随后出现 SSL 断连、一次 `429 RESOURCE_EXHAUSTED / MODEL_CAPACITY_EXHAUSTED` 和 `ECONNRESET`。按规则记录原因，不阻塞 `yuan-reviewer` 自身验收。

### 冲突裁决

无可裁决冲突；Gemini 未产出有效审查意见，最终以 `yuan-reviewer` 本地审查和验证命令结果为准。

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
2. `docs/project-os/TASK_BOARD.md` 中 T-004 已按 `docs/project-os/tasks/T-004-dashboard-json-sync.md`、`docs/project-os/dashboard/dashboard.json`、`docs/project-os/dashboard.json` 同步为“已完成”（内部枚举：`done`）。

### 检查项与证据

| 检查项 | 结论 | 证据 |
|---|---|---|
| 5 个 profiles 职责是否清晰 | PASS | `docs/project-os/agents/yuan-control.md`、`yuan-architect.md`、`yuan-frontend.md`、`yuan-backend.md`、`yuan-reviewer.md` 均有 `## 角色` 与 `## 职责`；实际执行 `hermes -p yuan-control/yuan-architect/yuan-frontend/yuan-backend/yuan-reviewer chat -Q -q ...` 均返回对应职责说明。 |
| 5 个 SOUL.md 是否存在并符合分工 | PASS | 已执行 `hermes profile show yuan-control/yuan-architect/yuan-frontend/yuan-backend/yuan-reviewer` 确认 home directory；5 个 profile home 下均存在 `SOUL.md`。审计摘要见 `docs/project-os/agents/profile-audit.md`，未复制敏感信息。 |
| `docs/project-os` 目录完整性 | PASS | 已存在 `README.md`、`PROJECT_BRIEF.md`、`ROADMAP.md`、`TASK_BOARD.md`、`DECISIONS.md`、`RISKS.md`、`CHANGELOG.md`、`SOURCE_OF_TRUTH.md`、产品/架构草案、`agents/`、`tasks/`、`dashboard/`、根部 `dashboard.json` 等 22 个预期入口。 |
| T-001 到 T-005 必填字段与验收标准 | PASS | `docs/project-os/tasks/T-001-setup-agent-profiles.md` 到 `T-005-wiki-viewer.md` 均包含 frontmatter `owner`、`status`、`priority`、`progress`，且均有 `## 验收标准`。 |
| `dashboard/dashboard.json` 是否符合 `SCHEMA.md` | PASS | Python 实际读取 `docs/project-os/dashboard/SCHEMA.md` 抽取顶层字段，并解析 `docs/project-os/dashboard/dashboard.json`：JSON 合法，包含 `project`、`agents`、`tasks`、`risks`、`roadmap`、`pendingApprovals`、`recentUpdates`、`wikiLinks`；`agents=5`；tasks 含 `T-001` 至 `T-005`。校验范围：合法 JSON、SCHEMA.md 声明的顶层字段、关键数组数量/ID，不包含深层 JSON Schema 类型约束（当前 SCHEMA.md 未定义深层类型）。 |
| 根部 `dashboard.json` 顶层字段 | PASS | `docs/project-os/dashboard.json` 为合法 JSON，包含用户要求的 8 个顶层字段：`project`、`agents`、`tasks`、`risks`、`roadmap`、`pendingApprovals`、`recentUpdates`、`wikiLinks`。 |
| T-003 是否可交给 `yuan-frontend` | PASS with prerequisites | `docs/project-os/tasks/T-003-dashboard-ui.md` `status: "ready"` 表示任务处于“准备中”状态，owner `yuan-frontend`、数据源为 `docs/project-os/dashboard/dashboard.json` 与 `summary.md`；`dashboard/dashboard.json` 校验通过。前置条件见下。 |

### T-003 放行建议

**建议放行给 `yuan-frontend` 开发 `/dev-dashboard`**，前置条件：

- 仅开发 Dev OS Dashboard，不进入登录、生图、试卷、支付等业务功能。
- 前端必须读取 `docs/project-os/dashboard/dashboard.json`，不得硬编码任务数量、Agent 状态、风险、路线图等展示数据。
- 以 `docs/project-os/tasks/T-003-dashboard-ui.md` 的验收标准为 UI 验收依据。
- `TASK_BOARD.md` 中 T-004 状态已同步为“已完成”（内部枚举：`done`），当前不再阻塞看板事实源。
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

- 已修复：`docs/project-os/TASK_BOARD.md` 中 T-004 状态已同步为“已完成”（内部枚举：`done`）。
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
- NOTE：`docs/project-os/TASK_BOARD.md` 仍显示 T-005 为“进行中”（内部枚举：`in_progress`）且“等待按架构实现”，与 T-005 任务文档和两个 dashboard JSON 的“审核中”（内部枚举：`review`）状态不一致。该问题不阻断 Wiki Viewer 功能验收，但建议 `yuan-control` 后续做事实源状态同步。

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

## T-006 Dev OS Dashboard Visual Alignment / Shell Refactor 验收记录（2026-05-03）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS with notes / 无 Blocker**。

- PASS：已先读取 `SOURCE_OF_TRUTH.md`、`AGENT_WORKFLOW.md`、`tasks/T-006-dashboard-visual-alignment.md`、`tasks/T-003-dashboard-ui.md`、`tasks/T-005-wiki-viewer.md`、本文件、`dashboard/dashboard.json`、`pic/dev-os-dashboard.png`、`src/main.tsx`、`src/styles.css`；补充读取 `DESIGN_SYSTEM.md` 并查看 `brand-logo-identity.png`。
- PASS：当前 `/dev-dashboard` 比 T-003 第一版更接近 `pic/dev-os-dashboard.png`：紧凑 sidebar、顶部搜索/通知/用户占位、五张 KPI 卡、项目总览、Agent 卡片网格、Roadmap 时间线、风险/待确认、最近更新与 Wiki 快捷入口均已形成参考图式的 SaaS dashboard 壳。
- PASS：保留 T-003 总览能力；KPI、项目总览、Agent 状态、Roadmap、风险/待确认、最近更新和 Wiki 入口仍可见。
- PASS：保留 T-005 Project Wiki Viewer；浏览器 DOM 可见 `Project Wiki`、`只读预览`、`Agent 进度目录`、`任务文档目录` 与 T-006 任务文档入口；Markdown 仍通过 `import.meta.glob('../docs/project-os/**/*.md', { query: '?raw' })` 只读映射。
- PASS：数据来源仍是 `src/main.tsx` 静态导入 `../docs/project-os/dashboard/dashboard.json`；任务、Agent、风险、Roadmap、recent updates、wikiLinks 均通过 `data.*` 或 `dashboardData.wikiLinks` 派生/遍历渲染，未发现硬编码这些业务状态数据。
- PASS：未新增 API、未改 `docs/project-os/dashboard/SCHEMA.md`、未改数据库 schema，未开发登录、生图、试卷、支付等业务功能。Header 里的通知数字与用户姓名属于 T-006 明确允许的视觉占位，不承载业务状态。
- NOTE：`docs/project-os/dashboard/summary.md` 当时存在一条旧的 T-006 后续派发重复行；这是事实源摘要 polish，不影响本次视觉壳验收，后续 closeout 已清理。
- NOTE：sidebar 的“任务看板”当前锚点落到 Wiki 快速入口区域；作为 T-003/T-006 的入口占位不阻塞，但后续任务看板详情页应拆成独立目标区或路由。

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

补充浏览器验证：使用本机 `google-chrome --headless=new` 截图访问 `http://127.0.0.1:5173/dev-dashboard`，生成 `/tmp/t006-dev-dashboard.png` 与 `/tmp/t006-dev-dashboard-full.png`；截图确认 PC 宽屏布局已呈现参考图的 sidebar + top header + KPI + card grid + Wiki 区域。使用 `--dump-dom` 确认 Wiki Viewer 渲染，页面 DOM 仅有 1 个只读搜索 `<input>`，未发现 `textarea`、`contenteditable`、保存/编辑/上传/删除/重命名入口。

### Gemini 第二审查结论

调用命令：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt '你是第二审查员。请只读审查当前 git diff 与 T-006 Dashboard 视觉对齐验收标准，重点看是否更接近 pic/dev-os-dashboard.png、是否破坏 T-003/T-005、是否越界开发业务功能，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。'
```

Gemini 结论：**无有效二审输出**。

- 结果：Gemini CLI 已被调用，但服务端连续返回 `429 RESOURCE_EXHAUSTED / MODEL_CAPACITY_EXHAUSTED`，提示 `No capacity available for model gemini-3.1-pro-preview on the server`。
- 处理：按 `AGENT_WORKFLOW.md`，Gemini 不可用必须记录原因，但不能替代或阻塞 `yuan-reviewer` 自身验收；本次结论以 `yuan-reviewer` 自身审查为准。

### 冲突裁决

- 无可裁决的 Gemini 审查意见；Gemini 未产出 Blocker/Major/Minor/Nit。
- `yuan-reviewer` 自身审查未发现 Blocker/Major；两个 NOTE 均为后续事实源/交互 polish，不影响 T-006 核心验收。

### 相对设计基准的改善点

- 页面从大面积渐变 hero 调整为参考图式 dashboard shell：左侧白底导航、主内容浅背景、白色卡片与轻阴影。
- 顶部 header 恢复搜索框、通知、帮助、用户区域占位，接近 `dev-os-dashboard.png` 的第一屏信息结构。
- KPI 卡片使用图标、圆形进度、轻色块和横向五卡布局，信息密度明显更接近设计基准。
- 项目总览、Agent 状态、Roadmap、风险/确认、最近更新改为多卡片网格和时间线结构，弱化临时内部页感。
- Wiki 快速入口和 Project Wiki Viewer 保持 T-005 只读能力，同时视觉上并入统一 dashboard 卡片系统。
- Logo 从整张 `brand-logo-identity.png` 设计总览图改为独立 `brand-app-icon.png` 资源，更符合参考图导航位的品牌使用方式。

### 后续 polish 项

- 进一步贴近参考图的精确间距、卡片高度、字体权重、头像/Agent 图标配色和右侧更新列表节奏。
- 为“任务看板”“风险与决策”“日报”“设置”补独立 Coming soon 区域或后续真实页面，避免导航锚点复用 Wiki 快捷入口。
- 清理 `docs/project-os/dashboard/summary.md` 中旧的 T-006 重复行，保持摘要事实源一致。
- 移动端当前保证不崩和不严重横向溢出，后续可按移动端 Dev OS 需求做专门布局优化。

## T-007 Dev OS 任务看板详情页 + 进度汇总机制验收记录（2026-05-05）

执行角色：`yuan-reviewer`（Review / QA Agent）。

### 总体结论

**PASS / 无 Blocker**。

- PASS：`/dev-dashboard` 可访问，`curl -I -s http://127.0.0.1:5173/dev-dashboard` 返回 `HTTP/1.1 200 OK`。
- PASS：sidebar “任务看板”入口指向并进入真实 `#task-board`；浏览器验证点击后 `window.location.hash` 为 `#task-board`，任务看板位于 Wiki 快捷入口之前。
- PASS：任务看板数据来自 `dashboard.json.tasks`；风险、待确认、最近更新来自 `dashboard.json.risks`、`pendingApprovals`、`recentUpdates`；统计由 `taskStats`、`averageProgress`、`countByStatus` 从 dashboard JSON 派生。
- PASS：任务详情使用 task 的 `wiki` 字段；浏览器脚本验证 T-007 详情可切换 Project Wiki Viewer 到 `docs/project-os/tasks/T-007-task-board-progress.md`。
- PASS：T-003 总览、T-005 Project Wiki Viewer、T-006 dashboard shell 关键 DOM 与文案仍可见；Wiki Viewer 保持只读，无编辑/保存/删除/上传入口。
- PASS：未新增 API、未改 `docs/project-os/dashboard/SCHEMA.md`、未改数据库 schema，未开发登录、生图、试卷、支付等业务功能。
- PASS：状态中文展示符合约定；内部枚举值和 JSON 字段名仍为英文；两个 dashboard JSON 合法且一致。
- PASS：Git diff 范围集中在 Dev OS Dashboard 前端实现与项目事实源文档/JSON 状态记录。

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

cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json
# PASS：exit 0

git diff --check
# PASS：exit 0

curl -I -s http://127.0.0.1:5173/dev-dashboard
# PASS：HTTP/1.1 200 OK
```

补充浏览器验证：使用本机 `google-chrome --headless=new` + DevTools Protocol 只读访问 `http://127.0.0.1:5173/dev-dashboard`，确认 `#task-board` 锚点、T-007 任务详情、Project Wiki 切换和 T-003/T-005/T-006 回归 DOM 均符合预期。

### Gemini 第二审查结论

调用命令：

```bash
HOME=/root/.hermes/profiles/yuan-reviewer/home gemini --prompt '你是第二审查员。请只读审查当前 git diff 与 T-007 Dev OS 任务看板详情页 + 进度汇总机制验收标准，按 Blocker/Major/Minor/Nit 输出问题和证据。不要修改文件。'
```

Gemini 结论：**无有效二审输出**。

- 结果：Gemini CLI 已被调用，但服务端连续返回 `429 RESOURCE_EXHAUSTED / MODEL_CAPACITY_EXHAUSTED`，提示 `No capacity available for model gemini-3.1-pro-preview on the server`。
- 处理：按 `yuan-reviewer` 规则记录原因；Gemini 429 不替代、不阻塞 `yuan-reviewer` 自身验收。

### 冲突裁决

- 无可裁决的 Gemini 审查意见；Gemini 未产出 Blocker/Major/Minor/Nit。
- `yuan-reviewer` 自身审查未发现 Blocker/Major，T-007 可收口为已完成。
