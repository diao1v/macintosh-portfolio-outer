import React, { useState, useEffect } from 'react';
import { isMobile, isTablet, browserName } from 'react-device-detect';

interface DeviceDetectionProps {
  children: React.ReactNode;
  minWidth?: number;
  minHeight?: number;
}

const DeviceDetection: React.FC<DeviceDetectionProps> = ({
  children,
  minWidth = 768,
  minHeight = 500,
}) => {
  const [windowTooSmall, setWindowTooSmall] = useState(false);
  const [isActualMobile, setIsActualMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsActualMobile(isMobile && !isTablet);
    const checkSize = () => {
      setWindowTooSmall(
        window.innerWidth < minWidth || window.innerHeight < minHeight
      );
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    setIsReady(true);

    return () => window.removeEventListener('resize', checkSize);
  }, [minWidth, minHeight]);

  if (!isReady) {
    return null;
  }

  if (isActualMobile) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-gray-900 text-white p-6 z-50'>
        <div className='max-w-md text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            Desktop Experience Required
          </h1>
          <div className='mb-4'>
            <img
              src='/macintosh.png'
              alt='Macintosh'
              className='w-10 mx-auto'
            />
          </div>
          <p className='mb-4'>
            This Macintosh portfolio experience is designed for desktop browsers
            with a larger screen and mouse/keyboard input.
          </p>
          <p className='mb-2'>
            Please visit this site from a desktop computer for the best
            experience.
          </p>
          <p className='text-sm opacity-70 mt-8'>
            You're currently using {browserName} on a mobile device.
          </p>
        </div>
      </div>
    );
  }

  if (windowTooSmall) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-gray-900 text-white p-6 z-50'>
        <div className='max-w-md text-center'>
          <h1 className='text-2xl font-bold mb-4'>Window Too Small</h1>
          <div className='mb-4'>
          <img
              src='/macintosh.png'
              alt='Macintosh'
              className='w-10 mx-auto'
            />
          </div>
          <p className='mb-4'>
            Please resize your browser window to at least {minWidth}x{minHeight}{' '}
            pixels for the best experience.
          </p>
          <p className='text-sm opacity-70 mt-8'>
            This Macintosh experience requires more screen space to display
            properly.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceDetection;
