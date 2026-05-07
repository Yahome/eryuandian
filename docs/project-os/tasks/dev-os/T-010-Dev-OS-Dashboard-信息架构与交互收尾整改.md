id: T-010
title: Dev OS Dashboard 信息架构与交互收尾整改
owner: yuan-architect
status: done
priority: P0
progress: 100
背景

经过前期 Dev OS 闭环的建设以及 T‑009 的审查通道调整，现阶段的 Dev OS 仪表盘已基本具备任务看板、里程碑、项目 Wiki 等核心功能。但实际使用中仍存在信息架构混乱、交互不一致、页面留白过多等问题。本任务旨在对现有 /dev-dashboard 页面进行收尾整改，为后续 Web App 正式开发腾挪空间。

目标与范围
顶栏信息区优化：删除当前右上角的“张小圆 / 项目负责人”等个人信息展示区域，仅保留通知铃铛和帮助按钮，并确保交互不受影响。
项目总览分段展示：将单一的进度条拆分为“Dev OS 完成度”和“Web App MVP 完成度”两项，分别展示百分比、总任务数及阶段说明。当前 Dev OS 已收尾，MVP 仍处于规划阶段，应避免误导性 100%。
合并里程碑与 Agent 状态：重新设计里程碑区域，将 roadmap 时间轴与各 Agent 当前所处阶段合并在同一区域展示，减少留白，提高信息浓度。
任务看板重构：放弃现有六列卡片式看板，改为“任务列表 + 详情面板 + 状态筛选”的布局：
顶部提供状态筛选（全部、进行中、准备中、审核中、阻塞、已完成）。
左侧为任务列表，按 ID、标题、负责人、状态排序；支持按项目线（Dev OS 或 Web App）筛选。
右侧为任务详情面板，展示所选任务的状态、进度、验收标准等。
Project Wiki 沉浸式阅读体验：Project Wiki 页将改为沉浸式阅读模式。左侧为最简化的文档导航抽屉，右侧内容区提供完整宽度的文档正文，顶部仅显示标题和文件路径，去除占用空间的卡片式头部。
导航调整：在侧边栏删除单独的“Agent 状态”一级入口，将其信息合并至里程碑区域；保留 Dev OS Dashboard 专用入口，并为后续 Web App 模块预留空间。
风险与待确认清理：更新风险列表，移除已解决项（如 Gemini CLI 与 OAuth 的问题），保留仍待解决的事项（如工作流自动化、CI 集成等），并区分 Dev OS 与 Web App 前置风险。
快速入口修复：修复 Project Wiki 快捷入口点击无效的问题，确保点击后切换到对应文档，并同步左侧目录状态。
文档头部压缩：在 Project Wiki 阅读区压缩标题、文件路径等辅助信息，减少高度占用，使正文更靠近顶端。
交付物
前端实现：完成上述 UI 重构，涉及 src/main.tsx、src/styles.css 以及相关组件的调整，不得修改业务 API 或数据库结构。所有文本需保留中英文混排现有风格。
图片资源：使用新版设计稿指导实现。参考文件：
docs/project-os/images/redesign/dashboard-overview-redesign-v1.png — 项目总览、里程碑与 Agent 状态整合的示意；
docs/project-os/images/redesign/wiki-immersive-design-final.png — Project Wiki 沉浸式阅读示意；
docs/project-os/images/redesign/taskboard-list-detail-v1.png — 任务列表 + 详情面板 + 状态筛选示意。
文档更新：适当更新 docs/project-os/README.md、docs/project-os/dashboard/summary.md、docs/project-os/CHANGELOG.md 等，使其反映本次调整内容。
验证脚本：确保 scripts/dev-os-validate.mjs 通过，不新增新的脚本。现有校验逻辑应能检测出任务状态与文件一致性。
验收标准
 项目总览区根据设计分离 Dev OS 和 MVP 进度；显示准确的任务完成度。
 里程碑与 Agent 状态合并展示，并根据当前阶段正确高亮。
 任务看板采用列表 + 详情布局，状态筛选有效；已完成任务默认折叠。
 Project Wiki 使用沉浸式阅读模式，快捷入口和目录联动正常。
 侧边导航栏移除 Agent 状态入口，保留必要项。
 风险列表更新，过期项移除，仍需解决的风险明确标注。
 通过 npm run lint、npm run typecheck、npm run build、node scripts/dev-os-validate.mjs 等命令，无错误。
