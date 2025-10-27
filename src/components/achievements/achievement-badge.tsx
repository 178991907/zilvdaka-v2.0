'use client';

import { Achievement, iconMap } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Lock, Pencil, Star, Book, Brush, ShieldCheck, Trophy, Zap, Swords, Mountain, Flower, Gem, Bug } from 'lucide-react';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Button } from '../ui/button';
import Image from 'next/image';
import type { LucideIcon, LucideProps } from 'lucide-react';

const icons: { [key: string]: LucideIcon } = {
  Star, Book, Brush, ShieldCheck, Trophy, Zap, Swords, Mountain, Flower, Gem, Bug
};

const Icon = ({ name, ...props }: { name: string } & LucideProps) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    return <Star {...props} />; // Fallback icon
  }
  return <LucideIcon {...props} />;
};


interface AchievementBadgeProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  index: number;
}

export default function AchievementBadge({ achievement, onEdit, index }: AchievementBadgeProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(achievement);
  };

  const hasImageUrl = achievement.imageUrl && achievement.imageUrl.trim() !== '';
  const isCustom = (achievement.id ?? '').startsWith('custom-');

  const getRequirementDescription = () => {
    const tasks = achievement.tasksRequired;
    const days = achievement.daysRequired;

    if (tasks && tasks > 0 && days && days > 0) {
        return <ClientOnlyT tKey='settings.parentalControls.tasksAndDaysToComplete' tOptions={{ tasksCount: tasks, daysCount: days }} />;
    } else if (tasks && tasks > 0) {
        return <ClientOnlyT tKey='settings.parentalControls.tasksToComplete' tOptions={{ count: tasks }} />;
    } else if (days && days > 0) {
        return <ClientOnlyT tKey='settings.parentalControls.daysToComplete' tOptions={{ count: days }} />;
    }
    return null;
  };

  const requirementText = getRequirementDescription();

  return (
    <div className={cn(
        "relative flex flex-col items-center justify-start text-center aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 p-4 group",
        achievement.unlocked 
          ? 'bg-accent/20 border-2 border-accent/50 shadow-lg shadow-accent/10' 
          : 'bg-muted/50'
      )}>
       
        {achievement.unlocked && (
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,0.1),rgba(255,255,0.5))]"></div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleEditClick}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <div
          className={cn(
            'relative mx-auto flex h-20 w-20 items-center justify-center rounded-full z-10 overflow-hidden',
            achievement.unlocked ? 'bg-accent/20' : 'bg-secondary'
          )}
        >
          {achievement.unlocked && (
             <div className="absolute inset-0 animate-pulse rounded-full bg-accent opacity-30"></div>
          )}
          
          {hasImageUrl ? (
            <Image
                src={achievement.imageUrl!}
                alt={achievement.title}
                width={80}
                height={80}
                className={cn(
                    'object-cover h-full w-full z-10',
                    achievement.unlocked ? '' : 'grayscale'
                )}
            />
          ) : (
            <Icon
              name={achievement.icon}
              className={cn(
                'h-10 w-10 z-10',
                achievement.unlocked ? 'text-accent-foreground' : 'text-muted-foreground'
              )}
            />
          )}

          {!achievement.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Lock className="h-8 w-8 text-white/70" />
            </div>
          )}
        </div>
      <div className="flex flex-col flex-grow justify-center mt-2 z-10">
        <p className="font-bold text-sm text-foreground leading-tight">
            {isCustom ? achievement.title : <ClientOnlyT tKey={`achievements.items.${achievement.id}.title`} />}
        </p>
        <p className="text-xs text-muted-foreground mt-1 px-1">
            {isCustom ? achievement.description : <ClientOnlyT tKey={`achievements.items.${achievement.id}.description`} />}
        </p>
        {!achievement.unlocked && requirementText && (
          <p className="text-xs font-semibold text-primary mt-1.5 px-1">
            {requirementText}
          </p>
        )}
      </div>
      {achievement.unlocked && achievement.dateUnlocked && (
        <div className="w-full mt-auto z-10 pt-1">
            <p className="text-[10px] text-muted-foreground w-full">
                <ClientOnlyT tKey='achievements.unlockedOn' />: {format(new Date(achievement.dateUnlocked), 'MMM d, yyyy')}
            </p>
        </div>
      )}
    </div>
  );
}
