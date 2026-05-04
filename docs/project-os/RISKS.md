# RISKS

状态：初始化

| ID | 风险 | 影响 | 状态 | 应对 |
|---|---|---|---|---|
| R-001 | Codex CLI 与 Hermes OAuth 状态分离 | worker 无法直接开发 | 监控中（内部枚举：`monitoring`） | 使用 `codex login status` 和一次真实 repo 内执行验证 |
| R-002 | 多 Agent 并行修改冲突 | 代码冲突、上下文错乱 | 未关闭（内部枚举：`open`） | 使用 git worktree 和总控派活 |
| R-003 | Dashboard 数据硬编码 | 看板失真 | 未关闭（内部枚举：`open`） | Dashboard 必须读取 `docs/project-os` 事实源 |
