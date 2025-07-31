import React from 'react';
import { NotesListSection } from './NotesListSection';
import { FoldersListSection } from './FoldersListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { Note } from '../../../types/note';
import { Folder as FolderType } from '../../../types/folder';

interface SectionRendererProps {
  sectionId: string;
  notes: Note[];
  folders: FolderType[];
  favoriteNotes: Note[];
  expandedSections: {
    favorites: boolean;
    folders: boolean;
    notes: boolean;
  };
  onToggleSection: (section: keyof SectionRendererProps['expandedSections']) => void;
  onCreateNote: () => void;
  onCreateFolder: () => Promise<void>;
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
  onFolderSelect?: (folderId: string) => void;
  isMobile: boolean;
}

export function SectionRenderer({
  sectionId,
  notes,
  folders,
  favoriteNotes,
  expandedSections,
  onToggleSection,
  onCreateNote,
  onCreateFolder,
  onMoveToFolder,
  onFolderSelect,
  isMobile
}: SectionRendererProps) {
  switch (sectionId) {
    case 'favorites':
      return (
        <FavoritesListSection
          notes={favoriteNotes}
          isExpanded={expandedSections.favorites}
          onToggle={() => onToggleSection('favorites')}
          onCreateNote={onCreateNote}
          isMobile={isMobile}
        />
      );
    case 'folders':
      return (
        <FoldersListSection
          folders={folders}
          notes={notes}
          isExpanded={expandedSections.folders}
          onToggle={() => onToggleSection('folders')}
          onCreateFolder={onCreateFolder}
          onMoveToFolder={onMoveToFolder}
          onFolderSelect={onFolderSelect}
          isMobile={isMobile}
        />
      );
    case 'notes':
      return (
        <NotesListSection
          notes={notes}
          isExpanded={expandedSections.notes}
          onToggle={() => onToggleSection('notes')}
          onCreateNote={onCreateNote}
          onCreateFolder={onCreateFolder}
          isMobile={isMobile}
        />
      );
    default:
      return null;
  }
}