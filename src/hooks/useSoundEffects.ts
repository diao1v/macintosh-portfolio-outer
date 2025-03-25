import { useState, useEffect, useCallback } from 'react';
import { preloadedAssets } from '../utils/preload';

const VOLUME = 0.3;

export const useSoundEffects = () => {
  const [keyboardSounds, setKeyboardSounds] = useState<HTMLAudioElement[]>([]);
  const [mouseClickSound, setMouseClickSound] =
    useState<HTMLAudioElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      preloadedAssets.keyboardSounds,
      preloadedAssets.mouseClick,
    ]).then(([keySounds, clickSound]) => {
      setKeyboardSounds(keySounds);
      setMouseClickSound(clickSound);
      setLoaded(true);
    });
  }, []);

  const playRandomKeyboardSound = useCallback(
    (volume = VOLUME) => {
      if (keyboardSounds.length > 0) {
        const randomIndex = Math.floor(Math.random() * keyboardSounds.length);
        const soundToPlay = keyboardSounds[randomIndex];

        const soundClone = soundToPlay.cloneNode() as HTMLAudioElement;
        soundClone.volume = volume;
        soundClone.play();
      }
    },
    [keyboardSounds]
  );

  const playMouseClickSound = useCallback(() => {
    if (mouseClickSound) {
      const soundClone = mouseClickSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = VOLUME;
      soundClone.play();
    }
  }, [mouseClickSound]);

  return {
    loaded,
    playRandomKeyboardSound,
    playMouseClickSound,
  };
};
