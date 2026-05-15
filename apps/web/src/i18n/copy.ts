import type { SupportedLocale } from "@/i18n/routing";

export const MARKET_PLACEHOLDER = "MARKET_PLACEHOLDER";

type FeatureCopy = {
  title: string;
  description: string;
  cta: string;
};

type RecentItemCopy = {
  title: string;
  meta: string;
  badge: string;
};

type MetricCopy = {
  label: string;
  value: string;
  delta: string;
};

export type LocaleCopy = {
  localeLabel: string;
  brandName: string;
  brandTagline: string;
  marketLabel: string;
  landing: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    generatorEntryTitle: string;
    generatorEntryBody: string;
    paperEntryTitle: string;
    paperEntryBody: string;
    staticNotice: string;
  };
  workspace: {
    searchPlaceholder: string;
    homeTitle: string;
    homeSubtitle: string;
    dashboardTitle: string;
    dashboardSubtitle: string;
    homeNavLabel: string;
    dashboardNavLabel: string;
    imageNavLabel: string;
    paperNavLabel: string;
    profileNavLabel: string;
    quickStartTitle: string;
    quickSteps: [string, string, string, string];
    recentTitle: string;
    templatesTitle: string;
    recentItems: [RecentItemCopy, RecentItemCopy, RecentItemCopy, RecentItemCopy];
    templateItems: [string, string, string, string, string, string];
    membershipTitle: string;
    membershipBody: string;
    quotaTitle: string;
    quotaImage: string;
    quotaPaper: string;
    featureImage: FeatureCopy;
    featurePaper: FeatureCopy;
  };
  dashboard: {
    snapshotTitle: string;
    snapshotBody: string;
    metrics: [MetricCopy, MetricCopy, MetricCopy, MetricCopy];
  };
};

