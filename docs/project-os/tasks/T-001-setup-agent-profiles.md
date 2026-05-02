---
id: T-001
title: 设置 Hermes Agent Profiles
owner: yuan-control
status: done
priority: P0
progress: 100
created_at: 2026-05-02
updated_at: 2026-05-02
tags:
  - dev-os
  - hermes
  - profiles
---

# T-001 设置 Hermes Agent Profiles

## 目标
创建两元店项目所需的 5 个 Hermes profiles，并为每个 profile 设置角色规则。

## Profiles
- yuan-control
- yuan-architect
- yuan-frontend
- yuan-backend
- yuan-reviewer

## 验收标准
- [x] 5 个 profile 创建成功
- [x] 每个 profile 有独立 SOUL.md
- [x] 每个 profile 可以通过 hermes -p 调用
- [x] 每个 profile 能说明自己的职责
- [x] 只允许 yuan-control 接入 Telegram / 飞书
- [x] 其他 agent 只作为后台 worker

## 当前进度
100%

## 验证记录
2026-05-03 已运行 5 条 `hermes -p <profile> chat -Q -q ...`，`yuan-control`、`yuan-architect`、`yuan-frontend`、`yuan-backend`、`yuan-reviewer` 均能返回职责说明。

## 备注
本任务完成后，才能进入 Dashboard UI 开发。
