import { supabase } from '@/integrations/supabase/client';
import { Note } from '../types/note';

export class SupabaseNotesService {
  static async getAllNotes(): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from('notes_v2')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: note.content_type || 'general',
        tags: note.tags || [],
        createdAt: note.created_at,
        updatedAt: note.updated_at,
        isFavorite: note.is_favorite || false,
        folder_id: note.folder_id,
        reminder_date: null, // Not available in current schema
        reminder_status: 'none' as const,
        reminder_frequency: 'once' as const,
        reminder_enabled: false,
      }));
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static async saveNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('notes_v2')
        .insert({
          title: noteData.title,
          content: noteData.content,
          content_type: noteData.category,
          tags: noteData.tags,
          is_favorite: noteData.isFavorite,
          folder_id: noteData.folder_id,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.content_type || 'general',
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isFavorite: data.is_favorite || false,
        folder_id: data.folder_id,
        reminder_date: null, // Not available in current schema
        reminder_status: 'none' as const,
        reminder_frequency: 'once' as const,
        reminder_enabled: false,
      };
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  static async updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content;
      if (updates.category !== undefined) updateData.content_type = updates.category;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.isFavorite !== undefined) updateData.is_favorite = updates.isFavorite;
      if (updates.folder_id !== undefined) updateData.folder_id = updates.folder_id;

      const { data, error } = await supabase
        .from('notes_v2')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.content_type || 'general',
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isFavorite: data.is_favorite || false,
        folder_id: data.folder_id,
        reminder_date: null, // Not available in current schema
        reminder_status: 'none' as const,
        reminder_frequency: 'once' as const,
        reminder_enabled: false,
      };
    } catch (error) {
      console.error('Error updating note:', error);
      return null;
    }
  }

  static async deleteNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notes_v2')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  static async getNoteById(id: string): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from('notes_v2')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.content_type || 'general',
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isFavorite: data.is_favorite || false,
        folder_id: data.folder_id,
        reminder_date: null, // Not available in current schema
        reminder_status: 'none' as const,
        reminder_frequency: 'once' as const,
        reminder_enabled: false,
      };
    } catch (error) {
      console.error('Error getting note:', error);
      return null;
    }
  }

  static async toggleFavorite(id: string): Promise<Note | null> {
    try {
      const note = await this.getNoteById(id);
      if (!note) return null;

      return this.updateNote(id, { isFavorite: !note.isFavorite });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return null;
    }
  }

  static subscribeToNoteChanges(
    userId: string,
    onInsert?: (note: Note) => void,
    onUpdate?: (note: Note) => void,
    onDelete?: (noteId: string) => void
  ) {
    // DEPRECATED: Use useOptimizedRealtime hook instead
    // This method is kept for backwards compatibility
    console.warn('SupabaseNotesService.subscribeToNoteChanges is deprecated. Use useOptimizedRealtime hook instead.');
    
    const channelName = `notes-${userId}-${Date.now()}`;
    
    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { self: false },
          presence: { key: userId }
        }
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notes_v2',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (onInsert && payload.new) {
            try {
              const note: Note = this.transformPayloadToNote(payload.new);
              onInsert(note);
            } catch (error) {
              console.error('Error processing INSERT payload:', error);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes_v2',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (onUpdate && payload.new) {
            try {
              const note: Note = this.transformPayloadToNote(payload.new);
              onUpdate(note);
            } catch (error) {
              console.error('Error processing UPDATE payload:', error);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notes_v2',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (onDelete && payload.old) {
            try {
              onDelete(payload.old.id);
            } catch (error) {
              console.error('Error processing DELETE payload:', error);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log(`Channel ${channelName} subscription status:`, status);
      });

    return channel;
  }

  // Helper method to transform database payload to Note object
  private static transformPayloadToNote(payload: any): Note {
    return {
      id: payload.id,
      title: payload.title,
      content: payload.content,
      category: payload.content_type || 'general',
      tags: payload.tags || [],
      createdAt: payload.created_at,
      updatedAt: payload.updated_at,
      isFavorite: payload.is_favorite || false,
      folder_id: payload.folder_id,
      reminder_date: null, // Not available in current schema
      reminder_status: 'none' as const,
      reminder_frequency: 'once' as const,
      reminder_enabled: false,
    };
  }
}
