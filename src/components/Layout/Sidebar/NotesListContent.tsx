import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';
import { NoteItem } from './NoteItem';

interface NotesListContentProps {
  isExpanded: boolean;
  isMobile: boolean;
  displayNotes: Note[];
  allNotes: Note[];
  isNoteActive: (noteId: string) => boolean;
  onNoteClick: (note: Note) => void;
  onEditNote: (note: Note, event: React.MouseEvent) => void;
  onDeleteNote: (noteId: string, event: React.MouseEvent) => void;
}

export function NotesListContent({ 
  isExpanded,
  isMobile,
  displayNotes,
  allNotes,
  isNoteActive,
  onNoteClick,
  onEditNote,
  onDeleteNote
}: NotesListContentProps) {
  return (
    <AnimatePresence>
      {isExpanded && !isMobile && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="space-y-1 px-2">
            {displayNotes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={isNoteActive(note.id)}
                onNoteClick={onNoteClick}
                onEditNote={onEditNote}
                onDeleteNote={onDeleteNote}
              />
            ))}
            {displayNotes.length === 0 && (
              <Button variant="ghost" size="sm" disabled className="w-full justify-start h-auto p-1">
                <span className="text-xs text-sidebar-foreground/40">No notes yet</span>
              </Button>
            )}
            {allNotes.length > displayNotes.length && (
              <Button variant="ghost" size="sm" asChild className="w-full justify-start h-auto p-1">
                <Link to="/app/notes" className="text-xs text-sidebar-foreground/60 hover:bg-accent hover:text-accent-foreground transition-colors">
                  View all {allNotes.length} notes →
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}