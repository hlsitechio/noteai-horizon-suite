
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Note, NoteFilters } from '../types/note';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOptimizedNotes } from './OptimizedNotesContext';

interface NotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  currentNote: Note | null;
  selectedNote: Note | null;
  filters: NoteFilters;
  isLoading: boolean;
  folders: Array<{ id: string; name: string; parent_folder_id?: string }>;
  syncStatus: 'connected' | 'disconnected' | 'syncing';
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  setCurrentNote: (note: Note | null) => void;
  setSelectedNote: (note: Note | null) => void;
  setFilters: (filters: NoteFilters) => void;
  refreshNotes: () => void;
  toggleFavorite: (id: string) => Promise<Note | null>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  console.warn('NotesContext is deprecated. Please migrate to OptimizedNotesContext for better performance.');
  
  // Use the imported optimized hook
  return useOptimizedNotes();
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filters, setFilters] = useState<NoteFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  
  // Get auth state - safely handle case where FoldersProvider might not be ready
  const { user, isLoading: authLoading } = useAuth();
  
  // Initialize folders as empty array - will be populated when folders context is available
  const folders: Array<{ id: string; name: string; parent_folder_id?: string }> = [];

  // Track subscription state with refs to prevent multiple subscriptions
  const subscriptionRef = useRef<any>(null);
  const hasSubscribedRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  // Debounce utility function with proper typing
  const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const refreshNotes = async () => {
    if (!user) {
      // Development logging only
      if (import.meta.env.DEV) {
        console.log('No user, skipping notes refresh');
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setSyncStatus('syncing');
    try {
      const loadedNotes = await SupabaseNotesService.getAllNotes();
      setNotes(loadedNotes);
      setSyncStatus('connected');
    } catch (error) {
      setSyncStatus('disconnected');
      console.error('Error loading notes:', error);
      // Only show toast if user is authenticated (to avoid errors on public pages)
      if (user) {
        toast.error('Failed to load notes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup function to properly remove subscriptions
  const cleanupSubscription = () => {
    if (subscriptionRef.current) {
      if (import.meta.env.DEV) {
        console.log('Cleaning up existing real-time subscription');
      }
      
      // First unsubscribe from the channel
      subscriptionRef.current.unsubscribe().then(() => {
        if (import.meta.env.DEV) {
          console.log('Successfully unsubscribed from channel');
        }
        
        // Then remove the channel
        if (subscriptionRef.current) {
          // supabase.removeChannel(subscriptionRef.current);
          if (import.meta.env.DEV) {
            console.log('Channel removed');
          }
        }
      }).catch((error: any) => {
        if (import.meta.env.DEV) {
          console.error('Error during unsubscribe:', error);
        }
        // Force remove the channel even if unsubscribe fails
        if (subscriptionRef.current) {
          // supabase.removeChannel(subscriptionRef.current);
        }
      });
      
      subscriptionRef.current = null;
      hasSubscribedRef.current = false;
    }
  };

  // Set up real-time subscription only when user is authenticated
  useEffect(() => {
    let isSetupInProgress = false;
    
    const setupRealtimeSubscription = async () => {
      // Real-time subscription completely disabled
      
      // Still do initial load
      if (user && !authLoading) {
        await refreshNotes();
      }
      
      hasSubscribedRef.current = false;
      setSyncStatus('disconnected');
      isSetupInProgress = false;
      return;
    };

    // Reduced debounce to minimize violations
    const debouncedSetup = debounce(setupRealtimeSubscription, 100);
    debouncedSetup();

    // Cleanup subscription on unmount or when user changes
    return () => {
      cleanupSubscription();
      currentUserIdRef.current = null;
      isSetupInProgress = false;
    };
  }, [user?.id, authLoading]); // Only depend on user ID and auth loading state


  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const newNote = await SupabaseNotesService.saveNote(noteData);
      // Note will be added via real-time subscription
      setSyncStatus('connected');
      toast.success('Note created and synced');
      return newNote;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to create note');
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const updatedNote = await SupabaseNotesService.updateNote(id, updates);
      if (updatedNote) {
        // Note will be updated via real-time subscription
        setSyncStatus('connected');
        toast.success('Note updated and synced');
      }
      return updatedNote;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to update note');
      throw error;
    }
  };

  const deleteNote = async (id: string): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const success = await SupabaseNotesService.deleteNote(id);
      if (success) {
        // Note will be removed via real-time subscription
        setSyncStatus('connected');
        toast.success('Note deleted and synced');
      }
      return success;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to delete note');
      throw error;
    }
  };

  const toggleFavorite = async (id: string): Promise<Note | null> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const updatedNote = await SupabaseNotesService.toggleFavorite(id);
      if (updatedNote) {
        // Note will be updated via real-time subscription
        setSyncStatus('connected');
        toast.success(updatedNote.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
      return updatedNote;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to update favorite');
      throw error;
    }
  };

  // Filter notes based on current filters
  const filteredNotes = notes.filter(note => {
    if (filters.category && note.category !== filters.category) return false;
    if (filters.isFavorite !== undefined && note.isFavorite !== filters.isFavorite) return false;
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesTitle = note.title.toLowerCase().includes(searchLower);
      const matchesContent = note.content ? note.content.toLowerCase().includes(searchLower) : false;
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

  return (
    <NotesContext.Provider
      value={{
        notes,
        filteredNotes,
        currentNote,
        selectedNote,
        filters,
        isLoading,
        folders,
        syncStatus,
        createNote,
        updateNote,
        deleteNote,
        setCurrentNote,
        setSelectedNote,
        setFilters,
        refreshNotes,
        toggleFavorite,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

// Export the context itself for use in App.tsx
export { NotesContext };
