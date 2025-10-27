'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Play, Pause } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { ClientOnlyT } from '../layout/app-sidebar';
import { cn } from '@/lib/utils';

const difficultyVariant = {
    Easy: 'default',
    Medium: 'secondary',
    Hard: 'destructive',
} as const;

interface TasksTableProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (taskId: string) => void;
}

// This component handles the translation of daysOfWeek on the client side to prevent hydration mismatch.
const TranslatedDays = ({ days }: { days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] | undefined }) => {
  if (!days || days.length === 0) {
    return null;
  }
  
  return (
    <>
      {days.map((day, index) => (
        <React.Fragment key={day}>
          <ClientOnlyT tKey={`tasks.weekdaysShort.${day}`} />
          {index < days.length - 1 && ', '}
        </React.Fragment>
      ))}
    </>
  );
};


export default function TasksTable({ tasks, setTasks, onEdit, onDelete, onToggleStatus }: TasksTableProps) {

  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

 const formatRecurrence = (task: Task) => {
    if (!task.recurrence) {
        return task.time 
            ? <ClientOnlyT tKey="tasks.recurrence.display.onceAtTime" tOptions={{ time: task.time }} />
            : <ClientOnlyT tKey="tasks.recurrence.once" />;
    }

    const { interval, unit, daysOfWeek } = task.recurrence;
    const hasDays = daysOfWeek && daysOfWeek.length > 0;
    const options = { count: interval, time: task.time };
    
    let baseKey = 'tasks.recurrence.display.every';
    if (interval > 1) {
        baseKey = `tasks.recurrence.display.every_x_${unit}s`;
    } else {
        baseKey = `tasks.recurrence.display.every_${unit}`;
    }

    if (hasDays) {
        const tKey = task.time ? `${baseKey}_on_at` : `${baseKey}_on`;
        return (
            <span>
                <ClientOnlyT tKey={tKey} tOptions={options} /> <TranslatedDays days={daysOfWeek} />
            </span>
        );
    } else {
        const tKey = task.time ? `${baseKey}_at` : baseKey;
        return <ClientOnlyT tKey={tKey} tOptions={options} />;
    }
};


  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.task' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.category' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.difficulty' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.recurrence' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.status' /></TableHead>
            <TableHead className="text-right w-[50px]"><ClientOnlyT tKey='tasks.table.actions' /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.id} className={cn(task.status === 'paused' && 'text-muted-foreground bg-muted/30')}>
              <TableCell>
                 <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)}
                    disabled={task.status === 'paused'}
                  />
              </TableCell>
              <TableCell className="font-medium flex items-center gap-3">
                 {task.icon ? React.createElement(task.icon, { className: 'h-5 w-5' }) : null}
                 {task.title}
              </TableCell>
              <TableCell>
                <Badge variant="outline"><ClientOnlyT tKey={`tasks.categories.${task.category.toLowerCase()}`} /></Badge>
              </TableCell>
              <TableCell>
                <Badge variant={difficultyVariant[task.difficulty]}><ClientOnlyT tKey={`tasks.difficulties.${task.difficulty.toLowerCase()}`} /></Badge>
              </TableCell>
               <TableCell className="text-xs">
                {formatRecurrence(task)}
              </TableCell>
              <TableCell>
                 {task.status === 'paused' ? (
                    <Badge variant="secondary">
                        <ClientOnlyT tKey='tasks.status.paused' />
                    </Badge>
                 ) : (
                    <Badge variant={task.completed ? 'default' : 'secondary'} className={task.completed ? 'bg-green-500/20 text-green-700' : ''}>
                        {task.completed ? <ClientOnlyT tKey='tasks.status.completed' /> : <ClientOnlyT tKey='tasks.status.pending' />}
                    </Badge>
                 )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only"><ClientOnlyT tKey='tasks.table.openMenu' /></span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Pencil className="mr-2 h-4 w-4"/>
                        <ClientOnlyT tKey='tasks.table.edit' />
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onToggleStatus(task.id)}>
                        {task.status === 'active' ? (
                            <Pause className="mr-2 h-4 w-4" />
                        ) : (
                            <Play className="mr-2 h-4 w-4" />
                        )}
                        <ClientOnlyT tKey={task.status === 'active' ? 'tasks.table.pause' : 'tasks.table.resume'} />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task)}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <ClientOnlyT tKey='tasks.table.delete' />
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
