
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EyeIcon, 
  HeartIcon, 
  ChevronUpIcon, 
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';
import { headerVariants, contentVariants } from './EditorHeaderTypes';
import EditorHeaderButton from './EditorHeaderButton';

interface EditorHeaderExpandedProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  isHeaderCollapsed: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onHeaderCollapseToggle?: () => void;
  onSave: () => void;
  onCollapseAllBars?: () => void;
}

const EditorHeaderExpanded: React.FC<EditorHeaderExpandedProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  isHeaderCollapsed,
  onFavoriteToggle,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onSave,
}) => {
  return (
    <motion.div
      variants={headerVariants}
      animate={isHeaderCollapsed ? 'collapsed' : 'expanded'}
      className="flex justify-between items-start glass rounded-2xl shadow-large"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onHeaderCollapseToggle}
            className="w-8 h-8 text-gray-500 hover:text-foreground transition-colors self-start mt-1 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 shadow-sm hover:shadow-md"
          >
            <motion.div
              animate={{ rotate: isHeaderCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
            >
              {isHeaderCollapsed ? <ChevronDownIcon className="w-4 h-4 drop-shadow-sm" /> : <ChevronUpIcon className="w-4 h-4 drop-shadow-sm" />}
            </motion.div>
          </Button>
        </motion.div>
        <AnimatePresence>
          {!isHeaderCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
              >
                {isNewNote ? 'Create New Note' : 'Edit Note'}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg font-medium mt-1 dark:text-slate-300"
              >
                {isNewNote ? 'Create with the most advanced AI writing tools available' : 'Edit with world-class AI writing assistance'}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        <EditorHeaderButton
          onClick={onFocusModeToggle}
          className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0 shadow-md hover:shadow-lg"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <EyeIcon className="w-4 h-4 mr-2 drop-shadow-sm" />
          </motion.div>
          Focus Mode
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onFavoriteToggle}
          className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20 shadow-lg' : 'text-gray-400 dark:text-slate-400 shadow-md'} hover:scale-105 transition-all backdrop-blur-sm border-0 hover:shadow-lg`}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {isFavorite ? (
              <HeartSolidIcon className="w-4 h-4 mr-2 drop-shadow-sm" />
            ) : (
              <HeartIcon className="w-4 h-4 mr-2 drop-shadow-sm" />
            )}
          </motion.div>
          {isFavorite ? 'Favorited' : 'Add to Favorites'}
        </EditorHeaderButton>
      </div>
    </motion.div>
  );
};

export default EditorHeaderExpanded;
