
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingWindowContentProps {
  content: string;
  isMinimized: boolean;
  windowHeight: number;
  onContentChange: (content: string) => void;
}

const FloatingWindowContent: React.FC<FloatingWindowContentProps> = ({
  content,
  isMinimized,
  windowHeight,
  onContentChange,
}) => {
  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex-1 flex flex-col"
          style={{ height: windowHeight - 50 }}
        >
          <div className="flex-1 p-3">
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Start writing your note..."
              className="w-full h-full resize-none border-none focus:ring-0 focus:outline-none bg-transparent"
              style={{ minHeight: windowHeight - 80 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingWindowContent;
