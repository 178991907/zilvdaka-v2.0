'use client';
import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Task, completeTaskAndUpdateXP, getTodaysTasks } from '@/lib/data';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useSound } from '@/hooks/use-sound';
import DigitalClock from '../dashboard/digital-clock';
import { usePomodoroModal } from '@/hooks/use-pomodoro-modal';

export default function DailyTaskTable() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const playSound = useSound();
  const { openPomodoro } = usePomodoroModal();

  React.useEffect(() => {
    const loadTasks = async () => {
      try {
        const todaysTasks = await getTodaysTasks();
        setTasks(todaysTasks);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    };
    
    loadTasks();
    
    window.addEventListener('tasksUpdated', loadTasks);
    window.addEventListener('userProfileUpdated', loadTasks);

    return () => {
        window.removeEventListener('tasksUpdated', loadTasks);
        window.removeEventListener('userProfileUpdated', loadTasks);
    };
  }, []);


  const handleTaskCompletion = (task: Task, completed: boolean) => {
    if (completed) {
      playSound('success');
    }
    completeTaskAndUpdateXP(task, completed);
  };
  
  const handleStartTask = (task: Task) => {
    openPomodoro();
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
           <TableRow>
            <TableCell colSpan={4} className="p-0">
              <div className="p-4">
                <DigitalClock />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[80px] text-center text-lg"><ClientOnlyT tKey="tasks.dailyTable.order" /></TableHead>
            <TableHead className="text-lg"><ClientOnlyT tKey="tasks.dailyTable.dailyTask" /></TableHead>
            <TableHead className="w-[120px] text-center text-lg"><ClientOnlyT tKey="tasks.dailyTable.execution" /></TableHead>
            <TableHead className="w-[120px] text-center text-lg"><ClientOnlyT tKey="tasks.dailyTable.status" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {task.icon ? React.createElement(task.icon, { className: 'h-5 w-5 text-primary' }) : null}
                    <span className="font-medium">
                      {task.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" onClick={() => handleStartTask(task)}>
                    <ClientOnlyT tKey="tasks.dailyTable.start" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompletion(task, checked)}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <ClientOnlyT tKey="dashboard.noAdventures" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
