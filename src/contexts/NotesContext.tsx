
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
  folders: any[];
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
  const folders: any[] = [];

  // Track subscription state with refs to prevent multiple subscriptions
  const subscriptionRef = useRef<any>(null);
  const hasSubscribedRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  const refreshNotes = async () => {
    if (!user) {
      console.log('No user, skipping notes refresh');
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
      console.log('Cleaning up existing real-time subscription');
      
      // First unsubscribe from the channel
      subscriptionRef.current.unsubscribe().then(() => {
        console.log('Successfully unsubscribed from channel');
        
        // Then remove the channel
        if (subscriptionRef.current) {
          supabase.removeChannel(subscriptionRef.current);
          console.log('Channel removed');
        }
      }).catch((error) => {
        console.error('Error during unsubscribe:', error);
        // Force remove the channel even if unsubscribe fails
        if (subscriptionRef.current) {
          supabase.removeChannel(subscriptionRef.current);
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
      // Prevent concurrent setups
      if (isSetupInProgress) {
        console.log('Real-time setup already in progress, skipping');
        return;
      }
      
      isSetupInProgress = true;

      // Clean up any existing subscription first
      cleanupSubscription();

      // Wait for auth to be ready and ensure user is authenticated
      if (authLoading || !user) {
        console.log('Auth not ready or no user, skipping real-time setup');
        setIsLoading(false);
        isSetupInProgress = false;
        return;
      }

      // Check if user changed - if so, we need to set up a new subscription
      const userChanged = currentUserIdRef.current !== user.id;
      currentUserIdRef.current = user.id;

      // Prevent multiple subscriptions for the same user
      if (hasSubscribedRef.current && !userChanged) {
        console.log('Real-time subscription already exists for current user, skipping setup');
        isSetupInProgress = false;
        return;
      }

      try {
        console.log('Setting up real-time subscription for user:', user.id);
        
        // Initial load
        await refreshNotes();

        // Set up VERY conservative real-time subscription to prevent performance issues
        // Heavily debounced to prevent query flooding
        const channel = SupabaseNotesService.subscribeToNoteChanges(
          user.id,
          // onInsert - heavily debounced and throttled
          debounce((newNote) => {
            setNotes(prev => {
              // Check if note already exists to avoid duplicates
              const exists = prev.find(note => note.id === newNote.id);
              if (exists) return prev;
              
              return [newNote, ...prev];
            });
          }, 2000), // 2 second debounce to prevent rapid-fire updates
          // onUpdate - heavily debounced and throttled
          debounce((updatedNote) => {
            setNotes(prev => prev.map(note => 
              note.id === updatedNote.id ? updatedNote : note
            ));
            
            // Update current note if it's the one being edited
            if (currentNote?.id === updatedNote.id) {
              setCurrentNote(updatedNote);
            }
            if (selectedNote?.id === updatedNote.id) {
              setSelectedNote(updatedNote);
            }
          }, 2000), // 2 second debounce
          // onDelete - heavily debounced
          debounce((deletedNoteId) => {
            setNotes(prev => prev.filter(note => note.id !== deletedNoteId));
            
            // Clear current note if it was deleted
            if (currentNote?.id === deletedNoteId) {
              setCurrentNote(null);
            }
            if (selectedNote?.id === deletedNoteId) {
              setSelectedNote(null);
            }
          }, 1000) // 1 second debounce for deletes
        );

        // Store the channel reference and mark as subscribed
        subscriptionRef.current = channel;
        hasSubscribedRef.current = true;
        setSyncStatus('connected');
        
        console.log('Real-time subscription setup completed');
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        setSyncStatus('disconnected');
        hasSubscribedRef.current = false;
      } finally {
        isSetupInProgress = false;
      }
    };

    // Debounce the setup function to prevent rapid calls
    const debouncedSetup = debounce(setupRealtimeSubscription, 1000);
    debouncedSetup();

    // Cleanup subscription on unmount or when user changes
    return () => {
      cleanupSubscription();
      currentUserIdRef.current = null;
      isSetupInProgress = false;
    };
  }, [user?.id, authLoading]); // Only depend on user ID and auth loading state

  // Debounce utility function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

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
