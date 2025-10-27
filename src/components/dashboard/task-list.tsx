'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { getTasks, completeTaskAndUpdateXP, type Task } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Skeleton } from '../ui/skeleton';
import { useSound } from '@/hooks/use-sound';

export default function TaskList() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { i18n } = useTranslation();
  const playSound = useSound();

  useEffect(() => {
    const updateTodaysTasks = async () => {
      try {
        const allTasks = await getTasks() as Task[];
        setTasks(allTasks.filter((t: Task) => new Date(t.dueDate).toDateString() === new Date().toDateString()));
        setIsClient(true);
      } catch (err) {
        console.error('Failed to load tasks:', err);
        setIsClient(true);
      }
    };

    updateTodaysTasks(); // Initial load

    const handleUpdate = () => {
      updateTodaysTasks();
    };

    window.addEventListener('tasksUpdated', handleUpdate);
    window.addEventListener('userProfileUpdated', handleUpdate);

    return () => {
      window.removeEventListener('tasksUpdated', handleUpdate);
      window.removeEventListener('userProfileUpdated', handleUpdate);
    };
  }, []);

  const handleTaskCompletion = (task: Task, completed: boolean) => {
    if (completed) {
      playSound('success');
    }
    completeTaskAndUpdateXP(task, completed);
  };

  if (!isClient) {
    return (
        <div className="space-y-4 pt-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeInOut"
              }}
              className="flex items-center p-3 -m-3 rounded-lg transition-colors hover:bg-secondary"
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={(checked) => handleTaskCompletion(task, !!checked)}
                className="h-6 w-6 rounded-md"
                disabled={task.status === 'paused'}
              />
              <label
                htmlFor={task.id}
                className={cn(
                  'ml-4 flex-1 text-base font-medium transition-all',
                  task.completed ? 'text-muted-foreground line-through' : 'text-foreground',
                  task.status === 'paused' ? 'cursor-not-allowed' : ''
                )}
              >
                {task.title}
              </label>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10">
                {task.icon ? React.createElement(task.icon, { className: 'h-5 w-5 text-primary' }) : null}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-8">
            <ClientOnlyT tKey='dashboard.noAdventures' />
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}
