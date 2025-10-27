'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, Settings2, Plus, Trash2, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUser, updateUser, User } from '@/lib/data';
import type { PomodoroSettings, PomodoroMode } from '@/lib/data-types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel';

const getInitialSettings = (user: User | null): PomodoroSettings => {
  const defaultSettings: PomodoroSettings = {
    modes: [
      { id: 'work', name: 'Work', duration: 25 },
      { id: 'shortBreak', name: 'Short Break', duration: 5 },
      { id: 'longBreak', name: 'Long Break', duration: 15 },
    ],
    longBreakInterval: 4,
  };

  if (user?.pomodoroSettings) {
    const mergedSettings = {
      ...defaultSettings,
      ...user.pomodoroSettings,
      modes: user.pomodoroSettings.modes?.length ? user.pomodoroSettings.modes : defaultSettings.modes,
    };
    if (!mergedSettings.modes.find(m => m.id === 'work')) mergedSettings.modes.unshift({ id: 'work', name: 'Work', duration: 25 });
    if (!mergedSettings.modes.find(m => m.id === 'shortBreak')) mergedSettings.modes.push({ id: 'shortBreak', name: 'Short Break', duration: 5 });
    if (!mergedSettings.modes.find(m => m.id === 'longBreak')) mergedSettings.modes.push({ id: 'longBreak', name: 'Long Break', duration: 15 });
    
    return mergedSettings;
  }
  return defaultSettings;
};

type TimerInstance = {
  id: number;
  modeIndex: number;
  timeRemaining: number;
  isActive: boolean;
  pomodoros: number;
};

const createNewTimer = (settings: PomodoroSettings): TimerInstance => ({
  id: Date.now(),
  modeIndex: 0,
  timeRemaining: (settings.modes[0]?.duration || 0) * 60,
  isActive: false,
  pomodoros: 0,
});


