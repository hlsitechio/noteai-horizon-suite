
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface CopilotButtonProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

const CopilotButton: React.FC<CopilotButtonProps> = ({ 
  onClick, 
  isActive = false, 
  className = "" 
}) => {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent click if we just finished dragging
    if (isDragging) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  return (
    <motion.button
      ref={dragRef}
      drag={!isMobile}
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: -window.innerWidth / 2,
        right: window.innerWidth / 2,
        top: -window.innerHeight / 2,
        bottom: window.innerHeight / 2,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileHover={!isDragging ? { scale: 1.02 } : {}}
      whileTap={!isDragging ? { scale: 0.98 } : {}}
      whileDrag={{ scale: 1.05, zIndex: 1000 }}
      onClick={handleClick}
      className={`relative z-10 group p-4 bg-transparent border-2 border-accent text-accent rounded-2xl transition-all duration-200 hover:bg-accent/10 hover:-translate-y-0.5 cursor-${!isMobile ? (isDragging ? 'grabbing' : 'grab') : 'pointer'} ${className}`}
      title={!isMobile ? "Drag to move • Click to open AI Copilot" : "Open AI Copilot"}
    >
      <motion.div
        animate={{ 
          rotate: isActive ? 180 : 0,
          scale: isActive ? 1.05 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <Bot className={`w-6 h-6 ${isDragging ? 'opacity-70' : ''}`} />
      </motion.div>
    </motion.button>
  );
};

export default CopilotButton;
