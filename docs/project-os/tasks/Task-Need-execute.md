你现在以 `yuan-control` 身份，在 `/root/eryuandian` 仓库 `main` 分支继续执行。  
  
当前 GitHub `main` HEAD 应为：  
  
- `bfa41c408abd3777bf1264ad6c6a94a44dc643dc`  
- commit message：`冻结 TWA-002 登录会话实现前架构`  
  
当前 TWA-002 状态应为：  
  
- owner：`yuan-architect`  
- status：`in_progress`  
- progress：`70`  
  
本轮总目标分成两个阶段：  
  
# 阶段 1：TWA-002A.1 契约唯一化与文档一致性修正  
先修复上一轮审核发现的契约漂移 / 文档不一致问题。  
  
# 阶段 2：若 reviewer 确认契约唯一化完成，则正式开启下一步  
进入：  
- TWA-002B：登录页与会话态前端 Mock 实现  
- TWA-002C：Auth Mock Service + Adapter interfaces 后端/服务层实现  
  
注意：  
- 阶段 1 修复完成并 reviewer PASS 之前，禁止派 frontend/backend 开工。  
- 只有 reviewer 明确确认“唯一冻结契约已收口，可以正式放行实现”后，才允许创建并派发 TWA-002B / TWA-002C。  
- 本轮如果成功进入阶段 2，可以直接执行 frontend/backend 实现，不只是生成 prompt。  
  
==================================================  
0. 执行前预检  
==================================================  
  
先执行：  
  
cd /root/eryuandian  
git status --short  
git branch --show-current  
git pull --ff-only  
git log --oneline -10  
  
要求：  
  
- 当前分支必须是 `main`  
- 工作区必须干净  
- 必须看到以下提交：  
- `bfa41c4 冻结 TWA-002 登录会话实现前架构`  
- `210a7f3 启动 TWA-002 登录会话前置规划`  
- `7919d5c 收口 TWA-001 并同步完成状态`  
  
如不满足，立即停止并汇报。  
  
==================================================  
1. 必须读取事实源  
==================================================  
  
完整读取：  
  
- docs/project-os/SOURCE_OF_TRUTH.md  
- docs/project-os/ROADMAP.md  
- docs/project-os/TASK_BOARD.md  
- docs/project-os/CHANGELOG.md  
- docs/project-os/API_CONTRACT.md  
- docs/project-os/DATA_MODEL.md  
- docs/project-os/DECISIONS.md  
- docs/project-os/RISKS.md  
- docs/project-os/dashboard/summary.md  
- docs/project-os/dashboard/dashboard.json  
- docs/project-os/dashboard.json  
- docs/project-os/tasks/web-app/TWA-000-Web-App-MVP-架构冻结与开发基线.md  
- docs/project-os/tasks/web-app/TWA-001-Web-App-技术栈冻结与移动优先-App-Shell-基础.md  
- docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md  
- docs/project-os/agents/yuan-control.md  
- docs/project-os/agents/yuan-architect.md  
- docs/project-os/agents/yuan-frontend.md  
- docs/project-os/agents/yuan-backend.md  
- docs/project-os/agents/yuan-reviewer.md  
  
同时读取设计稿：  
- pic/desktop-login.png  
- pic/mobile-login-register.png  
  
==================================================  
2. 阶段 1：TWA-002A.1 契约唯一化与文档一致性修正  
==================================================  
  
本阶段只做文档和事实源修正。  
  
不允许：  
- 不修改 `apps/web`  
- 不新增后端源码  
- 不创建 handler  
- 不创建 schema / migration  
- 不写真实 provider  
- 不接短信  
- 不写 secret / token / key  
  
--------------------------------------------------  
2.1 修复 API_CONTRACT.md 顶部断句 / 引号损坏  
--------------------------------------------------  
  
文件：  
- docs/project-os/API_CONTRACT.md  
  
当前问题：  
文件开头存在损坏句子：  
  
`TWA-002 之后，登录与会话契约以“## TWA-002 登录与会话 Mock / Adapter 契约补充（实现前冻结）`  
  
引号与句子没有闭合。  
  
要求修成完整句：  
  
`TWA-002 之后，登录与会话契约以“## TWA-002 登录与会话 Mock / Adapter 契约补充（实现前冻结）”为当前实现前冻结基准。TWA-000 与旧账号登录草案仅保留追溯；若路径或字段冲突，以本节为准。`  
  
--------------------------------------------------  
2.2 恢复 API_CONTRACT.md 的“通用约定”  
--------------------------------------------------  
  
