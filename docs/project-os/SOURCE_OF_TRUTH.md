# SOURCE_OF_TRUTH：两元店项目事实源

状态：active
更新时间：2026-05-02

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
| GitHub 可见性 | private |
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
| `yuan-control` | 总控 / Orchestrator | 接需求、拆任务、派活、验收、维护任务板 |
| `yuan-architect` | 架构 / 文档 / 项目知识库 | 产品边界、架构方案、API 契约、文档汇总 |
| `yuan-frontend` | 前端开发 | PC/移动端 UI、Dashboard UI、严格还原设计稿 |
| `yuan-backend` | 后端与 AI 业务开发 | 登录、用户、额度、生图 API、试卷 API、生成记录 |
| `yuan-reviewer` | Review / QA | 代码审查、测试、构建、安全与验收检查 |

只建议 `yuan-control` 接入飞书 / Telegram；其他 profile 默认作为后台 worker。

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
- GitHub private repo `Yahome/eryuandian`
- Dev OS 基础文档
- 5 个 Hermes profiles
- 5 个 profile 角色规则 `SOUL.md`
- 设计稿重命名与前端 profile 约束

下一步：

- 完善产品需求、页面信息架构、API 契约、数据模型。
- 再由 `yuan-architect` 拆分 MVP 技术方案。
- 最后交给 `yuan-frontend` / `yuan-backend` 开始实现。
