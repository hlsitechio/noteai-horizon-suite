import React, { createContext, useContext, useState, useEffect } from 'react';
import { Note } from '../types/note';
import { logger } from '../utils/logger';

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
        logger.floating.debug('Loaded state from localStorage', parsed);
        setFloatingNotes(parsed);
      }
    } catch (error) {
      logger.floating.error('Error loading floating notes state:', error);
    }
  }, []);

  // Save floating notes state to localStorage whenever it changes
  useEffect(() => {
    logger.floating.debug('Saving state to localStorage', floatingNotes);
    localStorage.setItem('floating-notes-state', JSON.stringify(floatingNotes));
  }, [floatingNotes]);

  const openFloatingNote = (note: Note) => {
    logger.floating.debug('Opening floating note', note.id, note.title);
    logger.floating.debug('Current floating notes before check:', floatingNotes.map(fn => ({ id: fn.id, noteId: fn.noteId })));
    
    // Check if note is already floating - use a more robust check
    const isAlreadyFloating = floatingNotes.some(fn => fn.noteId === note.id);
    logger.floating.debug('Is note already floating?', isAlreadyFloating);
    
    if (isAlreadyFloating) {
      logger.floating.debug('Note already floating, bringing to front');
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

    logger.floating.debug('Creating new floating note', newFloatingNote);
    setFloatingNotes(prev => {
      logger.floating.debug('Previous state before adding:', prev.map(fn => ({ id: fn.id, noteId: fn.noteId })));
      const updated = [...prev, newFloatingNote];
      logger.floating.debug('New state after adding:', updated.map(fn => ({ id: fn.id, noteId: fn.noteId })));
      return updated;
    });
  };

  const closeFloatingNote = (noteId: string) => {
    logger.floating.debug('Closing floating note', noteId);
    setFloatingNotes(prev => prev.filter(fn => fn.noteId !== noteId));
  };

  const minimizeFloatingNote = (noteId: string, minimized: boolean) => {
    logger.floating.debug('Minimizing floating note', noteId, minimized);
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, isMinimized: minimized } : fn
      )
    );
  };

  const updateFloatingNotePosition = (noteId: string, position: { x: number; y: number }) => {
    logger.floating.debug('Updating position', noteId, position);
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, position } : fn
      )
    );
  };

  const updateFloatingNoteSize = (noteId: string, size: { width: number; height: number }) => {
    logger.floating.debug('Updating size', noteId, size);
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, size } : fn
      )
    );
  };

  const updateFloatingNoteContent = (noteId: string, content: string) => {
    logger.floating.debug('Updating content', noteId);
    setFloatingNotes(prev =>
      prev.map(fn =>
        fn.noteId === noteId ? { ...fn, note: { ...fn.note, content } } : fn
      )
    );
  };

  const isNoteFloating = (noteId: string) => {
    const isFloating = floatingNotes.some(fn => fn.noteId === noteId);
    logger.floating.debug('isNoteFloating check', noteId, isFloating);
    return isFloating;
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
