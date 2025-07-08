
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotesListSection } from './NotesListSection';
import { FoldersListSection } from './FoldersListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Star, Folder, FileText, Plus } from 'lucide-react';

const contentVariants = {
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: {
      delay: 0.1,
      duration: 0.3
    }
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2
    }
  }
};

export function NotesSection() {
  const { notes, createNote, setCurrentNote } = useOptimizedNotes();
  const { folders, createFolder } = useFolders();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { open: sidebarOpen } = useSidebar();

  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    folders: true,
    notes: true
  });

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Untitled Note',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false,
        folder_id: null,
      });
      setCurrentNote(newNote);
      navigate(`/app/editor/${newNote.id}`);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await createFolder({
        name: 'New Folder',
        color: '#64748b',
      });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const favoriteNotes = notes.filter(note => note.isFavorite);

  // Collapsed icon-only view
  if (!sidebarOpen && !isMobile) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center py-4 space-y-3">
        {/* Favorites icon */}
        {favoriteNotes.length > 0 && (
          <Button
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent transition-all duration-200"
            onClick={() => {/* Navigate to favorites */}}
          >
            <Star className="w-5 h-5 text-sidebar-foreground" />
          </Button>
        )}
        
        {/* Folders icon */}
        <Button
          variant="ghost"
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent transition-all duration-200"
          onClick={handleCreateFolder}
        >
          <Folder className="w-5 h-5 text-sidebar-foreground" />
        </Button>
        
        {/* Notes icon */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent transition-all duration-200" 
          onClick={handleCreateNote}
        >
          <FileText className="w-5 h-5 text-sidebar-foreground" />
        </Button>
        
        {/* Add icon */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent transition-all duration-200"
          onClick={handleCreateNote}
        >
          <Plus className="w-5 h-5 text-sidebar-foreground" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0">
      {!isMobile && (
        <div className="p-2">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-3">Content</h3>
        </div>
      )}
      <div className="h-full">
        <AnimatePresence>
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="h-full overflow-hidden space-y-2"
          >
            <div className="h-full overflow-y-auto space-y-1 px-2">
              {/* Favorites Section */}
              {favoriteNotes.length > 0 && (
                <FavoritesListSection
                  notes={favoriteNotes}
                  isExpanded={expandedSections.favorites}
                  onToggle={() => toggleSection('favorites')}
                  isMobile={isMobile}
                />
              )}

              {/* Folders Section */}
              <FoldersListSection
                folders={folders}
                notes={notes}
                isExpanded={expandedSections.folders}
                onToggle={() => toggleSection('folders')}
                onCreateFolder={handleCreateFolder}
                isMobile={isMobile}
              />

              {/* Notes Section */}
              <NotesListSection
                notes={notes}
                isExpanded={expandedSections.notes}
                onToggle={() => toggleSection('notes')}
                onCreateNote={handleCreateNote}
                onCreateFolder={handleCreateFolder}
                isMobile={isMobile}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
