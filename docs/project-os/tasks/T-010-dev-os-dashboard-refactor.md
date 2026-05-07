id: T-010
title: Dev OS Dashboard 信息架构与交互收尾整改
owner: yuan-architect
status: ready
priority: P0
progress: 0
背景

经过前期 Dev OS 闭环的建设以及 T‑009 的审查通道调整，现阶段的 Dev OS 仪表盘已基本具备任务看板、里程碑、项目 Wiki 等核心功能。但实际使用中仍存在信息架构混乱、交互不一致、页面留白过多等问题。本任务旨在对现有 /dev-dashboard 页面进行收尾整改，为后续 Web App 正式开发腾挪空间。

目标与范围
顶栏信息区优化：删除当前右上角的“张小圆 / 项目负责人”等个人信息展示区域，仅保留通知铃铛和帮助按钮，并确保交互不受影响。
项目总览分段展示：将单一的进度条拆分为“Dev OS 完成度”和“Web App MVP 完成度”两项，分别展示百分比、总任务数及阶段说明。当前 Dev OS 已收尾，MVP 仍处于规划阶段，应避免误导性 100%。
合并里程碑与 Agent 状态：重新设计里程碑区域，将 roadmap 时间轴与各 Agent 当前所处阶段合并在同一区域展示，减少留白，提高信息浓度。
任务看板重构：放弃现有六列卡片式看板，改为“任务列表 + 详情面板 + 状态筛选”的布局：
顶部提供状态筛选（全部、进行中、准备中、审核中、阻塞、已完成）。
左侧为任务列表，按 ID、标题、负责人、状态排序；支持按项目线（Dev OS 或 Web App）筛选。
右侧为任务详情面板，展示所选任务的状态、进度、验收标准等。
Project Wiki 沉浸式阅读体验：Project Wiki 页将改为沉浸式阅读模式。左侧为最简化的文档导航抽屉，右侧内容区提供完整宽度的文档正文，顶部仅显示标题和文件路径，去除占用空间的卡片式头部。
导航调整：在侧边栏删除单独的“Agent 状态”一级入口，将其信息合并至里程碑区域；保留 Dev OS Dashboard 专用入口，并为后续 Web App 模块预留空间。
风险与待确认清理：更新风险列表，移除已解决项（如 Gemini CLI 与 OAuth 的问题），保留仍待解决的事项（如工作流自动化、CI 集成等），并区分 Dev OS 与 Web App 前置风险。
快速入口修复：修复 Project Wiki 快捷入口点击无效的问题，确保点击后切换到对应文档，并同步左侧目录状态。
文档头部压缩：在 Project Wiki 阅读区压缩标题、文件路径等辅助信息，减少高度占用，使正文更靠近顶端。
交付物
前端实现：完成上述 UI 重构，涉及 src/main.tsx、src/styles.css 以及相关组件的调整，不得修改业务 API 或数据库结构。所有文本需保留中英文混排现有风格。
图片资源：使用新版设计稿指导实现。参考文件：
docs/project-os/images/redesign/dashboard-overview-redesign-v1.png — 项目总览、里程碑与 Agent 状态整合的示意；
docs/project-os/images/redesign/wiki-immersive-design-final.png — Project Wiki 沉浸式阅读示意；
docs/project-os/images/redesign/taskboard-list-detail-v1.png — 任务列表 + 详情面板 + 状态筛选示意。
文档更新：适当更新 docs/project-os/README.md、docs/project-os/dashboard/summary.md、docs/project-os/CHANGELOG.md 等，使其反映本次调整内容。
验证脚本：确保 scripts/dev-os-validate.mjs 通过，不新增新的脚本。现有校验逻辑应能检测出任务状态与文件一致性。
验收标准
 项目总览区根据设计分离 Dev OS 和 MVP 进度；显示准确的任务完成度。
 里程碑与 Agent 状态合并展示，并根据当前阶段正确高亮。
 任务看板采用列表 + 详情布局，状态筛选有效；已完成任务默认折叠。
 Project Wiki 使用沉浸式阅读模式，快捷入口和目录联动正常。
 侧边导航栏移除 Agent 状态入口，保留必要项。
 风险列表更新，过期项移除，仍需解决的风险明确标注。
 通过 npm run lint、npm run typecheck、npm run build、node scripts/dev-os-validate.mjs 等命令，无错误。
备注

本任务为 Dev OS 收尾整改，不涉及真实业务功能开发，不修改数据库 schema，不新增 API，不触碰用户登录、支付、试卷、生图等业务模块。如需在未来版本针对 Web App 功能开发提出新需求，应由新的任务（如 T‑011）追踪。
