
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
  
  const { user, isLoading: authLoading } = useAuth();
  const folders: any[] = [];

  const subscriptionRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  const refreshNotes = async () => {
    if (!user) {
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
      if (user) {
        toast.error('Failed to load notes');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupSubscription = () => {
    if (subscriptionRef.current) {
      try {
        supabase.removeChannel(subscriptionRef.current);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }
      subscriptionRef.current = null;
      isSubscribedRef.current = false;
    }
  };

  useEffect(() => {
    const setupRealtimeSubscription = async () => {
      if (authLoading || !user) {
        setIsLoading(false);
        return;
      }

      const userChanged = currentUserIdRef.current !== user.id;
      
      if (isSubscribedRef.current && !userChanged) {
        return;
      }

      cleanupSubscription();
      currentUserIdRef.current = user.id;

      try {
        await refreshNotes();

        if (!isSubscribedRef.current) {
          const channel = SupabaseNotesService.subscribeToNoteChanges(
            user.id,
            (newNote) => {
              setNotes(prev => {
                const exists = prev.find(note => note.id === newNote.id);
                if (exists) return prev;
                toast.success(`New note synced: ${newNote.title}`);
                return [newNote, ...prev];
              });
            },
            (updatedNote) => {
              setNotes(prev => prev.map(note => 
                note.id === updatedNote.id ? updatedNote : note
              ));
              
              if (currentNote?.id === updatedNote.id) {
                setCurrentNote(updatedNote);
              }
              if (selectedNote?.id === updatedNote.id) {
                setSelectedNote(updatedNote);
              }
              
              toast.success(`Note synced: ${updatedNote.title}`);
            },
            (deletedNoteId) => {
              setNotes(prev => prev.filter(note => note.id !== deletedNoteId));
              
              if (currentNote?.id === deletedNoteId) {
                setCurrentNote(null);
              }
              if (selectedNote?.id === deletedNoteId) {
                setSelectedNote(null);
              }
              
              toast.info('Note deleted on another device');
            }
          );

          subscriptionRef.current = channel;
          isSubscribedRef.current = true;
          setSyncStatus('connected');
        }
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        setSyncStatus('disconnected');
        isSubscribedRef.current = false;
      }
    };

    setupRealtimeSubscription();

    return () => {
      cleanupSubscription();
      currentUserIdRef.current = null;
    };
  }, [user?.id, authLoading]);

  const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const newNote = await SupabaseNotesService.saveNote(noteData);
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

export { NotesContext };
