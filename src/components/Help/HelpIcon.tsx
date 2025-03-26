import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import questionMarkImage from '../../assets/images/question-mark-pixel-y.png';
import SpeechBubble from './SpeechBubble';
import HintText from './HintText';

const GAP_FOR_QUESTION_MARK = 50;
const GAP_FOR_BUBBLE = 20;
const INITIAL_VISIBILITY_DURATION = 8000;

interface HelpIconProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  iconSize?: number;
  bubbleWidth?: number;
  bubbleMinHeight?: number;
  zIndex?: number;
}

const HelpIcon: React.FC<HelpIconProps> = ({
  position = 'bottom-right',
  iconSize = 32,
  bubbleWidth = 250,
  bubbleMinHeight = 150,
  zIndex = 999,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInitiallyVisible, setIsInitiallyVisible] = useState(true);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  const iconRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitiallyVisible(false);
    }, INITIAL_VISIBILITY_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showHint) return;

      const clickedIcon = iconRef.current?.contains(event.target as Node);
      const clickedBubble = bubbleRef.current?.contains(event.target as Node);

      if (!clickedIcon && !clickedBubble) {
        setShowHint(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHint]);

  const getPointerPosition = (): 'top' | 'bottom' | 'left' | 'right' => {
    switch (position) {
      case 'top-right':
      case 'top-left':
        return 'top';
      case 'bottom-right':
      case 'bottom-left':
      default:
        return 'bottom';
    }
  };

  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'help-icon-portal';
    container.className = 'fixed inset-0 pointer-events-none';
    container.style.zIndex = String(zIndex);

    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      document.body.removeChild(container);
    };
  }, [zIndex]);

  const getIconPositionStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    switch (position) {
      case 'top-right':
        style.top = `${GAP_FOR_QUESTION_MARK}px`;
        style.right = `${GAP_FOR_QUESTION_MARK}px`;
        break;
      case 'top-left':
        style.top = `${GAP_FOR_QUESTION_MARK}px`;
        style.left = `${GAP_FOR_QUESTION_MARK}px`;
        break;
      case 'bottom-left':
        style.bottom = `${GAP_FOR_QUESTION_MARK}px`;
        style.left = `${GAP_FOR_QUESTION_MARK}px`;
        break;
      case 'bottom-right':
      default:
        style.bottom = `${GAP_FOR_QUESTION_MARK}px`;
        style.right = `${GAP_FOR_QUESTION_MARK}px`;
        break;
    }

    return style;
  };

  const getBubblePositionStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    switch (position) {
      case 'top-right':
        style.top = `${iconSize + GAP_FOR_QUESTION_MARK + GAP_FOR_BUBBLE}px`;
        style.right = `${GAP_FOR_QUESTION_MARK}px`;
        break;
      case 'top-left':
        style.top = `${iconSize + GAP_FOR_QUESTION_MARK + GAP_FOR_BUBBLE}px`;
        style.left = `${GAP_FOR_QUESTION_MARK}px`;
        break;
      case 'bottom-left':
        style.bottom = `${iconSize + GAP_FOR_QUESTION_MARK + GAP_FOR_BUBBLE}px`;
        style.left = `${GAP_FOR_QUESTION_MARK}px`;
        break;
      case 'bottom-right':
      default:
        style.bottom = `${iconSize + GAP_FOR_QUESTION_MARK + GAP_FOR_BUBBLE}px`;
        style.right = `${GAP_FOR_QUESTION_MARK}px`;
        break;
    }

    return style;
  };

  if (!portalContainer) return null;

  return createPortal(
    <>
      <div
        ref={iconRef}
        className={`fixed pointer-events-auto cursor-pointer bg-no-repeat bg-contain transition-opacity duration-300 ${
          showHint || isHovered || isInitiallyVisible
            ? 'opacity-100'
            : 'opacity-30'
        }`}
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          backgroundImage: `url(${questionMarkImage})`,
          ...getIconPositionStyle(),
        }}
        onClick={() => setShowHint(!showHint)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label='Help'
      />

      {showHint && (
        <div
          ref={bubbleRef}
          className='fixed pointer-events-auto shadow-2xl'
          style={{
            ...getBubblePositionStyle(),
          }}
        >
          <SpeechBubble
            pointerPosition={getPointerPosition()}
            width={bubbleWidth}
            minHeight={bubbleMinHeight}
          >
            <HintText />
          </SpeechBubble>
        </div>
      )}
    </>,
    portalContainer
  );
};

export default HelpIcon;
