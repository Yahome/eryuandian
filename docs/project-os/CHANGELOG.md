# CHANGELOG

## 2026-05-03

- 修正 T-005 派发前事实源漂移：整理 `--yolo` 执行边界、同步 Roadmap 中 Dev Dashboard MVP 状态、更新 T-005 下一步为 frontend 实现。
- 为 `yuan-reviewer` 接入 Gemini CLI 并行审查规则：profile HOME 的 `.gemini` 软链到 default/root `/root/.gemini`，最终验收需汇总 reviewer 自身结论、Gemini 结论和冲突裁决。
- 完成 Dev OS 流程纠偏：凡涉及新页面、新模块、数据结构、`dashboard.json` / schema 变更、API / 接口协议、Wiki / 文档索引结构、业务系统边界、前后端协作边界的任务，frontend/backend 开工前必须先由 `yuan-architect` 输出轻量架构说明。
- 明确例外：状态同步、文档小修、拼写修复、链接修正、reviewer 发现的小范围问题修复，不强制经过 `yuan-architect`。
- 将 T-005 Project Wiki Viewer 调整为 `yuan-architect` 架构前置 → `yuan-frontend` 实现 → `yuan-reviewer` 按架构验收。
- 完成 T-005 Project Wiki Viewer 前置架构说明：复用 `dashboard.json.wikiLinks`，本阶段不变更 dashboard schema，不新增 API，不修改数据库 schema；下一步等待 `yuan-frontend` 实现。
- 明确当前阶段不开发登录、生图、试卷、支付等业务功能，不修改数据库 schema。

## 2026-05-02

- 初始化 `/root/eryuandian` 项目目录。
- 初始化 git repo，默认分支为 `main`。
- 创建 `docs/project-os` 文档事实源骨架。
- 记录“两元店”英文目录名为 `eryuandian`。
- 从 default clone 创建 5 个 Hermes profiles：`yuan-control`、`yuan-architect`、`yuan-frontend`、`yuan-backend`、`yuan-reviewer`。
- 为 5 个 profiles 写入角色规则 `SOUL.md`。
- 将 `/root/eryuandian/pic` 设计稿按内容重命名。
- 将设计稿基准写入 `yuan-frontend` 的 `SOUL.md`。
- 创建 GitHub repo：`https://github.com/Yahome/eryuandian`。
- 推送初始 commit：`3c17b0737775`。
- 建立项目事实源 Markdown 文件集：`SOURCE_OF_TRUTH.md`、`PRODUCT_REQUIREMENTS.md`、`DESIGN_SYSTEM.md`、`INFORMATION_ARCHITECTURE.md`、`API_CONTRACT.md`、`DATA_MODEL.md`、`TECH_STACK.md`、`AGENT_WORKFLOW.md`。
