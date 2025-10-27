'use client';
import type { User, Task, Achievement, PomodoroSettings } from './data-types';
import { iconMap } from './data-types';
import { toast } from '@/hooks/use-toast';
import { Pets } from './pets';
import i18n from '@/i18n';

const defaultPomodoroSettings: PomodoroSettings = {
  modes: [
    { id: 'work', name: 'Work', duration: 25 },
    { id: 'shortBreak', name: 'Short Break', duration: 5 },
    { id: 'longBreak', name: 'Long Break', duration: 15 },
  ],
  longBreakInterval: 4,
};


const defaultUser: User = {
  name: 'Alex',
  avatar: 'avatar1',
  level: 1,
  xp: 75,
  xpToNextLevel: 100,
  petStyle: 'pet1',
  petName: '泡泡',
  appLogo: '',
  pomodoroSettings: defaultPomodoroSettings,
  // Configurable content
  appName: 'Discipline Baby',
  landingTitle: 'Gamify Your Child\'s Habits',
  landingDescription: 'Turn daily routines and learning into a fun adventure. Motivate your kids with rewards, achievements, and a virtual pet that grows with them.',
  landingCta: 'Get Started for Free',
  dashboardLink: '设置页面',
};

// This function now gets user data, prioritizing localStorage.
export const getUser = (): User => {
  if (typeof window === 'undefined') {
    return defaultUser;
  }
  try {
    const storedUser = localStorage.getItem('habit-heroes-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // We merge with default user to ensure all fields are present,
      // especially the new pomodoroSettings structure.
      const userWithDefaults = { ...defaultUser, ...parsedUser };
      userWithDefaults.pomodoroSettings = {
        ...defaultPomodoroSettings,
        ...(parsedUser.pomodoroSettings || {}),
      };
      return userWithDefaults;
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    // If parsing fails, fall back to default
  }
  return defaultUser;
};

// Function to update the global user object and localStorage
export const updateUser = (newUserData: Partial<User>, eventDetail?: object) => {
   if (typeof window !== 'undefined') {
    const currentUser = getUser();
    const updatedUser = { ...currentUser, ...newUserData };
    if (newUserData.pomodoroSettings) {
      updatedUser.pomodoroSettings = { ...currentUser.pomodoroSettings, ...newUserData.pomodoroSettings };
    }
    try {
      localStorage.setItem('habit-heroes-user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: eventDetail }));
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
  }
};

const XP_MAP = {
  'Easy': 5,
  'Medium': 10,
  'Hard': 15,
};

const getPetStyleForLevel = (level: number): string => {
  const sortedPets = [...Pets].sort((a, b) => b.unlockLevel - a.unlockLevel);
  const bestPet = sortedPets.find(p => level >= p.unlockLevel);
  return bestPet ? bestPet.id : 'pet1';
};


export const completeTaskAndUpdateXP = (task: Task, completed: boolean) => {
  const currentUser = getUser();
  
  // Find the original task to ensure we use the stored difficulty for XP calculation
  const allTasks = getTasks();
  const originalTask = allTasks.find(t => t.id === task.id);
  if (!originalTask) return; // Task not found, do nothing

  const oldXp = currentUser.xp;
  let newXp = oldXp;
  const xpChange = XP_MAP[originalTask.difficulty] || 0;

  // Only change XP if the completion status is actually different
  if (completed !== originalTask.completed) {
      if (completed) {
          newXp += xpChange;
      } else {
          newXp -= xpChange;
      }
      if (newXp < 0) newXp = 0;

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
      
      updateUser({
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel,
          petStyle: newPetStyle,
      }, { leveledUp: hasLeveledUp });

      if (hasLeveledUp) {
          const newPet = Pets.find(p => p.id === newPetStyle);
          const oldPet = Pets.find(p => p.id === currentUser.petStyle);

          if (newPetStyle !== currentUser.petStyle && newPet && oldPet) {
              toast({
                  title: i18n.t('notifications.petEvolved.title'),
                  description: i18n.t('notifications.petEvolved.description', { oldPetName: oldPet.name, newPetName: newPet.name, level: newLevel }),
              });
          } else {
              toast({
                  title: i18n.t('notifications.levelUp.title'),
                  description: i18n.t('notifications.levelUp.description', { level: newLevel }),
              });
          }
      }
  }

  // Always update the task's completion status
  const updatedTasks = allTasks.map(t =>
      t.id === task.id ? { ...t, completed } : t
  );
  updateTasks(updatedTasks);
};


const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Mission',
    description: 'Complete your very first task.',
    icon: 'Star',
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: '2',
    title: 'Task Master',
    description: 'Complete 10 tasks in total.',
    icon: 'Trophy',
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: '3',
    title: 'Perfect Week',
    description: 'Complete all your tasks for 7 days in a row.',
    icon: 'ShieldCheck',
    unlocked: false,
  },
    {
    id: '4',
    title: 'Streak Starter',
    description: 'Maintain a 3-day completion streak.',
    icon: 'Zap',
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: '5',
    title: 'Learning Hero',
    description: 'Complete 5 learning tasks.',
    icon: 'Book',
    unlocked: false,
  },
  {
    id: '6',
    title: 'Creative Genius',
    description: 'Complete 5 creative tasks.',
    icon: 'Brush',
    unlocked: false,
  },
  {
    id: 'ant_bronze',
    title: 'Little Ant - Bronze',
    description: '1-day streak.',
    icon: 'Bug',
    unlocked: true,
    dateUnlocked: new Date(),
  },
  {
    id: 'ant_silver',
    title: 'Little Ant - Silver',
    description: '3-day streak.',
    icon: 'Bug',
    unlocked: true,
    dateUnlocked: new Date(),
  },
  {
    id: 'ant_gold',
    title: 'Little Ant - Gold',
    description: '7-day streak.',
    icon: 'Bug',
unlocked: false,
  },
  {
    id: 'knight_bronze',
    title: 'Brave Knight - Bronze',
    description: '7-day streak.',
    icon: 'Swords',
    unlocked: false,
  },
  {
    id: 'knight_silver',
    title: 'Brave Knight - Silver',
    description: '14-day streak.',
    icon: 'Swords',
    unlocked: false,
  },
  {
    id: 'knight_gold',
    title: 'Brave Knight - Gold',
    description: '21-day streak.',
    icon: 'Swords',
unlocked: false,
  },
  {
    id: 'explorer_bronze',
    title: 'Magic Explorer - Bronze',
    description: '30-day streak.',
    icon: 'Mountain',
    unlocked: false,
  },
  {
    id: 'explorer_silver',
    title: 'Magic Explorer - Silver',
    description: '60-day streak.',
    icon: 'Mountain',
    unlocked: false,
  },
  {
    id: 'explorer_gold',
    title: 'Magic Explorer - Gold',
    description: '90-day streak.',
    icon: 'Mountain',
    unlocked: false,
  },
  {
    id: 'guardian_bronze',
    title: 'Seasons Guardian - Bronze',
    description: '90-day streak.',
    icon: 'Flower',
    unlocked: false,
  },
  {
    id: 'guardian_silver',
    title: 'Seasons Guardian - Silver',
    description: '180-day streak.',
    icon: 'Flower',
    unlocked: false,
  },
  {
    id: 'guardian_gold',
    title: 'Seasons Guardian - Gold',
    description: '365-day streak.',
    icon: 'Flower',
    unlocked: false,
  },
  {
    id: 'master_bronze',
    title: 'Super Master - Bronze',
    description: '1-year streak.',
    icon: 'Gem',
    unlocked: false,
  },
  {
    id: 'master_silver',
    title: 'Super Master - Silver',
    description: '2-year streak.',
    icon: 'Gem',
    unlocked: false,
  },
  {
    id: 'master_gold',
    title: 'Super Master - Gold',
    description: '3-year streak.',
    icon: 'Gem',
    unlocked: false,
  },
];

export const getAchievements = (): Achievement[] => {
    if (typeof window === 'undefined') {
        return defaultAchievements;
    }
    try {
        const storedAchievements = localStorage.getItem('habit-heroes-achievements');
        if (storedAchievements) {
            // Parse and ensure date objects are correctly formatted
            const parsed = JSON.parse(storedAchievements);
            return parsed.map((ach: Achievement) => ({
                ...ach,
                dateUnlocked: ach.dateUnlocked ? new Date(ach.dateUnlocked) : undefined
            }));
        }
    } catch (error) {
        console.error("Failed to parse achievements from localStorage", error);
    }
    // Set default achievements if none are in localStorage
    localStorage.setItem('habit-heroes-achievements', JSON.stringify(defaultAchievements));
    return defaultAchievements;
};


export const updateAchievements = (newAchievements: Achievement[]) => {
    if (typeof window !== 'undefined') {
        // Sort custom achievements to the top
        const sortedAchievements = [...newAchievements].sort((a, b) => {
            const aIsCustom = (a.id ?? '').startsWith('custom-');
            const bIsCustom = (b.id ?? '').startsWith('custom-');
            if (aIsCustom && !bIsCustom) return -1;
            if (!aIsCustom && bIsCustom) return 1;
            // then sort by unlock status
            if (a.unlocked && !b.unlocked) return -1;
            if (!a.unlocked && b.unlocked) return 1;
            return 0;
        });

        try {
            localStorage.setItem('habit-heroes-achievements', JSON.stringify(sortedAchievements));
            window.dispatchEvent(new CustomEvent('achievementsUpdated'));
        } catch (error) {
            console.error("Failed to save achievements to localStorage", error);
        }
    }
};

const getInitialTasks = (): Task[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return [
    {
      id: 'read',
      title: 'Read for 20 minutes',
      category: 'Learning',
      icon: iconMap.Learning,
      difficulty: 'Easy',
      completed: false,
      status: 'active',
      dueDate: today,
      recurrence: { interval: 1, unit: 'week', daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri'] },
      time: '20:00',
    },
    {
      id: 'drawing',
      title: 'Practice drawing',
      category: 'Creative',
      icon: iconMap.Creative,
      difficulty: 'Medium',
      completed: false,
      status: 'active',
      dueDate: today,
      recurrence: { interval: 1, unit: 'week', daysOfWeek: ['tue', 'thu'] },
      time: '16:30',
    },
    {
      id: 'bedtime',
      title: 'Go to bed on time',
      category: 'Health',
      icon: iconMap.Health,
      difficulty: 'Easy',
      completed: false,
      status: 'active',
      dueDate: today,
      time: '21:00',
    },
    {
      id: 'homework',
      title: 'Finish science homework',
      category: 'School',
      icon: iconMap.School,
      difficulty: 'Hard',
      completed: false,
      status: 'active',
      dueDate: yesterday,
    },
    {
      id: 'bike',
      title: 'Bike ride in the park',
      category: 'Activity',
      icon: iconMap.Activity,
      difficulty: 'Medium',
      completed: false,
      status: 'paused',
      dueDate: tomorrow,
    },
    {
      id: 'workout',
      title: 'Morning workout',
      category: 'Health',
      icon: iconMap.Health,
      difficulty: 'Medium',
      completed: false,
      status: 'active',
      dueDate: today,
      time: '07:00',
    },
  ];
};

export const getTasks = (): Task[] => {
    if (typeof window === 'undefined') {
        return getInitialTasks();
    }
    try {
        const storedTasks = localStorage.getItem('habit-heroes-tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks);
            
            return parsedTasks.map((task: any) => {
                 const titleKey = `tasks.items.${task.id}.title`;
                 // Only translate if the key exists and it's not a custom task
                 const title = !(task.id ?? '').startsWith('custom-') && i18n.exists(titleKey) 
                    ? i18n.t(titleKey) 
                    : task.title;

                 return {
                    ...task,
                    title: title,
                    icon: iconMap[task.category] || iconMap.Learning, // Re-assign icon function
                    dueDate: new Date(task.dueDate)
                }
            });
        }
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        localStorage.removeItem('habit-heroes-tasks'); // Clear bad data on error
    }

    // This part runs if localStorage is empty or was just cleared.
    const initialTasks = getInitialTasks();
    const tasksToSave = initialTasks.map(({icon, ...rest}) => rest);
    localStorage.setItem('habit-heroes-tasks', JSON.stringify(tasksToSave));
    return initialTasks;
};

export const updateTasks = (newTasks: Task[]) => {
    if (typeof window !== 'undefined') {
        try {
            // Ensure every task has a valid icon before saving.
            const processedTasks = newTasks.map(task => {
                // If the icon property is missing or not a function, assign it.
                if (!task.icon || typeof task.icon !== 'function') {
                    task.icon = iconMap[task.category] || iconMap.Learning;
                }
                // Strip the function property before serialization
                const { icon, ...rest } = task;
                return rest;
            });

            localStorage.setItem('habit-heroes-tasks', JSON.stringify(processedTasks));
            window.dispatchEvent(new CustomEvent('tasksUpdated'));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }
};

const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export const getTodaysTasks = (): Task[] => {
    const allTasks = getTasks();
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
