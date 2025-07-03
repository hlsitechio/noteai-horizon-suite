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
        isFavorite: note.is_public || false,
        folder_id: note.folder_id,
        reminder_date: note.reminder_date,
        reminder_status: (note.reminder_status || 'none') as 'none' | 'pending' | 'sent' | 'dismissed',
        reminder_frequency: (note.reminder_frequency || 'once') as 'once' | 'daily' | 'weekly' | 'monthly',
        reminder_enabled: note.reminder_enabled || false,
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
          is_public: noteData.isFavorite,
          folder_id: noteData.folder_id,
          reminder_date: noteData.reminder_date,
          reminder_status: noteData.reminder_status || 'none',
          reminder_frequency: noteData.reminder_frequency || 'once',
          reminder_enabled: noteData.reminder_enabled || false,
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
        isFavorite: data.is_public || false,
        folder_id: data.folder_id,
        reminder_date: data.reminder_date,
        reminder_status: (data.reminder_status || 'none') as 'none' | 'pending' | 'sent' | 'dismissed',
        reminder_frequency: (data.reminder_frequency || 'once') as 'once' | 'daily' | 'weekly' | 'monthly',
        reminder_enabled: data.reminder_enabled || false,
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
      if (updates.isFavorite !== undefined) updateData.is_public = updates.isFavorite;
      if (updates.folder_id !== undefined) updateData.folder_id = updates.folder_id;
      if (updates.reminder_date !== undefined) updateData.reminder_date = updates.reminder_date;
      if (updates.reminder_status !== undefined) updateData.reminder_status = updates.reminder_status;
      if (updates.reminder_frequency !== undefined) updateData.reminder_frequency = updates.reminder_frequency;
      if (updates.reminder_enabled !== undefined) updateData.reminder_enabled = updates.reminder_enabled;

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
        isFavorite: data.is_public || false,
        folder_id: data.folder_id,
        reminder_date: data.reminder_date,
        reminder_status: (data.reminder_status || 'none') as 'none' | 'pending' | 'sent' | 'dismissed',
        reminder_frequency: (data.reminder_frequency || 'once') as 'once' | 'daily' | 'weekly' | 'monthly',
        reminder_enabled: data.reminder_enabled || false,
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
        isFavorite: data.is_public || false,
        folder_id: data.folder_id,
        reminder_date: data.reminder_date,
        reminder_status: (data.reminder_status || 'none') as 'none' | 'pending' | 'sent' | 'dismissed',
        reminder_frequency: (data.reminder_frequency || 'once') as 'once' | 'daily' | 'weekly' | 'monthly',
        reminder_enabled: data.reminder_enabled || false,
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
    // Create a unique channel name to prevent conflicts
    const channelName = `notes-${userId}-${Date.now()}`;
    
    // Conservative real-time setup to prevent performance issues
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
              const note: Note = {
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
              const note: Note = {
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
}
