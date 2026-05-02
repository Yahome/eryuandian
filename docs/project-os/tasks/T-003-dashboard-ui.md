---
id: T-003
title: Dev OS Dashboard UI
owner: yuan-frontend
status: ready
priority: P0
progress: 0
created_at: 2026-05-02
updated_at: 2026-05-02
tags:
  - frontend
  - dashboard
  - dev-os
---

# T-003 Dev OS Dashboard UI

## 目标
开发 `/dev-dashboard` 页面，用于展示两元店项目开发过程。

## 页面模块
- 总览
- 任务看板
- Agent 状态
- 项目 Wiki
- 风险与决策
- 日报

## 数据源
- `docs/project-os/dashboard/dashboard.json`
- `docs/project-os/dashboard/summary.md`

## 验收标准
- [ ] 具有左侧导航
- [ ] 总览页展示整体进度
- [ ] 展示 5 个 agent 状态
- [ ] 展示任务看板
- [ ] 展示风险与阻塞
- [ ] 展示 Wiki 快速入口
- [ ] 支持 PC 宽屏展示
- [ ] 视觉风格匹配两元店紫蓝渐变设计系统
- [ ] 不硬编码演示统计数字，必须读取 Dashboard JSON
