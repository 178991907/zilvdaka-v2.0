'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Achievement } from '@/lib/data';
import { CalendarIcon, Trash2, Star, Book, Brush, ShieldCheck, Trophy, Zap, Swords, Mountain, Flower, Gem, Bug, Pause, Play } from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ClientOnlyT } from '../layout/app-sidebar';

const iconNames = ['Star', 'Book', 'Brush', 'ShieldCheck', 'Trophy', 'Zap', 'Swords', 'Mountain', 'Flower', 'Gem', 'Bug', 'Pause', 'Play'];
const icons: { [key: string]: LucideIcon } = {
  Star, Book, Brush, ShieldCheck, Trophy, Zap, Swords, Mountain, Flower, Gem, Bug, Pause, Play
};

const Icon = ({ name, ...props }: { name: string } & LucideProps) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    return <Star {...props} />; // Fallback icon
  }
  return <LucideIcon {...props} />;
};

interface EditAchievementDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  achievement: Achievement | null;
  onSave: (achievement: Achievement) => void;
  onDelete: (achievement: Achievement) => void;
}

const defaultAchievement: Partial<Achievement> = {
  title: '',
  description: '',
  icon: 'Star',
  imageUrl: '',
  unlocked: false,
  dateUnlocked: undefined,
  tasksRequired: undefined,
  daysRequired: undefined,
};

export function EditAchievementDialog({
  isOpen,
  setIsOpen,
  achievement,
  onSave,
  onDelete,
}: EditAchievementDialogProps) {
  const [formData, setFormData] = useState<Partial<Achievement>>(defaultAchievement);
  const isNew = achievement === null;

  useEffect(() => {
    if (isOpen) {
      if (achievement) {
        setFormData({
          ...achievement,
          dateUnlocked: achievement.dateUnlocked ? new Date(achievement.dateUnlocked) : undefined,
        });
      } else {
        setFormData(defaultAchievement);
      }
    }
  }, [isOpen, achievement]);

  const handleChange = (field: keyof Achievement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const newAchievement: Achievement = {
      id: achievement?.id || `custom-${Date.now()}`,
      title: formData.title || 'Untitled',
      description: formData.description || '',
      icon: formData.icon || 'Star',
      imageUrl: formData.imageUrl || '',
      unlocked: formData.unlocked || false,
      dateUnlocked: formData.unlocked ? (formData.dateUnlocked || new Date()) : undefined,
      tasksRequired: formData.tasksRequired ? Number(formData.tasksRequired) : undefined,
      daysRequired: formData.daysRequired ? Number(formData.daysRequired) : undefined,
    };
    onSave(newAchievement);
    setIsOpen(false);
  };
  
  const handleDelete = () => {
    if (achievement) {
      onDelete(achievement);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <ClientOnlyT tKey={isNew ? 'achievements.add.title' : 'achievements.edit.title'} />
          </DialogTitle>
          <DialogDescription>
            <ClientOnlyT tKey={isNew ? 'achievements.add.description' : 'achievements.edit.description'} />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              <ClientOnlyT tKey="achievements.edit.name" />
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              <ClientOnlyT tKey="achievements.edit.descriptionLabel" />
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              <ClientOnlyT tKey="achievements.edit.icon" />
            </Label>
            <Select value={formData.icon} onValueChange={value => handleChange('icon', value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey="achievements.edit.selectIcon" />} />
              </SelectTrigger>
              <SelectContent>
                {iconNames.map(iconName => (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                      <Icon name={iconName} className="h-4 w-4" />
                      <span>{iconName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              <ClientOnlyT tKey="achievements.edit.imageUrl" />
            </Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl || ''}
              onChange={e => handleChange('imageUrl', e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/image.png"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tasksRequired" className="text-right">
              任务数量
            </Label>
            <Input
              id="tasksRequired"
              type="number"
              value={formData.tasksRequired || ''}
              onChange={e => handleChange('tasksRequired', e.target.value)}
              className="col-span-3"
              placeholder="例如: 5"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="daysRequired" className="text-right">
              天数
            </Label>
            <Input
              id="daysRequired"
              type="number"
              value={formData.daysRequired || ''}
              onChange={e => handleChange('daysRequired', e.target.value)}
              className="col-span-3"
              placeholder="例如: 3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unlocked" className="text-right">
              <ClientOnlyT tKey="achievements.edit.unlocked" />
            </Label>
            <Switch
              id="unlocked"
              checked={formData.unlocked}
              onCheckedChange={checked => handleChange('unlocked', checked)}
              className="justify-self-start"
            />
          </div>
          {formData.unlocked && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateUnlocked" className="text-right">
                <ClientOnlyT tKey="achievements.edit.date" />
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'col-span-3 justify-start text-left font-normal',
                      !formData.dateUnlocked && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateUnlocked ? format(new Date(formData.dateUnlocked), 'PPP') : <span><ClientOnlyT tKey="achievements.edit.pickDate" /></span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateUnlocked ? new Date(formData.dateUnlocked) : undefined}
                    onSelect={date => handleChange('dateUnlocked', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
            {!isNew ? (
                <Button variant="ghost" className="text-destructive hover:text-destructive justify-self-start mr-auto" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <ClientOnlyT tKey="achievements.edit.delete" />
                </Button>
            ) : <div></div>}
            <div className="flex gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        <ClientOnlyT tKey="achievements.edit.cancel" />
                    </Button>
                </DialogClose>
                <Button type="button" onClick={handleSave}>
                    <ClientOnlyT tKey="achievements.edit.save" />
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
