# T-000：Bootstrap Dev OS

状态：已完成（内部枚举：`done`）
优先级：P0
负责人：yuan-control

## 目标

搭建“两元店 AI 开发团队”的 Hermes profiles，并建立 `docs/project-os` 事实源目录。

## 验收标准

- `/root/eryuandian` 存在并是 git repo。
- 默认分支为 `main`。
- `docs/project-os` 基础文档存在。
- `dashboard.json` 可被程序读取为合法 JSON。
- 5 个 Hermes profiles 存在：
  - yuan-control
  - yuan-architect
  - yuan-frontend
  - yuan-backend
  - yuan-reviewer
- Codex CLI 可运行。
- 记录 Codex CLI 登录状态。
- 前端 profile 已记录 `/root/eryuandian/pic` 设计稿基准。

## 验收结果

- 项目目录、git repo、文档事实源已创建。
- 5 个 Hermes profiles 已从 default clone。
- 5 个 profile 的 `SOUL.md` 已写入角色规则。
- 设计稿已按内容重命名，并写入 `yuan-frontend` 角色规则。
- Codex CLI 可运行，当前通过 CPA 配置工作；`codex login status` 显示官方 Codex CLI 账号未登录。

## 变更记录

- 2026-05-02：创建任务文档。
- 2026-05-02：完成 Dev OS bootstrap。
