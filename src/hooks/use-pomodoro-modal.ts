'use client';
import { create } from 'zustand';
import { ReactNode, createContext, useContext, useRef, useState } from 'react';

interface PomodoroModalState {
  isOpen: boolean;
  openPomodoro: () => void;
  closePomodoro: () => void;
}

const usePomodoroModalStore = create<PomodoroModalState>((set) => ({
  isOpen: false,
  openPomodoro: () => set({ isOpen: true }),
  closePomodoro: () => set({ isOpen: false }),
}));

// React Context provider for the store
const PomodoroModalContext = createContext<typeof usePomodoroModalStore | null>(null);

export function PomodoroModalProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<typeof usePomodoroModalStore>();
  if (!storeRef.current) {
    storeRef.current = usePomodoroModalStore;
  }
  return (
    <PomodoroModalContext.Provider value={storeRef.current}>
      {children}
    </PomodoroModalContext.Provider>
  );
}

// Custom hook to use the store
export const usePomodoroModal = () => {
  const store = useContext(PomodoroModalContext);
  if (!store) {
    throw new Error('usePomodoroModal must be used within a PomodoroModalProvider');
  }
  const { isOpen, openPomodoro, closePomodoro } = store();
  return { isOpen, openPomodoro, closePomodoro };
};
