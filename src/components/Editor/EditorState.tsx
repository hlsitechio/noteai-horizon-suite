
import { useState, useEffect, useRef } from 'react';
import { useNotes } from '../../contexts/NotesContext';

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
  
  // References to trigger AI assistant collapse/expand
  const collapseAssistantRef = useRef<() => void>();
  const expandAssistantRef = useRef<() => void>();

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
    
    // Refs
    collapseAssistantRef,
    expandAssistantRef,
    
    // Computed
    currentNote,
  };
};