export default function PomodoroPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<PomodoroSettings>(getInitialSettings(null));
  
  const [timers, setTimers] = useState<TimerInstance[]>(() => {
    const initialSettings = getInitialSettings(null);
    return [createNewTimer(initialSettings)];
  });

  const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const playSound = useSound();
  const { t } = useTranslation();
  
  const currentTimer = timers[currentTimerIndex];

  const updateUserAndSettings = useCallback(async () => {
    try {
      const currentUser = await getUser();
      setUser(currentUser);
      const newSettings = getInitialSettings(currentUser);
      setSettings(newSettings);
    } catch (err) {
      console.error('Failed to load user/settings:', err);
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    updateUserAndSettings();
    window.addEventListener('userProfileUpdated', updateUserAndSettings);
    return () => {
      window.removeEventListener('userProfileUpdated', updateUserAndSettings);
    };
  }, [updateUserAndSettings]);
  
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = (api: CarouselApi) => {
      setCurrentTimerIndex(api.selectedScrollSnap());
    };
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);
  
  useEffect(() => {
    if (timers.length > 1 && carouselApi) {
        const newIndex = timers.length - 1;
        if(currentTimerIndex === newIndex) {
            carouselApi.scrollTo(newIndex);
        }
    }
  }, [timers.length, carouselApi, currentTimerIndex]);
  
  const updateTimer = (index: number, updates: Partial<TimerInstance>) => {
    setTimers(prevTimers => 
      prevTimers.map((timer, i) => i === index ? { ...timer, ...updates } : timer)
    );
  };
  
  const nextMode = useCallback((index: number) => {
    const timer = timers[index];
    if (!timer) return;

    playSound('timer-end');
    const currentMode = settings.modes[timer.modeIndex];
    let nextModeIndex = 0;
    let newPomodoroCount = timer.pomodoros;
    
    if (currentMode?.id === 'work') {
      newPomodoroCount += 1;
      const isLongBreakTime = newPomodoroCount % settings.longBreakInterval === 0;
      const longBreakModeIndex = settings.modes.findIndex(m => m.id === 'longBreak');
      const shortBreakModeIndex = settings.modes.findIndex(m => m.id === 'shortBreak');

      if (isLongBreakTime && longBreakModeIndex !== -1) {
        nextModeIndex = longBreakModeIndex;
      } else if (shortBreakModeIndex !== -1) {
        nextModeIndex = shortBreakModeIndex;
      }
    } else {
      const workModeIndex = settings.modes.findIndex(m => m.id === 'work');
      if (workModeIndex !== -1) {
        nextModeIndex = workModeIndex;
      }
    }
    
    const newIndex = nextModeIndex >= 0 && nextModeIndex < settings.modes.length ? nextModeIndex : 0;
    const newDuration = (settings.modes[newIndex]?.duration || 0) * 60;
    
    updateTimer(index, {
      modeIndex: newIndex,
      pomodoros: newPomodoroCount,
      timeRemaining: newDuration,
      isActive: false, // Pause after switching mode
    });
  }, [playSound, settings, timers]);

  useEffect(() => {
    if (!currentTimer) return;
    
    let interval: NodeJS.Timeout | null = null;

    if (currentTimer.isActive && currentTimer.timeRemaining > 0) {
      interval = setInterval(() => {
        setTimers(prev => prev.map((t, i) => 
            i === currentTimerIndex ? { ...t, timeRemaining: t.timeRemaining - 1 } : t
        ));
      }, 1000);
    } else if (currentTimer.isActive && currentTimer.timeRemaining <= 0) {
      nextMode(currentTimerIndex);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentTimer, currentTimerIndex, nextMode, setTimers]);
  
  const addTimer = () => {
    const newTimer = createNewTimer(settings);
    const newIndex = timers.length;
    setTimers(prev => [...prev, newTimer]);
    setCurrentTimerIndex(newIndex);
  };

  const removeTimer = (index: number) => {
    if (timers.length <= 1) return;
    const newTimers = timers.filter((_, i) => i !== index);
    setTimers(newTimers);
    if (index === currentTimerIndex) {
        setCurrentTimerIndex(Math.max(0, index - 1));
    } else if (index < currentTimerIndex) {
        setCurrentTimerIndex(currentTimerIndex - 1);
    }
    setIsSettingsOpen(false);
  };

  const handleSaveSettings = (newSettings: PomodoroSettings) => {
    if (newSettings.modes.length === 0) {
      newSettings.modes.push({ id: `custom-${Date.now()}`, name: 'Work', duration: 25 });
    }
    if (newSettings.longBreakInterval < 1) {
      newSettings.longBreakInterval = 1;
    }
    
    updateUser({ pomodoroSettings: newSettings });

    setTimers(prev => prev.map(timer => {
        const currentModeId = settings.modes[timer.modeIndex]?.id;
        let newCurrentModeIndex = currentModeId ? newSettings.modes.findIndex(m => m.id === currentModeId) : -1;
        if (newCurrentModeIndex === -1) {
            newCurrentModeIndex = 0;
        }
        const newDuration = (newSettings.modes[newCurrentModeIndex]?.duration || 0) * 60;
        return {
          ...timer,
          modeIndex: newCurrentModeIndex,
          timeRemaining: newDuration,
          isActive: false,
        }
    }));
    
    setIsSettingsOpen(false);
  };
  
  const switchModeById = (index: number, modeId: string) => {
    const newModeIndex = settings.modes.findIndex(m => m.id === modeId);
    if (newModeIndex !== -1) {
      const newDuration = (settings.modes[newModeIndex]?.duration || 0) * 60;
      updateTimer(index, {
        modeIndex: newModeIndex,
        timeRemaining: newDuration,
        isActive: false
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getModeName = (mode: PomodoroMode) => {
    if (!isClient) return mode.name; // Fallback for SSR

    const keyMap: { [id: string]: string } = {
        'work': 'pomodoro.settings.defaultModeFocus',
        'shortBreak': 'pomodoro.settings.defaultModeShortBreak',
        'longBreak': 'pomodoro.settings.defaultModeLongBreak'
    };
    const tKey = keyMap[mode.id];
    const translated = tKey ? t(tKey) : mode.name;
    // Handle the case where translation is missing in client
    return translated === tKey ? mode.name : translated;
  };
  
  if (!isClient) {
    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center justify-center gap-6 text-center bg-card p-8 rounded-xl shadow-lg h-[548px] w-full max-w-md">
                 <p className="text-muted-foreground">Loading Timer...</p>
            </div>
        </div>
    );
  }

  if (!currentTimer) {
     return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex flex-col items-center justify-center gap-6 text-center bg-card p-8 rounded-xl shadow-lg h-[548px] w-full max-w-md">
                <Button variant="outline" className="h-32 w-32 rounded-full border-dashed" onClick={addTimer}>
                    <PlusCircle className="h-16 w-16 text-muted-foreground" />
                </Button>
                <p className="text-muted-foreground"><ClientOnlyT tKey="pomodoro.addTimer" /></p>
            </div>
        </div>
    );
  }
  
  return (
    <>
      <div className="flex flex-col items-center gap-6 w-full">
        <Carousel setApi={setCarouselApi} className="w-full max-w-md">
          <CarouselContent>
            {timers.map((timer, index) => {
              const mode = settings.modes[timer.modeIndex];
              const duration = (mode?.duration || 0) * 60;
              const progress = duration > 0 ? (duration - timer.timeRemaining) / duration * 100 : 0;
              return (
                <CarouselItem key={timer.id}>
                    <div className="flex flex-col items-center gap-6 text-center bg-card p-8 rounded-xl shadow-lg relative">
                        <div className="flex items-center gap-2 rounded-full bg-primary/10 p-1">
                            {settings.modes.filter(m => ['work', 'shortBreak', 'longBreak'].includes(m.id)).map(m => (
                              <Button
                                key={m.id}
                                variant={mode.id === m.id ? 'default' : 'ghost'}
                                className={cn(
                                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors w-24",
                                   mode.id === m.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-primary'
                                )}
                                onClick={() => switchModeById(index, m.id)}
                              >
                                {getModeName(m)}
                              </Button>
                            ))}
                        </div>
                        
                        <div className="relative h-64 w-64">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`${timer.id}-${timer.modeIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.5, ease: 'backInOut' }}
                              className="absolute inset-0"
                            >
                              <svg className="w-full h-full" viewBox="0 0 120 120">
                                <circle
                                  className="stroke-current text-muted"
                                  strokeWidth="10"
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="transparent"
                                />
                                <motion.circle
                                  className="stroke-current text-primary"
                                  strokeWidth="10"
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="transparent"
                                  strokeDasharray="314.15"
                                  strokeDashoffset={314.15 * (1 - progress / 100)}
                                  strokeLinecap="round"
                                  transform="rotate(-90 60 60)"
                                  initial={{ strokeDashoffset: 314.15 }}
                                  animate={{ strokeDashoffset: 314.15 * (1 - progress / 100) }}
                                  transition={{ duration: 1, ease: 'easeInOut' }}
                                />
                              </svg>
                            </motion.div>
                          </AnimatePresence>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <AnimatePresence mode="wait">
                                  <motion.span
                                      key={`${timer.id}-${timer.timeRemaining}`}
                                      initial={{ opacity: 0, y: -15 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 15, position: 'absolute' }}
                                      transition={{ duration: 0.3 }}
                                      className="text-6xl font-bold font-mono text-foreground"
                                  >
                                      {formatTime(timer.timeRemaining)}
                                  </motion.span>
                              </AnimatePresence>
                          </div>
                        </div>

                        <div className="flex w-full justify-center items-center gap-4 mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateTimer(index, { isActive: false, timeRemaining: (settings.modes[timer.modeIndex]?.duration || 0) * 60 })}
                            className="h-14 w-14 rounded-full"
                          >
                            <RotateCcw className="h-6 w-6" />
                          </Button>
                          <Button
                            onClick={() => updateTimer(index, { isActive: !timer.isActive })}
                            className="w-32 h-16 rounded-full text-2xl font-bold"
                            size="lg"
                          >
                            {timer.isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsSettingsOpen(true)}
                            className="h-14 w-14 rounded-full"
                          >
                            <Settings2 className="h-6 w-6" />
                          </Button>
                        </div>
                    </div>
                </CarouselItem>
              )
            })}
             <CarouselItem>
                <div className="flex flex-col items-center justify-center gap-6 text-center bg-card p-8 rounded-xl shadow-lg h-[548px]">
                    <Button variant="outline" className="h-32 w-32 rounded-full border-dashed" onClick={addTimer}>
                        <PlusCircle className="h-16 w-16 text-muted-foreground" />
                    </Button>
                    <p className="text-muted-foreground"><ClientOnlyT tKey="pomodoro.addTimer" /></p>
                </div>
             </CarouselItem>
          </CarouselContent>
        </Carousel>

        <div className="flex gap-4 items-center justify-center mt-4">
          {timers.map((_, i) => (
            <button key={i} onClick={() => carouselApi?.scrollTo(i)}>
              <motion.div
                animate={{ 
                    backgroundColor: i === currentTimerIndex ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                    scale: i === currentTimerIndex ? 1.25 : 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="h-3 w-8 rounded-full"
              />
            </button>
          ))}
           <button onClick={() => carouselApi?.scrollTo(timers.length)}>
                <motion.div
                    animate={{ 
                        backgroundColor: timers.length === currentTimerIndex ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                        scale: timers.length === currentTimerIndex ? 1.25 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="h-3 w-3 rounded-full"
                >
                    <Plus className="h-3 w-3 text-muted-foreground" />
                </motion.div>
            </button>
        </div>
      </div>
      
      {isSettingsOpen && 
        <SettingsDialog
          isOpen={isSettingsOpen}
          setIsOpen={setIsSettingsOpen}
          settings={settings}
          onSave={handleSaveSettings}
          onDeleteCurrentTimer={() => removeTimer(currentTimerIndex)}
          canDelete={timers.length > 1}
        />
      }
    </>
  );
}


interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
  onDeleteCurrentTimer: () => void;
  canDelete: boolean;
}

function SettingsDialog({ isOpen, setIsOpen, settings, onSave, onDeleteCurrentTimer, canDelete }: SettingsDialogProps) {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setCurrentSettings(settings);
  }, [settings, isOpen]);

  const getModeName = (mode: PomodoroMode) => {
    if (!isClient) return mode.name;
    const keyMap: { [id: string]: string } = {
        'work': 'pomodoro.settings.defaultModeWork',
        'shortBreak': 'pomodoro.settings.defaultModeShortBreak',
        'longBreak': 'pomodoro.settings.defaultModeLongBreak'
    };
    const tKey = keyMap[mode.id];
    return tKey ? t(tKey) : mode.name;
  };

  const handleModeChange = (index: number, field: keyof PomodoroMode, value: any) => {
    const newModes = [...currentSettings.modes];
    const mode = newModes[index];
    if (mode) {
        newModes[index] = { ...mode, [field]: value };
        setCurrentSettings({ ...currentSettings, modes: newModes });
    }
  };

  const handleAddMode = () => {
    const newMode: PomodoroMode = {
      id: `custom-${Date.now()}`,
      name: 'New Mode',
      duration: 10,
    };
    setCurrentSettings({ ...currentSettings, modes: [...currentSettings.modes, newMode] });
  };

  const handleRemoveMode = (index: number) => {
    const newModes = currentSettings.modes.filter((_, i) => i !== index);
    setCurrentSettings({ ...currentSettings, modes: newModes });
  };

  const handleSave = () => {
    onSave(currentSettings);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle><ClientOnlyT tKey="pomodoro.settings.title" /></DialogTitle>
            <DialogDescription><ClientOnlyT tKey="pomodoro.settings.description" /></DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label><ClientOnlyT tKey="pomodoro.settings.modes" /></Label>
              <div className="space-y-2 rounded-md border p-2">
                {currentSettings.modes.map((mode, index) => (
                  <div key={mode.id} className="flex items-center gap-2">
                    <Input
                      placeholder={t('pomodoro.settings.modeNamePlaceholder')}
                      value={getModeName(mode)}
                      onChange={(e) => handleModeChange(index, 'name', e.target.value)}
                      className="h-9"
                      disabled={['work', 'shortBreak', 'longBreak'].includes(mode.id)}
                    />
                    <Input
                      type="number"
                      placeholder={t('pomodoro.settings.minutesPlaceholder')}
                      value={mode.duration}
                      onChange={(e) => handleModeChange(index, 'duration', parseInt(e.target.value) || 0)}
                      className="w-24 h-9"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => handleRemoveMode(index)} disabled={['work', 'shortBreak', 'longBreak'].includes(mode.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleAddMode}>
                <Plus className="mr-2 h-4 w-4" />
                <ClientOnlyT tKey="pomodoro.settings.addMode" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longBreakInterval"><ClientOnlyT tKey="pomodoro.settings.longBreakInterval" /></Label>
              <Input
                id="longBreakInterval"
                type="number"
                value={currentSettings.longBreakInterval}
                onChange={(e) => setCurrentSettings({ ...currentSettings, longBreakInterval: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <div>
              {canDelete && (
                <Button variant="destructive" onClick={onDeleteCurrentTimer}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  <ClientOnlyT tKey="pomodoro.deleteTimer" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary"><ClientOnlyT tKey="achievements.edit.cancel" /></Button>
              </DialogClose>
              <Button type="button" onClick={handleSave}><ClientOnlyT tKey="achievements.edit.save" /></Button>
            </div>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
