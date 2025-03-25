import { useEffect } from 'react';
import { useSoundEffects } from '../hooks/useSoundEffects';

const SoundEffects: React.FC = () => {
  const { loaded, playRandomKeyboardSound, playMouseClickSound } =
    useSoundEffects();

  useEffect(() => {
    if (!loaded) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object') {
        if (event.data.type === 'keypress') {
          playRandomKeyboardSound();
        } else if (event.data.type === 'mouseclick') {
          playMouseClickSound();
        }
      }
    };

    // Listen for messages from iframe
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [loaded, playRandomKeyboardSound, playMouseClickSound]);

  return null;
};

export default SoundEffects;
