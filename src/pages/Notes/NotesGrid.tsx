
import React from 'react';
import { Note } from '../../types/note';
import NoteCard from './NoteCard';
import EmptyNotesState from './EmptyNotesState';

interface NotesGridProps {
  notes: Note[];
  hasFilters: boolean;
}

const NotesGrid: React.FC<NotesGridProps> = ({ notes, hasFilters }) => {
  if (notes.length === 0) {
    return <EmptyNotesState hasFilters={hasFilters} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NotesGrid;
