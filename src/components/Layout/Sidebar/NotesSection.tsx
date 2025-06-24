
import React, { useState } from 'react';
import { NotesListSection } from './NotesListSection';
import { ProjectsListSection } from './ProjectsListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { FoldersListSection } from './FoldersListSection';
import { CollapsedNotesSection } from './CollapsedNotesSection';
import { CreateFolderDialog } from './CreateFolderDialog';
import { useNotes } from '../../../contexts/NotesContext';
import { useProjectRealms } from '../../../contexts/ProjectRealmsContext';
import { useFolders } from '../../../contexts/FoldersContext';

interface NotesSectionProps {
  isCollapsed?: boolean;
}

export function NotesSection({ isCollapsed = false }: NotesSectionProps) {
  const { notes, createNote, updateNote } = useNotes();
  const { projects } = useProjectRealms();
  const { folders, createFolder } = useFolders();
  
  // State for expandable sections
  const [isNotesExpanded, setIsNotesExpanded] = useState(true);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(true);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  
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
  );
}
