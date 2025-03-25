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
    <div className='fixed inset-0 bg-black flex justify-center items-center z-50'>
      <div className='text-center text-white w-4/5 max-w-md'>
        <div className='w-full h-1 bg-gray-800 rounded overflow-hidden my-4'>
          <div
            className='h-full bg-gradient-to-r from-[#4568DC] to-[#B06AB3] transition-all duration-200 ease-in-out'
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className='text-sm font-bold'>{Math.floor(progress)}%</div>
      </div>
    </div>
  );
}
