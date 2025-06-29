import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import EditorContent from '../components/Editor/EditorContent';
import { useEditorState } from '../hooks/editor/useEditorState';
import { useEditorHandlers } from '../hooks/editor/useEditorHandlers';
import { toast } from 'sonner';

const Editor: React.FC = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { notes, setCurrentNote, toggleFavorite } = useNotes();
  
  // Use the new refactored hooks
  const editorState = useEditorState();
  const editorHandlers = useEditorHandlers(editorState);

  // Load note if noteId is provided
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setCurrentNote(note);
      }
    } else {
      setCurrentNote(null);
    }
  }, [noteId, notes, setCurrentNote]);

  // Auto-save functionality
  useEffect(() => {
    if (!editorState.title.trim() && !editorState.content.trim()) return;

    const autoSaveTimer = setTimeout(() => {
      editorHandlers.handleSave();
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [editorState.title, editorState.content, editorState.category, editorState.tags]);

  const handleFavoriteToggle = async () => {
    if (!editorState.currentNote?.id) {
      editorState.setIsFavorite(!editorState.isFavorite);
      return;
    }

    try {
      const updatedNote = await toggleFavorite(editorState.currentNote.id);
      if (updatedNote) {
        editorState.setIsFavorite(updatedNote.isFavorite);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleCollapseAllBars = () => {
    editorState.setIsHeaderHidden(true);
    editorState.setIsAssistantCollapsed(true);
  };

  return (
    <EditorContent
      // Form state
      title={editorState.title}
      content={editorState.content}
      category={editorState.category}
      tags={editorState.tags}
      newTag={editorState.newTag}
      isFavorite={editorState.isFavorite}
      isSaving={editorState.isSaving}
      
      // Form handlers
      onTitleChange={editorState.setTitle}
      onContentChange={editorState.setContent}
      onCategoryChange={editorState.setCategory}
      onNewTagChange={editorState.setNewTag}
      onAddTag={editorHandlers.addTag}
      onRemoveTag={editorHandlers.removeTag}
      onFavoriteToggle={handleFavoriteToggle}
      onSave={editorHandlers.handleSave}
      onSuggestionApply={editorHandlers.handleSuggestionApply}
      
      // UI state
      isFocusMode={editorState.isFocusMode}
      isHeaderCollapsed={editorState.isHeaderCollapsed}
      isHeaderHidden={editorState.isHeaderHidden}
      
      // UI handlers
      onFocusModeToggle={() => editorState.setIsFocusMode(!editorState.isFocusMode)}
      onHeaderCollapseToggle={() => editorState.setIsHeaderCollapsed(!editorState.isHeaderCollapsed)}
      onCollapseAllBars={handleCollapseAllBars}
      onFocusModeClose={() => editorState.setIsFocusMode(false)}
      
      // Refs
      collapseAssistantRef={{ current: undefined }}
      expandAssistantRef={{ current: undefined }}
      
      // Other props
      currentNote={editorState.currentNote}
      isAssistantCollapsed={editorState.isAssistantCollapsed}
    />
  );
};

export default Editor;
