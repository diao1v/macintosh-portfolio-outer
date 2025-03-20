import { useEffect, useState } from 'react';
import { allAssetsLoaded } from '../utils/preload';

const Loader = () => (
  <div className='flex justify-center items-center mb-8 space-x-2'>
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className='w-3 h-3 rounded-full bg-white opacity-0 animate-pulse'
        style={{
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1.5s',
        }}
      />
    ))}
  </div>
);

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
        <Loader />
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
