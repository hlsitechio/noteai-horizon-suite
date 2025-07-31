
import React from 'react';
import { BookOpen } from 'lucide-react';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useFolders } from '@/contexts/FoldersContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { useIsMobile } from '@/hooks/use-mobile';
import NotesHeader from '../Notes/NotesHeader';
import NotesFilters from '../Notes/NotesFilters';
import NotesGrid from '../Notes/NotesGrid';
import EmptyNotesState from '../Notes/EmptyNotesState';

const Notes: React.FC = () => {
  const { filteredNotes, filters, isLoading, notes, selectedNote } = useOptimizedNotes();
  const { folders } = useFolders();
  const isMobile = useIsMobile();

  useQuantumAIIntegration({
    page: '/app/notes',
    content: `Notes page with ${notes.length} notes. Current filters: ${filters.searchTerm || 'none'}`,
    metadata: {
      hasNotes: notes.length > 0,
      selectedNote: selectedNote?.id,
      folders: folders.length,
      totalNotes: notes.length,
      filteredNotesCount: filteredNotes.length,
      activeFilters: Object.values(filters).filter(Boolean).length
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading your notes...</p>
        </div>
      </div>
    );
  }

  const hasFilters = !!(filters.searchTerm || filters.category || filters.isFavorite);

  return (
    <div className={`space-y-6 h-full overflow-auto ${isMobile ? 'p-3' : 'p-6'}`}>
      <NotesHeader />
      <NotesFilters />
      {filteredNotes.length === 0 ? (
        <EmptyNotesState hasFilters={hasFilters} />
      ) : (
        <NotesGrid notes={filteredNotes} hasFilters={hasFilters} />
      )}
    </div>
  );
};

export default Notes;
