'use client';

import { useCallback } from 'react';

type Sound = 'click' | 'success' | 'level-up';

export const useSound = () => {
  const playSound = useCallback((sound: Sound) => {
    if (typeof window === 'undefined') return;

    try {
      const isSoundEnabled = localStorage.getItem('sound-effects-enabled') !== 'false';
      if (!isSoundEnabled) return;

      const audio = new Audio(`/sounds/${sound}.mp3`);
      audio.play().catch(error => {
        // Autoplay was prevented. This is a common browser restriction.
        // We can ignore this error silently.
        // console.error(`Could not play sound: ${sound}`, error);
      });
    } catch (error) {
      console.error(`Error playing sound: ${sound}`, error);
    }
  }, []);

  return playSound;
};
