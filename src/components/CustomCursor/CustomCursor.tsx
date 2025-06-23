
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCustomCursor } from '../../hooks/useCustomCursor';
import { getCursorPack } from './CursorPacks';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { isActive, cursorState, currentPack } = useCustomCursor();

  useEffect(() => {
    if (!isActive) return;

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        const pack = getCursorPack(currentPack);
        const cursor = pack?.cursors[cursorState];
        const hotspotX = cursor?.hotspotX || 16;
        const hotspotY = cursor?.hotspotY || 16;
        
        cursorRef.current.style.left = `${e.clientX - hotspotX}px`;
        cursorRef.current.style.top = `${e.clientY - hotspotY}px`;
      }
    };

    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, [isActive, cursorState, currentPack]);

  if (!isActive) return null;

  const pack = getCursorPack(currentPack);
  const cursor = pack?.cursors[cursorState];

  if (!cursor?.url) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="custom-cursor"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '32px',
        height: '32px',
        backgroundImage: `url(${cursor.url})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        pointerEvents: 'none',
        zIndex: 9999,
        filter: currentPack === 'neon' ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))' : 'none',
      }}
    />
  );
};

export default CustomCursor;