const COPY_MAP: Record<SupportedLocale, LocaleCopy> = {
  "zh-CN": {
    localeLabel: "中文",
    brandName: "两元店",
    brandTagline: "AI 创作好帮手",
    marketLabel: "Market 占位",
    landing: {
      eyebrow: "TWA-001B",
      title: "最小静态 UI",
      description:
        "只用于验证多语言路由、布局与静态展示，不包含登录、支付、真实生成。",
      primaryAction: "进入 App 首页",
      secondaryAction: "进入 Dashboard",
      generatorEntryTitle: "生图入口（占位）",
      generatorEntryBody: "用于展示卡片与导航，不接入真实生图流程。",
      paperEntryTitle: "试卷入口（占位）",
      paperEntryBody: "用于展示卡片与导航，不接入真实试卷流程。",
      staticNotice: "当前版本仅保留静态演示内容。",
    },
    workspace: {
      searchPlaceholder: "搜索模板、作品或功能",
      homeTitle: "欢迎回来，开始今天的创作",
      homeSubtitle: "两元店 AI 助力，让创作更简单高效。",
      dashboardTitle: "Dashboard 概览",
      dashboardSubtitle: "查看静态指标、快速入口与最近内容。",
      homeNavLabel: "首页",
      dashboardNavLabel: "看板",
      imageNavLabel: "生图",
      paperNavLabel: "试卷",
      profileNavLabel: "我的",
      quickStartTitle: "快速开始",
      quickSteps: ["选择类型", "输入需求", "AI 生成", "调整导出"],
      recentTitle: "最近创作",
      templatesTitle: "推荐模板",
      recentItems: [
        { title: "五一促销海报", meta: "今天 10:30", badge: "生图" },
        { title: "柠檬洗洁精主图", meta: "昨天 16:45", badge: "生图" },
        { title: "八年级数学期中", meta: "昨天 09:15", badge: "试卷" },
        { title: "物理练习卷", meta: "4 月 28 日", badge: "试卷" },
      ],
      templateItems: ["促销海报", "新品上架", "五一活动", "八年级物理", "人教版数学", "期中测试"],
      membershipTitle: "会员权益（静态）",
      membershipBody: "展示配色与布局，不包含购买与支付。",
      quotaTitle: "本月额度（静态）",
      quotaImage: "生图额度 82 / 100",
      quotaPaper: "试卷额度 28 / 30",
      featureImage: {
        title: "商家营销生图",
        description: "AI 一键生成营销主图与海报，当前仅静态占位。",
        cta: "立即进入",
      },
      featurePaper: {
        title: "智能生成试卷",
        description: "按知识点组织试卷结构，当前仅静态占位。",
        cta: "立即进入",
      },
    },
    dashboard: {
      snapshotTitle: "静态数据卡",
      snapshotBody: "这些数字仅用于 TWA-001B 的界面展示。",
      metrics: [
        { label: "生图总数", value: "1,268", delta: "+18.6%" },
        { label: "试卷总数", value: "342", delta: "+12.4%" },
        { label: "节省时间", value: "36.5 小时", delta: "+20.3%" },
        { label: "我的收藏", value: "128", delta: "+8.7%" },
      ],
    },
  },
  en: {
    localeLabel: "English",
    brandName: "Eryuandian",
    brandTagline: "AI Creation Assistant",
    marketLabel: "Market Placeholder",
    landing: {
      eyebrow: "TWA-001B",
      title: "Minimal Static UI",
      description:
        "This build only verifies locale routing, layout, and static presentation without auth, billing, or real generation.",
      primaryAction: "Open App Home",
      secondaryAction: "Open Dashboard",
      generatorEntryTitle: "Image Entry (Placeholder)",
      generatorEntryBody: "Card and navigation only. No real image generation flow.",
      paperEntryTitle: "Paper Entry (Placeholder)",
      paperEntryBody: "Card and navigation only. No real paper generation flow.",
      staticNotice: "Current version is static demo content only.",
    },
    workspace: {
      searchPlaceholder: "Search templates, creations, or features",
      homeTitle: "Welcome back, start creating today",
      homeSubtitle: "Eryuandian AI keeps your workflow simple and efficient.",
      dashboardTitle: "Dashboard Overview",
      dashboardSubtitle: "Check static metrics, quick entries, and recent items.",
      homeNavLabel: "Home",
      dashboardNavLabel: "Dashboard",
      imageNavLabel: "Image",
      paperNavLabel: "Paper",
      profileNavLabel: "Profile",
      quickStartTitle: "Quick Start",
      quickSteps: ["Choose Type", "Describe Need", "AI Draft", "Tune & Export"],
      recentTitle: "Recent Creations",
      templatesTitle: "Recommended Templates",
      recentItems: [
        { title: "May Promo Poster", meta: "Today 10:30", badge: "Image" },
        { title: "Lemon Product Main", meta: "Yesterday 16:45", badge: "Image" },
        { title: "Grade 8 Midterm", meta: "Yesterday 09:15", badge: "Paper" },
        { title: "Physics Practice", meta: "Apr 28", badge: "Paper" },
      ],
      templateItems: ["Promo Poster", "New Product", "Holiday Event", "Grade 8 Physics", "Math Workbook", "Midterm Test"],
      membershipTitle: "Membership (Static)",
      membershipBody: "Visual placeholder only, no purchase or billing flow.",
      quotaTitle: "Monthly Quota (Static)",
      quotaImage: "Image Quota 82 / 100",
      quotaPaper: "Paper Quota 28 / 30",
      featureImage: {
        title: "Marketing Image Generator",
        description: "One-click campaign visuals. Static entry only in this milestone.",
        cta: "Enter",
      },
      featurePaper: {
        title: "Smart Paper Generator",
        description: "Build question paper structure by knowledge points. Static entry only.",
        cta: "Enter",
      },
    },
    dashboard: {
      snapshotTitle: "Static Metrics",
      snapshotBody: "Numbers below are UI placeholders for TWA-001B only.",
      metrics: [
        { label: "Images", value: "1,268", delta: "+18.6%" },
        { label: "Papers", value: "342", delta: "+12.4%" },
        { label: "Time Saved", value: "36.5 hrs", delta: "+20.3%" },
        { label: "Favorites", value: "128", delta: "+8.7%" },
      ],
    },
  },
};

export function getCopy(locale: SupportedLocale): LocaleCopy {
  return COPY_MAP[locale];
}
