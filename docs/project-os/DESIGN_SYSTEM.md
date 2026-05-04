# DESIGN_SYSTEM：设计系统与视觉基准

状态：活跃（内部标识：`active`）
更新时间：2026-05-02

## 设计基准目录

`/root/eryuandian/pic`

这些图片是当前唯一确认过的视觉基准。任何前端实现、Dashboard 实现、Logo 使用，都必须先对照这些图片。

## 品牌基准

主基准：`brand-logo-identity.png`

要求：

- 使用彩色渐变“2”作为核心品牌符号。
- 中文字标为“两元店”。
- 副标题为“AI创作好帮手”。
- 品牌气质：干净、现代、友好、科技感、轻量商业化。
- 不允许把 Logo 改回购物袋提手风格。

## 颜色方向

从设计稿归纳：

- 主色：紫蓝渐变。
- 辅色：橙黄点缀。
- 背景：白色 / 浅灰 / 浅紫蓝渐变。
- 卡片：白底、圆角、轻阴影。
- 状态色：红色用于通知和风险，绿色用于完成，橙色用于进行中或会员提示。

具体色值在实现阶段由 `yuan-frontend` 从设计稿中抽样固化，写入前端样式变量。

## 桌面端页面基准

| 页面 | 图片 |
|---|---|
| 登录页 | `desktop-login.png` |
| 首页工作台 | `desktop-home-dashboard.png` |
| 商家营销生图 | `desktop-marketing-image-generator.png` |
| 智能生成试卷 | `desktop-paper-generator.png` |
| Dev OS Dashboard | `dev-os-dashboard.png` |

桌面端整体要求：

- 左侧导航。
- 顶部搜索 / 状态 / 用户区。
- 中央大卡片或多列工作区。
- 圆角卡片、柔和阴影、信息密度适中。
- 操作按钮清晰，有主次层级。

## 移动端页面基准

| 页面 | 图片 |
|---|---|
| 登录 / 注册 | `mobile-login-register.png` |
| 首页工作台 | `mobile-home-dashboard.png` |
| 商家营销生图 | `mobile-image-generator.png` |
| 智能生成试卷 | `mobile-paper-generator.png` |

移动端整体要求：

- 单列纵向信息流。
- 大圆角卡片。
- 清晰的步骤感。
- 主要操作按钮靠近当前任务区域。
- 底部导航或移动端友好入口可按实现框架决定，但不能破坏参考图结构。

## Dev OS Dashboard 视觉基准

主基准：`dev-os-dashboard.png`

Dashboard 必须表现为开发过程管理面板，包含：

- 整体进度。
- 任务看板。
- Agent 状态。
- Roadmap。
- 风险与决策。
- Wiki 快速入口。

Dashboard 数据必须来自真实事实源，不得写死演示数字。

## 实现约束

- 前端不能自行改品牌方向。
- 前端不能用随机生成的新 UI 风格覆盖这些设计稿。
- 如果设计稿不完整，先在任务文档列出缺口，再由 `yuan-control` 或用户确认。
- 若某处无法还原，必须记录原因、影响和替代方案。
