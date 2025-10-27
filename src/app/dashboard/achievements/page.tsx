'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Achievement, getAchievements, updateAchievements, iconMap } from '@/lib/data';
import AchievementBadge from '@/components/achievements/achievement-badge';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { EditAchievementDialog } from '@/components/achievements/edit-achievement-dialog';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Image from 'next/image';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [deletingAchievement, setDeletingAchievement] = useState<Achievement | null>(null);


  useEffect(() => {
    // Only run on client
    (async () => {
      const loadedAchievements = await getAchievements();
      setAchievements(loadedAchievements);
      setIsClient(true);
    })();

    const handleAchievementsUpdate = async () => {
      const updatedAchievements = await getAchievements();
      setAchievements(updatedAchievements);
    };

    window.addEventListener('achievementsUpdated', handleAchievementsUpdate);
    return () => {
      window.removeEventListener('achievementsUpdated', handleAchievementsUpdate);
    };
  }, []);

  const handleAdd = () => {
    setEditingAchievement(null);
    setDialogOpen(true);
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setDialogOpen(true);
  };
  
  const handleDeleteRequest = (achievement: Achievement) => {
    setDeletingAchievement(achievement);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAchievement) {
      const updated = achievements.filter(a => a.id !== deletingAchievement.id);
      await updateAchievements(updated);
      const refreshed = await getAchievements();
      setAchievements(refreshed);
      setDeletingAchievement(null);
    }
  };

  const handleSave = async (savedAchievement: Achievement) => {
    const isNew = !achievements.some(a => a.id === savedAchievement.id);
    let updatedAchievements;
    if (isNew) {
      updatedAchievements = [...achievements, savedAchievement];
    } else {
      updatedAchievements = achievements.map(a =>
        a.id === savedAchievement.id ? savedAchievement : a
      );
    }
    await updateAchievements(updatedAchievements);
    const refreshed = await getAchievements();
    setAchievements(refreshed);
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
    
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 bg-background px-4">
        <div className="flex items-center gap-1 w-1/2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold truncate"><ClientOnlyT tKey='achievements.title' /></h1>
        </div>
        <div className="flex items-center justify-end gap-4 w-1/2">
          {isClient ? (
            <>
              <span className="text-sm font-semibold text-muted-foreground text-right">
                  <ClientOnlyT tKey='achievements.unlocked' tOptions={{ unlockedCount, totalCount }} />
              </span>
              <Button size="sm" onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <ClientOnlyT tKey="achievements.add.button" />
              </Button>
            </>
          ) : (
            <>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-28" />
            </>
          )}
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {!isClient && Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-square rounded-xl" />
                ))}
                {isClient && achievements.map((achievement, index) => (
                    <AchievementBadge 
                        key={achievement.id} 
                        achievement={achievement} 
                        onEdit={handleEdit}
                        index={index}
                    />
                ))}
            </div>
        </div>
      </main>

      {isClient && (
        <EditAchievementDialog
            isOpen={dialogOpen}
            setIsOpen={setDialogOpen}
            achievement={editingAchievement}
            onSave={handleSave}
            onDelete={handleDeleteRequest}
        />
      )}

      <AlertDialog open={!!deletingAchievement} onOpenChange={(open) => !open && setDeletingAchievement(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><ClientOnlyT tKey="achievements.delete.title" /></AlertDialogTitle>
            <AlertDialogDescription>
              <ClientOnlyT tKey="achievements.delete.description" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><ClientOnlyT tKey="achievements.edit.cancel" /></AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <ClientOnlyT tKey="achievements.delete.confirm" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
