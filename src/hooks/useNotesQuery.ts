
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    queryFn: () => {
      console.log('API calls disabled - returning empty notes');
      return Promise.resolve([]);
    },
    enabled: false, // Disable the query
    staleTime: 1000 * 60 * 2,
  });
};

export const useNoteQuery = (id: string) => {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => {
      console.log('API calls disabled - returning null note');
      return Promise.resolve(null);
    },
    enabled: false, // Disable the query
  });
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('API calls disabled - create note blocked');
      return Promise.reject(new Error('API calls are disabled'));
    },
    onError: (error) => {
      console.error('Note creation blocked:', error);
      toast.error('API calls are disabled');
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<Note, 'id' | 'createdAt'>> }) => {
      console.log('API calls disabled - update note blocked');
      return Promise.reject(new Error('API calls are disabled'));
    },
    onError: (error) => {
      console.error('Note update blocked:', error);
      toast.error('API calls are disabled');
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('API calls disabled - delete note blocked');
      return Promise.reject(new Error('API calls are disabled'));
    },
    onError: (error) => {
      console.error('Note delete blocked:', error);
      toast.error('API calls are disabled');
    },
  });
};

export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('API calls disabled - toggle favorite blocked');
      return Promise.reject(new Error('API calls are disabled'));
    },
    onError: (error) => {
      console.error('Toggle favorite blocked:', error);
      toast.error('API calls are disabled');
    },
  });
};
