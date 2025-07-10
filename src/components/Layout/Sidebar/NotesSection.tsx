
import React, { useState } from 'react';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { CollapsedNotesView } from './CollapsedNotesView';
import { ExpandedNotesView } from './ExpandedNotesView';

export function NotesSection() {
  const { notes, createNote, setCurrentNote, updateNote } = useOptimizedNotes();
  const { folders, createFolder } = useFolders();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();
  const sidebarOpen = !isCollapsed;

  // Section order state for drag and drop
  const [sectionOrder, setSectionOrder] = useState(['favorites', 'folders', 'notes']);

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

  const handleMoveToFolder = async (noteId: string, folderId: string | null) => {
    try {
      await updateNote(noteId, { folder_id: folderId });
    } catch (error) {
      console.error('Failed to move note to folder:', error);
    }
  };

  const handleToggleFavorite = async (noteId: string, isFavorite: boolean) => {
    try {
      await updateNote(noteId, { isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Load saved section order on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebarSectionOrder');
    if (saved) {
      try {
        const parsedOrder = JSON.parse(saved);
        if (Array.isArray(parsedOrder)) {
          setSectionOrder(parsedOrder);
        }
      } catch (error) {
        console.warn('Failed to parse saved section order:', error);
      }
    }
  }, []);

  const favoriteNotes = notes.filter(note => note.isFavorite);

  // Collapsed icon-only view with enhanced animations
  if (!sidebarOpen && !isMobile) {
    return (
      <CollapsedNotesView
        favoriteNotes={favoriteNotes}
        onCreateNote={handleCreateNote}
        onCreateFolder={handleCreateFolder}
      />
    );
  }

  return (
    <ExpandedNotesView
      notes={notes}
      folders={folders}
      favoriteNotes={favoriteNotes}
      sectionOrder={sectionOrder}
      expandedSections={expandedSections}
      onToggleSection={toggleSection}
      onCreateNote={handleCreateNote}
      onCreateFolder={handleCreateFolder}
      onMoveToFolder={handleMoveToFolder}
      onToggleFavorite={handleToggleFavorite}
      isMobile={isMobile}
    />
  );
}
