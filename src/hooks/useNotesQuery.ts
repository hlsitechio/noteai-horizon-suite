
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { Note } from '../types/note';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Query keys for better organization
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filters: string) => [...noteKeys.lists(), { filters }] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
};

export const useNotesQuery = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: noteKeys.lists(),
    queryFn: () => SupabaseNotesService.getAllNotes(),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useNoteQuery = (id: string) => {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => SupabaseNotesService.getNoteById(id),
    enabled: !!id,
  });
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) =>
      SupabaseNotesService.saveNote(noteData),
    onSuccess: (newNote) => {
      // Add the new note to the cache
      queryClient.setQueryData(noteKeys.lists(), (old: Note[] | undefined) => {
        if (!old) return [newNote];
        return [newNote, ...old];
      });
      
      // Also cache the individual note
      queryClient.setQueryData(noteKeys.detail(newNote.id), newNote);
      
      toast.success('Note created successfully');
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
      toast.error('Failed to create note');
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Note, 'id' | 'createdAt'>> }) =>
      SupabaseNotesService.updateNote(id, updates),
    onSuccess: (updatedNote) => {
      if (updatedNote) {
        // Update the note in the list cache
        queryClient.setQueryData(noteKeys.lists(), (old: Note[] | undefined) => {
          if (!old) return [updatedNote];
          return old.map(note => note.id === updatedNote.id ? updatedNote : note);
        });
        
        // Update the individual note cache
        queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote);
        
        toast.success('Note updated successfully');
      }
    },
    onError: (error) => {
      console.error('Failed to update note:', error);
      toast.error('Failed to update note');
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => SupabaseNotesService.deleteNote(id),
    onSuccess: (success, id) => {
      if (success) {
        // Remove the note from the list cache
        queryClient.setQueryData(noteKeys.lists(), (old: Note[] | undefined) => {
          if (!old) return [];
          return old.filter(note => note.id !== id);
        });
        
        // Remove the individual note cache
        queryClient.removeQueries({ queryKey: noteKeys.detail(id) });
        
        toast.success('Note deleted successfully');
      }
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note');
    },
  });
};

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => SupabaseNotesService.toggleFavorite(id),
    onSuccess: (updatedNote) => {
      if (updatedNote) {
        // Update both caches
        queryClient.setQueryData(noteKeys.lists(), (old: Note[] | undefined) => {
          if (!old) return [updatedNote];
          return old.map(note => note.id === updatedNote.id ? updatedNote : note);
        });
        
        queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote);
        
        toast.success(updatedNote.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    },
    onError: (error) => {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    },
  });
};
