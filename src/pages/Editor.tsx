import React from 'react';
import { AppSidebar } from '../components/Layout/AppSidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useEditorState } from '../components/Editor/EditorState';
import { useEditorHandlers } from '../components/Editor/EditorHandlers';
import EditorContent from '../components/Editor/EditorContent';
import { useIsMobile } from '../hooks/use-mobile';

const EditorInner: React.FC = () => {
  const { state: sidebarState, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const editorState = useEditorState();
  const editorHandlers = useEditorHandlers({
    title: editorState.title,
    content: editorState.content,
    category: editorState.category,
    tags: editorState.tags,
    newTag: editorState.newTag,
    isFavorite: editorState.isFavorite,
    currentNote: editorState.currentNote,
    setTags: editorState.setTags,
    setNewTag: editorState.setNewTag,
    setContent: editorState.setContent,
    setIsSaving: editorState.setIsSaving,
    setIsHeaderHidden: editorState.setIsHeaderHidden,
    setIsAssistantCollapsed: editorState.setIsAssistantCollapsed,
    isHeaderHidden: editorState.isHeaderHidden,
  });

  const [isUnifiedFocusMode, setIsUnifiedFocusMode] = React.useState(false);

  // Auto-collapse sidebar on mobile and enable unified focus mode by default
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
      // Auto-enable unified focus mode on mobile for better experience
      if (!isUnifiedFocusMode) {
        setIsUnifiedFocusMode(true);
        editorState.setIsHeaderHidden(true);
        editorState.setIsAssistantCollapsed(true);
        editorState.setIsFocusMode(true);
      }
    }
  }, [isMobile, setOpen, isUnifiedFocusMode, editorState]);

  const handleUnifiedFocusToggle = () => {
    const newUnifiedFocusMode = !isUnifiedFocusMode;
    setIsUnifiedFocusMode(newUnifiedFocusMode);
    
    if (newUnifiedFocusMode) {
      // Enter unified focus mode: hide everything and enter focus mode
      setOpen(false);
      editorState.setIsFocusMode(true);
      editorState.setIsHeaderHidden(true);
      editorState.setIsAssistantCollapsed(true);
    } else {
      // Exit unified focus mode: restore normal layout
      if (!isMobile) {
        setOpen(true);
      }
      editorState.setIsFocusMode(false);
      editorState.setIsHeaderHidden(false);
      editorState.setIsAssistantCollapsed(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      <AppSidebar />
      <SidebarInset className="flex-1 min-w-0">
        <EditorContent
          // Form state
          title={editorState.title}
          content={editorState.content}
          category={editorState.category}
          tags={editorState.tags}
          newTag={editorState.newTag}
          isFavorite={editorState.isFavorite}
          isSaving={editorState.isSaving}
          
          // UI state - unified focus mode controls everything
          isFocusMode={editorState.isFocusMode}
          isHeaderCollapsed={editorState.isHeaderCollapsed}
          isHeaderHidden={editorState.isHeaderHidden || (isMobile && isUnifiedFocusMode)}
          isAssistantCollapsed={editorState.isAssistantCollapsed || isUnifiedFocusMode || isMobile}
          
          // Form handlers
          onTitleChange={editorState.setTitle}
          onContentChange={editorState.setContent}
          onCategoryChange={editorState.setCategory}
          onNewTagChange={editorState.setNewTag}
          onAddTag={editorHandlers.addTag}
          onRemoveTag={editorHandlers.removeTag}
          onFavoriteToggle={() => editorState.setIsFavorite(!editorState.isFavorite)}
          onSave={editorHandlers.handleSave}
          onSuggestionApply={editorHandlers.handleSuggestionApply}
          
          // UI handlers - unified approach
          onFocusModeToggle={handleUnifiedFocusToggle}
          onHeaderCollapseToggle={() => editorState.setIsHeaderCollapsed(!editorState.isHeaderCollapsed)}
          onCollapseAllBars={editorHandlers.handleCollapseAllBars}
          onFocusModeClose={() => {
            editorState.setIsFocusMode(false);
            if (isUnifiedFocusMode && !isMobile) {
              setIsUnifiedFocusMode(false);
              setOpen(true);
              editorState.setIsHeaderHidden(false);
              editorState.setIsAssistantCollapsed(false);
            }
            // On mobile, keep unified focus mode active even after closing focus mode overlay
            if (isMobile) {
              editorState.setIsHeaderHidden(true);
              editorState.setIsAssistantCollapsed(true);
            }
          }}
          
          // Refs and computed
          collapseAssistantRef={editorState.collapseAssistantRef}
          expandAssistantRef={editorState.expandAssistantRef}
          currentNote={editorState.currentNote}
          isDistractionFree={isUnifiedFocusMode}
          isMobile={isMobile}
        />
      </SidebarInset>
    </div>
  );
};

const Editor: React.FC = () => {
  return (
    <SidebarProvider>
      <EditorInner />
    </SidebarProvider>
  );
};

export default Editor;
