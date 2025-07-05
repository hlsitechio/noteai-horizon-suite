import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '../../contexts/OptimizedNotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import { toast } from 'sonner';
import { useEditor } from './hooks/useEditor';
import { useEditorResponsive } from './hooks/useEditorResponsive';
import EditorHeader from './components/EditorHeader';
import EditorContent from './components/EditorContent';
import FocusMode from './components/FocusMode';

const Editor: React.FC = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { notes, currentNote, setCurrentNote, createNote, updateNote, toggleFavorite } = useOptimizedNotes();
  const { folders } = useFolders();
  
  // Responsive hook to determine mobile/desktop behavior
  const { isMobile, isTablet } = useEditorResponsive();
  
  // Main editor state management
  const {
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
    
    // Form handlers
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
    handleTagAdd,
    handleTagRemove,
    handleFavoriteToggle,
    handleAutoSave
  } = useEditor({
    noteId,
    currentNote,
    notes,
    setCurrentNote,
    createNote,
    updateNote,
    toggleFavorite,
    navigate
  });

  // Load note if noteId is provided
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setCurrentNote(note);
      }
    } else {
      // Creating new note
      setCurrentNote(null);
    }
  }, [noteId, notes, setCurrentNote]);

  const handleFocusModeToggle = () => {
    setIsFocusMode(!isFocusMode);
  };

  const handleFocusModeClose = () => {
    setIsFocusMode(false);
  };

  const handleCollapseAllBars = () => {
    setIsHeaderHidden(true);
  };

  return (
    <div className="h-screen overflow-hidden bg-background">
      <div className={`h-full flex flex-col ${isMobile ? 'p-2' : 'p-4'}`}>
        {/* Header - Responsive */}
        {!isHeaderHidden && (
          <div className="flex-shrink-0 mb-4">
            <EditorHeader
              title={title}
              category={category}
              tags={tags}
              newTag={newTag}
              isFavorite={isFavorite}
              isSaving={isSaving}
              onTitleChange={setTitle}
              onCategoryChange={setCategory}
              onNewTagChange={setNewTag}
              onTagAdd={handleTagAdd}
              onTagRemove={handleTagRemove}
              onFavoriteToggle={handleFavoriteToggle}
              onSave={handleSave}
              onFocusModeToggle={handleFocusModeToggle}
              onCollapseAllBars={handleCollapseAllBars}
              isMobile={isMobile}
              isTablet={isTablet}
              canSave={title.trim().length > 0}
            />
          </div>
        )}

        {/* Main Editor Content */}
        <div className="flex-1 min-h-0">
          <EditorContent
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSave={handleSave}
            isSaving={isSaving}
            isMobile={isMobile}
            isTablet={isTablet}
            canSave={title.trim().length > 0}
            placeholder="Start writing your masterpiece..."
          />
        </div>

        {/* Focus Mode Modal */}
        <FocusMode
          isOpen={isFocusMode}
          onClose={handleFocusModeClose}
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onSave={handleSave}
          isSaving={isSaving}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default Editor;