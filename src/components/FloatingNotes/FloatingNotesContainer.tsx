
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

  // Removed debug logs to prevent PostHog rate limiting

  return (
    <div 
      className="floating-notes-container fixed inset-0 pointer-events-none z-[9999]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        {floatingNotes.map((floatingNote) => {
          // Rendering floating note
          return (
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
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNotesContainer;
