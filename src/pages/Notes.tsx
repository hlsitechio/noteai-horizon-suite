
import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import { useFolders } from '../contexts/FoldersContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import NotesHeader from './Notes/NotesHeader';
import NotesFilters from './Notes/NotesFilters';
import NotesGrid from './Notes/NotesGrid';

const Notes: React.FC = () => {
  const { filteredNotes, filters, isLoading, notes, selectedNote } = useNotes();
  const { folders } = useFolders();

  useQuantumAIIntegration({
    page: '/app/notes',
    content: `Notes page with ${notes.length} notes`,
    metadata: {
      hasNotes: notes.length > 0,
      selectedNote: selectedNote?.id,
      folders: folders.length
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  const hasFilters = !!(filters.searchTerm || filters.category || filters.isFavorite);

  return (
    <div className="space-y-6">
      <NotesHeader />
      <NotesFilters />
      <NotesGrid notes={filteredNotes} hasFilters={hasFilters} />
    </div>
  );
};

export default Notes;