当前问题：  
上一轮改动中不小心删掉了 API 总体约定：  
  
- Base path 建议：`/api`  
- 通用成功响应  
- 通用错误响应  
  
要求：  
在 TWA-002 冻结章节前，恢复：  
  
## 通用约定  
  
Base path 建议：`/api`  
  
### 通用成功响应  
  
```json  
{  
"success": true,  
"data": {},  
"error": null  
}
```
### 通用错误响应
```
{  
"success": false,  
"data": null,  
"error": {  
"code": "INVALID_INPUT",  
"message": "参数不合法"  
}  
}
```
注意：

- TWA-002 专属 ErrorDTO 可继续扩展 `request_id`、`details`
- 不要删掉 TWA-002 专属错误结构
- 通用响应与 TWA-002 特化响应要并存，逻辑上是“通用基线 + TWA-002 细化”

---

## 2.3 将 TWA-002 的执行契约收敛为“唯一版本”

当前问题：  
`docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md`  
内部存在多版本契约并存：

- 前半段“登录契约草案”是一版
- 中段冻结说明是一版
- 后段 DTO 冻结是一版
- API_CONTRACT.md 又是一版

这会误导后续 frontend/backend。

本轮必须明确一套“唯一实现基准”，并让所有文档与之对齐。

---

## 2.3.1 本轮最终唯一契约版本，严格采用以下定义

### Endpoint 最终只认 4 个

- `POST /api/auth/send-code`
- `POST /api/auth/login-phone`
- `GET /api/auth/session`
- `POST /api/auth/logout`

旧接口：

- `/api/auth/login`
- `/api/auth/sms-code`

仅保留历史追溯，不作为实现基准。

---

## 2.3.2 SendCodeRequest 最终定稿

最终采用：

```
type SendCodeRequest = {  phone: string;  scene: "login";};
```

不要在当前冻结契约中加入：

- `agree_terms`
- `captcha_token`

原因：

- `agree_terms` 已由登录提交阶段负责
- `captcha_token` 当前没有完整配套错误码与 provider 语义，属于真实 provider / 风控阶段，不应提前进入 TWA-002 mock contract

### SendCodeResponse

```
type SendCodeResponse = {  code_id: string;  cooldown_seconds: number;  expires_at: string;  delivery: "mock";};
```

---

## 2.3.3 LoginPhoneRequest 最终定稿

```
type LoginPhoneRequest = {  phone: string;  code: string;  code_id: string;  agree_terms: boolean;  return_to?: string | null;};
```

---

## 2.3.4 LoginPhoneResponse 最终定稿

```
type LoginPhoneResponse = {  session: SessionDTO;  user: UserDTO;  redirect_to: string;};
```

---

## 2.3.5 Session 查询最终定稿

### 有有效会话

```
{  session: SessionDTO;  user: UserDTO;}
```

### 无会话

```
{  session: null;  user: null;}
```

约定：

- `GET /api/auth/session` 无会话时：
    - HTTP 200
    - `success: true`
    - `data: { session: null, user: null }`
- 携带过期会话时：
    - HTTP 401
    - error code：`SESSION_EXPIRED`

不要再在冻结契约中出现：

- `authenticated: true`
- `authenticated: false`

如果文档中已有，统一删除或改为上述结构。

---

## 2.3.6 Logout 最终定稿

### LogoutRequest

无 body：

```
type LogoutRequest = Record<string, never>;
```

### LogoutResponse

统一为：

```
type LogoutResponse = {  logged_out: true;  cleared: true;};
```

不要出现仅有：

```
{ cleared: true }
```

---

## 2.3.7 DTO 最终定稿

```
type SessionDTO = {  session_id: string;  user_id: string;  status: "active" | "revoked" | "expired";  issued_at: string;  expires_at: string;  last_seen_at?: string;  is_mock: true;};type UserDTO = {  id: string;  phone: string;  phone_masked: string;  nickname: string | null;  membership: "free" | "pro";  credits: number;};
```

---

## 2.3.8 ErrorDTO 与错误码最终定稿

继续沿用当前冻结版本：

```
type ErrorDTO = {  code:    | "INVALID_PHONE"    | "UNSUPPORTED_SCENE"    | "SEND_CODE_TOO_FREQUENT"    | "CODE_ID_NOT_FOUND"    | "INVALID_CODE"    | "CODE_EXPIRED"    | "TERMS_NOT_AGREED"    | "SESSION_NOT_FOUND"    | "SESSION_EXPIRED";  message: string;  request_id: string;  details?: Record<string, string | number | boolean | null>;};
```

