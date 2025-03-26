import React from 'react';

type PointerPosition = 'top' | 'bottom' | 'left' | 'right';

interface SpeechBubbleProps {
  children: React.ReactNode;
  pointerPosition: PointerPosition;
  width?: number;
  minHeight?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  children,
  pointerPosition,
  width = 250,
  minHeight = 150,
  backgroundColor = '#ffffff',
  borderColor = '#000000',
  borderWidth = 0.5,
  borderRadius = 4,
  className = '',
  style = {},
}) => {
  const getPointerPath = (): string => {
    switch (pointerPosition) {
      case 'top':
        return 'M20,0 L30,-15 L40,0';
      case 'bottom':
        return 'M20,100 L30,115 L40,100';
      case 'left':
        return 'M0,20 L-15,30 L0,40';
      case 'right':
        return 'M100,20 L115,30 L100,40';
      default:
        return '';
    }
  };

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        minHeight: `${minHeight}px`,
        ...style,
      }}
    >
      <div className='relative w-full h-full'>
        <svg
          className='absolute inset-0 w-full h-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          <rect
            x='0'
            y='0'
            width='100'
            height='100'
            rx={borderRadius}
            ry={borderRadius}
            fill={backgroundColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin='round'
          />

          <path
            d={getPointerPath()}
            fill={backgroundColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin='round'
          />
        </svg>

        <div className='relative z-10 p-4 w-full h-full overflow-auto text-black text-sm'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SpeechBubble;
