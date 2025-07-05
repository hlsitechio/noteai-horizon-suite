
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from '@/components/ui/sidebar';
import { NotesListSection } from './NotesListSection';
import { FoldersListSection } from './FoldersListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';

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
  const { state } = useSidebar();
  const { notes, createNote, setCurrentNote } = useOptimizedNotes();
  const { folders, createFolder } = useFolders();
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';

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
      navigate('/app/editor');
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

  if (isCollapsed) {
    return (
      <SidebarGroup className="flex-1 min-h-0">
        <SidebarGroupContent className="h-full flex items-center justify-center">
          <div className="px-2 py-1">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-xs font-medium text-primary">N</span>
            </div>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup className="flex-1 min-h-0">
      <SidebarGroupLabel>Content</SidebarGroupLabel>
      <SidebarGroupContent className="h-full">
        <AnimatePresence>
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="h-full overflow-hidden space-y-2"
          >
            <div className="h-full overflow-y-auto space-y-1">
              {/* Favorites Section */}
              {favoriteNotes.length > 0 && (
                <FavoritesListSection
                  notes={favoriteNotes}
                  isExpanded={expandedSections.favorites}
                  onToggle={() => toggleSection('favorites')}
                />
              )}

              {/* Folders Section */}
              <FoldersListSection
                folders={folders}
                notes={notes}
                isExpanded={expandedSections.folders}
                onToggle={() => toggleSection('folders')}
                onCreateFolder={handleCreateFolder}
              />

              {/* Notes Section */}
              <NotesListSection
                notes={notes}
                isExpanded={expandedSections.notes}
                onToggle={() => toggleSection('notes')}
                onCreateNote={handleCreateNote}
                onCreateFolder={handleCreateFolder}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
