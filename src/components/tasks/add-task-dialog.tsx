'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { useState, useEffect } from 'react';
import { Task } from '@/lib/data';
import { Switch } from '../ui/switch';

type AddTaskDialogProps = {
  onSave: (task: Omit<Task, 'id' | 'icon' | 'completed' | 'dueDate'>, taskId?: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: Task | null;
};

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
type WeekDay = typeof weekDays[number];

export function AddTaskDialog({ onSave, isOpen, setIsOpen, task }: AddTaskDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('');
  
  const [recurrenceInterval, setRecurrenceInterval] = useState('1');
  const [recurrenceUnit, setRecurrenceUnit] = useState<'week' | 'month' | 'year'>('week');
  
  const [daysOfWeek, setDaysOfWeek] = useState<WeekDay[]>([]);
  const [time, setTime] = useState('08:00');
  const [isRecurring, setIsRecurring] = useState(false);
  const [status, setStatus] = useState<Task['status']>('active');

  
  const isEditMode = task !== null;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setName(task.title);
        setCategory(task.category);
        setDifficulty(task.difficulty);
        setTime(task.time || '08:00');
        setStatus(task.status);
        if (task.recurrence) {
          setIsRecurring(true);
          setRecurrenceInterval(String(task.recurrence.interval));
          setRecurrenceUnit(task.recurrence.unit);
          setDaysOfWeek(task.recurrence.daysOfWeek || []);
        } else {
          setIsRecurring(false);
          setRecurrenceInterval('1');
          setRecurrenceUnit('week');
          setDaysOfWeek([]);
        }
      } else {
        // Reset form for new task
        setName('');
        setCategory('');
        setDifficulty('');
        setIsRecurring(false);
        setRecurrenceInterval('1');
        setRecurrenceUnit('week');
        setDaysOfWeek([]);
        setTime('08:00');
        setStatus('active');
      }
    }
  }, [isOpen, task]);

  const handleSave = () => {
    if (!name || !category || !difficulty) {
      // Basic validation
      return;
    }
    
    const taskData: Omit<Task, 'id' | 'icon' | 'completed' | 'dueDate'> = { 
      title: name, 
      category, 
      difficulty, 
      time,
      status,
    };

    if (isRecurring) {
        taskData.recurrence = {
            interval: parseInt(recurrenceInterval, 10) || 1,
            unit: recurrenceUnit,
            daysOfWeek: daysOfWeek,
        }
    }

    onSave(taskData, task?.id);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><ClientOnlyT tKey={isEditMode ? 'tasks.editTaskDialog.title' : 'tasks.addTaskDialog.title'} /></DialogTitle>
          <DialogDescription>
            <ClientOnlyT tKey={isEditMode ? 'tasks.editTaskDialog.description' : 'tasks.addTaskDialog.description'} />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.taskName' />
            </Label>
            <Input
              id="name"
              placeholder={t('tasks.addTaskDialog.taskNamePlaceholder')}
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.category' />
            </Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.categoryPlaceholder' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Learning"><ClientOnlyT tKey='tasks.categories.learning' /></SelectItem>
                <SelectItem value="Creative"><ClientOnlyT tKey='tasks.categories.creative' /></SelectItem>
                <SelectItem value="Health"><ClientOnlyT tKey='tasks.categories.health' /></SelectItem>
                <SelectItem value="School"><ClientOnlyT tKey='tasks.categories.school' /></SelectItem>
                <SelectItem value="Activity"><ClientOnlyT tKey='tasks.categories.activity' /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.difficulty' />
            </Label>
            <Select onValueChange={(value) => setDifficulty(value as 'Easy' | 'Medium' | 'Hard')} value={difficulty}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.difficultyPlaceholder' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy"><ClientOnlyT tKey='tasks.difficulties.easy' /></SelectItem>
                <SelectItem value="Medium"><ClientOnlyT tKey='tasks.difficulties.medium' /></SelectItem>
                <SelectItem value="Hard"><ClientOnlyT tKey='tasks.difficulties.hard' /></SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
                <ClientOnlyT tKey='tasks.addTaskDialog.recurrence' />
            </Label>
             <div className="col-span-3 flex items-center">
                <ToggleGroup type="single" variant="outline" value={isRecurring ? 'on' : 'off'} onValueChange={(value) => setIsRecurring(value === 'on')}>
                    <ToggleGroupItem value="off" aria-label="Toggle off">
                        <ClientOnlyT tKey='tasks.recurrence.once' />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="on" aria-label="Toggle on">
                       <ClientOnlyT tKey='tasks.recurrence.recurring' />
                    </ToggleGroupItem>
                </ToggleGroup>
             </div>
          </div>
          
          {isRecurring && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recurrence" className="text-right">
                  <ClientOnlyT tKey='tasks.addTaskDialog.repeatEvery' />
                </Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                    <Input
                        id="recurrence-interval"
                        type="number"
                        min="1"
                        value={recurrenceInterval}
                        onChange={(e) => setRecurrenceInterval(e.target.value)}
                    />
                    <Select
                      value={recurrenceUnit}
                      onValueChange={(value) => setRecurrenceUnit(value as 'week' | 'month' | 'year')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.selectUnit' />} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week"><ClientOnlyT tKey='tasks.recurrence.units.week' /></SelectItem>
                        <SelectItem value="month"><ClientOnlyT tKey='tasks.recurrence.units.month' /></SelectItem>
                        <SelectItem value="year"><ClientOnlyT tKey='tasks.recurrence.units.year' /></SelectItem>
                      </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                      <ClientOnlyT tKey='tasks.addTaskDialog.repeatOn' />
                  </Label>
                  <ToggleGroup
                      type="multiple"
                      variant="outline"
                      className="col-span-3 flex-wrap justify-start gap-1"
                      value={daysOfWeek}
                      onValueChange={(days) => setDaysOfWeek(days as WeekDay[])}
                  >
                      {weekDays.map(day => (
                          <ToggleGroupItem key={day} value={day} className="h-8 w-8 p-0">
                              <ClientOnlyT tKey={`tasks.weekdays.${day}`} />
                          </ToggleGroupItem>
                      ))}
                  </ToggleGroup>
              </div>
            </>
          )}


          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.time' />
            </Label>
            <Input
              id="time"
              type="time"
              className="col-span-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              <ClientOnlyT tKey='tasks.table.status' />
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Switch
                id="status"
                checked={status === 'active'}
                onCheckedChange={(checked) => setStatus(checked ? 'active' : 'paused')}
              />
              <span className="text-sm text-muted-foreground">
                <ClientOnlyT tKey={status === 'active' ? 'tasks.status.active' : 'tasks.status.paused'} />
              </span>
            </div>
          </div>


        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            <ClientOnlyT tKey={isEditMode ? 'tasks.editTaskDialog.save' : 'tasks.addTaskDialog.createTask'} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
