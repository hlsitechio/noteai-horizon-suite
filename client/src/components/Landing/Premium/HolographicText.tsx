import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface HolographicTextProps {
  children: React.ReactNode;
  className?: string;
  glitchEffect?: boolean;
  speed?: number;
}

const HolographicText: React.FC<HolographicTextProps> = ({ 
  children, 
  className = '',
  glitchEffect = false,
  speed = 1
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (glitchEffect && textRef.current) {
      const textElement = textRef.current;
      textElement.setAttribute('data-text', textElement.textContent || '');
    }
  }, [children, glitchEffect]);

  return (
    <motion.div
      ref={textRef}
      className={`
        text-holographic
        ${glitchEffect ? 'glitch-text' : ''}
        ${className}
      `}
      style={{
        animationDuration: `${4 / speed}s`
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default HolographicText;