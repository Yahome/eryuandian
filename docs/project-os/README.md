# 两元店 Dev OS

状态：初始化

## 定位

两元店 Dev OS 是“两元店”项目的 AI 开发过程管理事实源。

原则：Markdown 文档是事实源，Dashboard 只是可视化层。

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

## 目录

- `PROJECT_BRIEF.md`：项目背景与范围
- `ROADMAP.md`：路线图
- `TASK_BOARD.md`：任务板
- `DECISIONS.md`：架构/产品决策记录
- `RISKS.md`：风险清单
- `CHANGELOG.md`：变更日志
- `dashboard.json`：Dashboard 初始数据接口
- `agents/`：各 Agent 进度记录
- `tasks/`：单任务文档

## 角色

- `yuan-control`：总控 / Orchestrator
- `yuan-architect`：架构 / 文档 / 项目知识库
- `yuan-frontend`：前端开发
- `yuan-backend`：后端与 AI 业务开发
- `yuan-reviewer`：Review / QA
