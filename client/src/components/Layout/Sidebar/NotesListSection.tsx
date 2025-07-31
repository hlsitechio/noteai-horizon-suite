
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Note } from '../../../types/note';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useConfirmDialog } from '@/hooks/useConfirmDialog';
import { NotesListHeader } from './NotesListHeader';
import { NotesListContent } from './NotesListContent';

interface NotesListSectionProps {
  notes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
  onCreateNote: () => void;
  onCreateFolder: () => void;
  isMobile: boolean;
}

export function NotesListSection({ 
  notes, 
  isExpanded, 
  onToggle, 
  onCreateNote, 
  onCreateFolder,
  isMobile
}: NotesListSectionProps) {
  const { setCurrentNote, deleteNote } = useOptimizedNotes();
  const { confirmDelete, ConfirmDialog } = useConfirmDialog();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get all notes sorted by most recent
  const allNotes = notes.sort((a, b) => 
    new Date(b.updatedAt || b.updated_at || '').getTime() - new Date(a.updatedAt || a.updated_at || '').getTime()
  );
  
  // Show more notes when expanded, fewer when collapsed
  const displayNotes = isExpanded ? allNotes.slice(0, 10) : allNotes.slice(0, 5);

  const handleNoteClick = (note: Note) => {
    setCurrentNote(note);
    navigate(`/app/notes?note=${note.id}`);
  };

  const handleEditNote = (note: Note, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCurrentNote(note);
    navigate(`/app/editor/${note.id}`);
  };

  const handleDeleteNote = async (noteId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const note = notes.find(n => n.id === noteId);
    const confirmed = await confirmDelete(note?.title || 'this note');
    
    if (confirmed) {
      await deleteNote(noteId);
    }
  };

  const isNoteActive = (noteId: string) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('note') === noteId;
  };

  return (
    <div className="space-y-2">
      <NotesListHeader
        isExpanded={isExpanded}
        onToggle={onToggle}
        onCreateNote={onCreateNote}
        notesCount={notes.length}
        isMobile={isMobile}
      />
      
      <NotesListContent
        isExpanded={isExpanded}
        isMobile={isMobile}
        displayNotes={displayNotes}
        allNotes={allNotes}
        isNoteActive={isNoteActive}
        onNoteClick={handleNoteClick}
        onEditNote={handleEditNote}
        onDeleteNote={handleDeleteNote}
      />
      
      <ConfirmDialog />
    </div>
  );
}
