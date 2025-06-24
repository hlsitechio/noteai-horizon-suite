
import React from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Draggable } from 'react-beautiful-dnd';
import { Note } from '../../types/note';

interface NoteTreeItemProps {
  note: Note;
  index: number;
  level: number;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onChangeColor: (id: string, color: string, type: 'folder' | 'note') => void;
}

export const NoteTreeItem: React.FC<NoteTreeItemProps> = ({
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
          className={`${
            snapshot.isDragging ? 'bg-blue-100 shadow-lg dark:bg-blue-900/30' : ''
          } transition-all`}
          style={{
            paddingLeft: `${paddingLeft}px`,
            ...provided.draggableProps.style,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-accent/50 rounded-sm group cursor-pointer"
            onClick={() => !snapshot.isDragging && onEditNote(note)}
          >
            <div 
              className="w-2 h-2 rounded-full flex-shrink-0" 
              style={{ backgroundColor: note.color || '#64748b' }}
            />
            
            <DocumentTextIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            
            <span className="text-sm truncate flex-1 text-foreground">
              {note.title}
            </span>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};
