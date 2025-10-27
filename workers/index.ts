/// <reference types="@cloudflare/workers-types" />
import type { Env } from './bindings'
import { handleKVRoutes } from './routes/kv-api'

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,PUT,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
}

const json = (data: any, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
      ...corsHeaders,
      ...headers,
    },
  })

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15)
}

function errorResponse(message: string, status = 500, requestId?: string) {
  return json({
    error: message,
    code: status,
    requestId: requestId || generateRequestId(),
  }, status)
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestId = generateRequestId()
    const startTime = Date.now()
    
    try {
      const url = new URL(request.url)
      
      // Log request (in production, consider using structured logging)
      console.log(`[${requestId}] ${request.method} ${url.pathname}`)

      // CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders })
      }

      // Health check
      if (url.pathname === '/health') {
        return json({ 
          ok: true, 
          timestamp: new Date().toISOString(),
          environment: env.APP_ENV || 'development',
          requestId 
        })
      }

      // KV API routes
      const kvResponse = await handleKVRoutes(request, env, ctx)
      if (kvResponse) {
        const duration = Date.now() - startTime
        console.log(`[${requestId}] Response: ${kvResponse.status} (${duration}ms)`) 
        return kvResponse
      }

      // 404 for unmatched routes
      return errorResponse('Route not found', 404, requestId)
      
    } catch (error) {
      const duration = Date.now() - startTime
      console.error(`[${requestId}] Error (${duration}ms):`, error)
      
      return errorResponse(
        'Internal server error',
        500,
        requestId
      )
    }
  },

  // Scheduled event handler (for future CRON jobs)
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const requestId = generateRequestId()
    console.log(`[${requestId}] Scheduled event: ${controller.cron}`)
    
    // Guard: only write to KV if binding exists
    if (env.APP_KV) {
      ctx.waitUntil(env.APP_KV.put(`last_cron_${requestId}`, new Date().toISOString()))
    } else {
      console.log(`[${requestId}] No APP_KV binding; scheduled handler no-op`)
    }
  },
}