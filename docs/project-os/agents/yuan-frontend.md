# yuan-frontend

状态：准备中（内部标识：`ready`）

## 角色

前端开发 Agent。

## 职责

- PC 端界面开发
- 移动端界面开发
- 生图工作台 UI
- 试卷生成工作台 UI
- Dashboard UI
- 严格还原已确认设计稿

## 设计稿基准

设计稿目录：`/root/eryuandian/pic`

当前基准图：

- `brand-logo-identity.png`
- `desktop-login.png`
- `desktop-home-dashboard.png`
- `desktop-marketing-image-generator.png`
- `desktop-paper-generator.png`
- `mobile-login-register.png`
- `mobile-home-dashboard.png`
- `mobile-image-generator.png`
- `mobile-paper-generator.png`
- `dev-os-dashboard.png`

## 当前进度

- profile 已创建。
- `SOUL.md` 已写入角色规则。
- 设计稿基准已写入前端 profile。
- 2026-05-03：已完成 T-003 第一版 `/dev-dashboard` 总览页。
  - 搭建最小 React / Vite / TypeScript 项目，仅用于 Dev OS Dashboard。
  - 通过 `src/main.tsx` 静态导入 `docs/project-os/dashboard/dashboard.json`，渲染 KPI、5 个 Agent、Roadmap、风险、待确认、最近更新和 Wiki 快速入口。
  - 左侧导航已实现；任务看板、Agent 状态、项目 Wiki、风险与决策、日报、设置为第一版 `Coming soon` 占位。
  - UI 使用 `pic/brand-logo-identity.png`、紫蓝渐变、白底圆角卡片风格。
  - 验证通过：`npm run lint`、`npm run typecheck`、`npm run build`；`/dev-dashboard` 本地访问返回 200。
- 2026-05-03：已完成 T-005 Project Wiki Viewer 前端实现，并经 `yuan-reviewer` 与 Gemini 双审查通过。
  - 继续使用现有 `/dev-dashboard`，未新建业务系统。
  - Wiki 索引来自 `docs/project-os/dashboard/dashboard.json` 的 `wikiLinks`，最近更新复用 `recentUpdates`。
  - Markdown 正文通过 Vite raw glob 固定映射到 `docs/project-os/**/*.md`，目录入口 `docs/project-os/agents/` 与 `docs/project-os/tasks/` 展开为目录下 Markdown 文件。
  - Markdown 只读渲染，不提供编辑、保存、上传、删除、重命名；原始 HTML/script 不执行。
  - 未修改 dashboard schema，未新增 API，未修改数据库 schema，未开发登录、生图、试卷、支付等业务功能。

## T-006 Dashboard 视觉对齐进展（2026-05-03）

- 已完成 T-006 Dev OS Dashboard 视觉对齐 / Shell 重构实现，并经 `yuan-reviewer` 验收通过。
- 视觉壳改为更接近 `pic/dev-os-dashboard.png` 的现代 SaaS dashboard：紧凑 sidebar、top header、KPI 卡片、项目总览、Agent grid、Roadmap、风险/待确认、最近更新和 Wiki 快捷入口。
- 保留 T-003 总览能力和 T-005 只读 Project Wiki Viewer；数据仍来自 `dashboard.json`，未新增 API、未变更 schema、未修改数据库 schema。
- 已抽取独立 logo 静态资源，避免继续把 `brand-logo-identity.png` 整张设计总览图当页面 logo。
- 验证通过：`npm run lint`、`npm run typecheck`、`npm run build`、`jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json`、`git diff --check`。
