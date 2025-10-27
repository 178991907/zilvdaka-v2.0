# Cloudflare Workers 开发规范

目标：为本项目建立一套可落地、可维护的 Cloudflare Workers 开发规则，统一开发、测试、配置、部署与运维流程，提升性能、安全与可观测性。

参考资料：Cloudflare Workers 官方文档（https://developers.cloudflare.com/workers/）。

## 适用范围
- 独立 Worker 应用：API、Web 服务、计划任务、消息处理等。
- 与现有 Next.js 项目集成的边缘能力：中间件、路由处理、静态资源加速、服务降级与熔断。
- 使用 Cloudflare 存储与计算：KV、D1、R2、Queues、Durable Objects、Hyperdrive、Workers AI。

## 基础工具与约束
- 语言与模块：TypeScript（推荐）、ES Modules。
- 运行时：Web 标准 API（Request/Response/URL/crypto 等），避免 Node.js 专有 API（如 `fs`、`net`、`process`）。
- CLI：Wrangler ≥ 3.x（本地开发、部署、日志、绑定配置）。
- 代码风格：统一使用异步 `async/await`；拒绝阻塞式逻辑；类型严格（`tsconfig` 开启 strict）。

## 推荐目录结构
```
/ (repo root)
├─ docs/
│  └─ cloudflare-workers-guidelines.md
├─ workers/                 # Workers 源码与相关代码
│  ├─ index.ts              # 默认入口（可按场景拆分）
│  ├─ routes/               # 路由或功能模块
│  ├─ bindings.d.ts         # env 绑定的类型声明
│  └─ tests/                # 单元/集成测试
└─ wrangler.toml            # Wrangler 配置（按环境分段）
```

> 说明：目录可根据项目需要调整为 `/src/workers/`。入口 `main` 与 `wrangler.toml` 保持一致。

## wrangler.toml 配置规范（示例片段）
```toml
name = "zilvdaka-workers"
main = "workers/index.ts"
compatibility_date = "2024-10-01"

# 环境变量（非敏感）
[vars]
APP_ENV = "development"

# KV 绑定示例
[[kv_namespaces]]
binding = "KV_CACHE"
id = "kv_cache_dev"

# D1 数据库绑定示例
[[d1_databases]]
binding = "DB"
id = "zilvdaka_db_dev"

# R2 对象存储绑定示例
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "zilvdaka-assets"

# 队列示例
[[queues.producers]]
binding = "TASKS_QUEUE"
queue = "zilvdaka-tasks"

[[queues.consumers]]
queue = "zilvdaka-tasks"
max_concurrency = 5

# 计划任务（CRON）示例
[[triggers.crons]]
# 每小时第 5 分钟执行
cron = "5 * * * *"

# 环境分段示例
[env.production]
name = "zilvdaka-workers-prod"
vars = { APP_ENV = "production" }
```

## 代码模式与示例
- 入口导出：使用模块导出对象或函数形式；推荐对象形式同时实现 `fetch`/`scheduled`/`queue`。
```ts
// workers/index.ts
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // 基础路由示例
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" }
      })
    }

    // 使用 KV 作为简单缓存
    const cacheKey = `resp:${url.pathname}`
    const cached = await env.KV_CACHE.get(cacheKey)
    if (cached) return new Response(cached, { headers: { "content-type": "text/plain" } })

    const body = `Hello from Workers at ${new Date().toISOString()}`
    ctx.waitUntil(env.KV_CACHE.put(cacheKey, body, { expirationTtl: 60 }))
    return new Response(body)
  },

  // CRON 计划任务
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(env.KV_CACHE.put("last_cron", new Date().toISOString()))
  },
}

// 类型声明示例（workers/bindings.d.ts）
export interface Env {
  KV_CACHE: KVNamespace
  DB: D1Database
  ASSETS: R2Bucket
  TASKS_QUEUE: Queue<string>
}
```

- D1 查询示例：
```ts
const { results } = await env.DB.prepare("SELECT * FROM tasks WHERE status = ?")
  .bind("open")
  .all()
```

- R2 获取对象示例：
```ts
const obj = await env.ASSETS.get("images/logo.png")
if (!obj) return new Response("Not Found", { status: 404 })
return new Response(obj.body, { headers: { "content-type": obj.httpMetadata?.contentType ?? "application/octet-stream" } })
```

- 队列生产与消费示例：
```ts
await env.TASKS_QUEUE.send({ type: "recalculate", at: Date.now() })

export default {
  async queue(batch: MessageBatch<string>, env: Env, ctx: ExecutionContext) {
    for (const msg of batch.messages) {
      // 处理消息
    }
  }
}
```

## 开发、测试与部署流程
- 安装：`npm i -D wrangler`。
- 本地开发：`npx wrangler dev`（支持 `--env production` 进行环境切换）。
- 部署：`npx wrangler deploy`，按 `wrangler.toml` 绑定环境；`wrangler tail` 观测日志。
- 测试：
  - 单元测试：`vitest` + `miniflare` 或 `wrangler dev` 的 `--inspect`。
  - 使用模拟 `Env` 对象注入绑定；避免真实外部调用。

## 性能与缓存规范
- 使用 `caches.default` 对热点响应进行缓存：
```ts
const cache = caches.default
const cacheKey = new Request(url.toString(), request)
let resp = await cache.match(cacheKey)
if (!resp) {
  resp = await handler()
  ctx.waitUntil(cache.put(cacheKey, resp.clone()))
}
return resp
```
- 充分利用边缘特性（就近执行、Smart Placement）与对象存储的 HTTP 缓存头（`Cache-Control`、`ETag`）。
- Streaming 响应、避免大型 JSON 一次性返回；如需分页或增量。

## 安全与合规
- 输入校验：使用 `zod` 校验请求参数与 JSON 体。
- 机密管理：通过 `wrangler secret put` 管理；避免明文写入 `wrangler.toml`。
- CORS：仅允许受信任来源与必要方法/头；默认拒绝。
- 速率限制：结合 KV/DO 实现滑动窗口限流；对高价值接口施加更严格策略。
- 错误处理：统一返回结构 `{ code, message, requestId }`；向日志输出 `requestId`，便于排障。

## 与 Next.js 集成建议
- 对需要在边缘运行的 Route Handler/Middleware 设置：`export const runtime = 'edge'`（Next 13+）。
- 保持共享工具库为 Web 兼容（避免 Node-only 依赖）。
- 若未来需要将 Next 全站部署到 Cloudflare Pages/Workers，评估 `@cloudflare/next-on-pages` 方案与迁移成本。

## 变更与版本管理
- 规范变更走 PR 流程；更新本文件与示例代码。
- 为 Worker 发布打标签；记录 `wrangler.toml` 的绑定变更与迁移步骤。

## 落地清单（Checklist）
- [ ] 根目录新增 `wrangler.toml`（按环境与绑定填写）。
- [ ] 新建 `workers/` 目录与入口 `index.ts`；编写基础路由与示例。
- [ ] 引入 `bindings.d.ts`，沉淀 Env 类型与共享接口。
- [ ] 安装 `wrangler`，本地跑通 `wrangler dev` 与日志观察。
- [ ] 按需添加 KV/D1/R2/Queues/Durable Objects。
- [ ] 建立 `tests/` 与最小单元测试，覆盖核心路径。

> 更多能力与最佳实践，请查阅官方文档（https://developers.cloudflare.com/workers/）。