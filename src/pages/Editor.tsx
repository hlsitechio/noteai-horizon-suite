import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '../contexts/OptimizedNotesContext';
import { useFolders } from '../contexts/FoldersContext';
import EditorContent from '../components/Editor/EditorContent';
import { CategoryOption } from '../types/note';
import { toast } from 'sonner';

const Editor: React.FC = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { notes, currentNote, setCurrentNote, createNote, updateNote, toggleFavorite } = useOptimizedNotes();
  const { folders } = useFolders();

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

  // Refs for assistant control
  const collapseAssistantRef = useRef<(() => void) | undefined>();
  const expandAssistantRef = useRef<(() => void) | undefined>();

  // Load note if noteId is provided
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setCurrentNote(note);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
        setTags(note.tags);
        setIsFavorite(note.isFavorite);
      }
    } else {
      // Creating new note
      setCurrentNote(null);
      setTitle('');
      setContent('');
      setCategory('general');
      setTags([]);
      setIsFavorite(false);
    }
  }, [noteId, notes, setCurrentNote]);

  // Auto-save functionality with reduced timeout to minimize violations
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 1000); // Reduced from 2000ms to 1000ms

    return () => clearTimeout(autoSaveTimer);
  }, [title, content, category, tags]);

  const handleSave = async () => {
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
      } else {
        const newNote = await createNote(noteData);
        setCurrentNote(newNote);
        navigate(`/app/editor/${newNote.id}`, { replace: true });
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFavoriteToggle = async () => {
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
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionApply = (original: string, suggestion: string) => {
    setContent(content.replace(original, suggestion));
  };

  // Focus Mode handlers
  const handleFocusModeToggle = () => {
    console.log('Focus mode toggle clicked:', !isFocusMode);
    setIsFocusMode(!isFocusMode);
  };

  const handleFocusModeClose = () => {
    console.log('Focus mode close clicked');
    setIsFocusMode(false);
  };

  const handleCollapseAllBars = () => {
    setIsHeaderHidden(true);
    setIsAssistantCollapsed(true);
    if (collapseAssistantRef.current) {
      collapseAssistantRef.current();
    }
  };

  return (
    <EditorContent
      // Form state
      title={title}
      content={content}
      category={category}
      tags={tags}
      newTag={newTag}
      isFavorite={isFavorite}
      isSaving={isSaving}
      
      // Form handlers
      onTitleChange={setTitle}
      onContentChange={setContent}
      onCategoryChange={setCategory}
      onNewTagChange={setNewTag}
      onAddTag={handleTagAdd}
      onRemoveTag={handleTagRemove}
      onFavoriteToggle={handleFavoriteToggle}
      onSave={handleSave}
      onSuggestionApply={handleSuggestionApply}
      
      // UI state
      isFocusMode={isFocusMode}
      isHeaderCollapsed={isHeaderCollapsed}
      isHeaderHidden={isHeaderHidden}
      
      // UI handlers
      onFocusModeToggle={handleFocusModeToggle}
      onHeaderCollapseToggle={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
      onCollapseAllBars={handleCollapseAllBars}
      onFocusModeClose={handleFocusModeClose}
      
      // Refs
      collapseAssistantRef={collapseAssistantRef}
      expandAssistantRef={expandAssistantRef}
      
      // Other props
      currentNote={currentNote}
      isAssistantCollapsed={isAssistantCollapsed}
    />
  );
};

export default Editor;
