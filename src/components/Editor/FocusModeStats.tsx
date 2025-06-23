
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusModeStatsProps {
  showStats: boolean;
  isControlsVisible: boolean;
  wordCount: number;
  characterCount: number;
  timeSpent: number;
  wpm: number;
  formatTime: (seconds: number) => string;
}

const FocusModeStats: React.FC<FocusModeStatsProps> = ({
  showStats,
  isControlsVisible,
  wordCount,
  characterCount,
  timeSpent,
  wpm,
  formatTime,
}) => {
  return (
    <AnimatePresence>
      {showStats && isControlsVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute bottom-6 left-6 bg-black/20 backdrop-blur-xl rounded-2xl p-6 min-w-[200px]"
        >
          <h3 className="text-white font-semibold mb-4">Writing Session</h3>
          <div className="space-y-3 text-white/80">
            <div className="flex justify-between">
              <span>Words:</span>
              <span className="font-mono">{wordCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Characters:</span>
              <span className="font-mono">{characterCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-mono">{formatTime(timeSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span>WPM:</span>
              <span className="font-mono">{wpm}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusModeStats;
