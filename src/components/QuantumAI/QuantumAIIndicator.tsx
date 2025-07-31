
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Command } from 'lucide-react';
import { useQuantumAI } from '@/contexts/QuantumAIContext';

const QuantumAIIndicator: React.FC = () => {
  const { state, showCommandPalette } = useQuantumAI();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={showCommandPalette}
        className="group relative p-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground rounded-2xl shadow-premium hover:shadow-large transition-all duration-300 border border-accent/20 backdrop-blur-xl"
        title="Open Quantum AI (⌘K)"
      >
        <motion.div
          animate={{ 
            rotate: state.isVisible ? 180 : 0,
            scale: state.isVisible ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <Brain className="w-6 h-6" />
        </motion.div>
        
        {/* Electric pulse effect when active */}
        {state.isVisible && (
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
        
        {/* Professional keyboard shortcut hint */}
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-xl text-foreground text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border/20 shadow-premium">
          <div className="flex items-center gap-2">
            <Command className="w-3 h-3" />
            <span className="font-medium">⌘K</span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default QuantumAIIndicator;
