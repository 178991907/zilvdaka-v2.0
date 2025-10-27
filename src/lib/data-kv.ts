// src/lib/data-kv.ts
// Cloudflare KV-backed data provider implemented via Workers API.

import type { User, Task, Achievement } from './data-types';
import { iconMap } from './data-types';

const BASE_URL = process.env.NEXT_PUBLIC_WORKERS_BASE_URL || 'http://127.0.0.1:8787';

const headers = { 'content-type': 'application/json' };

export const getUser = async (): Promise<User> => {
  const res = await fetch(`${BASE_URL}/kv/user`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch user from KV');
  return res.json();
};

export const updateUser = async (newUserData: Partial<User>) => {
  const res = await fetch(`${BASE_URL}/kv/user`, { method: 'PUT', headers, body: JSON.stringify(newUserData) });
  if (!res.ok) throw new Error('Failed to update user in KV');
};

export const getTasks = async (): Promise<Task[]> => {
  const res = await fetch(`${BASE_URL}/kv/tasks`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch tasks from KV');
  const tasks: any[] = await res.json();
  // revive date strings and map icon string/category to component function
  return tasks.map((t: any) => {
    const revived: any = {
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
    };
    // Prefer category-based mapping; fallback to Learning
    revived.icon = iconMap[t.category] || iconMap.Learning;
    return revived as Task;
  });
};

export const updateTasks = async (newTasks: Task[]) => {
  // strip function fields before serialization and ISO date
  const payload = newTasks.map((t: any) => {
    const { icon, ...rest } = t; // remove icon function
    return {
      ...rest,
      dueDate: t.dueDate ? (t.dueDate as Date).toISOString() : undefined,
    };
  });
  const res = await fetch(`${BASE_URL}/kv/tasks`, { method: 'PUT', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to update tasks in KV');
};

export const getAchievements = async (): Promise<Achievement[]> => {
  const res = await fetch(`${BASE_URL}/kv/achievements`, { method: 'GET' });
  if (!res.ok) throw new Error('Failed to fetch achievements from KV');
  const ach: any[] = await res.json();
  return ach.map((a: any) => ({ ...a, dateUnlocked: a.dateUnlocked ? new Date(a.dateUnlocked) : undefined }));
};

export const updateAchievements = async (newAchievements: Achievement[]) => {
  const payload = newAchievements.map(a => ({ ...a, dateUnlocked: a.dateUnlocked ? (a.dateUnlocked as Date).toISOString() : undefined }));
  const res = await fetch(`${BASE_URL}/kv/achievements`, { method: 'PUT', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to update achievements in KV');
};

export const completeTaskAndUpdateXP = async (task: Task, completed: boolean) => {
  // remove icon function from payload to avoid serialization issues
  const { icon, ...taskPayload } = task as any;
  const res = await fetch(`${BASE_URL}/kv/complete-task`, { 
    method: 'POST', 
    headers, 
    body: JSON.stringify({ task: taskPayload, completed }) 
  });
  if (!res.ok) throw new Error('Failed to complete task and update XP in KV');
};

const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export const getTodaysTasks = async (): Promise<Task[]> => {
  const allTasks = await getTasks();
  const today = new Date();
  const todayString = today.toDateString();
  const todayDay = dayMapping[today.getDay()];

  return allTasks.filter(task => {
    if (task.status !== 'active') {
      return false;
    }

    const taskDueDate = new Date(task.dueDate);

    if (task.recurrence) {
      const { unit, interval, daysOfWeek } = task.recurrence;
      if (unit === 'week') {
        if (daysOfWeek && daysOfWeek.length > 0) {
          // It repeats on specific days of the week
          return daysOfWeek.includes(todayDay);
        } else {
          // It repeats every X weeks, check if today is the correct day
          const diffTime = Math.abs(today.getTime() - taskDueDate.getTime());
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (taskDueDate.getDay() === today.getDay()) {
            return diffDays % (interval * 7) === 0;
          }
          return false;
        }
      }
      // Add logic for 'month' and 'year' if needed
    }
    
    // Non-recurring tasks
    return taskDueDate.toDateString() === todayString;
  });
};

export const reportData = [
  { date: 'Mon', completed: 3 },
  { date: 'Tue', completed: 4 },
  { date: 'Wed', completed: 2 },
  { date: 'Thu', completed: 5 },
  { date: 'Fri', completed: 4 },
  { date: 'Sat', completed: 6 },
  { date: 'Sun', completed: 5 },
];

export { iconMap };