Endpoint 对应关系保持：

|Error Code|适用 Endpoint|
|---|---|
|INVALID_PHONE|send-code, login-phone|
|UNSUPPORTED_SCENE|send-code|
|SEND_CODE_TOO_FREQUENT|send-code|
|CODE_ID_NOT_FOUND|login-phone|
|INVALID_CODE|login-phone|
|CODE_EXPIRED|login-phone|
|TERMS_NOT_AGREED|login-phone|
|SESSION_NOT_FOUND|GET /api/me|
|SESSION_EXPIRED|GET /api/auth/session, GET /api/me|

---

## 2.4 修正文档中的 camelCase / snake_case 笔误

文件：

- docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md

当前存在错误表述：

`camelCase（code_id / expires_at）`

应改为：

`camelCase（codeId / expiresAt）`

---

## 2.5 整理 TWA-002 任务文档结构，避免多版本契约并存

文件：

- docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md

要求：

1. 在靠前位置新增正式章节：
    
    `## 当前实现前冻结结论（唯一执行基准）`
    
2. 该章节完整写入：
    - 路由：
        - `/[locale]/login`
    - 登录/注册同页 Tab
    - `return_to`
    - 4 个 endpoint
    - DTO 定稿
    - Session / Logout 定稿
    - ErrorDTO 定稿
    - Adapter 接口定稿
    - frontend/backend 并行条件
3. 文档中旧的“草案”段落可以保留作为历史过程记录，但必须明确标注：
    - `历史规划草案，当前实现以“当前实现前冻结结论（唯一执行基准）”为准`
4. 不得让前半段旧草案继续看起来像当前实现依据。

---

## 2.6 同步 API_CONTRACT.md 与 TWA-002 任务文档

必须确保以下内容在两份文档中一致：

- SendCodeRequest
- SendCodeResponse
- LoginPhoneRequest
- LoginPhoneResponse
- SessionResponse
- LogoutResponse
- ErrorDTO
- 4 个 endpoint
- 旧接口为历史，不可实现
- public DTO 使用 snake_case

不得出现：

- 一个文档含 `captcha_token`，另一个没有
- 一个文档含 `authenticated`，另一个没有
- 一个文档 login response 有 `redirect_to`，另一个没有
- 一个文档 logout 只有 `cleared`，另一个又是 `logged_out + cleared`

---

## 2.7 可选但建议：API_CONTRACT.md 将旧历史登录草案归档

如不扩大工作量，可新增章节：

`## 历史 Auth 草案归档`

将旧 token 响应 / 旧 login 草案统一放入该区域，避免混在主契约中。

如果你认为当前先不整理，也可不做，但必须保证其明确标注为历史，不可误作当前实现基准。

# ==================================================  
3. 调用 yuan-reviewer：只读审查“唯一冻结契约是否收口”

完成文档修复后，不得立刻派 frontend/backend。

先调用 `yuan-reviewer` 做只读审查。

reviewer 必须重点检查：

1. `API_CONTRACT.md` 顶部损坏句子是否修复。
2. 通用响应约定是否恢复。
3. TWA-002 任务文档是否新增“当前实现前冻结结论（唯一执行基准）”。
4. API_CONTRACT.md 与 TWA-002 任务文档中以下内容是否完全一致：
    - SendCodeRequest
    - SendCodeResponse
    - LoginPhoneRequest
    - LoginPhoneResponse
    - SessionResponse
    - LogoutResponse
    - ErrorDTO
5. 是否彻底删除 / 归档了多版本契约漂移：
    - `agree_terms` 不再出现在 send-code
    - `captcha_token` 不再出现在 send-code
    - `authenticated: true/false` 不再作为 session 当前契约
    - LogoutResponse 全部统一
6. camelCase 笔误是否修正：
    - `codeId / expiresAt`
7. TWA-000 superseded note 仍存在。
8. 事实源状态是否仍保持：
    - owner：yuan-architect
    - status：in_progress
    - progress：70
9. 没有新增业务代码、handler、schema、secret。

reviewer 必须给出明确结论：

- PASS
- PASS with notes
- BLOCKER / Major

若 reviewer 结论为 BLOCKER / Major：

- 不得进入下一阶段
- 先修复
- 再审

# ==================================================  
4. 阶段 1 验证命令

执行：

node scripts/dev-os-validate.mjs  
jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json  
cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json  
git diff --check

若有失败：

- 不提交
- 不进入 frontend/backend

# ==================================================  
5. 若 reviewer PASS，则提交阶段 1 修复

如果：

