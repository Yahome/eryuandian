# TWA-001 Deep Research Report

> 来源：用户在 2026-05-08 提供的 `deep-research-report.md`。
> 用途：作为 TWA-001 Web App 技术栈冻结的用户确认依据。
> 注意：原文中的 `二元店` 指当前项目 `两元店 / eryuandian`。

# 二元店最适合让 AI 协同开发的前后端最优解

## 结论

如果今天直接拍板，我会定成这样：**Web 主前端**用 entity["software","Next.js","React framework for web"] + entity["software","React","JavaScript UI library"] + entity["software","TypeScript","typed superset of JavaScript"] + entity["software","Tailwind CSS","utility-first CSS framework"] + entity["software","shadcn/ui","React UI code distribution system"] + entity["software","TanStack Query","async state management library"]；**核心后端**用 entity["software","Node.js","JavaScript runtime"] 24 LTS + entity["software","NestJS","Node.js framework"] + entity["software","Fastify","Node.js web framework"] + entity["software","PostgreSQL","relational database"] + entity["software","Drizzle ORM","TypeScript ORM"] + entity["software","Redis","in-memory data store"] + entity["software","BullMQ","Redis-based job queue"]；**工程底座**用 entity["software","pnpm","JavaScript package manager"] workspace + entity["software","Turborepo","monorepo build system"] + entity["software","Biome","formatter and linter"] + entity["software","Zod","TypeScript-first schema validation library"] + entity["software","Storybook","frontend workshop for UI components"] + entity["software","Mock Service Worker","API mocking library"] + entity["software","Playwright","browser automation and testing framework"]；**移动端以后**再补一条 entity["software","Expo","framework for universal apps"] + entity["software","React Native","framework for native apps using React"] + entity["software","Expo Router","file-based router for Expo apps"] 的独立 app 线，但共享契约、API client、鉴权和 design token，不强求共享复杂 UI。这个组合最重要的优势不是“理论最先进”，而是它对 AI 编码代理最友好：有版本匹配文档、有明确目录约定、有 MCP/LLM 文档入口、有类型和 schema 单一真相，还有非常成熟的自动化验证链路。citeturn22search9turn5search17turn22search2turn17search0turn17search14turn18search0turn19search0turn19search11turn13search29turn14search0turn13search11turn13search3

| 层 | 我建议冻结的选择 |
|---|---|
| Web 前端 | Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + TanStack Query |
| API 后端 | Node.js 24 LTS + NestJS + Fastify adapter + OpenAPI |
| 数据与任务 | PostgreSQL 17/18 + Drizzle ORM + Redis + BullMQ |
| AI 接口层 | provider adapter + `Responses API` + `Structured Outputs` |
| 工程化 | pnpm workspace + Turborepo + Biome + Zod + Storybook + MSW + Playwright |
| 移动端后续 | Expo + React Native + Expo Router + NativeWind，单独 UI，共享领域层 |

我不把纯 entity["software","Vite","frontend build tool"] SPA 作为第一选择，也不把 Python 当主后端。前者当然能做出这些页面，但在“让 AI 高效接手项目”这个维度上，缺少 entity["software","Next.js","React framework for web"] 16 已经提供的 agent 文档、AGENTS.md、MCP 与 App Router 约定；后者虽然很适合模型训练和算法实验，但会把前后端和未来移动端拆成两套主语言，降低 AI 在仓库里跨层联动修改时的命中率。如果以后出现 OCR、复杂文档编排、重度数据处理，再加 Python worker sidecar 更合理。citeturn22search9turn5search17turn22search2turn18search5turn6search2

## 设计稿暴露出的真实约束

你给的设计稿非常清楚地说明，这不是一个“纯内容站”或“纯聊天壳”，而是一个**表单驱动的生成型业务台**。桌面首页有左侧导航、顶部搜索、通知、会员额度、近期作品和模板区；生图页是“左侧配置表单 + 右侧结果网格”；试卷页是“左侧配置 + 右侧试卷预览/导出”。移动端则明显换成了底部 Tab、顺序流程式表单、单列卡片流和底部主 CTA。也就是说，你的核心不是博客式渲染，而是**上传、配置、异步生成、资产回看、额度系统、导出和移动端差异化导航**。citeturn3view0turn2view2turn2view3turn2view4turn2view5turn2view6turn2view7

