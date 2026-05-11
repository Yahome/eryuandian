# RISKS

状态：活跃

| ID | 风险 | 影响 | 状态 | 应对 |
|---|---|---|---|---|
| R-002 | 多 Agent 并行修改冲突 | 代码冲突、上下文错乱 | 未关闭（内部枚举：`open`） | 使用 git worktree 和总控派活 |
| R-004 | Dev OS / Web App 任务线混用 | 总览进度误导、任务筛选失真 | 监控中（内部枚举：`monitoring`） | T-011 已拆分 `tasks/dev-os/` 与 `tasks/web-app/`；TWA-000 已冻结 `T-xxx` / `TWA-xxx` 命名规则 |
| R-005 | Phase 1 技术栈 / API / 数据模型未冻结 | Web App 开工后返工 | 监控中（内部枚举：`monitoring`） | TWA-001 已按 deep research 冻结目标技术路线；后续仍需在工程底座任务中落地 Next.js / NestJS / monorepo / contract，不得直接跳到业务功能 |
| R-006 | 技术路线复杂度上升 | Next.js / NestJS / Redis / BullMQ / monorepo 一次性落地可能拖慢 MVP | 监控中（内部枚举：`monitoring`） | 按任务分阶段落地：先工程底座与 contract，再 mock/adapter，再真实 provider；本轮只同步事实源，不安装依赖或写业务代码 |

## 已降级 / 历史记录

- Gemini CLI 二审 429 / 网络错误：T-009 已确认后续 reviewer 二审改用 Codex CLI `gpt-5.3-codex`，不再作为当前风险。
- R-001 Codex CLI 与 Hermes OAuth 状态分离：T-010 不依赖 Hermes worker 直接开发，降级为历史/监控事项。
- R-003 Dashboard 数据硬编码：当前 Dashboard 已读取 `docs/project-os/dashboard/dashboard.json`，且 T-008 已有只读一致性校验脚本；降级为实现约束，不再作为 open 风险展示。
