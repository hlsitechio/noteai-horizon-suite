import React, { createContext, useContext, useState, useCallback } from 'react';
import { Note, NoteFilters } from '../types/note';
import { SupabaseNotesService } from '../services/supabaseNotesService';
import { useAuth } from './AuthContext';
import { useOptimizedNotesQuery } from '../hooks/useOptimizedNotesQuery';
import { useOptimizedRealtime } from '../hooks/useOptimizedRealtime';
import { ActivityService } from '../services/activityService';
import { toast } from 'sonner';

interface OptimizedNotesContextType {
  notes: Note[];
  filteredNotes: Note[];
  currentNote: Note | null;
  selectedNote: Note | null;
  filters: NoteFilters;
  isLoading: boolean;
  syncStatus: 'connected' | 'disconnected' | 'syncing';
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  setCurrentNote: (note: Note | null) => void;
  setSelectedNote: (note: Note | null) => void;
  setFilters: (filters: NoteFilters) => void;
  refreshNotes: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<Note | null>;
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
  const { user } = useAuth();
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [filters, setFilters] = useState<NoteFilters>({});
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');

  // Use optimized query hook
  const {
    notes,
    isLoading,
    refetch,
    addNote: optimisticAddNote,
    updateNote: optimisticUpdateNote,
    removeNote: optimisticRemoveNote,
  } = useOptimizedNotesQuery({
    filters,
    enabled: !!user,
  });

  // Real-time functionality completely removed

  // Filter notes based on current filters
  const filteredNotes = React.useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return notes;
    
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
  }, [notes, filters]);

  const createNote = useCallback(async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const newNote = await SupabaseNotesService.saveNote(noteData);
      
      // Log activity
      await ActivityService.logActivity({
        activity_type: ActivityService.ActivityTypes.NOTE_CREATED,
        activity_title: 'Created new note',
        activity_description: newNote.title,
        entity_type: 'note',
        entity_id: newNote.id,
        metadata: { 
          category: newNote.category,
          tags: newNote.tags,
          content_length: newNote.content.length
        }
      });
      
      // Optimistic update is handled by realtime
      setSyncStatus('connected');
      toast.success('Note created successfully');
      return newNote;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to create note');
      throw error;
    }
  }, [user]);

  const updateNote = useCallback(async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const updatedNote = await SupabaseNotesService.updateNote(id, updates);
      if (updatedNote) {
        // Log activity
        await ActivityService.logActivity({
          activity_type: ActivityService.ActivityTypes.NOTE_UPDATED,
          activity_title: 'Updated note',
          activity_description: updatedNote.title,
          entity_type: 'note',
          entity_id: updatedNote.id,
          metadata: { 
            updated_fields: Object.keys(updates),
            content_length: updatedNote.content.length
          }
        });
        
        // Optimistic update is handled by realtime
        setSyncStatus('connected');
        toast.success('Note updated successfully');
      }
      return updatedNote;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to update note');
      throw error;
    }
  }, [user]);

  const deleteNote = useCallback(async (id: string): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');
    
    // Get note details before deletion for activity log
    const noteToDelete = notes.find(note => note.id === id);
    
    setSyncStatus('syncing');
    try {
      const success = await SupabaseNotesService.deleteNote(id);
      if (success) {
        // Log activity
        await ActivityService.logActivity({
          activity_type: ActivityService.ActivityTypes.NOTE_DELETED,
          activity_title: 'Deleted note',
          activity_description: noteToDelete?.title || 'Unknown note',
          entity_type: 'note',
          entity_id: id,
          metadata: { 
            category: noteToDelete?.category,
            was_favorite: noteToDelete?.isFavorite
          }
        });
        
        // Optimistic update is handled by realtime
        setSyncStatus('connected');
        toast.success('Note deleted successfully');
      }
      return success;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to delete note');
      throw error;
    }
  }, [user, notes]);

  const toggleFavorite = useCallback(async (id: string): Promise<Note | null> => {
    if (!user) throw new Error('User not authenticated');
    
    setSyncStatus('syncing');
    try {
      const updatedNote = await SupabaseNotesService.toggleFavorite(id);
      if (updatedNote) {
        // Log activity
        await ActivityService.logActivity({
          activity_type: updatedNote.isFavorite 
            ? ActivityService.ActivityTypes.NOTE_FAVORITED 
            : ActivityService.ActivityTypes.NOTE_UNFAVORITED,
          activity_title: updatedNote.isFavorite ? 'Added note to favorites' : 'Removed note from favorites',
          activity_description: updatedNote.title,
          entity_type: 'note',
          entity_id: updatedNote.id,
          metadata: { 
            is_favorite: updatedNote.isFavorite
          }
        });
        
        // Optimistic update is handled by realtime
        setSyncStatus('connected');
        toast.success(updatedNote.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
      return updatedNote;
    } catch (error) {
      setSyncStatus('disconnected');
      toast.error('Failed to update favorite');
      throw error;
    }
  }, [user]);

  const refreshNotes = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <OptimizedNotesContext.Provider
      value={{
        notes,
        filteredNotes,
        currentNote,
        selectedNote,
        filters,
        isLoading,
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
    </OptimizedNotesContext.Provider>
  );
};

export { OptimizedNotesContext };