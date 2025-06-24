
import { DropResult } from 'react-beautiful-dnd';
import { useNotes } from '../contexts/NotesContext';

export const useUnifiedDragDrop = () => {
  const { notes, updateNote } = useNotes();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    console.log('Unified drag end:', { destination, source, draggableId });

    // Handle sidebar drag and drop logic
    if (destination.droppableId === 'sidebar-favorites' && source.droppableId !== 'sidebar-favorites') {
      // Add to favorites
      const noteId = draggableId.replace('sidebar-note-', '').replace('sidebar-favorite-note-', '');
      const note = notes.find(n => n.id === noteId);
      if (note && updateNote) {
        updateNote(noteId, { ...note, isFavorite: true });
      }
    } else if (source.droppableId === 'sidebar-favorites' && destination.droppableId !== 'sidebar-favorites') {
      // Remove from favorites
      const noteId = draggableId.replace('sidebar-note-', '').replace('sidebar-favorite-note-', '');
      const note = notes.find(n => n.id === noteId);
      if (note && updateNote) {
        updateNote(noteId, { ...note, isFavorite: false });
      }
    }
    // Handle main notes tree drag and drop logic
    else if (destination.droppableId.startsWith('folder-') || destination.droppableId === 'unorganized') {
      // Extract folder ID from droppableId
      const targetFolderId = destination.droppableId.replace('folder-', '');
      
      // Update note's folder
      if (targetFolderId === 'unorganized') {
        updateNote(draggableId, { folder_id: null });
      } else {
        updateNote(draggableId, { folder_id: targetFolderId });
      }
    }
  };

  return { handleDragEnd };
};
