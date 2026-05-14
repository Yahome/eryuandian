# RISKS

状态：活跃

| ID | 风险 | 影响 | 状态 | 应对 |
|---|---|---|---|---|
| R-002 | 多 Agent 并行修改冲突 | 代码冲突、上下文错乱 | 未关闭（内部枚举：`open`） | 使用 git worktree 和总控派活 |
| R-004 | Dev OS / Web App 任务线混用 | 总览进度误导、任务筛选失真 | 监控中（内部枚举：`monitoring`） | T-011 已拆分 `tasks/dev-os/` 与 `tasks/web-app/`；TWA-000 已冻结 `T-xxx` / `TWA-xxx` 命名规则 |
| R-005 | Phase 1 技术栈 / API / 数据模型未冻结 | Web App 开工后返工 | 已关闭（内部枚举：`closed`） | TWA-001 已完成技术冻结与用户最终确认；当前转为实现阶段边界风险监控 |
| R-006 | 技术路线复杂度上升 | Next.js / NestJS / Redis / BullMQ / monorepo 一次性落地可能拖慢 MVP | 监控中（内部枚举：`monitoring`） | 按任务分阶段落地：先工程底座与 contract，再 mock/adapter，再真实 provider；TWA-001 第二阶段只做 App Shell 静态实现 |
| R-007 | TWA-001 实现阶段越界 | 误接真实 API / schema / provider 或提前实现后续任务 | 监控中（内部枚举：`monitoring`） | reviewer 重点检查无真实登录、短信、生图、试卷、支付、额度扣费、DB schema、API handler、secret |
| R-008 | 前端偏离移动端优先 | 95% 移动端使用场景体验失真 | 监控中（内部枚举：`monitoring`） | TWA-001 必须覆盖 375 / 390 / 430px，底部 Tab、轻量 header、单列内容流和 44px 触控区域 |
| R-009 | App Shell 未按 deep research 路线建立可复用结构 | 后续 TWA-002 至 TWA-007 返工 | 监控中（内部枚举：`monitoring`） | 实现需按 Next.js / contract / mock / adapter / 移动优先结构组织，不把 mock 逻辑散落到 UI 组件 |
| R-010 | 国际化 / 双市场能力后置导致路由与首页重构 | App Shell、首页、导航、定价文案、功能展示可能返工 | 监控中（内部枚举：`monitoring`） | TWA-001 现在先冻结 locale-aware / market-aware 基线；后续 frontend 按该基线组织文案和路由 |

## 已降级 / 历史记录

- Gemini CLI 二审 429 / 网络错误：T-009 已确认后续 reviewer 二审改用 Codex CLI `gpt-5.3-codex`，不再作为当前风险。
- R-001 Codex CLI 与 Hermes OAuth 状态分离：T-010 不依赖 Hermes worker 直接开发，降级为历史/监控事项。
- R-003 Dashboard 数据硬编码：当前 Dashboard 已读取 `docs/project-os/dashboard/dashboard.json`，且 T-008 已有只读一致性校验脚本；降级为实现约束，不再作为 open 风险展示。
