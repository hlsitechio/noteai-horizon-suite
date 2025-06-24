
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

export type NoteCategory = 'general' | 'work' | 'personal' | 'ideas' | 'todo';