备注

本任务为 Dev OS 收尾整改，不涉及真实业务功能开发，不修改数据库 schema，不新增 API，不触碰用户登录、支付、试卷、生图等业务模块。如需在未来版本针对 Web App 功能开发提出新需求，应由新的任务（如 T‑011）追踪。

## 执行记录

- 2026-05-07：`yuan-control` 已同步 T-010 进入执行状态（内部枚举：`in_progress`，中文：进行中），progress 调整为 10%；当前阶段为 `yuan-architect` 前置架构说明。架构说明通过前，`yuan-frontend` 不得修改 `src/main.tsx` 或 `src/styles.css`。
- 2026-05-07：`yuan-architect` 已完成本前置架构说明并同步必要 Dev OS 事实源；T-010 仍为 `in_progress`，progress 调整为 20%。`yuan-control` 确认前仍不得派 `yuan-frontend` 修改 `src/main.tsx` 或 `src/styles.css`。

- 2026-05-07：`yuan-control` 已确认前置架构说明覆盖总览页、任务看板、Project Wiki、导航调整、风险清理、数据来源与 schema 边界；确认未进入业务功能、未改 schema、未改 `src/main.tsx` / `src/styles.css`。现放行 `yuan-frontend` 按说明实施，T-010 progress 调整为 30%。

- 2026-05-07：`yuan-frontend` 已完成 T-010 Dev OS Dashboard v1.0 收尾整改实现，修改 `src/main.tsx` 与 `src/styles.css`；本地验证 `npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty`、`cmp -s`、`git diff --check` 均通过，`curl -I -s http://127.0.0.1:5173/dev-dashboard` 返回 `HTTP/1.1 200 OK`。当前等待 `yuan-reviewer` 只读验收。

## 前置架构说明（yuan-architect，2026-05-07）

### 0. 已读取事实源与设计稿

本说明基于以下事实源和设计稿，不以臆测替代当前实现：

- 代码：`src/main.tsx`、`src/styles.css`。
- Dev OS 事实源：`docs/project-os/dashboard.json`、`docs/project-os/dashboard/dashboard.json`、`docs/project-os/dashboard/summary.md`、`docs/project-os/TASK_BOARD.md`。
- 关联事实源：`docs/project-os/ROADMAP.md`、`docs/project-os/RISKS.md`、`docs/project-os/dashboard/SCHEMA.md`、`docs/project-os/README.md`、`docs/project-os/CHANGELOG.md`、`docs/project-os/agents/yuan-architect.md`、`docs/project-os/agents/yuan-control.md`。
- 设计稿：`pic/dashboard-overview-redesign-v1.png`、`pic/taskboard-list-detail-v1.png`、`pic/wiki-immersive-design-final.png`。

### 1. 当前 `/dev-dashboard` 结构识别

当前 `/dev-dashboard` 由 `src/main.tsx` 中的 `DevDashboard` 直接读取 `../docs/project-os/dashboard/dashboard.json` 渲染，未接业务 API。Markdown 预览通过 `import.meta.glob('../docs/project-os/**/*.md', { query: '?raw', import: 'default', eager: true })` 建立只读 registry，再由 `dashboardData.wikiLinks` 生成 Wiki 索引。

当前页面结构如下：

