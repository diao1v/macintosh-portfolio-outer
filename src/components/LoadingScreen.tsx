import { useEffect, useState } from 'react';
import { allAssetsLoaded } from '../utils/preload';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 95) return prev + 0.5;
        return prev;
      });
    }, 10);

    allAssetsLoaded.then(() => {
      clearInterval(interval);
      setProgress(100);
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='loading-screen'>
      <div className='loading-container'>
        <div className='loading-title'>Loading...</div>
        <div className='progress-bar'>
          <div className='progress-fill' style={{ width: `${progress}%` }} />
        </div>
        <div className='progress-text'>{Math.floor(progress)}%</div>
      </div>
    </div>
  );
}
