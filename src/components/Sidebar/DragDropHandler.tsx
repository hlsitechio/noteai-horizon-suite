
import { DropResult } from 'react-beautiful-dnd';
import { Note } from '../../types/note';

interface DragDropHandlerProps {
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => Promise<Note | null>;
}

export const useDragDropHandler = ({ updateNote }: DragDropHandlerProps) => {
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If dropped in the same place, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Extract folder ID from droppableId
    const targetFolderId = destination.droppableId.replace('folder-', '');
    
    // Update note's folder
    if (targetFolderId === 'unorganized') {
      await updateNote(draggableId, { folder_id: null });
    } else {
      await updateNote(draggableId, { folder_id: targetFolderId });
    }
  };

  return { handleDragEnd };
};
