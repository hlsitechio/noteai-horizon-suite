import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseEditorProps {
  noteId?: string;
  currentNote: any;
  notes: any[];
  setCurrentNote: (note: any) => void;
  createNote: (noteData: any) => Promise<any>;
  updateNote: (id: string, noteData: any) => Promise<any>;
  toggleFavorite: (id: string) => Promise<any>;
  navigate: (path: string, options?: any) => void;
}

export const useEditor = ({
  noteId,
  currentNote,
  notes,
  setCurrentNote,
  createNote,
  updateNote,
  toggleFavorite,
  navigate
}: UseEditorProps) => {
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // UI state
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  // Load note data when currentNote changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title || '');
      setContent(currentNote.content || '');
      setCategory(currentNote.category || 'general');
      setTags(currentNote.tags || []);
      setIsFavorite(currentNote.isFavorite || false);
    } else {
      // Reset for new note
      setTitle('');
      setContent('');
      setCategory('general');
      setTags([]);
      setIsFavorite(false);
    }
  }, [currentNote]);

  // Auto-save functionality
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 1000);

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, category, tags]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsSaving(true);
    try {
      const noteData = {
        title,
        content,
        category,
        tags,
        isFavorite,
        folderId: null,
      };

      if (currentNote?.id) {
        await updateNote(currentNote.id, noteData);
        toast.success('Note updated!');
      } else {
        const newNote = await createNote(noteData);
        setCurrentNote(newNote);
        navigate(`/app/editor/${newNote.id}`, { replace: true });
        toast.success('Note created!');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, category, tags, isFavorite, currentNote, createNote, updateNote, setCurrentNote, navigate]);

  const handleAutoSave = useCallback(async () => {
    if (!title.trim()) return;

    try {
      const noteData = {
        title,
        content,
        category,
        tags,
        isFavorite,
        folderId: null,
      };

      if (currentNote?.id) {
        await updateNote(currentNote.id, noteData);
      } else {
        const newNote = await createNote(noteData);
        setCurrentNote(newNote);
        navigate(`/app/editor/${newNote.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [title, content, category, tags, isFavorite, currentNote, createNote, updateNote, setCurrentNote, navigate]);

  const handleFavoriteToggle = useCallback(async () => {
    if (!currentNote?.id) {
      setIsFavorite(!isFavorite);
      return;
    }

    try {
      const updatedNote = await toggleFavorite(currentNote.id);
      if (updatedNote) {
        setIsFavorite(updatedNote.isFavorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    }
  }, [currentNote, isFavorite, toggleFavorite]);

  const handleTagAdd = useCallback(() => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  }, [newTag, tags]);

  const handleTagRemove = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }, [tags]);

  return {
    // Form state
    title,
    content,
    category,
    tags,
    newTag,
    isFavorite,
    isSaving,
    
    // UI state
    isFocusMode,
    isHeaderCollapsed,
    isHeaderHidden,
    
    // Form setters
    setTitle,
    setContent,
    setCategory,
    setTags,
    setNewTag,
    setIsFavorite,
    setIsFocusMode,
    setIsHeaderCollapsed,
    setIsHeaderHidden,
    
    // Actions
    handleSave,
    handleAutoSave,
    handleFavoriteToggle,
    handleTagAdd,
    handleTagRemove,
  };
};