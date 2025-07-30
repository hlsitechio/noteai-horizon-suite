
import { Note } from '../types/note';

export class NoteStorageService {
  private static readonly STORAGE_KEY = 'notes';

  static getAllNotes(): Note[] {
    try {
      const notes = localStorage.getItem(this.STORAGE_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  static saveNote(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const newNote: Note = {
      ...noteData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: noteData.isFavorite || false,
    };

    const notes = this.getAllNotes();
    notes.push(newNote);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
      return newNote;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  static updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note | null {
    const notes = this.getAllNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) {
      return null;
    }

    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    notes[noteIndex] = updatedNote;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notes));
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  static deleteNote(id: string): boolean {
    const notes = this.getAllNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredNotes));
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  static getNoteById(id: string): Note | null {
    const notes = this.getAllNotes();
    return notes.find(note => note.id === id) || null;
  }

  static toggleFavorite(id: string): Note | null {
    const note = this.getNoteById(id);
    if (!note) return null;

    return this.updateNote(id, { isFavorite: !note.isFavorite });
  }
}
