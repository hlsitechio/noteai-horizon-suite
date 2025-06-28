
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note } from '../types/note';

interface FloatingWindowState {
  id: string;
  noteId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  note: Note;
}

interface FloatingNotesContextType {
  floatingNotes: FloatingWindowState[];
  openFloatingNote: (note: Note) => void;
  closeFloatingNote: (noteId: string) => void;
  minimizeFloatingNote: (noteId: string, minimized: boolean) => void;
  updateFloatingNotePosition: (noteId: string, position: { x: number; y: number }) => void;
  updateFloatingNoteSize: (noteId: string, size: { width: number; height: number }) => void;
  updateFloatingNoteContent: (noteId: string, content: string) => void;
  isNoteFloating: (noteId: string) => boolean;
}

const FloatingNotesContext = createContext<FloatingNotesContextType | undefined>(undefined);

export const useFloatingNotes = () => {
  const context = useContext(FloatingNotesContext);
  if (!context) {
    throw new Error('useFloatingNotes must be used within a FloatingNotesProvider');
  }
  return context;
};

export const FloatingNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [floatingNotes, setFloatingNotes] = useState<FloatingWindowState[]>([]);

  // Load floating notes state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('floating-notes-state');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        setFloatingNotes(parsed);
      }
    } catch (error) {
      console.error('Error loading floating notes state:', error);
    }
  }, []);

  // Save floating notes state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('floating-notes-state', JSON.stringify(floatingNotes));
  }, [floatingNotes]);

  const openFloatingNote = (note: Note) => {
    // Check if note is already floating - use a more robust check
    const isAlreadyFloating = floatingNotes.some(fn => fn.noteId === note.id);
    
    if (isAlreadyFloating) {
      // Bring to front by moving to end of array
      setFloatingNotes(prev => {
        const existingIndex = prev.findIndex(fn => fn.noteId === note.id);
        if (existingIndex === -1) return prev; // Safety check
        
        const updated = [...prev];
        const existing = updated.splice(existingIndex, 1)[0];
        updated.push(existing);
        return updated;
      });
      return;
    }

    // Create new floating note with staggered position
    const offset = floatingNotes.length * 30;
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    const newFloatingNote: FloatingWindowState = {
      id: `floating-${note.id}-${Date.now()}`,
      noteId: note.id,
      position: { 
        x: Math.min(100 + offset, windowWidth - 400), 
        y: Math.min(100 + offset, windowHeight - 300) 
      },
      size: { width: 400, height: 300 },
      isMinimized: false,
      note,
    };

    setFloatingNotes(prev => [...prev, newFloatingNote]);
  };

  const closeFloatingNote = (noteId: string) => {
    setFloatingNotes(prev => prev.filter(fn => fn.noteId !== noteId));
  };

  const minimizeFloatingNote = (noteId: string, minimized: boolean) => {
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, isMinimized: minimized } : fn
      )
    );
  };

  const updateFloatingNotePosition = (noteId: string, position: { x: number; y: number }) => {
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, position } : fn
      )
    );
  };

  const updateFloatingNoteSize = (noteId: string, size: { width: number; height: number }) => {
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, size } : fn
      )
    );
  };

  const updateFloatingNoteContent = (noteId: string, content: string) => {
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, note: { ...fn.note, content } } : fn
      )
    );
  };

  const isNoteFloating = (noteId: string) => {
    return floatingNotes.some(fn => fn.noteId === noteId);
  };

  return (
    <FloatingNotesContext.Provider
      value={{
        floatingNotes,
        openFloatingNote,
        closeFloatingNote,
        minimizeFloatingNote,
        updateFloatingNotePosition,
        updateFloatingNoteSize,
        updateFloatingNoteContent,
        isNoteFloating,
      }}
    >
      {children}
    </FloatingNotesContext.Provider>
  );
};

// Export the context itself for use in App.tsx
export { FloatingNotesContext };
