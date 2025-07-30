
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import type { AIButton3DProps } from './types';

const AIButton3D: React.FC<AIButton3DProps> = ({
  onClick,
  isActive,
  isDragging,
  dragRef,
  onDragStart,
  onDragEnd,
  className,
  isMobile
}) => {
  return (
    <motion.button
      ref={dragRef}
      drag={!isMobile}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      whileHover={!isDragging ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isDragging ? { scale: 0.95 } : {}}
      whileDrag={{ scale: 1.1, zIndex: 1000 }}
      onClick={onClick}
      className={`relative z-10 group w-16 h-16 cursor-${!isMobile ? (isDragging ? 'grabbing' : 'grab') : 'pointer'} ${className}`}
      title={!isMobile ? "Drag to move • Click for AI Copilot" : "Click for AI Copilot"}
    >
      {/* 3D Button Container */}
      <div className="relative w-full h-full">
        {/* Shadow/Base Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full transform translate-y-2 blur-sm opacity-50" />
        
        {/* Middle Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full transform translate-y-1" />
        
        {/* Top Layer */}
        <div className="relative w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-full border border-slate-500/30 shadow-2xl overflow-hidden group-hover:from-slate-500 group-hover:via-slate-600 group-hover:to-slate-700 transition-all duration-300">
          
          {/* Glowing Border */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
               style={{ mask: 'linear-gradient(white, white) content-box, linear-gradient(white, white)', maskComposite: 'exclude' }} />
          
          {/* Inner Glow */}
          <div className="absolute inset-1 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Icon Container */}
          <div className="flex items-center justify-center w-full h-full relative z-10">
            <motion.div
              animate={{ 
                rotate: isActive ? 180 : 0,
                scale: isActive ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Bot className={`w-8 h-8 text-white filter drop-shadow-lg ${isDragging ? 'opacity-70' : ''}`} />
            </motion.div>
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-3 left-3 w-0.5 h-0.5 bg-white rounded-full"
            />
          </div>
          
          {/* Pulse Ring */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/50"
              animate={{
                scale: [1, 1.3],
                opacity: [0.7, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          )}
        </div>
      </div>
      
      {/* Activity Indicator */}
      {isActive && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </motion.button>
  );
};

export default AIButton3D;