- `Sidebar`：导航包含“总览、任务看板、Agent 状态、项目 Wiki、风险与决策、日报、设置”。其中“Agent 状态”是独立一级入口，指向 `#agents`。
- `TopHeader`：展示项目标题、状态说明、只读搜索框、通知铃铛、帮助图标和 `user-chip`。`user-chip` 当前硬编码“张小圆 / 项目负责人 · updatedAt”。
- KPI 区：`averageProgress(data.tasks)` 生成“整体进度”，并展示进行中任务、阻塞任务、活跃 Agent、最近更新。当前整体进度是 Dev OS 任务均值，不代表 Web App MVP 进度。
- 总览页：`ProjectOverviewCard` 展示当前阶段、健康状态、阶段进度和整体任务进度；`AgentStatusGrid` 作为独立卡片展示 5 个 Agent。
- Roadmap：`RoadmapTimeline` 单独读取 `data.roadmap`，按 Phase 0 到 Phase 4 展示标题、状态、进度和已完成项数量，但不展示关联 Agent 和关联任务详情。
- 风险与待确认：`RiskApprovalCard` 从 `data.risks.slice(0, 3)` 和 `data.pendingApprovals.slice(0, 3)` 合并展示；`blockedTasks(tasks, risks)` 把 `blocked` 任务数和 `open` 风险数相加生成阻塞 KPI。
- 任务看板：`TaskBoardSection` 使用 `groupTasksByStatus(tasks)` 生成六列状态 Kanban，并在右侧展示 `TaskDetailPanel`。当大部分任务已完成时，多列空状态造成大留白。
- Project Wiki：`WikiQuickLinks` 只渲染 `<a href="#project-wiki">`，没有调用 `onSelect` 或 `setSelectedWikiPath`，因此点击快捷入口只会滚动到 Wiki 区，不会切换 Markdown，也不会同步目录选中状态。`TaskWikiLink` 和 Wiki 更新面板按钮则会调用选择逻辑。
- Project Wiki 阅读区：`ProjectWikiViewer` 当前是卡片式三栏结构：左侧目录、正文、右侧最近更新。正文被 `wiki-document-toolbar`、卡片边框和右栏占用空间压缩，阅读重心偏低且偏窄。

### 2. 总览页整改架构

目标是把总览页从“全部任务平均进度”改为“Dev OS 收尾 + Web App 即将启动”的双轨表达，避免用户误解为整个产品已经接近完成。

- 顶栏删除 `user-chip`，即删除右上头像、张小圆、项目负责人和日期说明；仅保留通知铃铛与帮助图标。项目更新时间仍保留在 JSON 事实源中，不在右上个人区域展示。
- 保留只读搜索框时，应把其定位为 Dashboard 内筛选入口的视觉占位；如本轮实现未启用全局搜索，不得伪装成真实业务搜索。
- 总览卡片拆分两类进度：
  - Dev OS 完成度：来源于 `dashboardData.tasks` 中 Dev OS 任务的 `progress` / `status`，当前表现为收尾中，不写成产品整体 100%。
  - Web App MVP 完成度：来源于 Phase 1 及后续 Web App 任务或 roadmap business items；当前业务开发尚未启动，默认表现为 0% / 准备中。
- 当前阶段文案应明确“Dev OS 收尾优化（T-010）”与“Web App MVP 即将启动”是两个层级，不能把 Phase 0 完成度解释为产品完成度。
- KPI 文案中“整体进度”改为更明确的“Dev OS 完成度”或“双轨完成度”，避免继续用单一百分比代表项目全局。

### 3. Roadmap 与 Agent 状态合并架构

本次删除独立“Agent 状态”导航入口，不再把 Agent 状态作为一级页面锚点；Agent 信息并入 Phase 0 到 Phase 4 的里程碑区域。

里程碑区域每个 phase 至少展示：

- 阶段名称：来自 `roadmap[].title`。
- 阶段状态：来自 `roadmap[].status`，继续复用现有 `Badge` / `statusLabel`。
- 阶段进度：继续由 `phaseProgress(phase)` 从 `roadmap[].items[].done` 派生。
- 关联 Agent：优先从该 phase 关联任务的 `owner` 映射到 `agents[]`；无任务 ID 的 business item 可按职责兜底展示候选 Agent，例如 Phase 1 关联 `yuan-frontend`、`yuan-backend`、`yuan-architect`、`yuan-reviewer`。
- 关联任务：优先从 `roadmap[].items[].title` 中的 `T-xxx` 与 `tasks[]` 匹配；没有任务 ID 时展示 roadmap item 标题和“未建任务”状态。

当前字段足以完成第一版合并展示，不新增 `roadmap.agentIds` 或 `phase.tasks` 字段。若后续需要人工精确维护 phase 与 Agent 的多对多关系，再由 `yuan-control` 确认是否新增 schema 字段。

### 4. 任务看板整改架构

任务看板主视图改为“任务列表 + 详情面板 + 状态筛选”，不再以六列 Kanban 作为主视图。

列表上方筛选：

- 状态筛选：全部、准备中、进行中、审核中、阻塞、已完成。
- 项目线筛选：全部、Dev OS、Web App。当前 T-000 到 T-010 均归为 Dev OS；Web App 任务尚未创建时显示空状态。
- Owner 筛选：从 `tasks[].owner` 去重生成。
- 优先级筛选：从 `tasks[].priority` 去重生成。
- 搜索：本地过滤 `id`、`title`、`summary`、`owner`、`status`、`priority`、`wiki`，不新增后端搜索 API。

