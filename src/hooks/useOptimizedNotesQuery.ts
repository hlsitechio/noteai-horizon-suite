import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Note, NoteFilters } from '../types/note';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { useAuth } from '../contexts/AuthContext';
import { useCallback, useMemo } from 'react';

interface UseOptimizedNotesQueryOptions {
  filters?: NoteFilters;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
}

export const useOptimizedNotesQuery = ({
  filters,
  enabled = true,
  staleTime = 1000 * 60 * 5, // 5 minutes
  gcTime = 1000 * 60 * 30, // 30 minutes
}: UseOptimizedNotesQueryOptions = {}) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Memoize query key to prevent unnecessary re-renders
  const queryKey = useMemo(() => ['notes', user?.id, filters], [user?.id, filters]);

  // Optimized filter function
  const filterNotes = useCallback((notes: Note[], filters?: NoteFilters): Note[] => {
    if (!filters) return notes;

    return notes.filter(note => {
      // Early returns for better performance
      if (filters.category && note.category !== filters.category) return false;
      if (filters.isFavorite !== undefined && note.isFavorite !== filters.isFavorite) return false;
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = note.title.toLowerCase().includes(searchLower);
        const contentMatch = note.content.toLowerCase().includes(searchLower);
        const tagMatch = note.tags.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!titleMatch && !contentMatch && !tagMatch) return false;
      }
      
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag => 
          note.tags.includes(filterTag)
        );
        if (!hasMatchingTag) return false;
      }
      
      return true;
    });
  }, []);

  const notesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const notes = await SupabaseNotesService.getAllNotes();
      return filterNotes(notes, filters);
    },
    enabled: enabled && isAuthenticated && !!user,
    staleTime,
    gcTime,
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        return false;
      }
      return failureCount < 2; // Reduced from 3 to 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Optimized update functions
  const optimisticUpdate = useCallback((updater: (notes: Note[]) => Note[]) => {
    queryClient.setQueryData(queryKey, (oldData: Note[] | undefined) => {
      if (!oldData) return oldData;
      return updater(oldData);
    });
  }, [queryClient, queryKey]);

  const addNote = useCallback((newNote: Note) => {
    optimisticUpdate(notes => [newNote, ...notes]);
  }, [optimisticUpdate]);

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    optimisticUpdate(notes => 
      notes.map(note => 
        note.id === noteId ? { ...note, ...updates } : note
      )
    );
  }, [optimisticUpdate]);

  const removeNote = useCallback((noteId: string) => {
    optimisticUpdate(notes => notes.filter(note => note.id !== noteId));
  }, [optimisticUpdate]);

  return {
    notes: notesQuery.data ?? [],
    isLoading: notesQuery.isLoading,
    isError: notesQuery.isError,
    error: notesQuery.error,
    refetch: notesQuery.refetch,
    isStale: notesQuery.isStale,
    // Optimistic update functions
    addNote,
    updateNote,
    removeNote,
  };
};