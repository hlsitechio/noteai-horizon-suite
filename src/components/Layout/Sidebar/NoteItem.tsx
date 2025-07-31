import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Star,
  Edit,
  Trash2
} from 'lucide-react';
import { Note } from '../../../types/note';
import { DraggableNote } from './DraggableNote';
import DesktopPopOutButton from '../../FloatingNotes/DesktopPopOutButton';

interface NoteItemProps {
  note: Note;
  isActive: boolean;
  onNoteClick: (note: Note) => void;
  onEditNote: (note: Note, event: React.MouseEvent) => void;
  onDeleteNote: (noteId: string, event: React.MouseEvent) => void;
}

export function NoteItem({ 
  note, 
  isActive, 
  onNoteClick, 
  onEditNote, 
  onDeleteNote 
}: NoteItemProps) {
  return (
    <DraggableNote note={note}>
      <div className="flex items-center w-full group">
        <Button 
          variant="ghost"
          size="sm"
          className={`w-full justify-start h-auto p-1 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => onNoteClick(note)}
        >
          <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate text-xs text-left flex-1">{note.title}</span>
          {note.isFavorite && (
            <Star className="h-3 w-3 ml-1 text-accent fill-current flex-shrink-0" />
          )}
        </Button>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => onEditNote(note, e)}
            title="Edit note"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => onDeleteNote(note.id, e)}
            title="Delete note"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <DesktopPopOutButton 
            note={note} 
            size="sm" 
            className="h-6 w-6 p-0 flex-shrink-0" 
          />
        </div>
      </div>
    </DraggableNote>
  );
}