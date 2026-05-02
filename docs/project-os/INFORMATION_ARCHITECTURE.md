# INFORMATION_ARCHITECTURE：信息架构

状态：draft
更新时间：2026-05-02

## 总体结构

两元店首期包括两个系统面：

1. 用户 Web App：面向真实用户使用生图和试卷生成。
2. Dev OS Dashboard：面向项目开发过程管理。

二者可以共用品牌和基础组件，但数据来源和用户目标不同。

## 用户 Web App 页面

### 未登录

| 路由建议 | 页面 | 设计稿 |
|---|---|---|
| `/login` | 登录 / 注册 | `desktop-login.png`、`mobile-login-register.png` |

### 已登录

| 路由建议 | 页面 | 设计稿 |
|---|---|---|
| `/` 或 `/dashboard` | 首页工作台 | `desktop-home-dashboard.png`、`mobile-home-dashboard.png` |
| `/image-generator` | 商家营销生图 | `desktop-marketing-image-generator.png`、`mobile-image-generator.png` |
| `/paper-generator` | 智能生成试卷 | `desktop-paper-generator.png`、`mobile-paper-generator.png` |
| `/history` | 生成记录 | 暂无独立设计稿，可从首页最近创作延展 |
| `/membership` | 会员 / 额度 | 暂无独立设计稿，可从首页会员权益卡片延展 |
| `/settings` | 账号设置 | 暂无独立设计稿，首期可简化 |

## 导航结构

桌面端建议左侧导航：

- 首页
- 生图
- 生成试卷
- 我的作品 / 生成记录
- 会员中心
- 账号设置

移动端建议底部导航或顶部入口：

- 首页
- 生图
- 试卷
- 记录
- 我的

## 生图工作流

```text
选择图片比例
  ↓
选择业务场景
  ↓
选择行业类目
  ↓
填写需求描述
  ↓
上传商品图（可选）
  ↓
选择风格
  ↓
生成
  ↓
预览 / 保存 / 下载 / 再生成
```

## 试卷生成工作流

```text
选择年级
  ↓
选择科目
  ↓
选择教材版本
  ↓
选择单元 / 考试类型
  ↓
设置难度、题量、题型
  ↓
生成试卷
  ↓
预览
  ↓
导出 Word / PDF
```

## Dev OS Dashboard 页面

| 路由建议 | 页面 | 数据源 |
|---|---|---|
| `/dev-os` | 开发过程管理 Dashboard | `docs/project-os/dashboard.json` + Markdown |
| `/dev-os/tasks` | 任务看板 | `TASK_BOARD.md`、`tasks/*` |
| `/dev-os/agents` | Agent 状态 | `agents/*.md` |
| `/dev-os/risks` | 风险 | `RISKS.md` |
| `/dev-os/decisions` | 决策 | `DECISIONS.md` |

首期可以只实现 `/dev-os` 单页，把其他入口作为链接或卡片。

## 信息架构规则

- 用户 Web App 不应暴露内部 Agent 细节。
- Dev OS Dashboard 不应混入真实用户业务后台能力。
- 生成记录是业务数据；开发任务记录是项目事实源，两者必须分开。
