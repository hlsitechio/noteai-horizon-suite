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

      // Log activity
      const { ActivityService } = await import('./activityService');
      await ActivityService.logActivity({
        activity_type: ActivityService.ActivityTypes.NOTE_CREATED,
        activity_title: `Created note "${noteData.title}"`,
        activity_description: `Note created with ${noteData.tags.length} tags`,
        entity_type: 'note',
        entity_id: data.id,
        metadata: {
          category: noteData.category,
          tags: noteData.tags,
          folder_id: noteData.folder_id
        }
      });

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
      // Get original note for comparison
      const originalNote = await this.getNoteById(id);
      if (!originalNote) return null;

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

      // Log activity for significant changes
      const { ActivityService } = await import('./activityService');
      
      if (updates.isFavorite !== undefined && updates.isFavorite !== originalNote.isFavorite) {
        await ActivityService.logActivity({
          activity_type: updates.isFavorite ? ActivityService.ActivityTypes.NOTE_FAVORITED : ActivityService.ActivityTypes.NOTE_UNFAVORITED,
          activity_title: `${updates.isFavorite ? 'Added' : 'Removed'} "${originalNote.title}" ${updates.isFavorite ? 'to' : 'from'} favorites`,
          entity_type: 'note',
          entity_id: id,
        });
      } else if (updates.title || updates.content || updates.category || updates.tags) {
        await ActivityService.logActivity({
          activity_type: ActivityService.ActivityTypes.NOTE_UPDATED,
          activity_title: `Updated note "${updates.title || originalNote.title}"`,
          activity_description: `Modified note content and metadata`,
          entity_type: 'note',
          entity_id: id,
          metadata: {
            changes: Object.keys(updates).filter(key => key !== 'updatedAt'),
            original_title: originalNote.title
          }
        });
      }

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
      // Get note details before deletion for activity logging
      const note = await this.getNoteById(id);
      if (!note) return false;

      const { error } = await supabase
        .from('notes_v2')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log deletion activity
      const { ActivityService } = await import('./activityService');
      await ActivityService.logActivity({
        activity_type: ActivityService.ActivityTypes.NOTE_DELETED,
        activity_title: `Deleted note "${note.title}"`,
        activity_description: `Note deleted from ${note.category} category`,
        entity_type: 'note',
        entity_id: id,
        metadata: {
          title: note.title,
          category: note.category,
          tags: note.tags,
          was_favorite: note.isFavorite
        }
      });

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
    // Real-time subscriptions completely removed
    
    // Return a mock channel object to prevent errors
    return {
      unsubscribe: () => Promise.resolve(),
      subscribe: () => ({ status: 'CLOSED' })
    };
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
