import type { Env, User, Task, Achievement, CompleteTaskRequest } from '../bindings'

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

async function getJSON<T>(env: Env, key: string, fallback: T): Promise<T> {
  const val = await env.APP_KV.get(key)
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

async function putJSON(env: Env, key: string, value: any): Promise<void> {
  await env.APP_KV.put(key, JSON.stringify(value))
}

// Default data
const defaultUser: User = {
  name: 'Alex (KV)',
  avatar: 'avatar1',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  petStyle: 'pet1',
  petName: '泡泡',
  appLogo: '',
  appName: 'Discipline Baby',
  landingTitle: 'Gamify Your Child\'s Habits',
  landingDescription: 'Turn daily routines and learning into a fun adventure.',
  landingCta: 'Get Started for Free',
  dashboardLink: '设置页面',
}

const defaultTasks: Task[] = [
  { 
    id: 'read-kv', 
    title: 'Read for 20 minutes (KV)', 
    category: 'Learning', 
    icon: 'Learning', 
    difficulty: 'Easy', 
    completed: false, 
    status: 'active', 
    dueDate: new Date().toISOString(),
    time: '20:00'
  },
  { 
    id: 'exercise-kv', 
    title: 'Morning exercise (KV)', 
    category: 'Health', 
    icon: 'Health', 
    difficulty: 'Medium', 
    completed: false, 
    status: 'active', 
    dueDate: new Date().toISOString(),
    time: '07:00'
  },
]

const defaultAchievements: Achievement[] = [
  { 
    id: 'kv-first', 
    title: 'KV Achievement', 
    description: 'Successfully loaded from Cloudflare KV', 
    icon: 'Star', 
    unlocked: true, 
    dateUnlocked: new Date().toISOString() 
  },
]

// XP calculation
const XP_MAP = {
  'Easy': 5,
  'Medium': 10,
  'Hard': 15,
}

const getPetStyleForLevel = (level: number): string => {
  if (level >= 10) return 'pet3'
  if (level >= 5) return 'pet2'
  return 'pet1'
}

export async function handleKVRoutes(request: Request, env: Env, ctx: ExecutionContext): Promise<Response | null> {
  const url = new URL(request.url)
  
  // User endpoints
  if (url.pathname === '/kv/user') {
    if (request.method === 'GET') {
      const data = await getJSON(env, 'user', defaultUser)
      return json(data)
    }
    if (request.method === 'PUT') {
      const body = await request.json() as Partial<User>
      const current = await getJSON(env, 'user', defaultUser)
      const merged = { ...current, ...body }
      await putJSON(env, 'user', merged)
      return json({ ok: true })
    }
  }

  // Tasks endpoints
  if (url.pathname === '/kv/tasks') {
    if (request.method === 'GET') {
      const data = await getJSON(env, 'tasks', defaultTasks)
      return json(data)
    }
    if (request.method === 'PUT') {
      const body = await request.json()
      await putJSON(env, 'tasks', body)
      return json({ ok: true })
    }
  }

  // Achievements endpoints
  if (url.pathname === '/kv/achievements') {
    if (request.method === 'GET') {
      const data = await getJSON(env, 'achievements', defaultAchievements)
      return json(data)
    }
    if (request.method === 'PUT') {
      const body = await request.json()
      await putJSON(env, 'achievements', body)
      return json({ ok: true })
    }
  }

  // Complete task with XP update
  if (url.pathname === '/kv/complete-task' && request.method === 'POST') {
    try {
      const { task, completed }: CompleteTaskRequest = await request.json()
      
      // Get current data
      const currentUser = await getJSON(env, 'user', defaultUser)
      const allTasks = await getJSON(env, 'tasks', defaultTasks)
      
      // Find the task
      const taskIndex = allTasks.findIndex((t: Task) => t.id === task.id)
      if (taskIndex === -1) {
        return json({ error: 'Task not found' }, 404)
      }
      
      const originalTask = allTasks[taskIndex]
      const oldXp = currentUser.xp
      let newXp = oldXp
      const xpChange = XP_MAP[originalTask.difficulty] || 0
      
      // Only change XP if completion status actually changed
      if (completed !== originalTask.completed) {
        if (completed) {
          newXp += xpChange
        } else {
          newXp -= xpChange
        }
        if (newXp < 0) newXp = 0
        
        // Level up logic
        let newLevel = currentUser.level
        let newXpToNextLevel = currentUser.xpToNextLevel
        let hasLeveledUp = false
        
        while (newXp >= newXpToNextLevel) {
          newLevel++
          newXp -= newXpToNextLevel
          newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2)
          hasLeveledUp = true
        }
        
        const newPetStyle = getPetStyleForLevel(newLevel)
        
        // Update user
        const updatedUser = {
          ...currentUser,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel,
          petStyle: newPetStyle,
        }
        
        await putJSON(env, 'user', updatedUser)
      }
      
      // Update task completion status
      allTasks[taskIndex] = { ...originalTask, completed }
      await putJSON(env, 'tasks', allTasks)
      
      return json({ ok: true, xpGained: newXp - oldXp })
    } catch (error) {
      return json({ error: 'Invalid request body' }, 400)
    }
  }

  return null // Route not handled
}