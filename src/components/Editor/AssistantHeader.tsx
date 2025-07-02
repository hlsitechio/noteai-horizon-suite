
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface AssistantHeaderProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.15
    }
  }
};

const AssistantHeader: React.FC<AssistantHeaderProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className="p-4 border-b border-border/50">
      <div className="flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <motion.h3 
                className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                AI Power Tools
              </motion.h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Next-generation features</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggle(!isCollapsed)}
            className="w-8 h-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"
            />
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              className="relative z-10"
            >
              {isCollapsed ? (
                <ChevronDoubleLeftIcon className="w-4 h-4 drop-shadow-sm" />
              ) : (
                <ChevronDoubleRightIcon className="w-4 h-4 drop-shadow-sm" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AssistantHeader;