这组设计对技术选型有两个很硬的约束。第一，前端必须有成熟的组件复用和状态分层能力，因为这里既有大量表单和筛选 chip，也有上传、预览、结果卡片、会员块、额度块、文档预览和导出操作。第二，桌面和移动的导航形态差异非常明显：桌面是侧边栏 + 双栏工作区，移动是底部 Tab + 顺序表单流，这意味着你未来应该优先共享**契约和业务逻辑**，而不是一上来就执着于共享整套 UI。citeturn3view0turn2view2turn2view3turn2view4turn2view5turn2view7

正因为如此，最优解不是“找一个什么都能跑的平台然后硬凑”。最优解应该是：**Web 先做到最好，让 AI 可以稳定生成和改代码；未来移动端平移时，把共享范围严格收敛到 schema、API client、鉴权、设计 token 和少量无平台依赖的 domain logic**。这一点，后面的前后端建议都是围绕它展开的。citeturn2view2turn2view3turn2view4turn2view5turn2view6turn2view7

## 适合 AI 写前端的最优解

我会把 Web 主前端放在 entity["software","Next.js","React framework for web"] 上，而不是继续停留在“React + Vite 就够了”的层面。原因不是 entity["software","Vite","frontend build tool"] 不够快，而是从 2026 年的官方能力来看，entity["software","Next.js","React framework for web"] 已经把 **AI-assisted development** 当成产品目标本身来做：16+ 内置面向编码代理的 MCP 支持；16.2 明确加入了给 agents 用的 create-next-app、浏览器日志转发和 agent 调试改进；文档还提供了与安装版本匹配的打包文档和根目录 `AGENTS.md` 指引，让代理优先读本地版本文档而不是瞎猜旧知识。对 AI 来说，这比“只是构建快”更重要，因为它直接决定 AI 改动目录、路由、数据获取和运行时边界时的正确率。与此同时，App Router 本身又把 Server Components、Suspense、Server Functions 和 streaming 放进了一套统一约定里。citeturn5search17turn22search2turn22search7turn22search9turn5search5turn5search2turn5search15

在 UI 层，我会选 entity["software","Tailwind CSS","utility-first CSS framework"] 4 + entity["software","shadcn/ui","React UI code distribution system"]。这里不是因为“大家都在用”，而是因为这两个工具对 AI 的可操作性非常高。entity["software","Tailwind CSS","utility-first CSS framework"] 4 官方强调了新版本的性能和配置体验，且对 entity["software","Vite","frontend build tool"] / modern framework 的接入已经很顺手；entity["software","shadcn/ui","React UI code distribution system"] 则不仅明确写了“works with your favorite frameworks and AI models”，还提供 `components.json` schema 和专门给 AI 助手用的 Skills，让代理能按项目真实配置去添加、组合和定制组件。换句话说，AI 不是在“猜一个 UI 库怎么用”，而是在一个**机器可理解的组件分发系统**里工作。对于你的页面，这特别重要，因为登录、会员卡、额度条、筛选 chip、sheet、dialog、textarea、卡片网格和表单都属于 entity["software","shadcn/ui","React UI code distribution system"] 的强项。citeturn4search2turn4search25turn19search0turn19search11turn19search12turn19search19turn19search15turn19search9

数据层我会用 entity["software","TanStack Query","async state management library"]，但只放在真正的 client islands 里：比如生图提交、列表轮询、最近作品刷新、额度刷新、导出状态查询这些“异步 server state”，不要把整个 App 都重新做成老式 SPA。这样一来，首屏和布局交给 Next 的 App Router 与 server rendering，真正高频交互的局部再交给 Query。这个混合模型对 AI 非常友好，因为 server/client 边界更清楚，生成结果也更不容易出现“所有东西都塞在 useEffect”里的混乱结构。citeturn5search5turn5search15turn5search3turn5search6

如果再往“让 AI 写得更准”推进一步，我会把前端验证回路设成 **Storybook + MSW + Playwright**。entity["software","Storybook","frontend workshop for UI components"] 可以把组件和页面隔离开发，并把 stories 直接转成 living docs；entity["software","Mock Service Worker","API mocking library"] 可以把 mock 复用到浏览器、Node 和测试环境；entity["software","Playwright","browser automation and testing framework"] 则一方面支持 Chromium、WebKit、Firefox 以及移动模拟，另一方面从 2026 年开始有了明确的 Playwright MCP 和面向 coding agents 的 CLI/MCP 工作流，甚至能通过 accessibility snapshots 而不是截图来驱动 AI 浏览器操作。对于你的桌面/移动双形态页面，这种“AI 改组件 → Storybook 看状态 → Playwright 跑回归”的闭环，比任何单一框架选择都更影响研发效率。citeturn15search5turn15search26turn15search6turn16search0turn17search0turn17search5turn17search14turn17search6

