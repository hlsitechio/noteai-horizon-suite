
import React from 'react';
import { motion } from 'framer-motion';
import { CrownIcon, EyeIcon, HeartIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { headerVariants } from './EditorHeaderTypes';
import EditorHeaderButton from './EditorHeaderButton';

interface EditorHeaderCollapsedProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onSave: () => void;
  onCollapseAllBars?: () => void;
}

const EditorHeaderCollapsed: React.FC<EditorHeaderCollapsedProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  onFavoriteToggle,
  onFocusModeToggle,
  onSave,
}) => {
  return (
    <motion.div
      variants={headerVariants}
      animate="focus"
      className="flex justify-between items-center glass rounded-xl shadow-large"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ 
            rotate: 360,
            scale: 1.1,
            boxShadow: "0 0 30px rgba(147, 51, 234, 0.4)"
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-8 h-8 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <CrownIcon className="w-4 h-4 text-white drop-shadow-sm relative z-10" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-semibold text-foreground"
        >
          {isNewNote ? 'Creating...' : 'Editing...'}
        </motion.span>
      </div>
      <div className="flex gap-2">
        <EditorHeaderButton
          onClick={onFocusModeToggle}
          className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0 shadow-md hover:shadow-lg"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center"
          >
            <EyeIcon className="w-4 h-4 mr-1 drop-shadow-sm" />
          </motion.div>
          Focus
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
              <HeartSolidIcon className="w-4 h-4 mr-1 drop-shadow-sm" />
            ) : (
              <HeartIcon className="w-4 h-4 mr-1 drop-shadow-sm" />
            )}
          </motion.div>
          {isFavorite ? 'Favorited' : 'Favorite'}
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md relative overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
            animate={{
              x: [-100, 200],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            animate={isSaving ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isSaving ? Infinity : 0, ease: "linear" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10 flex items-center"
          >
            <BookmarkIcon className="w-4 h-4 mr-1 drop-shadow-sm" />
          </motion.div>
          <span className="relative z-10">{isSaving ? 'Saving...' : 'Save'}</span>
        </EditorHeaderButton>
      </div>
    </motion.div>
  );
};

export default EditorHeaderCollapsed;
