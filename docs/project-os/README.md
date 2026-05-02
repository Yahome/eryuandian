# 两元店 Dev OS

状态：事实源建立中

## 定位

两元店 Dev OS 是“两元店 / eryuandian”项目的 AI 开发过程管理事实源。

原则：Markdown 文档是事实源，Dashboard 只是可视化层。

## 事实源入口

首读文件：`SOURCE_OF_TRUTH.md`

专题文件：

- `PRODUCT_REQUIREMENTS.md`：产品需求
- `DESIGN_SYSTEM.md`：设计系统与视觉基准
- `INFORMATION_ARCHITECTURE.md`：信息架构
- `API_CONTRACT.md`：前后端接口契约草案
- `DATA_MODEL.md`：数据模型草案
- `TECH_STACK.md`：技术栈草案
- `AGENT_WORKFLOW.md`：多 Agent 工作流

## 过程管理文件

- `PROJECT_BRIEF.md`：项目背景与范围
- `ROADMAP.md`：路线图
- `TASK_BOARD.md`：任务板
- `DECISIONS.md`：架构/产品决策记录
- `RISKS.md`：风险清单
- `CHANGELOG.md`：变更日志
- `dashboard.json`：Dashboard 初始数据接口
- `agents/`：各 Agent 进度记录
- `tasks/`：单任务文档

## 核心链路

```text
用户需求 / 飞书 / Telegram
  ↓
yuan-control 总控拆解任务
  ↓
yuan-architect / yuan-frontend / yuan-backend / yuan-reviewer 执行
  ↓
各 Agent 更新自己的进度 Markdown
  ↓
yuan-architect 汇总项目知识库和整体进度
  ↓
Dashboard 读取 Markdown / JSON 展示
```

## 角色

- `yuan-control`：总控 / Orchestrator
- `yuan-architect`：架构 / 文档 / 项目知识库
- `yuan-frontend`：前端开发
- `yuan-backend`：后端与 AI 业务开发
- `yuan-reviewer`：Review / QA

## 硬规则

- 项目英文目录名固定为 `eryuandian`。
- 不使用 `liangyuandian` 作为目录名或仓库名。
- UI 必须以 `/root/eryuandian/pic` 设计稿为准。
- Dashboard 数据必须来自 `docs/project-os`，不得硬编码演示数字。
