import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const PremiumTypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-[85%] flex items-start gap-3">
        <div className="
          w-8 h-8 rounded-full
          bg-gradient-holographic
          border border-primary/30
          flex items-center justify-center
          shadow-glow animate-pulse-glow
        ">
          <Bot className="h-4 w-4 text-background" />
        </div>
        <div className="
          bg-gradient-glass backdrop-blur-xl
          border border-border/30
          rounded-2xl rounded-bl-md px-4 py-3
          shadow-elegant
        ">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl rounded-bl-md pointer-events-none" />
          <div className="relative flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              AI is thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};