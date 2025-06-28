
import React, { useState } from 'react';
import { NotesListSection } from './NotesListSection';
import { ProjectsListSection } from './ProjectsListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { FoldersListSection } from './FoldersListSection';
import { CollapsedNotesSection } from './CollapsedNotesSection';
import { CreateFolderDialog } from './CreateFolderDialog';
import { useNotes } from '../../../contexts/NotesContext';
import { useProjectRealms } from '../../../contexts/ProjectRealmsContext';
import { useNavigate } from 'react-router-dom';

// Safely import useFolders with error handling
let useFolders: any = null;
try {
  const foldersModule = require('../../../contexts/FoldersContext');
  useFolders = foldersModule.useFolders;
} catch (error) {
  console.warn('FoldersContext not available:', error);
}

interface NotesSectionProps {
  isCollapsed?: boolean;
}

export function NotesSection({ isCollapsed = false }: NotesSectionProps) {
  const { notes, createNote, updateNote, setCurrentNote } = useNotes();
  const { projects } = useProjectRealms();
  const navigate = useNavigate();
  
  // Safely use folders context if available
  let folders: any[] = [];
  let createFolder: any = null;
  
  if (useFolders) {
    try {
      const foldersContext = useFolders();
      folders = foldersContext.folders || [];
      createFolder = foldersContext.createFolder;
    } catch (error) {
      console.warn('Could not access folders context:', error);
      folders = [];
      createFolder = null;
    }
  }
  
  // State for expandable sections
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  
  // State for folder creation dialog
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [folderName, setFolderName] = useState('');

  const favoriteNotes = notes.filter(note => note.isFavorite);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: 'Untitled Note',
        content: '',
        category: 'general' as const,
        tags: [],
        isFavorite: false,
        folder_id: null
      });
      
      // Set the new note as current and navigate to editor
      setCurrentNote(newNote);
      navigate('/app/editor');
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleCreateFolder = () => {
    if (folderName.trim() && createFolder) {
      createFolder({
        name: folderName.trim(),
        color: '#64748b'
      });
      setFolderName('');
      setShowCreateFolderDialog(false);
    }
  };

  if (isCollapsed) {
    return <CollapsedNotesSection />;
  }

  return (
    <div className="space-y-2">
      <NotesListSection
        notes={notes}
        isExpanded={isNotesExpanded}
        onToggle={() => setIsNotesExpanded(!isNotesExpanded)}
        onCreateNote={handleCreateNote}
        onCreateFolder={() => setShowCreateFolderDialog(true)}
      />

      {folders.length > 0 && (
        <FoldersListSection
          folders={folders}
          notes={notes}
          isExpanded={isFoldersExpanded}
          onToggle={() => setIsFoldersExpanded(!isFoldersExpanded)}
        />
      )}
      
      <ProjectsListSection
        projects={projects}
        isExpanded={isProjectsExpanded}
        onToggle={() => setIsProjectsExpanded(!isProjectsExpanded)}
      />
      
      {favoriteNotes.length > 0 && (
        <FavoritesListSection
          favoriteNotes={favoriteNotes}
          isExpanded={isFavoritesExpanded}
          onToggle={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
        />
      )}

      {createFolder && (
        <CreateFolderDialog
          isOpen={showCreateFolderDialog}
          onOpenChange={setShowCreateFolderDialog}
          folderName={folderName}
          onFolderNameChange={setFolderName}
          onCreateFolder={handleCreateFolder}
        />
      )}
    </div>
  );
}
