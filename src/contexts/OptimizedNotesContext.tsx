
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Note, NoteFilters } from '../types/note';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OptimizedNotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  currentNote: Note | null;
  filters: NoteFilters;
  isLoading: boolean;
  syncStatus: 'connected' | 'disconnected' | 'syncing';
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  setCurrentNote: (note: Note | null) => void;
  setFilters: (filters: NoteFilters) => void;
  refreshNotes: () => void;
}

const OptimizedNotesContext = createContext<OptimizedNotesContextType | undefined>(undefined);

export const useOptimizedNotes = () => {
  const context = useContext(OptimizedNotesContext);
  if (!context) {
    throw new Error('useOptimizedNotes must be used within an OptimizedNotesProvider');
  }
  return context;
};

export const OptimizedNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [filters, setFilters] = useState<NoteFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  
  const { user, isLoading: authLoading } = useAuth();
  
  // Use refs to prevent memory leaks
  const channelRef = useRef<any>(null);
  const mountedRef = useRef(true);
  const subscriptionActiveRef = useRef(false);

  const refreshNotes = useCallback(async () => {
    if (!user || !mountedRef.current) return;

    setIsLoading(true);
    setSyncStatus('syncing');
    
    try {
      const loadedNotes = await SupabaseNotesService.getAllNotes();
      if (mountedRef.current) {
        setNotes(loadedNotes);
        setSyncStatus('connected');
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      if (mountedRef.current) {
        setSyncStatus('disconnected');
        toast.error('Failed to load notes');
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user]);

  // Cleanup function for subscription
  const cleanupSubscription = useCallback(async () => {
    if (channelRef.current && subscriptionActiveRef.current) {
      try {
        await supabase.removeChannel(channelRef.current);
        console.log('Cleaned up notes subscription');
      } catch (error) {
        console.warn('Error cleaning up subscription:', error);
      }
      channelRef.current = null;
      subscriptionActiveRef.current = false;
    }
  }, []);

  // Set up real-time subscription only when user is authenticated
  useEffect(() => {
    if (authLoading || !user || subscriptionActiveRef.current) return;

    const setupRealtimeSubscription = async () => {
      try {
        // Initial load
        await refreshNotes();

        if (!mountedRef.current) return;

        console.log('Setting up optimized real-time subscription');
        
        const channelName = `notes-optimized-${user.id}-${Date.now()}`;
        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notes_v2',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              if (!mountedRef.current) return;
              
              console.log('Real-time notes update:', payload.eventType);
              
              // Debounce updates to prevent excessive re-renders
              setTimeout(() => {
                if (mountedRef.current) {
                  refreshNotes();
                }
              }, 500);
            }
          );

        channel.subscribe((status) => {
          if (!mountedRef.current) return;
          
          console.log('Notes subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            channelRef.current = channel;
            subscriptionActiveRef.current = true;
            setSyncStatus('connected');
          } else if (status === 'CHANNEL_ERROR') {
            setSyncStatus('disconnected');
          }
        });

      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        if (mountedRef.current) {
          setSyncStatus('disconnected');
        }
      }
    };

    setupRealtimeSubscription();

    return () => {
      cleanupSubscription();
    };
  }, [user?.id, authLoading, refreshNotes, cleanupSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanupSubscription();
    };
  }, [cleanupSubscription]);

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const newNote = await SupabaseNotesService.saveNote(noteData);
      setSyncStatus('connected');
      toast.success('Note created successfully');
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
        setSyncStatus('connected');
        toast.success('Note updated successfully');
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
        setSyncStatus('connected');
        toast.success('Note deleted successfully');
      }
      return success;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to delete note');
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
    return true;
  });

  return (
    <OptimizedNotesContext.Provider
      value={{
        notes,
        filteredNotes,
        currentNote,
        filters,
        isLoading,
        syncStatus,
        createNote,
        updateNote,
        deleteNote,
        setCurrentNote,
        setFilters,
        refreshNotes,
      }}
    >
      {children}
    </OptimizedNotesContext.Provider>
  );
};
