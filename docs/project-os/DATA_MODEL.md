# DATA_MODEL：数据模型草案

状态：草稿（内部标识：`draft`）
更新时间：2026-05-02

## 说明

本文档定义首期业务数据模型草案。字段用于前后端协作和后续数据库设计，不代表最终数据库 schema。

## User

用户。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 用户 ID |
| `phone` | string | 手机号 |
| `nickname` | string | 昵称 |
| `avatar_url` | string/null | 头像 |
| `membership` | enum | `free`、`pro` |
| `credits` | number | 当前额度 |
| `today_usage` | number | 今日使用次数 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

## CreditLedger

额度流水。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 流水 ID |
| `user_id` | string | 用户 ID |
| `change` | number | 正数为增加，负数为扣减 |
| `reason` | string | 变更原因 |
| `related_record_id` | string/null | 关联生成记录 |
| `created_at` | datetime | 创建时间 |

## GenerationRecord

生成记录统一表。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 记录 ID |
| `user_id` | string | 用户 ID |
| `type` | enum | `image`、`paper` |
| `title` | string | 标题 |
| `status` | enum | `queued`（排队中）、`running`（运行中）、`succeeded`（已完成）、`failed`（失败） |
| `input` | object | 生成输入 |
| `output` | object | 生成输出 |
| `credits_used` | number | 消耗额度 |
| `error_message` | string/null | 错误信息 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

## ImageGenerationInput

| 字段 | 类型 | 说明 |
|---|---|---|
| `ratio` | string | 图片比例 |
| `scene` | string | 业务场景 |
| `industry` | string | 行业类目 |
| `prompt` | string | 用户需求描述 |
| `style` | string | 风格 |
| `source_image_ids` | string[] | 上传图片 ID |

## ImageGenerationOutput

| 字段 | 类型 | 说明 |
|---|---|---|
| `results` | array | 结果图片列表 |
| `provider` | string | AI 服务提供方 |
| `model` | string | 模型名称 |

## PaperGenerationInput

| 字段 | 类型 | 说明 |
|---|---|---|
| `grade` | string | 年级 |
| `subject` | string | 科目 |
| `textbook_version` | string | 教材版本 |
| `scope` | string | 单元 / 范围 |
| `exam_type` | string | 考试类型 |
| `difficulty` | enum | `easy`、`medium`、`hard` |
| `question_count` | number | 题量 |
| `question_types` | string[] | 题型 |

## PaperGenerationOutput

| 字段 | 类型 | 说明 |
|---|---|---|
| `preview_markdown` | string | 试卷 Markdown 预览 |
| `answer_markdown` | string/null | 答案与解析 |
| `export_urls.word` | string/null | Word 导出地址 |
| `export_urls.pdf` | string/null | PDF 导出地址 |

## FileAsset

上传或生成的文件。

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | 文件 ID |
| `user_id` | string | 用户 ID |
| `kind` | enum | `upload`、`generated_image`、`export_docx`、`export_pdf` |
| `url` | string | 文件访问地址 |
| `mime_type` | string | 文件类型 |
| `size_bytes` | number | 文件大小 |
| `created_at` | datetime | 创建时间 |

## DevOS 数据模型

Dev OS 首期不进业务数据库，直接读取 Markdown / JSON。

- `dashboard.json`：聚合展示数据。
- `TASK_BOARD.md`：任务状态。
- `agents/*.md`：Agent 进度。
- `RISKS.md`：风险。
- `DECISIONS.md`：决策。

后续如需数据库化，必须保持 Markdown 仍为事实源或明确迁移规则。
