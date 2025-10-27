'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Zap, Info, Pencil, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTasks, getUser, User, Task } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import PetViewer from '@/components/dashboard/pet-viewer';
import { ProgressSummaryContent } from '@/components/dashboard/progress-summary';
import DigitalClock from '@/components/dashboard/digital-clock';
import TaskList from '@/components/dashboard/task-list';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Pets } from '@/lib/pets';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const DashboardGridLayout = dynamic(() => import('@/components/dashboard/dashboard-grid-layout'), {
  ssr: false,
  loading: () => (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2"><Skeleton className="h-[400px]" /></div>
      <div className="space-y-6">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[200px]" />
      </div>
      <div className="lg:col-span-3"><Skeleton className="h-[300px]" /></div>
    </div>
  ),
});


export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, tasksData] = await Promise.all([
          getUser(),
          getTasks()
        ]);
        setUser(userData);
        setTasks(tasksData);
        setIsClient(true);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsClient(true);
      }
    };

    loadData();

    const handleUserUpdate = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    };
    const handleTasksUpdate = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to update tasks:', error);
      }
    };

    window.addEventListener('userProfileUpdated', handleUserUpdate);
    window.addEventListener('tasksUpdated', handleTasksUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserUpdate);
      window.removeEventListener('tasksUpdated', handleTasksUpdate);
    };
  }, []);

  const completedTasks = tasks.filter(t => t.completed && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const totalTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  const petIntroDescription = t('dashboard.petIntroDescription');
  const petIntroItems = t('dashboard.petIntroItems', { returnObjects: true }) as string[];


  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 bg-background px-4">
          <div className="flex items-center gap-1 w-1/2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold truncate"><ClientOnlyT tKey='dashboard.title' /></h1>
          </div>
          <div className="flex items-center justify-end gap-4 w-1/2">
            {isClient ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      <ClientOnlyT tKey="dashboard.done" />
                    </>
                  ) : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      <ClientOnlyT tKey="dashboard.editPage" />
                    </>
                  )}
                </Button>
                <DigitalClock />
              </>
            ) : <Skeleton className="h-9 w-24" />}
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8">
            <DashboardGridLayout isEditing={isEditing}>
                <div key="pet" className="overflow-hidden rounded-lg">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle><ClientOnlyT tKey='dashboard.myPet' /></CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col p-4">
                            {isClient && user ? (
                                <>
                                    <div className="flex-grow flex items-start justify-center">
                                        <PetViewer progress={petProgress} />
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-center">
                                            <p className="text-lg font-bold">{user.petName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                <ClientOnlyT tKey='user.level' tOptions={{ level: user.level }} />
                                            </p>
                                        </div>
                                        <Progress value={petProgress} className="mt-4 h-2" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex flex-col">
                                    <div className='flex-grow flex items-start justify-center'>
                                      <Skeleton className="w-full h-full" />
                                    </div>
                                    <div className="mt-4">
                                        <Skeleton className="h-6 w-24 mx-auto" />
                                        <Skeleton className="h-4 w-16 mx-auto mt-2" />
                                        <Skeleton className="h-2 w-full mt-4" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div key="dailyGoal" className="overflow-hidden rounded-lg">
                    <Card className="h-full">
                        <CardContent className="p-4">
                            <ProgressSummaryContent
                                icon={Target}
                                title={<ClientOnlyT tKey="dashboard.dailyGoal" />}
                                value={`${Math.round(dailyProgress)}%`}
                                description={<ClientOnlyT tKey="dashboard.dailyGoalDescription" tOptions={{ completedTasks, totalTasks }} />}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div key="xpGained" className="overflow-hidden rounded-lg">
                     <Card className="h-full">
                        <CardContent className="p-4">
                            <ProgressSummaryContent
                                icon={Zap}
                                title={<ClientOnlyT tKey="dashboard.xpGained" />}
                                value={`${user ? user.xp : 0} XP`}
                                description={<ClientOnlyT tKey="dashboard.xpToNextLevel" tOptions={{ xp: user ? user.xpToNextLevel - user.xp : '...' }} />}
                                progress={petProgress}
                            />
                        </CardContent>
                     </Card>
                </div>
                <div key="petIntro" className="overflow-hidden rounded-lg">
                   <Card className="h-full">
                        <CardHeader className="flex flex-row items-start gap-4">
                        <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                        <CardTitle><ClientOnlyT tKey="dashboard.petIntroTitle" /></CardTitle>
                        {isClient && Array.isArray(petIntroItems) ? (
                            <div className="mt-2 text-sm text-muted-foreground">
                            {petIntroDescription && <p className="mb-3">{petIntroDescription}</p>}
                            {petIntroItems.length > 0 && (
                                <ul className="space-y-2 list-disc pl-5">
                                {petIntroItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                                </ul>
                            )}
                            </div>
                        ) : (
                            <div className="mt-2 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        )}
                        </div>
                    </CardHeader>
                   </Card>
               </div>
               <div key="tasks">
                 <Card>
                    <CardHeader>
                      <CardTitle><ClientOnlyT tKey='dashboard.todaysAdventures' /></CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-6 pb-2">
                      <TaskList />
                    </CardContent>
                  </Card>
               </div>
            </DashboardGridLayout>
        </main>
    </div>
  );
}
