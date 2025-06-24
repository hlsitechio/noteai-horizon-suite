
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
    <div className="relative">
      {/* Glowing gradient circling border animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent via-accent/50 via-transparent to-accent blur-sm"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          background: 'conic-gradient(from 0deg, hsl(var(--accent)) 0%, transparent 50%, hsl(var(--accent)) 100%)',
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Secondary pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-accent/30 blur-md"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative z-10 group p-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-2xl shadow-premium hover:shadow-large transition-all duration-300 border border-accent/20 backdrop-blur-xl ${className}`}
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
    </div>
  );
};

export default CopilotButton;