- reviewer PASS / PASS with notes
- 无 Blocker / Major
- 验证命令通过

则提交：

git add .  
git commit -m "收口 TWA-002A 契约唯一性与文档一致性"  
git push origin main

# ==================================================  
6. 阶段 2：正式开启下一步实现

只有在阶段 1 commit 已成功 push 后，才允许进入阶段 2。

阶段 2 目标：

正式开启：

# TWA-002B：登录页与会话态前端 Mock 实现

# TWA-002C：Auth Mock Service + Adapter interfaces 实现

要求：

- 两个任务可并行
- 必须以修复后的：
    - docs/project-os/API_CONTRACT.md
    - docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md  
        为唯一契约依据
- 不得再各自发明 DTO
- 不得实现真实 API handler
- 不得接真实 provider
- 不得改 DB schema

# ==================================================  
7. 创建并派发 TWA-002B 给 yuan-frontend

给 `yuan-frontend` 的 prompt：

你负责 TWA-002B：

“登录页与会话态前端 Mock 实现”。

前提：

- TWA-002A 契约唯一化与文档一致性修正已完成并通过 reviewer。
- 当前唯一契约以：
    - `docs/project-os/API_CONTRACT.md`
    - `docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md`  
        为准。

本轮目标：

1. 基于现有 Next.js Web App，新增 locale-aware 登录页：
    - `/zh-CN/login`
    - `/en/login`
2. 登录 / 注册同页 Tab：
    - 不创建 `/register`
    - 同页 Tab 切换
3. 对照设计稿实现：
    - `pic/desktop-login.png`
    - `pic/mobile-login-register.png`
4. 实现 mock 登录 UI 状态机：
    - 初始态
    - 手机号输入态
    - 发送验证码中
    - 冷却倒计时
    - 验证码输入态
    - 未勾选协议
    - 提交登录中
    - 登录成功
    - 验证码错误
    - 验证码过期
    - 会话检查中
    - 已登录态
    - 未登录态
    - logout 完成态
5. 处理：
    - `return_to`
    - 登录成功默认跳 `/{locale}/app/dashboard`
    - 未登录访问 `/{locale}/app` 与 `/{locale}/app/dashboard` 时，当前阶段保持静态可见，但显示 mock session 状态，不做真实 redirect
6. 增加前端本地 types / mock utilities，但不得与契约冲突。
7. 前端只做 mock flow，不直连真实短信，不做真实鉴权，不接真实 backend handler。

允许：

- 修改 `apps/web`
- 新增页面组件
- 新增 auth 相关前端组件
- 新增本地 mock state / hook / types
- 新增 locale copy

禁止：

- 不创建真实 network handler
- 不接真实短信
- 不接真实 provider
- 不改数据库 schema
- 不新增 secret/token/key
- 不提前实现真实微信登录
- 不提前实现支付、生图、试卷真实流程

完成后输出：

1. 实现路由
2. 设计稿对照结果
3. 状态机覆盖情况
4. return_to 处理逻辑
5. mock session 展示位置
6. 修改文件清单
7. 自检命令结果
8. 已知限制

# ==================================================  
8. 创建并派发 TWA-002C 给 yuan-backend

给 `yuan-backend` 的 prompt：

你负责 TWA-002C：

“Auth Mock Service + Adapter interfaces 实现”。

前提：

- TWA-002A 契约唯一化与文档一致性修正已完成并通过 reviewer。
- 当前唯一契约以：
    - `docs/project-os/API_CONTRACT.md`
    - `docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md`  
        为准。

本轮目标：

1. 实现纯服务层 mock auth 能力。
2. 实现 Adapter interfaces：
    - `SmsAdapter`
        - `sendCode`
        - `verifyCode`
    - `SessionAdapter`
        - `create`
        - `getCurrent`
        - `revokeCurrent`
3. 输出稳定 mock 数据结构与错误码映射，严格与冻结契约一致：
    - INVALID_PHONE
    - UNSUPPORTED_SCENE
    - SEND_CODE_TOO_FREQUENT
    - CODE_ID_NOT_FOUND
    - INVALID_CODE
    - CODE_EXPIRED
    - TERMS_NOT_AGREED
    - SESSION_NOT_FOUND
    - SESSION_EXPIRED
4. 保持无真实 handler：
    - 不创建真实 `/api/auth/*` route handler
    - 不开真实 network endpoint
    - 不落数据库
    - 不接短信 provider
    - 不建 migration
5. 如需创建目录，优先采用清晰隔离的 mock/service 结构，便于后续真实 provider 替换。
6. 不抽共享 `packages/contracts`，继续按 TWA-002A 冻结结论执行。

