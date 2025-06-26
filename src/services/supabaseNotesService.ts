
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

  // Real-time subscription methods
  static subscribeToNoteChanges(
    userId: string,
    onInsert?: (note: Note) => void,
    onUpdate?: (note: Note) => void,
    onDelete?: (noteId: string) => void
  ) {
    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notes_v2',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Real-time INSERT:', payload);
          if (onInsert && payload.new) {
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
            };
            onInsert(note);
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
          console.log('Real-time UPDATE:', payload);
          if (onUpdate && payload.new) {
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
            };
            onUpdate(note);
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
          console.log('Real-time DELETE:', payload);
          if (onDelete && payload.old) {
            onDelete(payload.old.id);
          }
        }
      )
      .subscribe();

    return channel;
  }
}
