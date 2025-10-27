// src/lib/data.ts
import type { User, Task, Achievement, Recurrence } from './data-types';

// This file acts as a router for data storage.
// It will use the STORAGE_PROVIDER environment variable to determine which data source to use.
// Default is 'local'.
const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'local';

// Dynamic import to avoid duplicate declarations
let dataProvider: any;

switch (provider) {
  case 'kv':
    console.log('Using Cloudflare KV data provider.');
    dataProvider = require('./data-kv');
    break;
  case 'db':
    console.log('Using 3rd party DB data provider.');
    dataProvider = require('./data-db');
    break;
  case 'local':
  default:
    console.log('Using local storage data provider.');
    dataProvider = require('./data-local');
    break;
}

export const { 
    getUser, 
    updateUser, 
    completeTaskAndUpdateXP,
    getAchievements,
    updateAchievements,
    getTasks,
    getTodaysTasks,
    updateTasks,
    iconMap,
    reportData
} = dataProvider;

// Re-export types
export type { User, Task, Achievement, Recurrence };