允许：

- 创建 mock auth service 文件
- 创建 adapter interface 文件
- 创建 mock provider 文件
- 创建少量类型定义
- 创建单元级/纯函数级自检脚本或最小测试，如现有工程结构支持

禁止：

- 不创建真实 API handler
- 不新增 NestJS app
- 不创建 schema / migration
- 不接 Redis / Postgres / SMS provider
- 不写 secret / token / key
- 不进入真实登录生产实现

完成后输出：

1. 目录结构
2. SmsAdapter / SessionAdapter 实现位置
3. mock service 能力
4. 错误码映射
5. 是否完全未创建 handler / DB schema
6. 自检命令结果
7. 已知限制

# ==================================================  
9. 阶段 2 reviewer 验收

当前轮如果成功派发并完成 TWA-002B / TWA-002C，实现结束后调用 `yuan-reviewer`。

reviewer 必须检查：

## 9.1 契约一致性

- frontend/backend 是否严格使用唯一冻结契约
- 没有重新发明 DTO
- 没有重新引入 captcha_token / authenticated 漂移
- Login / Session / Logout 结构一致

## 9.2 前端

- 是否新增 `/[locale]/login`
- 是否不新增 `/register`
- 是否对照 desktop/mobile 登录设计稿
- 是否实现 required state machine
- 是否处理 return_to
- 是否在 app/dashboard 展示 mock session 状态
- 是否没有真实登录 redirect

## 9.3 后端/服务层

- 是否仅实现 mock service + adapter interfaces
- 是否没有真实 API handler
- 是否没有 DB schema / migration
- 是否没有短信 provider
- 是否没有 secret

## 9.4 边界

- 未进入支付、生图、试卷真实功能
- 未越过 TWA-002 范围

reviewer 结论：

- PASS
- PASS with notes
- BLOCKER / Major

若有 Blocker / Major：

- 不提交实现
- 分别回 frontend / backend 修复
- 再审

# ==================================================  
10. 阶段 2 验证命令

若 TWA-002B / TWA-002C 均实现完成并 reviewer PASS，执行：

# 根 Dev OS

npm run lint  
npm run typecheck  
npm run build

# Web App

pnpm --dir apps/web run build  
pnpm --dir apps/web run typecheck  
pnpm --dir apps/web run lint

# 如 backend/mock service 有独立脚本或 typecheck，则按实际执行

# 事实源一致性

node scripts/dev-os-validate.mjs  
jq empty docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json  
cmp -s docs/project-os/dashboard/dashboard.json docs/project-os/dashboard.json  
git diff --check

# ==================================================  
11. 阶段 2 状态同步

若 TWA-002B / TWA-002C 均通过 reviewer 与验证：

建议同步：

- TWA-002 status：仍 `in_progress`
- owner：根据任务阶段可保持 `yuan-architect` 或由你根据事实源规则决定是否改为多 owner 说明
- progress：从 `70` 更新到 `85`

更新：

- docs/project-os/tasks/web-app/TWA-002-登录与会话-Mock-Adapter.md
- TASK_BOARD.md
- ROADMAP.md
- dashboard/summary.md
- dashboard/dashboard.json
- dashboard.json
- CHANGELOG.md
- 相关 agent 文档

状态说明建议：

- TWA-002B 前端 Mock 登录流已完成
- TWA-002C mock auth service + adapter interfaces 已完成
- 下一步进入 TWA-002D 视觉/流程回归 + 是否 closeout TWA-002 判断

# ==================================================  
12. 阶段 2 提交要求

如 TWA-002B / C 均完成并通过 reviewer：

git add .  
git commit -m "完成 TWA-002B-C 登录前端 Mock 与 Auth Service 骨架"  
git push origin main

# ==================================================  
13. 最终输出给用户

最终输出中文汇报，必须包含：

# 阶段 1

1. 是否完成 TWA-002A.1 契约唯一化修复
2. 修复了哪些文档问题
3. API_CONTRACT 顶部损坏句子是否修复
4. 通用响应约定是否恢复
5. 最终唯一契约版本摘要
6. reviewer 对契约唯一性的结论
7. 阶段 1 commit hash / push 结果

# 阶段 2

8. 是否正式开启 TWA-002B / TWA-002C
9. frontend 实现了什么
10. backend/mock service 实现了什么
11. reviewer 对实现的结论
12. 验证命令结果
13. TWA-002 当前 owner / status / progress
14. 阶段 2 commit hash / push 结果
15. 当前工作区是否干净
16. 下一步建议