任务列表字段：

- ID / 标题。
- 项目线（当前由任务事实源和已知阶段派生，不写入新字段）。
- 状态。
- 进度。
- Owner。
- 优先级。
- Wiki 路径或 Markdown 入口。

右侧详情字段：

- ID、标题、状态、进度、owner、优先级。
- 摘要 `summary`。
- Task Markdown 路径与 Project Wiki 跳转。
- 验收标准：优先从对应 `tasks/**/*.md` Markdown 中解析“验收标准”段落；解析不到时显示“任务文档未提供验收标准”，不新增 JSON 字段。
- 关联风险、待确认、最近更新：继续从 `risks`、`pendingApprovals`、`recentUpdates` 派生，并优先按任务 ID / wiki path 关联。

列表密度与空白处理：

- 默认隐藏或折叠已完成任务，提供“显示已完成”切换。
- 当已完成任务很多时，采用分页、折叠分组或筛选隐藏，不能渲染多列空 Kanban。
- 详情面板在桌面端 sticky，在窄屏下移到列表下方。

第一版仍只读，不新增任务创建 / 编辑 / 删除，不新增业务 API。

### 5. Project Wiki 沉浸式阅读架构

目标是把 Project Wiki 从“Dashboard 卡片里的文档预览”改为更接近知识库的沉浸式阅读区。

快捷入口修复：

- `WikiQuickLinks` 需要接收 `selectedPath` / `onSelect` 或 `onOpenWiki`。
- 点击 Markdown 文件型入口时，调用 `onSelect(link.path)` 并滚动到 `#project-wiki`。
- 点击目录型入口时，选择该目录下第一个可预览 Markdown；如果目录为空，显示空状态。
- 选择成功后必须同步左侧目录 active 状态。

阅读布局：

- 压缩 Project Wiki 顶部标题、路径、类型等辅助信息，避免大面积 toolbar 把正文推低。
- 正文列优先占宽，桌面端正文可使用 `minmax(0, 1fr)` 并扩大最大阅读宽度；右侧“最近更新 / 大纲”应窄化、可折叠，或在中小屏移动到正文下方，不能抢正文空间。
- 右侧区域若新增“大纲”，应从当前 Markdown heading 派生，不写入 dashboard JSON。
- Markdown 渲染仍保持只读，不执行原始 HTML / script。

目录分组目标：

- Overview：`README.md`、项目简报等入口。
- 过程管理文件：`ROADMAP.md`、`TASK_BOARD.md`、`CHANGELOG.md`。
- Agent 工作流：`agents/` 与 Agent 相关流程文档。
- 风险与决策：`RISKS.md`、`DECISIONS.md`。
- Dashboard 相关：`dashboard/SCHEMA.md`、`dashboard/summary.md` 等 Dashboard 文档。
- 任务文档：`tasks/` 下的 T-xxx 任务文档。

当前优先通过前端分组函数从 `wikiLinks`、路径和 Markdown registry 派生这些分组，不新增 `wikiGroup` schema 字段。若后续要由 JSON 显式维护目录分组，再由 `yuan-control` 确认 schema 变更。

### 6. 风险与待确认整改

当前风险区需要从历史问题列表转为“后续开工前真正需要关注的事项”。

降级或移除：

- Gemini CLI 二审失败：T-009 已明确后续 reviewer 二审改用 Codex CLI `gpt-5.3-codex`，Gemini 429 仅保留为历史记录，不再作为当前 Dashboard 风险或待确认事项。
- Dashboard 数据硬编码：当前 `src/main.tsx` 已直接 import dashboard JSON，且 T-008 已提供只读一致性校验脚本；该项降级为实现约束，不再作为 `open` 风险展示。
- Codex CLI 与 Hermes OAuth 状态分离：当前 T-010 不依赖 Hermes worker 直接开发，降级为历史/监控事项，不作为当前阻塞项。

保留或强化：

