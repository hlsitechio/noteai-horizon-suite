import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Note } from '../../../types/note';

interface DraggableNotesContextProps {
  children: React.ReactNode;
  notes: Note[];
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
  onToggleFavorite: (noteId: string, isFavorite: boolean) => void;
}

export function DraggableNotesContext({ 
  children, 
  notes,
  onMoveToFolder,
  onToggleFavorite
}: DraggableNotesContextProps) {
  const [activeNote, setActiveNote] = React.useState<Note | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require dragging 8px before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const note = notes.find(n => n.id === active.id);
    if (note) {
      setActiveNote(note);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveNote(null);

    if (!over || active.id === over.id) return;

    const noteId = active.id as string;
    const overId = over.id as string;

    // Handle dropping into folders
    if (overId.startsWith('folder-')) {
      const folderId = overId.replace('folder-', '');
      onMoveToFolder(noteId, folderId);
    }
    // Handle dropping into favorites
    else if (overId === 'favorites-container') {
      onToggleFavorite(noteId, true);
    }
    // Handle dropping into notes (remove from folder/favorites)
    else if (overId === 'notes-container') {
      const note = notes.find(n => n.id === noteId);
      if (note?.folder_id) {
        onMoveToFolder(noteId, null);
      }
      if (note?.isFavorite) {
        onToggleFavorite(noteId, false);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeNote ? (
          <div className="bg-card border rounded p-2 shadow-lg opacity-90">
            <span className="text-sm font-medium">{activeNote.title}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}