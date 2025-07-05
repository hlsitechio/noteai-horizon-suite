import { useCallback } from 'react';
import { toast } from 'sonner';

interface UseEditorActionsProps {
  createNote: (noteData: any) => Promise<any>;
  updateNote: (id: string, noteData: any) => Promise<any>;
  toggleFavorite: (id: string) => Promise<any>;
  setCurrentNote: (note: any) => void;
  navigate: (path: string, options?: any) => void;
}

export const useEditorActions = ({
  createNote,
  updateNote,
  toggleFavorite,
  setCurrentNote,
  navigate
}: UseEditorActionsProps) => {
  
  const saveNote = useCallback(async (noteData: any, currentNote?: any) => {
    try {
      if (currentNote?.id) {
        const updatedNote = await updateNote(currentNote.id, noteData);
        toast.success('Note updated!');
        return updatedNote;
      } else {
        const newNote = await createNote(noteData);
        setCurrentNote(newNote);
        navigate(`/app/editor/${newNote.id}`, { replace: true });
        toast.success('Note created!');
        return newNote;
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
      throw error;
    }
  }, [createNote, updateNote, setCurrentNote, navigate]);

  const handleFavoriteToggle = useCallback(async (currentNote: any, isFavorite: boolean, setIsFavorite: (value: boolean) => void) => {
    if (!currentNote?.id) {
      setIsFavorite(!isFavorite);
      return;
    }

    try {
      const updatedNote = await toggleFavorite(currentNote.id);
      if (updatedNote) {
        setIsFavorite(updatedNote.isFavorite);
        toast.success(updatedNote.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    }
  }, [toggleFavorite]);

  const handleTagOperations = useCallback((tags: string[], newTag: string, setTags: (tags: string[]) => void, setNewTag: (tag: string) => void) => {
    const addTag = () => {
      if (newTag.trim() && !tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
        setNewTag('');
      }
    };

    const removeTag = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return { addTag, removeTag };
  }, []);

  return {
    saveNote,
    handleFavoriteToggle,
    handleTagOperations
  };
};