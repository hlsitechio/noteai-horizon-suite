
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Note } from '../../types/note';
import { NoteTreeItem } from './NoteTreeItem';

interface UnorganizedNotesProps {
  notes: Note[];
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onChangeColor: (id: string, color: string, type: 'folder' | 'note') => void;
}

const UnorganizedNotes: React.FC<UnorganizedNotesProps> = ({
  notes,
  onEditNote,
  onDeleteNote,
  onChangeColor,
}) => {
  if (notes.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="text-xs text-muted-foreground mb-2 px-2">Unorganized</div>
      <Droppable droppableId="folder-unorganized" type="NOTE">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${
              snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            } transition-colors rounded-sm p-1`}
          >
            {notes.map((note, index) => (
              <div key={note.id} className="px-1">
                <NoteTreeItem
                  note={note}
                  index={index}
                  level={0}
                  onEditNote={onEditNote}
                  onDeleteNote={onDeleteNote}
                  onChangeColor={onChangeColor}
                />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default UnorganizedNotes;
