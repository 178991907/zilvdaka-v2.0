// src/lib/data-db.ts
// This is a placeholder for a 3rd party database implementation.
// The actual implementation would depend on the chosen database (e.g., Firebase, Supabase, etc.)
// and would involve setting up the respective SDKs and environment variables.

import type { User, Task, Achievement } from './data-types';
import { iconMap } from './data-types';

// --- PLACEHOLDER IMPLEMENTATION ---

const defaultUser: User = {
  name: 'Alex (DB)',
  avatar: 'avatar1',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  petStyle: 'pet1',
  petName: '泡泡',
  appLogo: '',
};

const initialTasks: Task[] = [
  { id: '1', title: 'Read DB Task', category: 'Learning', icon: iconMap.Learning, difficulty: 'Easy', completed: false, status: 'active', dueDate: new Date() }
];

const defaultAchievements: Achievement[] = [
    { id: '1', title: 'DB Achivement', description: 'Loaded from DB', icon: 'Star', unlocked: true, dateUnlocked: new Date() }
];

console.warn("3rd Party DB provider is not fully implemented. Using placeholder data.");


export const getUser = (): User => {
  // In a real scenario, you'd use the database SDK to fetch the user.
  return defaultUser;
};

export const updateUser = (newUserData: Partial<User>) => {
  // In a real scenario, this would send an update to the database.
  console.log("DB.updateUser called (placeholder)", newUserData);
};

export const getTasks = (): Task[] => {
  return initialTasks;
};

export const updateTasks = (newTasks: Task[]) => {
  console.log("DB.updateTasks called (placeholder)", newTasks);
};

export const getAchievements = (): Achievement[] => {
    return defaultAchievements;
};

export const updateAchievements = (newAchievements: Achievement[]) => {
    console.log("DB.updateAchievements called (placeholder)", newAchievements);
};

export const completeTaskAndUpdateXP = (task: Task, completed: boolean) => {
    console.log("DB.completeTaskAndUpdateXP called (placeholder)", task, completed);
};

export { iconMap };

export const reportData = [
    { date: 'Mon', completed: 2 },
    { date: 'Tue', completed: 2 },
    { date: 'Wed', completed: 2 },
    { date: 'Thu', completed: 2 },
    { date: 'Fri', completed: 2 },
    { date: 'Sat', completed: 2 },
    { date: 'Sun', completed: 2 },
];
