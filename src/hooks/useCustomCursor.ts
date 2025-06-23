
import { useEffect, useState } from 'react';

export type CursorState = 
  | 'default' 
  | 'pointer' 
  | 'text' 
  | 'grab' 
  | 'grabbing' 
  | 'crosshair'
  | 'move'
  | 'resize'
  | 'loading';

const cursorPositions = {
  default: '0 0',
  pointer: '-32px 0',
  text: '-64px 0',
  grab: '-96px 0',
  grabbing: '-128px 0',
  crosshair: '-160px 0',
  move: '-192px 0',
  resize: '-224px 0',
  loading: '-256px 0',
};

export const useCustomCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const updateCursor = () => {
      if (!isActive) return;

      const position = cursorPositions[cursorState];
      document.documentElement.style.setProperty(
        '--cursor-bg-position', 
        position
      );
    };

    updateCursor();
  }, [cursorState, isActive]);

  useEffect(() => {
    // Hide default cursor and show custom cursor
    if (isActive) {
      document.body.style.cursor = 'none';
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.style.cursor = 'auto';
      document.body.classList.remove('custom-cursor-active');
    }

    return () => {
      document.body.style.cursor = 'auto';
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isActive]);

  return {
    cursorState,
    setCursorState,
    isActive,
    setIsActive,
  };
};
