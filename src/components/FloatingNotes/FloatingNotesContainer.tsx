
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFloatingNotes } from '../../contexts/FloatingNotesContext';
import FloatingNoteWindow from './FloatingNoteWindow';

const FloatingNotesContainer: React.FC = () => {
  const {
    floatingNotes,
    closeFloatingNote,
    minimizeFloatingNote,
    updateFloatingNotePosition,
    updateFloatingNoteSize,
    updateFloatingNoteContent,
  } = useFloatingNotes();

  return (
    <div className="floating-notes-container">
      <AnimatePresence>
        {floatingNotes.map((floatingNote) => (
          <FloatingNoteWindow
            key={floatingNote.id}
            noteId={floatingNote.noteId}
            title={floatingNote.note.title}
            content={floatingNote.note.content}
            initialPosition={floatingNote.position}
            initialSize={floatingNote.size}
            isMinimized={floatingNote.isMinimized}
            onClose={closeFloatingNote}
            onMinimize={minimizeFloatingNote}
            onPositionChange={updateFloatingNotePosition}
            onSizeChange={updateFloatingNoteSize}
            onContentChange={updateFloatingNoteContent}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNotesContainer;
