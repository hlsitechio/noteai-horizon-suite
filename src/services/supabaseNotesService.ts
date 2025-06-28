
import { Note } from '../types/note';

export class SupabaseNotesService {
  static async getAllNotes(): Promise<Note[]> {
    console.log('API calls disabled - returning empty notes array');
    return [];
  }

  static async saveNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    console.log('API calls disabled - note save blocked');
    throw new Error('API calls are disabled');
  }

  static async updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<Note | null> {
    console.log('API calls disabled - note update blocked');
    return null;
  }

  static async deleteNote(id: string): Promise<boolean> {
    console.log('API calls disabled - note delete blocked');
    return false;
  }

  static async getNoteById(id: string): Promise<Note | null> {
    console.log('API calls disabled - returning null for note');
    return null;
  }

  static async toggleFavorite(id: string): Promise<Note | null> {
    console.log('API calls disabled - toggle favorite blocked');
    return null;
  }

  static subscribeToNoteChanges(
    userId: string,
    onInsert?: (note: Note) => void,
    onUpdate?: (note: Note) => void,
    onDelete?: (noteId: string) => void
  ) {
    console.log('API calls disabled - real-time subscription blocked');
    
    // Return a mock channel that does nothing
    return {
      unsubscribe: () => console.log('Mock unsubscribe called'),
      subscribe: () => console.log('Mock subscribe called')
    };
  }
}
