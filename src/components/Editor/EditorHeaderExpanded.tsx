
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Focus, Heart, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
            className="w-8 h-8 text-gray-500 hover:text-foreground transition-colors self-start mt-1"
          >
            <motion.div
              animate={{ rotate: isHeaderCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isHeaderCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
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
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 dark:from-blue-400 dark:to-purple-400"
              >
                {isNewNote ? 'Create New Note' : 'Edit Note'}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <Crown className="w-8 h-8 text-yellow-500" />
                </motion.div>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg font-medium mt-1 dark:text-slate-300"
              >
                {isNewNote ? 'Create with the most advanced AI writing tools available' : 'Edit with world-class AI writing assistance'}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mt-2"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.7)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                      "0 0 0 0 rgba(59, 130, 246, 0)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 backdrop-blur-md">
                    ⚡ AI-Powered
                  </Badge>
                </motion.div>
                <Badge variant="outline" className="border-0 bg-yellow-100/20 backdrop-blur-sm text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300">
                  🏆 Better than Notion AI
                </Badge>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        <EditorHeaderButton
          onClick={onFocusModeToggle}
          className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
        >
          <Focus className="w-4 h-4 mr-2" />
          Focus Mode
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onFavoriteToggle}
          className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all backdrop-blur-sm border-0`}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.div>
          {isFavorite ? 'Favorited' : 'Add to Favorites'}
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md"
        >
          <motion.div
            animate={isSaving ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isSaving ? Infinity : 0 }}
          >
            <Save className="w-4 h-4 mr-2" />
          </motion.div>
          {isSaving ? 'Saving...' : 'Save Note'}
        </EditorHeaderButton>
      </div>
    </motion.div>
  );
};

export default EditorHeaderExpanded;
