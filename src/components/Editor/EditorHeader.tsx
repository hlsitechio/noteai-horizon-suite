
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Save, Focus, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotes } from '../../contexts/NotesContext';
import NoteShareButton from '../Sharing/NoteShareButton';

interface EditorHeaderProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  isCollapsed: boolean;
  isHeaderCollapsed: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onHeaderCollapseToggle: () => void;
  onSave: () => void;
  onCollapseAllBars: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  isCollapsed,
  isHeaderCollapsed,
  onFavoriteToggle,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onSave,
  onCollapseAllBars,
}) => {
  const { currentNote } = useNotes();

  if (isHeaderCollapsed) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center mb-4"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onHeaderCollapseToggle}
          className="text-gray-400 hover:text-gray-600"
        >
          <Minimize2 className="w-4 h-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {isNewNote ? 'Create New Note' : 'Edit Note'}
              </h1>
              <p className="text-gray-600">
                Write your thoughts with AI assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFavoriteToggle}
              className={`${
                isFavorite 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>

            {currentNote && !isNewNote && (
              <NoteShareButton 
                note={currentNote} 
                variant="ghost" 
                size="sm" 
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onFocusModeToggle}
              className="text-gray-400 hover:text-gray-600"
            >
              <Focus className="w-4 h-4" />
            </Button>

            <Button
              onClick={onSave}
              disabled={!canSave || isSaving}
              className="min-w-[100px]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Note'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onHeaderCollapseToggle}
              className="text-gray-400 hover:text-gray-600"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorHeader;
