# SOURCE_OF_TRUTH：两元店项目事实源

状态：active
更新时间：2026-05-03

## 事实源原则

本文件是“两元店 / eryuandian”项目的一级事实源入口。

所有 Agent 开工前必须先读取本文件，再读取对应专题文件。若聊天内容、临时想法、代码实现与本文档冲突，以本文档和同目录专题文档为准；若发现文档过期，必须先更新文档再继续实现。

## 项目身份

| 字段 | 值 |
|---|---|
| 中文名 | 两元店 |
| 英文目录名 | eryuandian |
| 本地项目目录 | `/root/eryuandian` |
| GitHub 仓库 | `https://github.com/Yahome/eryuandian` |
| GitHub 可见性 | public |
| Dev OS 事实源 | `/root/eryuandian/docs/project-os` |
| 设计稿目录 | `/root/eryuandian/pic` |

## 产品定位

两元店是一个面向中文用户的 AI 内容生成 Web App。

首期核心能力：

1. 生图：面向本地商家，生成营销、活动、宣传类图片。
2. 生成试卷：面向老师、家长、学生，根据年级、科目、教材版本、单元/考试类型生成试卷。

核心不是“工具堆砌”，而是让非技术用户用少量配置快速得到可用内容。

## 首期范围

必须包含：

- 手机号注册 / 登录
- PC 端首页工作台
- 移动端首页工作台
- 商家营销生图工作台
- 智能生成试卷工作台
- 生成记录
- 基础用户与额度模型
- Dev OS Dashboard：展示开发过程、任务、Agent 状态、风险、决策、Wiki 快速入口

暂不纳入首期：

- 完整支付闭环
- 多租户组织管理
- 复杂后台运营系统
- 多语言国际化
- 原生 App

## 当前硬边界

- 当前 Dev OS 阶段聚焦 T-007：Dev OS 任务看板详情页 + 进度汇总机制。
- 当前不开发登录、生图、试卷、支付等业务功能。
- 当前不修改数据库 schema。
- Dev OS Dashboard 继续以 Markdown-first / `dashboard.json` 为事实源，不硬编码示例数字。

## 视觉基准

视觉基准文件位于 `/root/eryuandian/pic`。

- `brand-logo-identity.png`：品牌 Logo / App 图标 / 横版组合 / 单色版本 / 导航示例。
- `desktop-login.png`：桌面端登录页。
- `desktop-home-dashboard.png`：桌面端首页工作台。
- `desktop-marketing-image-generator.png`：桌面端商家营销生图工作台。
- `desktop-paper-generator.png`：桌面端智能生成试卷工作台。
- `mobile-login-register.png`：移动端登录 / 注册页。
- `mobile-home-dashboard.png`：移动端首页工作台。
- `mobile-image-generator.png`：移动端商家营销生图页。
- `mobile-paper-generator.png`：移动端智能生成试卷页。
- `dev-os-dashboard.png`：开发过程管理 Dashboard。

硬规则：最终 Web App 和 Dev OS Dashboard 必须以这些图片为准，不得另起炉灶。

## Agent 分工

| Profile | 角色 | 主要职责 |
|---|---|---|
| `yuan-control` | 总控 / Orchestrator | 接需求、拆任务、派活、验收、维护任务板；保证需要架构前置的任务先走 `yuan-architect` |
| `yuan-architect` | 架构 / 文档 / 项目知识库 | 产品边界、架构方案、API 契约、数据/文档结构、前后端边界、验收标准 |
| `yuan-frontend` | 前端开发 | PC/移动端 UI、Dashboard UI、严格还原设计稿；必须按 architect 边界实现 |
| `yuan-backend` | 后端与 AI 业务开发 | 登录、用户、额度、生图 API、试卷 API、生成记录；必须按 architect 契约实现 |
| `yuan-reviewer` | Review / QA | 代码审查、测试、构建、安全、验收检查；必须检查实现是否遵守 architect 设计边界 |

只建议 `yuan-control` 接入飞书 / Telegram；其他 profile 默认作为后台 worker。

## Architect 前置规则

凡涉及以下内容的任务，`yuan-frontend` / `yuan-backend` 开工前必须先由 `yuan-architect` 输出轻量架构说明：

- 新页面。
- 新模块。
- 数据结构。
- `dashboard.json` / schema 变更。
- API / 接口协议。
- Wiki / 文档索引结构。
- 业务系统边界。
- 前后端协作边界。

小型纯状态修复、拼写修复、链接修正、任务状态同步、reviewer 发现的小范围问题修复，可以由 `yuan-control` 或 `yuan-reviewer` 直接处理，不强制经过 `yuan-architect`。

固定流程：

```text
用户
  ↓
yuan-control
  ↓
yuan-architect：先定结构 / 数据 / 边界
  ↓
yuan-frontend 或 yuan-backend：按架构实现
  ↓
yuan-reviewer：按架构和任务要求验收
  ↓
yuan-control：同步状态和派发下一步
```

## 文档优先级

1. `SOURCE_OF_TRUTH.md`：总入口与不可违背事实。
2. `PRODUCT_REQUIREMENTS.md`：产品需求。
3. `DESIGN_SYSTEM.md`：设计系统与视觉基准。
4. `INFORMATION_ARCHITECTURE.md`：页面、路由、导航结构。
5. `API_CONTRACT.md`：前后端契约。
6. `DATA_MODEL.md`：数据模型。
7. `AGENT_WORKFLOW.md`：多 Agent 工作流。
8. `TASK_BOARD.md`、`tasks/*`：任务执行状态。
9. `DECISIONS.md`、`RISKS.md`、`CHANGELOG.md`：决策、风险、变更。

## 当前阶段

当前处于 P0：开发操作系统与事实源建立阶段。

已完成：

- 本地项目目录 `/root/eryuandian`
- GitHub repo `Yahome/eryuandian` 已完成远端同步，当前可公开访问
- Dev OS 基础文档
- 5 个 Hermes profiles
- 5 个 profile 角色规则 `SOUL.md`
- 设计稿重命名与前端 profile 约束
- T-003 `/dev-dashboard` 第一版 UI，已完成并验收通过
- T-004 Dashboard JSON Sync
- Dev OS 流程纠偏：触发结构、数据、接口、边界变化的任务必须先经过 `yuan-architect`
- T-005 Project Wiki Viewer，已完成并验收通过
- T-006 Dashboard 视觉对齐 / Shell 重构，已完成并验收通过

下一步：

- T-007：Dev OS 任务看板详情页 + 进度汇总机制。
- T-007 属于新页面 / 新模块 / 进度数据汇总机制，开工前必须先由 `yuan-architect` 输出轻量架构说明。
- `yuan-frontend` / `yuan-backend` 只能在架构说明完成后按边界实现，`yuan-reviewer` 验收时必须检查实现是否遵守 architect 的结构、数据和边界说明。