如果你坚持保留 entity["software","Vite","frontend build tool"] 作为备选，它仍然是第二选择，而不是被淘汰。因为 entity["software","Tailwind CSS","utility-first CSS framework"] 官方把 Vite 视为顺手接入方式，entity["software","shadcn/ui","React UI code distribution system"] 也明确支持 Vite 模板；再加上 entity["software","React","JavaScript UI library"] Compiler 1.0 已与 entity["software","Expo","framework for universal apps"]、Vite 和 entity["software","Next.js","React framework for web"] 集成，说明这条线不会过时。只是如果目标是“让 AI 直接接手项目并长期维护”，我仍然把 entity["software","Next.js","React framework for web"] 放在第一位。citeturn4search25turn19search8turn4search16

## 适合 AI 写后端的最优解

后端主栈我会选 **entity["software","Node.js","JavaScript runtime"] 24 LTS + entity["software","NestJS","Node.js framework"] + entity["software","Fastify","Node.js web framework"] adapter**。截至 2026 年 5 月，Node 24 是官方 LTS，Node 26 是 Current；如果你要给 AI 一个能长期稳定写下去的生产主线，LTS 才是正确基线。entity["software","NestJS","Node.js framework"] 的价值在于它把模块、控制器、服务、DI、验证、异常过滤、WebSocket、OpenAPI 这些后端常见横切能力全部放进一种高度可预测的代码组织里；官方文档也明确说明它内置 Express 和 Fastify 两个平台支持，而 Fastify 在基准上明显快于 Express。对 AI 来说，这种“规范先于代码”的框架比微型框架更友好，因为目录、职责和扩展点不容易发散。citeturn6search2turn18search5turn6search4turn20search24turn6search0turn6search12

我不推荐 Python 做这类项目的**主后端**。原因不是 Python 不适合 AI，而是你的产品形态更像一个“有大量前台交互、鉴权、额度、任务、作品资产、移动端延展”的 SaaS，而不是一个以训练、推理服务编排或数据科学工作流为中心的平台。对这种产品，前后端和移动端尽量保持在 entity["software","TypeScript","typed superset of JavaScript"] 一条主语言上，会让 AI 在改 Web、改 API、改 schema、改移动 client 时拥有同一套类型上下文。真正要用 Python 的地方，应该作为**异步 worker 或 sidecar**出现，例如 OCR、复杂排版、学科题库处理或某些必须依赖 Python 生态的算法任务，而不是让整个主 API 服务切到两套主语言。这个判断本质上是维护成本和 AI 命中率的平衡。citeturn18search5turn6search4turn8search0

数据库我会选 entity["software","PostgreSQL","relational database"]，并优先搭配 entity["software","Drizzle ORM","TypeScript ORM"]。entity["software","PostgreSQL","relational database"] 的官方定位仍然是功能全面、可安全存储和扩展复杂数据负载的开源关系数据库，而 `pgvector` 让它在需要时还能把 embeddings 和业务表放在同一个数据库里处理。entity["software","Drizzle ORM","TypeScript ORM"] 的优势则在于它本身就是轻量、性能导向、TypeScript-first 的 ORM；相比需要单独 DSL 和生成流程的 ORM，它更接近“你写的就是代码本身”。在 AI 协同开发场景里，这种显式、SQL-like、少魔法的方式通常更容易让代理在读 schema、改 query、查类型时保持一致性。Prisma 依然是很强的第二选择，尤其当你更重视 Studio 和更重的抽象层时；但如果让我拍一个更适合 AI 长期接手的方案，我会先选 Drizzle。citeturn7search2turn7search3turn7search0turn7search7turn7search14

