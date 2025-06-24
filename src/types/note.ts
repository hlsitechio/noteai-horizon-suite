
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  folder_id?: string | null;
  color?: string;
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

export type NoteCategory = 'general' | 'work' | 'personal' | 'ideas' | 'todo' | 'meeting' | 'learning' | 'brainstorm' | 'project';

export interface CategoryOption {
  value: string;
  label: string;
  color: string;
}
