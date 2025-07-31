import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Note } from '../../../types/note';
import DesktopPopOutButton from '../../FloatingNotes/DesktopPopOutButton';

interface FolderNotesListProps {
  notes: Note[];
}

export function FolderNotesList({ notes }: FolderNotesListProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="ml-4 space-y-1"
    >
      {notes.slice(0, 5).map((note) => (
        <div key={note.id} className="flex items-center w-full">
          <Button variant="ghost" size="sm" asChild className="flex-1 h-auto p-1">
            <Link 
              to={`/app/notes?note=${note.id}`} 
              className="flex items-center hover:bg-accent hover:text-accent-foreground transition-colors w-full"
            >
              <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate text-xs flex-1">{note.title}</span>
              {note.isFavorite && (
                <Star className="h-3 w-3 ml-auto text-accent fill-current" />
              )}
            </Link>
          </Button>
          <DesktopPopOutButton 
            note={note} 
            size="sm" 
            className="ml-1 h-6 w-6 p-0 flex-shrink-0" 
          />
        </div>
      ))}
      {notes.length > 5 && (
        <div className="text-xs text-sidebar-foreground/40 px-2 ml-4">
          +{notes.length - 5} more notes
        </div>
      )}
    </motion.div>
  );
}