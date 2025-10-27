'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import PomodoroPage from '@/components/pomodoro/pomodoro-page';
import { Card, CardContent } from '@/components/ui/card';

export default function PomodoroTimerPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 bg-background px-4">
        <div className="flex items-center gap-1 w-full">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold truncate"><ClientOnlyT tKey='sidebar.pomodoro' /></h1>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
            <PomodoroPage />
        </div>
      </main>
    </div>
  );
}
