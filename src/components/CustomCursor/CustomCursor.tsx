
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCustomCursor } from '../../hooks/useCustomCursor';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { isActive } = useCustomCursor();

  useEffect(() => {
    if (!isActive) return;

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <motion.div
      ref={cursorRef}
      className="custom-cursor"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '32px',
        height: '32px',
        backgroundImage: 'url(/cursors/cursor-sprite.png)',
        backgroundPosition: 'var(--cursor-bg-position, 0 0)',
        backgroundSize: 'auto 32px',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-16px, -16px)',
        mixBlendMode: 'normal',
      }}
    />
  );
};

export default CustomCursor;