异步任务层我会直接上 entity["software","Redis","in-memory data store"] + entity["software","BullMQ","Redis-based job queue"]。你的生图和试卷生成，本质上都不是“瞬时 CRUD”，而是**提交任务、排队、处理、回写结果、更新状态、允许重试和导出**。BullMQ 官方就把自己定义成一个快速、稳健、基于 Redis 的队列系统；对第一阶段产品，这已经足够。只有当你未来真的出现跨天长流程、人工介入审批、复杂子任务依赖、多工具链重入、或者 agentic workflow 需要 durable execution 时，我才建议在队列之上新增 entity["software","Temporal","durable execution platform"] 这一层，而不是一开始就把系统复杂度抬太高。Temporal 官方强调的是“crash-proof execution”和 durable execution；这很强，但也意味着更高的操作复杂度。对当前这类生成型 SaaS，BullMQ 先上、Temporal 后补，是更稳的路线。citeturn6search3turn6search31turn10search0turn10search1turn10search6

文件层我建议一开始就用 **S3 兼容对象存储**，本地阶段可用 MinIO，自托管或云阶段再切真实 S3。你这个产品一定会有生成图片、缩略图、导出 PDF、导出 Word、模板封面、历史作品等二进制资产；这些东西不应该长期塞本地磁盘。官方文档里，S3 Standard 明确是 11 个 9 的 durability，MinIO 的对象存储文档也强调自己使用标准 S3-compatible API。也就是说，先用 MinIO 保持开发/自托管一致，再按需要切云对象存储，是最顺的演进方式。citeturn9search2turn9search5

模型接口层我会要求**全部走 provider adapter + 结构化输出**，而不是让业务代码到处直接拼 prompt。这里非常建议把模型侧协议收敛到 `Responses API` 和 `Structured Outputs` 这种能够强制 JSON Schema 的能力上。官方文档已经明确：Responses 是新项目推荐的主接口；Structured Outputs 可以确保模型遵循你给出的 JSON Schema；流式输出则支持通过 SSE 尽早返回结果。对你的产品来说，这意味着“生图配置”“试卷大纲”“题目结构”“运营文案块”“导出任务元数据”都可以先变成稳定的 schema，再进入落库和渲染流程。这样一来，AI 写后端时面对的是**清晰的 contract**，不是到处散落的 prompt 字符串。urlResponses APIturn12search3、urlStructured Outputsturn12search2 和流式响应文档都明确支持这条做法。citeturn12search3turn12search2turn12search7turn12search19

## 让 AI 真正高效的工程底座

如果说前后端框架决定了“AI 能不能写”，那工程底座决定的就是“AI 写出来会不会持续可维护”。这里我会坚持 monorepo，而且用 entity["software","pnpm","JavaScript package manager"] workspace + entity["software","Turborepo","monorepo build system"]。pnpm 官方支持 monorepo/workspace，Turbo 官方又明确建立在 workspace 约定上，并且通过缓存与并行执行优化仓库任务。对你这种未来很可能同时拥有 `apps/web`、`apps/api`、`apps/mobile` 和 `packages/contracts`、`packages/api-client`、`packages/design-tokens` 的项目，monorepo 不是“高级玩法”，而是让 AI 能够在一个仓库里看见全局关系的基础设施。citeturn14search0turn14search9turn13search11turn13search15

我还会把格式化和 lint 统一到 entity["software","Biome","formatter and linter"]。Biome 官方强调自己既是 formatter 也是 linter，还有官方 VS Code 扩展。对人类开发者它的意义是更快，对 AI 的意义则更直接：**减少风格噪音和工具碎片**。当 AI 修改 8 个文件时，你不希望它还要同时揣摩 Prettier、ESLint、import-sort、custom lint preset 之间的差异；统一到 Biome，能显著提升“改完即过线”的概率。citeturn13search3turn13search7turn13search14turn13search18

最关键的一层是 schema。我的建议是把 `packages/contracts` 设成全仓库单一真相，用 entity["software","Zod","TypeScript-first schema validation library"] 定义核心输入输出，并从它派生 API types、表单校验、模型结构化输出 schema，以及必要的文档元数据。Zod 官方文档甚至直接写了 metadata/registries 对文档、code generation、AI structured outputs 和 form validation 都有价值。这几乎就是“AI 友好仓库”的核心：你要让 AI 看到的是**一个 schema 驱动的系统**，而不是一堆互相复制又慢慢漂移的 interface、DTO、form rules 和 prompt contract。citeturn13search2turn13search21turn13search29

