
export interface Note {
  id: string;
  title: string;
  content: string | null | undefined;
  content_type?: string | null;
  category: string;
  tags: string[];
  // Support both naming conventions - all optional for compatibility
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  isFavorite?: boolean;
  is_favorite?: boolean | null;
  user_id?: string;
  folder_id?: string | null;
  color?: string;
  reminder_date?: string | null;
  reminder_status?: 'none' | 'pending' | 'sent' | 'dismissed';
  reminder_frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  reminder_enabled?: boolean;
}

export interface NoteFilters {
  category?: string;
  searchTerm?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface NoteMeta {
  wordCount: number;
  readingTime: number;
  lastModified: string;
}

export type NoteCategory = 'general' | 'work' | 'personal' | 'ideas' | 'todo' | 'meeting' | 'learning' | 'brainstorm' | 'project' | 'reminder';

export interface CategoryOption {
  value: string;
  label: string;
  color: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  note_id: string;
  reminder_date: string;
  status: 'pending' | 'sent' | 'dismissed' | 'snoozed';
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  snooze_until?: string | null;
  notification_sent: boolean;
  created_at: string;
  updated_at: string;
}
