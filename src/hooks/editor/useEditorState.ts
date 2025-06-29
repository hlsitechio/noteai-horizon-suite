
import { useState, useEffect } from 'react';
import { useNotes } from '../../contexts/NotesContext';

export interface EditorState {
  // Form state
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  isFavorite: boolean;
  isSaving: boolean;
  
  // UI state
  isFocusMode: boolean;
  isHeaderCollapsed: boolean;
  isHeaderHidden: boolean;
  isAssistantCollapsed: boolean;
}

export const useEditorState = () => {
  const { currentNote } = useNotes();
  
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
  const [isAssistantCollapsed, setIsAssistantCollapsed] = useState(false);

  // Load current note when it changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setCategory(currentNote.category);
      setTags(currentNote.tags);
      setIsFavorite(currentNote.isFavorite);
    } else {
      // Clear form for new note
      setTitle('');
      setContent('');
      setCategory('general');
      setTags([]);
      setIsFavorite(false);
    }
  }, [currentNote]);

  return {
    // Form state
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    tags,
    setTags,
    newTag,
    setNewTag,
    isFavorite,
    setIsFavorite,
    isSaving,
    setIsSaving,
    
    // UI state
    isFocusMode,
    setIsFocusMode,
    isHeaderCollapsed,
    setIsHeaderCollapsed,
    isHeaderHidden,
    setIsHeaderHidden,
    isAssistantCollapsed,
    setIsAssistantCollapsed,
    
    // Computed
    currentNote,
  };
};