在可视化与联调层，我会做三件事。第一，Storybook 把组件状态文档化，尤其是空态、加载态、错误态、额度不足态。第二，MSW 把 API mock 固化成真正可复用的 mock，而不是在页面里写一堆 if/else 假数据。第三，Playwright 负责跑桌面和移动 Web 回归，并把失败 trace 保存出来。这样一来，AI 写完组件可以立刻在 Storybook 看，写完状态机可以用 MSW 驱动，写完页面再让 Playwright 跑回归。更进一步，如果你接入 Playwright MCP，AI 甚至可以直接基于 accessibility snapshot 去探索页面和生成 locator；官方也明确区分了 coding agents 更偏好 `playwright-cli` 的 token-efficient 流程，而 MCP 更适合带状态的 agentic loop。citeturn15search5turn15search26turn15search6turn17search0turn17search14turn17search13turn16search3

如果你还想再把这条路线发挥到极致，我建议把仓库里真正面向 AI 的四个文件固定下来：根目录 `AGENTS.md`、`packages/contracts` 的 schema 文档、`components.json`、以及生成出来的 OpenAPI spec。前者让 agent 先读项目约束，中间两个让它理解 UI 和 schema，最后一个让 web/mobile client 自动生成。Nest 的 OpenAPI 模块、`orval` 这种从 OpenAPI 生成 TS client/mocks/validators 的工具，都说明这个链路已经足够成熟了。AI 最怕的不是复杂，而是**没有机器可读的约束**。citeturn22search9turn8search0turn8search3turn19search12

## 平移到 Android 和 iOS 的正确路线

你后面确实很可能要上 Android/iOS，但我不建议现在就为了“未来可能上移动端”而把 Web 前端改成“一套 React Native Web/Universal UI 通吃”。原因很简单：从设计稿看，桌面和移动已经不是简单响应式关系，而是两种不同导航模型。桌面侧重工作台、双栏、预览区和信息密度；移动侧重底部 Tab、顺序表单流和单列卡片。如果现在硬追求“一套 UI 代码同时跑 Web 与 Native”，你会在桌面端体验、组件生态和页面结构上不断妥协。更合理的方式是：**先把 Web 用 Next.js 做到成熟，再在同一 monorepo 里开一个 Expo app，共享 schema、api client、auth、token 和业务 utilities**。citeturn3view0turn2view2turn2view3turn2view4turn2view5turn2view6turn2view7

移动端我会选 entity["software","Expo","framework for universal apps"] + entity["software","React Native","framework for native apps using React"] + entity["software","Expo Router","file-based router for Expo apps"]。Expo 官方文档一方面继续强调它能做 Android、iOS 和 web 的 universal app，另一方面已经专门提供了给 AI agents 和 LLMs 消费的低 token 成本文档入口；Expo Router 官方也明确说明了它是面向 React Native 和 web 的 file-based router，天然支持 deep linkable、offline-first 的应用体验。这对你很重要：以后无论是微信登录回调、作品分享跳转、营销图详情页还是试卷记录页，deep link 和路由一致性都会节省很多成本。citeturn4search3turn18search0turn18search7turn11search3turn4search7turn4search11

样式层如果未来走 Expo，我倾向于用 entity["software","NativeWind","Tailwind CSS for React Native"]，因为它能把 Web 团队熟悉的 Tailwind 工作流带到 React Native 里；但我要特别强调，它适合作为“熟悉的 token 和 utility 语言”，不应该被误解为“桌面 Web 和 Native 一套 UI 组件直接通用”。NativeWind 官方文档自己就提醒了，默认 responsive theme 仍然主要沿用 Web 设计。换句话说，它更适合帮你共享设计 token 和样式语言，而不是直接替代 Web 的完整布局体系。对你这类产品，正确的共享单位仍然是**设计 token + schema + API client + auth logic**，而不是把桌面 Dashboard 组件硬搬到 Native。citeturn11search0turn11search4

所以，真正正确的移动路线是这样的：**现在冻结 Web 主线为 Next.js；后端和 contracts 从第一天就按 web/mobile 双消费者设计；等 Web MVP 稳定后，在 monorepo 新建 Expo app，复用 contracts、生成的 API client、鉴权流程和部分 token；UI 则根据移动设计稿重新实现。** 这样做的好处不是“少写代码”，而是“AI 在第二阶段迁移时仍然能复用第一阶段的语义层资产”，避免把一次产品扩展变成一次技术重写。citeturn14search0turn13search11turn18search0turn11search3turn13search29