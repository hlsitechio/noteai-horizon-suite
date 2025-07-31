import React from 'react';
import { motion } from 'framer-motion';

interface PremiumChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PremiumChatContainer: React.FC<PremiumChatContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`
        relative overflow-hidden
        bg-gradient-glass backdrop-blur-xl
        border border-border/20
        rounded-2xl
        shadow-premium
        ${className}
      `}
    >
      {/* Quantum Aurora Background Effect */}
      <div className="absolute inset-0 bg-gradient-quantum opacity-30 animate-gradient-mesh pointer-events-none" />
      
      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/20 to-background/40 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};