'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

type Reward = {
  name: string;
  tasksRequired?: number;
  daysRequired?: number;
};

export default function RewardsPage() {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<Reward[]>([
    { name: '30 minutes of screen time', tasksRequired: 5 },
    { name: 'Ice cream trip', tasksRequired: 10 },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRewardName, setNewRewardName] = useState('');
  const [newTasksRequired, setNewTasksRequired] = useState('');
  const [newDaysRequired, setNewDaysRequired] = useState('');

  const getRewardDescription = (reward: Reward): { tKey: string, tOptions?: any } => {
    const tasks = reward.tasksRequired;
    const days = reward.daysRequired;

    if (tasks && tasks > 0 && days && days > 0) {
      return { tKey: 'settings.parentalControls.tasksAndDaysToComplete', tOptions: { tasksCount: tasks, daysCount: days } };
    } else if (tasks && tasks > 0) {
      return { tKey: 'settings.parentalControls.tasksToComplete', tOptions: { count: tasks } };
    } else if (days && days > 0) {
        return { tKey: 'settings.parentalControls.daysToComplete', tOptions: { count: days } };
    }
    return { tKey: 'settings.parentalControls.noRequirement' };
  };

  const handleAddReward = () => {
    if (!newRewardName.trim()) return;

    const newReward: Reward = {
      name: newRewardName.trim(),
      tasksRequired: newTasksRequired ? parseInt(newTasksRequired, 10) : undefined,
      daysRequired: newDaysRequired ? parseInt(newDaysRequired, 10) : undefined,
    };

    setRewards(prev => [...prev, newReward]);

    // Reset fields and close dialog
    setNewRewardName('');
    setNewTasksRequired('');
    setNewDaysRequired('');
    setIsDialogOpen(false);
  };

  const handleDeleteReward = (indexToDelete: number) => {
    setRewards(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 bg-background px-4">
          <div className="flex items-center gap-1 w-full">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold truncate"><ClientOnlyT tKey='rewards.title' /></h1>
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <Card>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-1">
                    <CardTitle><ClientOnlyT tKey='settings.parentalControls.rewardSystem' /></CardTitle>
                    <CardDescription className="mb-4"><ClientOnlyT tKey='settings.parentalControls.rewardSystemDescription' /></CardDescription>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <ClientOnlyT tKey='settings.parentalControls.addReward' />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle><ClientOnlyT tKey='settings.parentalControls.addRewardDialog.title' /></DialogTitle>
                                <CardDescription>
                                    <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.description' />
                                </CardDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="reward-name" className="text-right">
                                            <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.rewardName' />
                                        </Label>
                                        <Input
                                          id="reward-name"
                                          placeholder={t('settings.parentalControls.addRewardDialog.rewardNamePlaceholder')}
                                          className="col-span-3"
                                          value={newRewardName}
                                          onChange={(e) => setNewRewardName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="tasks-required" className="text-right">
                                            <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.tasksRequired' />
                                        </Label>
                                        <Input
                                          id="tasks-required"
                                          type="number"
                                          placeholder="5"
                                          className="col-span-3"
                                          value={newTasksRequired}
                                          onChange={(e) => setNewTasksRequired(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="days-required" className="text-right">
                                            <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.daysRequired' />
                                        </Label>
                                        <Input
                                          id="days-required"
                                          type="number"
                                          placeholder="3"
                                          className="col-span-3"
                                          value={newDaysRequired}
                                          onChange={(e) => setNewDaysRequired(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                <Button type="submit" onClick={handleAddReward}><ClientOnlyT tKey='settings.parentalControls.addRewardDialog.createButton' /></Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                     <div className="space-y-2 rounded-md border p-2">
                        {rewards.length > 0 ? rewards.map((reward, index) => {
                           const { tKey, tOptions } = getRewardDescription(reward);
                           return (
                           <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div>
                                    <p className="font-medium">{reward.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        <ClientOnlyT tKey={tKey} tOptions={tOptions} />
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteReward(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </div>
                           );
                        }) : (
                            <p className="text-center text-muted-foreground p-4"><ClientOnlyT tKey="settings.parentalControls.noRewards" /></p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
