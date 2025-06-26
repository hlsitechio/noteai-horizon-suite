
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative z-10 group p-4 bg-transparent border-2 border-accent text-accent rounded-2xl transition-all duration-200 hover:bg-accent/10 hover:-translate-y-0.5 ${className}`}
      title="Open AI Copilot"
    >
      <motion.div
        animate={{ 
          rotate: isActive ? 180 : 0,
          scale: isActive ? 1.05 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <Bot className="w-6 h-6" />
      </motion.div>
    </motion.button>
  );
};

export default CopilotButton;
