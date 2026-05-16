# Roadmap

## Phase 0：Dev OS 与项目准备
- [x] T-000 Hermes profiles 建立
- [x] T-001 Agent 分工规则建立
- [x] T-002 docs/project-os 文档体系建立
- [x] T-003 Dev Dashboard MVP
- [x] T-005 Project Wiki Viewer：已完成，`yuan-frontend` 实现，`yuan-reviewer` 与 Gemini 双审查通过
- [x] T-006 Dev OS Dashboard 视觉对齐 / Shell 重构：已完成，`yuan-frontend` 实现，`yuan-reviewer` 验收通过
- [x] T-007 Dev OS 任务看板详情页 + 进度汇总机制：已完成，`yuan-frontend` 实现，`yuan-reviewer` 验收通过；Gemini 二审因服务端 429 无有效输出，已记录且不阻塞验收
- [x] T-010 Dev OS Dashboard 信息架构与交互收尾整改：已完成并通过 `yuan-reviewer` 与 `gpt-5.3-codex` 二审
- [x] T-011 Project OS 文档体系中文化与任务线分离：已完成，T-000 至 T-010 已迁移到 `tasks/dev-os/` 中文文件名，`tasks/web-app/README.md` 仅作为任务线说明

## Phase 1：MVP 基础
- [x] T-008 Dev OS 事实源一致性校验脚本 / Closeout Gate：已完成，`yuan-architect` 实现，`yuan-reviewer` 验收通过；Gemini 二审因 429 / 网络错误无有效输出，已记录且不阻塞验收
- [x] TWA-000 Web App MVP 架构冻结与开发基线：已完成，冻结 MVP 范围、路由草案、API contract 草案、概念数据模型、Mock/Adapter 边界和后续 TWA-001 至 TWA-007 拆分
- [x] TWA-001：技术栈冻结 + 移动优先 App Shell / 首页 / 工作台基础（已完成；含国际化 / 双市场版本基线、TWA-001A/B/C 收口）
- [ ] TWA-002：登录与会话 Mock / Adapter（进行中：TWA-002A 实现前架构冻结已完成，owner `yuan-architect`，progress `70`）
- [ ] TWA-003：额度账本 Mock / Adapter
- [ ] TWA-004：营销生图工作台 Mock 流程
- [ ] TWA-005：试卷生成工作台 Mock 流程
- [ ] TWA-006：我的作品 / 生成记录
- [ ] TWA-007：账户 / 商业化占位 + 移动端体验回归

## Phase 2：核心功能
- [ ] 真实生图模型接入（需后续任务明确放行）
- [ ] 真实试卷生成模型接入（需后续任务明确放行）
- [ ] 导出 PDF / Word

## Phase 3：商业化
- [ ] 会员套餐
- [ ] 额度系统
- [ ] 订单支付
- [ ] 水印 / 高清下载

## Phase 4：上线
- [ ] 部署
- [ ] 日志
- [ ] 监控
- [ ] 备份
