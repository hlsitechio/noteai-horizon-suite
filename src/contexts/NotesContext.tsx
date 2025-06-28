import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Note, NoteFilters } from '../types/note';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
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

  // Track subscription state to prevent multiple subscriptions
  const channelRef = useRef<any>(null);
  const isInitializedRef = useRef(false);

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

  // Set up real-time subscription only when user is authenticated
  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      // Wait for auth to be ready and ensure user is authenticated
      if (authLoading || !user) {
        console.log('Auth not ready or no user, skipping real-time setup');
        return;
      }

      // Prevent multiple initializations
      if (isInitializedRef.current) {
        console.log('Real-time subscription already initialized, skipping setup');
        return;
      }

      // Clean up any existing channel first
      if (channelRef.current) {
        console.log('Cleaning up existing channel before creating new one');
        try {
          await supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.warn('Error removing existing channel:', error);
        }
        channelRef.current = null;
      }

      try {
        // Initial load
        await refreshNotes();

        // Set up real-time subscription only if user is authenticated
        console.log('Setting up real-time subscription for user:', user.id);
        
        // Create a unique channel name to avoid conflicts
        const channelName = `notes-changes-${user.id}-${Date.now()}`;
        const channel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notes_v2',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Real-time: Note inserted', payload);
              if (payload.new) {
                const newNote: Note = {
                  id: payload.new.id,
                  title: payload.new.title,
                  content: payload.new.content,
                  category: payload.new.content_type || 'general',
                  tags: payload.new.tags || [],
                  createdAt: payload.new.created_at,
                  updatedAt: payload.new.updated_at,
                  isFavorite: payload.new.is_public || false,
                  folder_id: payload.new.folder_id,
                  reminder_date: payload.new.reminder_date,
                  reminder_status: (payload.new.reminder_status || 'none') as 'none' | 'pending' | 'sent' | 'dismissed',
                  reminder_frequency: (payload.new.reminder_frequency || 'once') as 'once' | 'daily' | 'weekly' | 'monthly',
                  reminder_enabled: payload.new.reminder_enabled || false,
                };
                
                setNotes(prev => {
                  // Check if note already exists to avoid duplicates
                  const exists = prev.find(note => note.id === newNote.id);
                  if (exists) return prev;
                  
                  toast.success(`New note synced: ${newNote.title}`);
                  return [newNote, ...prev];
                });
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'notes_v2',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Real-time: Note updated', payload);
              if (payload.new) {
                const updatedNote: Note = {
                  id: payload.new.id,
                  title: payload.new.title,
                  content: payload.new.content,
                  category: payload.new.content_type || 'general',
                  tags: payload.new.tags || [],
                  createdAt: payload.new.created_at,
                  updatedAt: payload.new.updated_at,
                  isFavorite: payload.new.is_public || false,
                  folder_id: payload.new.folder_id,
                  reminder_date: payload.new.reminder_date,
                  reminder_status: (payload.new.reminder_status || 'none') as 'none' | 'pending' | 'sent' | 'dismissed',
                  reminder_frequency: (payload.new.reminder_frequency || 'once') as 'once' | 'daily' | 'weekly' | 'monthly',
                  reminder_enabled: payload.new.reminder_enabled || false,
                };
                
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
                
                toast.success(`Note synced: ${updatedNote.title}`);
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'notes_v2',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Real-time: Note deleted', payload);
              if (payload.old) {
                setNotes(prev => prev.filter(note => note.id !== payload.old.id));
                
                // Clear current note if it was deleted
                if (currentNote?.id === payload.old.id) {
                  setCurrentNote(null);
                }
                if (selectedNote?.id === payload.old.id) {
                  setSelectedNote(null);
                }
                
                toast.info('Note deleted on another device');
              }
            }
          );

        // Subscribe to the channel
        const subscriptionResponse = await channel.subscribe();
        
        if (subscriptionResponse === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
          channelRef.current = channel;
          isInitializedRef.current = true;
          setSyncStatus('connected');
        } else {
          console.error('Failed to subscribe to real-time updates:', subscriptionResponse);
          setSyncStatus('disconnected');
        }

      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        setSyncStatus('disconnected');
      }
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount or when user changes
    return () => {
      if (channelRef.current) {
        console.log('Cleaning up real-time subscription');
        supabase.removeChannel(channelRef.current).then(() => {
          console.log('Channel removed successfully');
        }).catch((error) => {
          console.warn('Error removing channel:', error);
        });
        channelRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [user?.id, authLoading]); // Only depend on user.id and authLoading

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
