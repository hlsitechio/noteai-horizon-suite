
import React from 'react';
import { useNotes } from '../contexts/NotesContext';
import { useNavigate } from 'react-router-dom';
import EditorContent from '../components/Editor/EditorContent';
import { useEditorState } from '../components/Editor/EditorState';
import { useSecureEditorHandlers } from '../components/Editor/SecureEditorHandlers';

const Editor: React.FC = () => {
  const { currentNote, createNote, updateNote, setCurrentNote } = useNotes();
  const navigate = useNavigate();

  // Initialize editor state
  const editorState = useEditorState();
  
  // Initialize editor handlers with proper props
  const editorHandlers = useSecureEditorHandlers({
    ...editorState,
    currentNote,
  });

  // Handler functions for EditorContent
  const handleTitleChange = (title: string) => editorState.setTitle(title);
  const handleContentChange = (content: string) => editorState.setContent(content);
  const handleCategoryChange = (category: string) => editorState.setCategory(category);
  const handleNewTagChange = (tag: string) => editorState.setNewTag(tag);
  const handleFavoriteToggle = () => editorState.setIsFavorite(!editorState.isFavorite);
  const handleFocusModeToggle = () => editorState.setIsFocusMode(!editorState.isFocusMode);
  const handleHeaderCollapseToggle = () => editorState.setIsHeaderCollapsed(!editorState.isHeaderCollapsed);
  const handleFocusModeClose = () => editorState.setIsFocusMode(false);

  return (
    <div className="h-full w-full">
      <EditorContent
        currentNote={currentNote}
        // Form state
        title={editorState.title}
        content={editorState.content}
        category={editorState.category}
        tags={editorState.tags}
        newTag={editorState.newTag}
        isFavorite={editorState.isFavorite}
        isSaving={editorState.isSaving}
        // Form handlers
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        onCategoryChange={handleCategoryChange}
        onNewTagChange={handleNewTagChange}
        onAddTag={editorHandlers.addTag}
        onRemoveTag={editorHandlers.removeTag}
        onFavoriteToggle={handleFavoriteToggle}
        onSave={editorHandlers.handleSave}
        onSuggestionApply={editorHandlers.handleSuggestionApply}
        // UI state
        isFocusMode={editorState.isFocusMode}
        isHeaderCollapsed={editorState.isHeaderCollapsed}
        isHeaderHidden={editorState.isHeaderHidden}
        isAssistantCollapsed={editorState.isAssistantCollapsed}
        // UI handlers
        onFocusModeToggle={handleFocusModeToggle}
        onHeaderCollapseToggle={handleHeaderCollapseToggle}
        onCollapseAllBars={editorHandlers.handleCollapseAllBars}
        onFocusModeClose={handleFocusModeClose}
        // Refs
        collapseAssistantRef={editorState.collapseAssistantRef}
        expandAssistantRef={editorState.expandAssistantRef}
      />
    </div>
  );
};

export default Editor;
