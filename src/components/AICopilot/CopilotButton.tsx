
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

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
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group relative p-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-2xl shadow-premium hover:shadow-large transition-all duration-300 border border-accent/20 backdrop-blur-xl ${className}`}
      title="Open AI Copilot"
    >
      <motion.div
        animate={{ 
          rotate: isActive ? 180 : 0,
          scale: isActive ? 1.1 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <Bot className="w-6 h-6" />
      </motion.div>
      
      {/* Electric pulse effect when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent to-accent/80 rounded-2xl"
          animate={{
            scale: [1, 1.2],
            opacity: [0.7, 0]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </motion.button>
  );
};

export default CopilotButton;
