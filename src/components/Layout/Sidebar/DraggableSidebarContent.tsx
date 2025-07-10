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
    console.log('Drag started:', event);
    const { active } = event;
    const note = notes.find(n => n.id === active.id);
    if (note) {
      console.log('Setting active note:', note.title);
      setActiveNote(note);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event);
    const { active, over } = event;
    setActiveNote(null);

    if (!over || active.id === over.id) {
      console.log('No valid drop target');
      return;
    }

    const noteId = active.id as string;
    const overId = over.id as string;
    console.log(`Dropping note ${noteId} onto ${overId}`);

    // Handle dropping into folders
    if (overId.startsWith('folder-')) {
      const folderId = overId.replace('folder-', '');
      console.log(`Moving note to folder: ${folderId}`);
      onMoveToFolder(noteId, folderId);
    }
    // Handle dropping into favorites
    else if (overId === 'favorites-container') {
      console.log('Adding note to favorites');
      onToggleFavorite(noteId, true);
    }
    // Handle dropping into notes (remove from folder/favorites)
    else if (overId === 'notes-container') {
      const note = notes.find(n => n.id === noteId);
      console.log('Moving note to general notes, current note:', note);
      if (note?.folder_id) {
        console.log('Removing from folder');
        onMoveToFolder(noteId, null);
      }
      if (note?.isFavorite) {
        console.log('Removing from favorites');
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