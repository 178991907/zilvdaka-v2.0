var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-fUupGG/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// workers/routes/kv-api.ts
var corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,PUT,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};
var json = /* @__PURE__ */ __name((data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json",
    "cache-control": "no-store",
    ...corsHeaders,
    ...headers
  }
}), "json");
async function getJSON(env, key, fallback) {
  const val = await env.APP_KV.get(key);
  if (!val)
    return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}
__name(getJSON, "getJSON");
async function putJSON(env, key, value) {
  await env.APP_KV.put(key, JSON.stringify(value));
}
__name(putJSON, "putJSON");
var defaultUser = {
  name: "Alex (KV)",
  avatar: "avatar1",
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  petStyle: "pet1",
  petName: "\u6CE1\u6CE1",
  appLogo: "",
  appName: "Discipline Baby",
  landingTitle: "Gamify Your Child's Habits",
  landingDescription: "Turn daily routines and learning into a fun adventure.",
  landingCta: "Get Started for Free",
  dashboardLink: "\u8BBE\u7F6E\u9875\u9762"
};
var defaultTasks = [
  {
    id: "read-kv",
    title: "Read for 20 minutes (KV)",
    category: "Learning",
    icon: "Learning",
    difficulty: "Easy",
    completed: false,
    status: "active",
    dueDate: (/* @__PURE__ */ new Date()).toISOString(),
    time: "20:00"
  },
  {
    id: "exercise-kv",
    title: "Morning exercise (KV)",
    category: "Health",
    icon: "Health",
    difficulty: "Medium",
    completed: false,
    status: "active",
    dueDate: (/* @__PURE__ */ new Date()).toISOString(),
    time: "07:00"
  }
];
var defaultAchievements = [
  {
    id: "kv-first",
    title: "KV Achievement",
    description: "Successfully loaded from Cloudflare KV",
    icon: "Star",
    unlocked: true,
    dateUnlocked: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var XP_MAP = {
  "Easy": 5,
  "Medium": 10,
  "Hard": 15
};
var getPetStyleForLevel = /* @__PURE__ */ __name((level) => {
  if (level >= 10)
    return "pet3";
  if (level >= 5)
    return "pet2";
  return "pet1";
}, "getPetStyleForLevel");
async function handleKVRoutes(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname === "/kv/user") {
    if (request.method === "GET") {
      const data = await getJSON(env, "user", defaultUser);
      return json(data);
    }
    if (request.method === "PUT") {
      const body = await request.json();
      const current = await getJSON(env, "user", defaultUser);
      const merged = { ...current, ...body };
      await putJSON(env, "user", merged);
      return json({ ok: true });
    }
  }
  if (url.pathname === "/kv/tasks") {
    if (request.method === "GET") {
      const data = await getJSON(env, "tasks", defaultTasks);
      return json(data);
    }
    if (request.method === "PUT") {
      const body = await request.json();
      await putJSON(env, "tasks", body);
      return json({ ok: true });
    }
  }
  if (url.pathname === "/kv/achievements") {
    if (request.method === "GET") {
      const data = await getJSON(env, "achievements", defaultAchievements);
      return json(data);
    }
    if (request.method === "PUT") {
      const body = await request.json();
      await putJSON(env, "achievements", body);
      return json({ ok: true });
    }
  }
  if (url.pathname === "/kv/complete-task" && request.method === "POST") {
    try {
      const { task, completed } = await request.json();
      const currentUser = await getJSON(env, "user", defaultUser);
      const allTasks = await getJSON(env, "tasks", defaultTasks);
      const taskIndex = allTasks.findIndex((t) => t.id === task.id);
      if (taskIndex === -1) {
        return json({ error: "Task not found" }, 404);
      }
      const originalTask = allTasks[taskIndex];
      const oldXp = currentUser.xp;
      let newXp = oldXp;
      const xpChange = XP_MAP[originalTask.difficulty] || 0;
      if (completed !== originalTask.completed) {
        if (completed) {
          newXp += xpChange;
        } else {
          newXp -= xpChange;
        }
        if (newXp < 0)
          newXp = 0;
        let newLevel = currentUser.level;
        let newXpToNextLevel = currentUser.xpToNextLevel;
        let hasLeveledUp = false;
        while (newXp >= newXpToNextLevel) {
          newLevel++;
          newXp -= newXpToNextLevel;
          newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);
          hasLeveledUp = true;
        }
        const newPetStyle = getPetStyleForLevel(newLevel);
        const updatedUser = {
          ...currentUser,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel,
          petStyle: newPetStyle
        };
        await putJSON(env, "user", updatedUser);
      }
      allTasks[taskIndex] = { ...originalTask, completed };
      await putJSON(env, "tasks", allTasks);
      return json({ ok: true, xpGained: newXp - oldXp });
    } catch (error) {
      return json({ error: "Invalid request body" }, 400);
    }
  }
  return null;
}
__name(handleKVRoutes, "handleKVRoutes");

// workers/index.ts
var corsHeaders2 = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,PUT,POST,OPTIONS",
  "access-control-allow-headers": "content-type"
};
var json2 = /* @__PURE__ */ __name((data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json",
    "cache-control": "no-store",
    ...corsHeaders2,
    ...headers
  }
}), "json");
function generateRequestId() {
  return Math.random().toString(36).substring(2, 15);
}
__name(generateRequestId, "generateRequestId");
function errorResponse(message, status = 500, requestId) {
  return json2({
    error: message,
    code: status,
    requestId: requestId || generateRequestId()
  }, status);
}
__name(errorResponse, "errorResponse");
var workers_default = {
  async fetch(request, env, ctx) {
    const requestId = generateRequestId();
    const startTime = Date.now();
    try {
      const url = new URL(request.url);
      console.log(`[${requestId}] ${request.method} ${url.pathname}`);
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders2 });
      }
      if (url.pathname === "/health") {
        return json2({
          ok: true,
          timestamp: (/* @__PURE__ */ new Date()).toISOString(),
          environment: env.APP_ENV || "development",
          requestId
        });
      }
      const kvResponse = await handleKVRoutes(request, env, ctx);
      if (kvResponse) {
        const duration = Date.now() - startTime;
        console.log(`[${requestId}] Response: ${kvResponse.status} (${duration}ms)`);
        return kvResponse;
      }
      return errorResponse("Route not found", 404, requestId);
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${requestId}] Error (${duration}ms):`, error);
      return errorResponse(
        "Internal server error",
        500,
        requestId
      );
    }
  },
  // Scheduled event handler (for future CRON jobs)
  async scheduled(controller, env, ctx) {
    const requestId = generateRequestId();
    console.log(`[${requestId}] Scheduled event: ${controller.cron}`);
    ctx.waitUntil(env.APP_KV.put(`last_cron_${requestId}`, (/* @__PURE__ */ new Date()).toISOString()));
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-fUupGG/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = workers_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-fUupGG/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
