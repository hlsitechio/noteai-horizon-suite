
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
        className="group relative p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        title="Open Quantum AI (⌘K)"
      >
        <motion.div
          animate={{ 
            rotate: state.isVisible ? 180 : 0,
            scale: state.isVisible ? 1.1 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <Brain className="w-5 h-5" />
        </motion.div>
        
        {/* Pulse effect when active */}
        {state.isVisible && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
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
        
        {/* Keyboard shortcut hint */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>⌘K</span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default QuantumAIIndicator;
