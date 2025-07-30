// Helper function to create properly typed Note objects
import type { Note } from '@/types/note';

export interface CreateNoteParams {
  title: string;
  content: string | null;
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  folder_id?: string | null;
  color?: string;
  reminder_date?: string | null;
  reminder_status?: 'none' | 'pending' | 'sent' | 'dismissed';
  reminder_frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  reminder_enabled?: boolean;
}

export const createNoteObject = (
  params: CreateNoteParams,
  userId: string,
  id?: string
): Omit<Note, 'id' | 'createdAt' | 'updatedAt'> => {
  const now = new Date().toISOString();
  
  return {
    title: params.title,
    content: params.content,
    content_type: 'text',
    category: params.category || 'general',
    tags: params.tags || [],
    // Both naming conventions required
    createdAt: now,
    created_at: now,
    updatedAt: now,
    updated_at: now,
    isFavorite: params.isFavorite || false,
    is_favorite: params.isFavorite || false,
    user_id: userId,
    folder_id: params.folder_id || null,
    color: params.color,
    reminder_date: params.reminder_date || null,
    reminder_status: params.reminder_status || 'none',
    reminder_frequency: params.reminder_frequency || 'once',
    reminder_enabled: params.reminder_enabled || false,
  } as Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
};

// Helper for creating full Note objects with ID and timestamps
export const createFullNoteObject = (
  params: CreateNoteParams,
  userId: string,
  id: string = crypto.randomUUID()
): Note => {
  const now = new Date().toISOString();
  
  return {
    id,
    title: params.title,
    content: params.content,
    content_type: 'text',
    category: params.category || 'general',
    tags: params.tags || [],
    // Both naming conventions for compatibility
    createdAt: now,
    created_at: now,
    updatedAt: now,
    updated_at: now,
    isFavorite: params.isFavorite || false,
    is_favorite: params.isFavorite || false,
    user_id: userId,
    folder_id: params.folder_id || null,
    color: params.color,
    reminder_date: params.reminder_date || null,
    reminder_status: params.reminder_status || 'none',
    reminder_frequency: params.reminder_frequency || 'once',
    reminder_enabled: params.reminder_enabled || false,
  };
};