import React from 'react';
import { AppSidebar } from '../components/Layout/AppSidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useEditorState } from '../components/Editor/EditorState';
import { useEditorHandlers } from '../components/Editor/EditorHandlers';
import EditorContent from '../components/Editor/EditorContent';
import EditorLayoutFloatingControls from '../components/Editor/EditorLayoutFloatingControls';
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

  const [isDistractionFree, setIsDistractionFree] = React.useState(false);

  // Auto-collapse sidebar on mobile and enable distraction-free mode by default
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
      // Auto-enable distraction-free mode on mobile for better experience
      if (!isDistractionFree) {
        setIsDistractionFree(true);
        editorState.setIsHeaderHidden(true);
        editorState.setIsAssistantCollapsed(true);
      }
    }
  }, [isMobile, setOpen, isDistractionFree, editorState]);

  const handleDistractionFreeToggle = () => {
    const newDistractionFree = !isDistractionFree;
    setIsDistractionFree(newDistractionFree);
    
    if (newDistractionFree) {
      // Collapse sidebar and enable focus mode
      setOpen(false);
      editorState.setIsFocusMode(true);
      editorState.setIsHeaderHidden(true);
      editorState.setIsAssistantCollapsed(true);
    } else {
      // Restore normal mode
      if (!isMobile) {
        setOpen(true);
      }
      editorState.setIsFocusMode(false);
      editorState.setIsHeaderHidden(false);
      editorState.setIsAssistantCollapsed(false);
    }
  };

  // Enhanced mobile focus mode toggle - automatically enter focus mode on mobile
  const handleMobileFocusMode = () => {
    if (isMobile) {
      setIsDistractionFree(true);
      editorState.setIsFocusMode(true);
      editorState.setIsHeaderHidden(true);
      editorState.setIsAssistantCollapsed(true);
    } else {
      editorState.setIsFocusMode(true);
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
          
          // UI state - mobile responsive with enhanced distraction-free mode
          isFocusMode={editorState.isFocusMode}
          isHeaderCollapsed={editorState.isHeaderCollapsed}
          isHeaderHidden={editorState.isHeaderHidden || (isMobile && isDistractionFree)}
          isAssistantCollapsed={editorState.isAssistantCollapsed || isDistractionFree || isMobile}
          
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
          
          // UI handlers - enhanced for mobile
          onFocusModeToggle={handleMobileFocusMode}
          onHeaderCollapseToggle={() => editorState.setIsHeaderCollapsed(!editorState.isHeaderCollapsed)}
          onCollapseAllBars={editorHandlers.handleCollapseAllBars}
          onFocusModeClose={() => {
            editorState.setIsFocusMode(false);
            if (isDistractionFree && !isMobile) {
              setIsDistractionFree(false);
              setOpen(true);
              editorState.setIsHeaderHidden(false);
              editorState.setIsAssistantCollapsed(false);
            }
            // On mobile, keep distraction-free mode active even after closing focus mode
            if (isMobile) {
              editorState.setIsHeaderHidden(true);
              editorState.setIsAssistantCollapsed(true);
            }
          }}
          
          // Refs and computed
          collapseAssistantRef={editorState.collapseAssistantRef}
          expandAssistantRef={editorState.expandAssistantRef}
          currentNote={editorState.currentNote}
          isDistractionFree={isDistractionFree}
          isMobile={isMobile}
        />
        
        {/* Only show floating controls when not in focus mode and not on mobile */}
        {!editorState.isFocusMode && !isMobile && (
          <EditorLayoutFloatingControls
            isDistractionFree={isDistractionFree}
            onToggleDistractionFree={handleDistractionFreeToggle}
          />
        )}
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
