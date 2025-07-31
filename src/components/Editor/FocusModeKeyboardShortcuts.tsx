
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FocusModeKeyboardShortcutsProps {
  isControlsVisible: boolean;
}

const FocusModeKeyboardShortcuts: React.FC<FocusModeKeyboardShortcutsProps> = ({
  isControlsVisible,
}) => {
  return (
    <AnimatePresence>
      {isControlsVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center"
        >
          <div className="flex gap-6 text-sm text-white/60">
            <span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">Esc</kbd>
              Exit
            </span>
            <span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">Ctrl+S</kbd>
              Save
            </span>
            <span>
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs mr-1">Ctrl+H</kbd>
              {isControlsVisible ? "Hide" : "Show"} Controls
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusModeKeyboardShortcuts;
