
import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { NotesListSection } from './NotesListSection';
import { ProjectsListSection } from './ProjectsListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { CollapsedNotesSection } from './CollapsedNotesSection';
import { CreateFolderDialog } from './CreateFolderDialog';
import { useNotes } from '../../../contexts/NotesContext';
import { useProjectRealms } from '../../../contexts/ProjectRealmsContext';

interface NotesSectionProps {
  isCollapsed?: boolean;
}

export function NotesSection({ isCollapsed = false }: NotesSectionProps) {
  const { notes, createNote, updateNote } = useNotes();
  const { projects } = useProjectRealms();
  
  // State for expandable sections
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true);
  
  // State for folder creation dialog
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState('');

  const favoriteNotes = notes.filter(note => note.isFavorite);

  const handleCreateNote = () => {
    const newNote = {
      title: 'Untitled Note',
      content: '',
      category: 'general' as const,
      tags: [],
      isFavorite: false,
      folder_id: null
    };
    createNote(newNote);
  };

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      // Handle folder creation logic here
      console.log('Creating folder:', folderName);
      setFolderName('');
      setShowCreateFolderDialog(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    console.log('Drag end:', { destination, source, draggableId });

    // Handle drag and drop logic
    if (destination.droppableId === 'sidebar-favorites' && source.droppableId !== 'sidebar-favorites') {
      // Add to favorites
      const noteId = draggableId.replace('sidebar-note-', '').replace('sidebar-favorite-note-', '');
      const note = notes.find(n => n.id === noteId);
      if (note && updateNote) {
        updateNote(noteId, { ...note, isFavorite: true });
      }
    } else if (source.droppableId === 'sidebar-favorites' && destination.droppableId !== 'sidebar-favorites') {
      // Remove from favorites
      const noteId = draggableId.replace('sidebar-note-', '').replace('sidebar-favorite-note-', '');
      const note = notes.find(n => n.id === noteId);
      if (note && updateNote) {
        updateNote(noteId, { ...note, isFavorite: false });
      }
    }
  };

  if (isCollapsed) {
    return <CollapsedNotesSection />;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-2">
        <NotesListSection
          notes={notes}
          isExpanded={isNotesExpanded}
          onToggle={() => setIsNotesExpanded(!isNotesExpanded)}
          onCreateNote={handleCreateNote}
          onCreateFolder={() => setShowCreateFolderDialog(true)}
        />
        
        <ProjectsListSection
          projects={projects}
          isExpanded={isProjectsExpanded}
          onToggle={() => setIsProjectsExpanded(!isProjectsExpanded)}
        />
        
        <FavoritesListSection
          favoriteNotes={favoriteNotes}
          isExpanded={isFavoritesExpanded}
          onToggle={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
        />

        <CreateFolderDialog
          isOpen={showCreateFolderDialog}
          onOpenChange={setShowCreateFolderDialog}
          folderName={folderName}
          onFolderNameChange={setFolderName}
          onCreateFolder={handleCreateFolder}
        />
      </div>
    </DragDropContext>
  );
}
