
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface WelcomeContentProps {
  currentTime: string;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ currentTime }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-2"
        >
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <h1 className="text-4xl font-bold tracking-tight">
            {getGreeting()}
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/90 font-medium"
        >
          {currentTime}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default WelcomeContent;