- Dev OS / Web App 任务线区分：需要在总览和任务列表中清晰分离，避免 Dev OS 完成度误导 Web App MVP 完成度。
- Dashboard JSON 手动 / 自动维护方式：继续保留为待确认事项，当前对应 `PA-003`。
- Phase 1 技术栈 / API / 数据模型冻结：继续保留为待确认事项，当前对应 `PA-004`。
- 多 Agent 并行控制：继续保留为开放风险，实施前仍需 `yuan-control` 控制写入范围，避免多个 Agent 同时修改 Dashboard 前端文件。

### 7. 数据来源与 schema 边界

本任务默认不修改 dashboard schema。现有字段已足够支撑 T-010 第一版信息架构整改：

- `project` 支撑项目状态、当前焦点、更新时间。
- `tasks` 支撑任务列表、状态筛选、owner / priority 筛选、进度、Wiki 跳转。
- `agents` 支撑 Agent 资料与 Roadmap 合并展示。
- `roadmap` 支撑 Phase 0 到 Phase 4、阶段状态和阶段进度。
- `risks` 与 `pendingApprovals` 支撑风险与待确认。
- `recentUpdates` 支撑最近更新与任务详情关联。
- `wikiLinks` 支撑 Project Wiki 入口和目录基础。

因此本轮结论是：

- 不变更 `docs/project-os/dashboard/SCHEMA.md`。
- 不变更 `scripts/dev-os-validate.mjs`。
- 不新增业务 API。
- 不修改数据库 schema。
- 不进入登录 / 生图 / 试卷 / 支付。
- 不派 `yuan-frontend`，也不修改 `src/main.tsx` 或 `src/styles.css`。

若后续实现中发现必须新增字段，例如 `tasks[].projectLine`、`roadmap[].agentIds`、`wikiLinks[].group`，必须先写明现有字段无法满足的原因，并由 `yuan-control` 确认后再更新 schema、SCHEMA.md 和校验脚本。

### 8. 后续实现验收点

后续若 `yuan-control` 放行 `yuan-frontend`，reviewer 需按以下点验收：

- 顶栏只保留通知铃铛和帮助图标，硬编码用户身份与日期展示已移除。
- 总览页明确分离 Dev OS 完成度和 Web App MVP 完成度，不再用单一“整体进度”误导产品完成度。
- Sidebar 不再有独立“Agent 状态”一级入口；Agent 信息已并入 Phase 0 到 Phase 4 里程碑区域。
- 任务看板采用列表 + 详情面板 + 筛选，不再以六列 Kanban 为主视图；已完成任务可折叠、分页或隐藏。
- Project Wiki 快捷入口点击后会切换 Markdown，并同步目录 active 状态。
- Project Wiki 阅读区正文更靠上、更宽，右侧更新 / 大纲不压缩正文主阅读空间。
- 风险与待确认展示不再突出 Gemini 429、Dashboard 硬编码、OAuth 状态分离等旧问题，保留真实待确认事项。
- 验证命令至少覆盖：`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。


## Closeout（yuan-control，2026-05-07）

- 状态：已完成（内部枚举：`done`），progress `100`。
- 修改文件：`src/main.tsx`、`src/styles.css`、`docs/project-os/tasks/dev-os/T-010-Dev-OS-Dashboard-信息架构与交互收尾整改.md`、`TASK_BOARD.md`、`ROADMAP.md`、`RISKS.md`、`dashboard/summary.md`、两个 dashboard JSON、`CHANGELOG.md`、相关 agent 状态文档。
- dashboard schema：未变更；未修改 `docs/project-os/dashboard/SCHEMA.md`。
- 新增脚本：无；继续复用 `scripts/dev-os-validate.mjs`。
- 两个 dashboard JSON：`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json` exit 0。
- 业务边界：未新增业务 API，未修改数据库 schema，未进入登录 / 生图 / 试卷 / 支付真实业务功能，未修改测试逻辑。
- 静态验证：`npm run lint`、`npm run typecheck`、`npm run build`、`node scripts/dev-os-validate.mjs`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check` 均 exit 0。
- 页面验证：`curl -I -s http://127.0.0.1:5173/dev-dashboard` exit 0，返回 `HTTP/1.1 200 OK`。
- reviewer 二审：`gpt-5.3-codex` 只读验收 PASS，无 Blocker/Major；建议 closeout，仅记录 `scripts/dev-os-validate.mjs` 输出文案仍提到 “T-008 阶段说明” 的 Minor 文案 note，不影响功能与本次收口。
- commit / push：待 `yuan-control` 提交并推送。
