
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowsPointingOutIcon, 
  BookmarkIcon, 
  PencilIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ClockIcon, 
  ChartBarIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface FocusModeControlsProps {
  isControlsVisible: boolean;
  isZenMode: boolean;
  onZenModeToggle: () => void;
  showStats: boolean;
  onStatsToggle: () => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
  title: string;
  wordCount: number;
  timeSpent: number;
  formatTime: (seconds: number) => string;
}

const FocusModeControls: React.FC<FocusModeControlsProps> = ({
  isControlsVisible,
  isZenMode,
  onZenModeToggle,
  showStats,
  onStatsToggle,
  onSave,
  onClose,
  isSaving,
  title,
  wordCount,
  timeSpent,
  formatTime,
}) => {
  return (
    <AnimatePresence>
      {isControlsVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between bg-black/20 backdrop-blur-xl rounded-2xl p-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 text-white/90"
            >
              <ArrowsPointingOutIcon className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold">Focus Mode</span>
            </motion.div>
            
            {/* Writing Stats */}
            <motion.div 
              className="flex items-center gap-4 text-sm text-white/70"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-1">
                <PencilIcon className="w-4 h-4" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            {/* Zen Mode Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZenModeToggle}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {isZenMode ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
              </Button>
            </motion.div>

            {/* Stats Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onStatsToggle}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ChartBarIcon className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Save Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onSave}
                disabled={!title.trim() || isSaving}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-none shadow-lg"
              >
                <BookmarkIcon className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </motion.div>

            {/* Close Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusModeControls;
