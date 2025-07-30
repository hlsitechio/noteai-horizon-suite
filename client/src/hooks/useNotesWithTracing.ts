
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Note, NoteFilters } from '../types/note';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export const useNotesWithTracing = (filters?: NoteFilters) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for fetching notes with error tracing
  const notesQuery = useQuery({
    queryKey: ['notes', user?.id, filters],
    queryFn: async () => {
      try {
        const notes = await SupabaseNotesService.getAllNotes();
        
        // Apply filters if provided
        if (filters) {
          return notes.filter(note => {
            if (filters.category && note.category !== filters.category) return false;
            if (filters.isFavorite !== undefined && note.isFavorite !== filters.isFavorite) return false;
            if (filters.searchTerm) {
              const searchLower = filters.searchTerm.toLowerCase();
              const matchesTitle = note.title.toLowerCase().includes(searchLower);
              const matchesContent = note.content.toLowerCase().includes(searchLower);
              const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(searchLower));
              if (!matchesTitle && !matchesContent && !matchesTags) return false;
            }
            if (filters.tags && filters.tags.length > 0) {
              const hasMatchingTag = filters.tags.some(filterTag => 
                note.tags.includes(filterTag)
              );
              if (!hasMatchingTag) return false;
            }
            return true;
          });
        }
        
        return notes;
      } catch (error) {
        console.error('Failed to fetch notes:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      errorMessage: 'Failed to fetch notes',
    },
  });

  // Mutation for creating notes with error tracing
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        return await SupabaseNotesService.saveNote(noteData);
      } catch (error) {
        console.error('Failed to create note:', error);
        throw error;
      }
    },
    onSuccess: (newNote) => {
      // Optimistically update the cache
      queryClient.setQueryData(['notes', user?.id], (old: Note[] | undefined) => {
        if (!old) return [newNote];
        return [newNote, ...old];
      });
      toast.success('Note created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create note');
    },
    meta: {
      errorMessage: 'Failed to create note',
    },
  });

  // Mutation for updating notes with error tracing
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Note, 'id' | 'createdAt'>> }) => {
      try {
        return await SupabaseNotesService.updateNote(id, updates);
      } catch (error) {
        console.error('Failed to update note:', error);
        throw error;
      }
    },
    onSuccess: (updatedNote, { id }) => {
      if (updatedNote) {
        // Update the cache with the new data
        queryClient.setQueryData(['notes', user?.id], (old: Note[] | undefined) => {
          if (!old) return [updatedNote];
          return old.map(note => note.id === id ? updatedNote : note);
        });
        toast.success('Note updated successfully');
      }
    },
    onError: (error) => {
      toast.error('Failed to update note');
    },
    meta: {
      errorMessage: 'Failed to update note',
    },
  });

  // Mutation for deleting notes with error tracing
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      try {
        const success = await SupabaseNotesService.deleteNote(noteId);
        if (!success) {
          throw new Error('Delete operation returned false');
        }
        return noteId;
      } catch (error) {
        console.error('Failed to delete note:', error);
        throw error;
      }
    },
    onSuccess: (deletedNoteId) => {
      // Remove from cache
      queryClient.setQueryData(['notes', user?.id], (old: Note[] | undefined) => {
        if (!old) return [];
        return old.filter(note => note.id !== deletedNoteId);
      });
      toast.success('Note deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete note');
    },
    meta: {
      errorMessage: 'Failed to delete note',
    },
  });

  // Mutation for toggling favorite with error tracing
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      try {
        return await SupabaseNotesService.toggleFavorite(noteId);
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        throw error;
      }
    },
    onSuccess: (updatedNote, noteId) => {
      if (updatedNote) {
        // Update the cache
        queryClient.setQueryData(['notes', user?.id], (old: Note[] | undefined) => {
          if (!old) return [updatedNote];
          return old.map(note => note.id === noteId ? updatedNote : note);
        });
        toast.success(updatedNote.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    },
    onError: (error) => {
      toast.error('Failed to update favorite');
    },
    meta: {
      errorMessage: 'Failed to toggle favorite',
    },
  });

  return {
    // Query data
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    error: notesQuery.error,
    refetch: notesQuery.refetch,
    
    // Mutations
    createNote: createNoteMutation.mutate,
    updateNote: updateNoteMutation.mutate,
    deleteNote: deleteNoteMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    
    // Mutation states
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isTogglingFavorite: toggleFavoriteMutation.isPending,
  };
};
