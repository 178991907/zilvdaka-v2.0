/// <reference types="@cloudflare/workers-types" />

export interface Env {
  APP_KV?: KVNamespace
  APP_ENV: string
}

export interface User {
  name: string
  avatar: string
  level: number
  xp: number
  xpToNextLevel: number
  petStyle: string
  petName: string
  appLogo: string
  pomodoroSettings?: any
  appName?: string
  landingTitle?: string
  landingDescription?: string
  landingCta?: string
  dashboardLink?: string
}

export interface Task {
  id: string
  title: string
  category: string
  icon: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  completed: boolean
  status: 'active' | 'paused' | 'completed'
  dueDate: string
  recurrence?: {
    interval: number
    unit: 'week' | 'month' | 'year'
    daysOfWeek?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]
  }
  time?: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  dateUnlocked?: string
}

export interface CompleteTaskRequest {
  task: Task
  completed: boolean
}