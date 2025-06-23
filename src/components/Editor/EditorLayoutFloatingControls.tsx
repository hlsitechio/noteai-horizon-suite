
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowsPointingOutIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

interface EditorLayoutFloatingControlsProps {
  isDistractionFree: boolean;
  onToggleDistractionFree: () => void;
}

const EditorLayoutFloatingControls: React.FC<EditorLayoutFloatingControlsProps> = ({
  isDistractionFree,
  onToggleDistractionFree,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={onToggleDistractionFree}
          className={`glass shadow-lg ${
            isDistractionFree 
              ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800' 
              : 'bg-white/10 hover:bg-white/20 dark:bg-gray-800/20 dark:hover:bg-gray-700/30'
          } text-white border-0 backdrop-blur-md transition-all duration-300 relative overflow-hidden group`}
          size="lg"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              x: [-100, 200],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {isDistractionFree ? (
            <>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Squares2X2Icon className="w-5 h-5 mr-2 drop-shadow-sm" />
              </motion.div>
              <span className="relative z-10">Exit Focus</span>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <ArrowsPointingOutIcon className="w-5 h-5 mr-2 drop-shadow-sm" />
              </motion.div>
              <span className="relative z-10">Enter Focus</span>
            </>
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditorLayoutFloatingControls;
