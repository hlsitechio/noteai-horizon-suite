
import React from 'react';
import { BookOpen } from 'lucide-react';
import { useNotesWithTracing } from '../hooks/useNotesWithTracing';
import { useFolders } from '../contexts/FoldersContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { ErrorBoundaryWithTracing } from '../components/ErrorBoundaryWithTracing';
import NotesHeader from './Notes/NotesHeader';
import NotesFilters from './Notes/NotesFilters';
import NotesGrid from './Notes/NotesGrid';
import { useState } from 'react';
import { NoteFilters } from '../types/note';

const NotesWithTracing: React.FC = () => {
  const [filters, setFilters] = useState<NoteFilters>({});
  const { notes, isLoading, error, refetch } = useNotesWithTracing(filters);
  const { folders } = useFolders();

  useQuantumAIIntegration({
    page: '/app/notes',
    content: `Notes page with ${notes.length} notes. Current filters: ${filters.searchTerm || 'none'}`,
    metadata: {
      hasNotes: notes.length > 0,
      folders: folders.length,
      totalNotes: notes.length,
      filteredNotesCount: notes.length,
      activeFilters: Object.values(filters).filter(Boolean).length
    }
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Failed to load notes</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
    <ErrorBoundaryWithTracing>
      <div className="space-y-3 h-full">
        <NotesHeader />
        <NotesFilters filters={filters} onFiltersChange={setFilters} />
        <NotesGrid notes={notes} hasFilters={hasFilters} />
      </div>
    </ErrorBoundaryWithTracing>
  );
};

export default NotesWithTracing;
