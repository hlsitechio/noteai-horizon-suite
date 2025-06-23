
import { useEffect, useState } from 'react';
import { cursorPacks, getCursorPack, type CursorPack } from '../components/CustomCursor/CursorPacks';

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

export const useCustomCursor = () => {
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const [isActive, setIsActive] = useState(true);
  const [currentPack, setCurrentPack] = useState<string>('neon');

  useEffect(() => {
    const updateCursor = () => {
      if (!isActive) return;

      const pack = getCursorPack(currentPack);
      if (!pack) return;

      const cursor = pack.cursors[cursorState];
      if (cursor.url) {
        document.documentElement.style.setProperty(
          '--cursor-image', 
          `url("${cursor.url}")`
        );
        document.documentElement.style.setProperty(
          '--cursor-hotspot-x', 
          `${cursor.hotspotX || 0}px`
        );
        document.documentElement.style.setProperty(
          '--cursor-hotspot-y', 
          `${cursor.hotspotY || 0}px`
        );
      }
    };

    updateCursor();
  }, [cursorState, isActive, currentPack]);

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

  const switchPack = (packId: string) => {
    const pack = getCursorPack(packId);
    if (pack) {
      setCurrentPack(packId);
    }
  };

  return {
    cursorState,
    setCursorState,
    isActive,
    setIsActive,
    currentPack,
    switchPack,
    availablePacks: cursorPacks,
  };
};
