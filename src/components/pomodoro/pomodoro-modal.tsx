'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import PomodoroPage from './pomodoro-page';
import { usePomodoroModal } from '@/hooks/use-pomodoro-modal';
import { useEffect, useState } from 'react';

export default function PomodoroModal() {
  const { isOpen, closePomodoro } = usePomodoroModal();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={closePomodoro}>
      <DialogContent className="max-w-md p-0 bg-transparent border-0 shadow-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Pomodoro Timer</DialogTitle>
          <DialogDescription>A timer to help you focus on your tasks.</DialogDescription>
        </DialogHeader>
        <PomodoroPage />
      </DialogContent>
    </Dialog>
  );
}
