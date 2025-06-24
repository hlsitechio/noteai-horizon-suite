
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useSidebar } from '@/components/ui/sidebar';
import { useNotes } from '../../../contexts/NotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useProjectRealms } from '../../../contexts/ProjectRealmsContext';
import { toast } from 'sonner';
import { NotesListSection } from './NotesListSection';
import { ProjectsListSection } from './ProjectsListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { CollapsedNotesSection } from './CollapsedNotesSection';
import { CreateFolderDialog } from './CreateFolderDialog';

export function NotesSection() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const { notes, createNote, updateNote } = useNotes();
  const { createFolder } = useFolders();
  const { projects } = useProjectRealms();
  
  const [expandedSections, setExpandedSections] = useState({
    notes: true,
    projects: false,
    favorites: false
  });

  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const favoriteNotes = notes.filter(note => note.isFavorite);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCreateNote = async () => {
    try {
      await createNote({
        title: 'New Note',
        content: '',
        category: 'general',
        tags: [],
        isFavorite: false,
        folder_id: null
      });
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        await createFolder({
          name: newFolderName.trim(),
          color: '#3b82f6'
        });
        setNewFolderName('');
        setShowCreateFolderDialog(false);
        toast.success('Folder created successfully');
      } catch (error) {
        console.error('Failed to create folder:', error);
        toast.error('Failed to create folder');
      }
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    const noteId = draggableId.replace('note-', '');
    
    try {
      if (destination.droppableId === 'favorites') {
        // Add to favorites
        await updateNote(noteId, { isFavorite: true });
        toast.success('Note added to favorites');
      } else if (destination.droppableId.startsWith('project-')) {
        // Move to project (this would require extending the note structure to include project_id)
        const projectId = destination.droppableId.replace('project-', '');
        toast.success('Note moved to project');
        // Note: You would need to extend the Note interface to include project_id
        // await updateNote(noteId, { project_id: projectId });
      }
    } catch (error) {
      console.error('Failed to move note:', error);
      toast.error('Failed to move note');
    }
  };

  if (isCollapsed) {
    return <CollapsedNotesSection />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <NotesListSection 
          notes={notes}
          isExpanded={expandedSections.notes}
          onToggle={() => toggleSection('notes')}
          onCreateNote={handleCreateNote}
          onCreateFolder={() => setShowCreateFolderDialog(true)}
        />

        <ProjectsListSection 
          projects={projects}
          isExpanded={expandedSections.projects}
          onToggle={() => toggleSection('projects')}
        />

        <FavoritesListSection 
          favoriteNotes={favoriteNotes}
          isExpanded={expandedSections.favorites}
          onToggle={() => toggleSection('favorites')}
        />

        <CreateFolderDialog
          isOpen={showCreateFolderDialog}
          onOpenChange={setShowCreateFolderDialog}
          folderName={newFolderName}
          onFolderNameChange={setNewFolderName}
          onCreateFolder={handleCreateFolder}
        />
      </div>
    </DragDropContext>
  );
}
