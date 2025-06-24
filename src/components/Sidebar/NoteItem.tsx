
import React from 'react';
import { 
  DocumentTextIcon, 
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Draggable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Note } from '../../types/note';
import ColorPalette from './ColorPalette';

interface NoteItemProps {
  note: Note;
  index: number;
  level: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onChangeColor: (id: string, color: string, type: 'folder' | 'note') => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  index,
  level,
  onEditNote,
  onDeleteNote,
  onChangeColor,
}) => {
  const paddingLeft = level * 20;

  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex items-center gap-1 py-1 hover:bg-accent/50 rounded-sm group cursor-pointer ${
            snapshot.isDragging ? 'bg-blue-100 shadow-lg dark:bg-blue-900/30' : ''
          } transition-all`}
          style={{
            paddingLeft: `${paddingLeft}px`,
            ...provided.draggableProps.style,
          }}
          onClick={() => !snapshot.isDragging && onEditNote(note)}
        >
          {/* Tree Line */}
          <div className="absolute left-2 h-full border-l border-border/30" 
               style={{ left: `${(level - 1) * 20 + 8}px` }} />
          
          <div className="h-4 w-4" />
          
          <div 
            className="w-2 h-2 rounded-full mr-1" 
            style={{ backgroundColor: note.color || '#64748b' }}
          />
          
          <DocumentTextIcon className="h-4 w-4 text-muted-foreground" />
          
          <span className="text-sm truncate flex-1">{note.title}</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-4 w-4 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <EllipsisHorizontalIcon className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditNote(note)}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ColorPalette onColorSelect={(color) => onChangeColor(note.id, color, 'note')} />
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="text-destructive"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </Draggable>
  );
};

export default NoteItem;
