import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './useToast';
import { ReminderService } from '@/services/reminderService';
import { Note } from '@/types/note';

export interface AIAction {
  type: 'create_note' | 'set_reminder' | 'search_notes' | 'update_note' | 'delete_note' | 
        'improve_text' | 'summarize_text' | 'translate_text' | 'check_grammar' | 
        'adjust_tone' | 'expand_content' | 'extract_keywords';
  data: any;
  message?: string;
}

export interface AIActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const useAIActions = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const executeAction = async (action: AIAction): Promise<AIActionResponse> => {
    setIsExecuting(true);
    
    try {
      console.log('Executing AI action:', action);

      switch (action.type) {
        case 'create_note':
          return await createNote(action.data);
        
        case 'set_reminder':
          return await setReminder(action.data);
        
        case 'search_notes':
          return await searchNotes(action.data);
        
        case 'update_note':
          return await updateNote(action.data);
        
        case 'delete_note':
          return await deleteNote(action.data);
        
        case 'improve_text':
        case 'summarize_text':
        case 'translate_text':
        case 'check_grammar':
        case 'adjust_tone':
        case 'expand_content':
        case 'extract_keywords':
          return await processWritingAction(action.type, action.data);
        
        default:
          return {
            success: false,
            message: `Unknown action type: ${action.type}`
          };
      }
    } catch (error: any) {
      console.error('Error executing AI action:', error);
      return {
        success: false,
        message: `Failed to execute action: ${error.message}`
      };
    } finally {
      setIsExecuting(false);
    }
  };

  const createNote = async (data: {
    title: string;
    content: string;
    category?: string;
    tags?: string[];
    folder_id?: string;
  }): Promise<AIActionResponse> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const noteData = {
        title: data.title,
        content: data.content,
        user_id: user.user.id,
        content_type: 'html',
        tags: data.tags || [],
        folder_id: data.folder_id || null,
        is_public: false,
      };

      const { data: newNote, error } = await supabase
        .from('notes_v2')
        .insert(noteData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Note created successfully!');
      
      return {
        success: true,
        message: `Created note "${data.title}" successfully!`,
        data: newNote
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to create note: ${error.message}`
      };
    }
  };

  const setReminder = async (data: {
    note_id?: string;
    title?: string;
    content?: string;
    reminder_date: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  }): Promise<AIActionResponse> => {
    try {
      let noteId = data.note_id;

      // If no note_id provided, create a new note first
      if (!noteId && (data.title || data.content)) {
        const noteResult = await createNote({
          title: data.title || 'Reminder Note',
          content: data.content || 'Reminder set via AI chat',
          category: 'reminder'
        });
        
        if (!noteResult.success) {
          throw new Error('Failed to create note for reminder');
        }
        
        noteId = noteResult.data.id;
      }

      if (!noteId) {
        throw new Error('No note specified for reminder');
      }

      const reminderDate = new Date(data.reminder_date);
      const frequency = data.frequency || 'once';

      const reminder = await ReminderService.createReminder(noteId, reminderDate, frequency);
      
      if (!reminder) {
        throw new Error('Failed to create reminder');
      }

      toast.success('Reminder set successfully!');
      
      return {
        success: true,
        message: `Reminder set for ${reminderDate.toLocaleString()}`,
        data: reminder
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to set reminder: ${error.message}`
      };
    }
  };

  const searchNotes = async (data: {
    query: string;
    limit?: number;
  }): Promise<AIActionResponse> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: notes, error } = await supabase
        .from('notes_v2')
        .select('id, title, content, created_at, updated_at, tags')
        .eq('user_id', user.user.id)
        .or(`title.ilike.%${data.query}%,content.ilike.%${data.query}%`)
        .order('updated_at', { ascending: false })
        .limit(data.limit || 10);

      if (error) throw error;

      return {
        success: true,
        message: `Found ${notes.length} notes matching "${data.query}"`,
        data: notes
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to search notes: ${error.message}`
      };
    }
  };

  const updateNote = async (data: {
    note_id: string;
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<AIActionResponse> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.content) updateData.content = data.content;
      if (data.tags) updateData.tags = data.tags;
      updateData.updated_at = new Date().toISOString();

      const { data: updatedNote, error } = await supabase
        .from('notes_v2')
        .update(updateData)
        .eq('id', data.note_id)
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Note updated successfully!');
      
      return {
        success: true,
        message: `Updated note "${updatedNote.title}" successfully!`,
        data: updatedNote
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to update note: ${error.message}`
      };
    }
  };

  const deleteNote = async (data: {
    note_id: string;
  }): Promise<AIActionResponse> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('notes_v2')
        .delete()
        .eq('id', data.note_id)
        .eq('user_id', user.user.id);

      if (error) throw error;

      toast.success('Note deleted successfully!');
      
      return {
        success: true,
        message: 'Note deleted successfully!'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to delete note: ${error.message}`
      };
    }
  };

  const processWritingAction = async (
    actionType: string, 
    data: { text: string; targetLanguage?: string; tone?: string; length?: string }
  ): Promise<AIActionResponse> => {
    try {
      const { data: result, error } = await supabase.functions.invoke('ai-writing-assistant', {
        body: {
          action: actionType,
          text: data.text,
          targetLanguage: data.targetLanguage,
          tone: data.tone,
          length: data.length
        }
      });

      if (error) throw error;

      const actionLabels = {
        'improve_text': 'Text improved',
        'summarize_text': 'Text summarized',
        'translate_text': 'Text translated',
        'check_grammar': 'Grammar checked',
        'adjust_tone': 'Tone adjusted',
        'expand_content': 'Content expanded',
        'extract_keywords': 'Keywords extracted'
      };

      return {
        success: true,
        message: actionLabels[actionType as keyof typeof actionLabels] || 'Writing task completed',
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to process writing task: ${error.message}`
      };
    }
  };

  return {
    executeAction,
    isExecuting
  };
};