
import React from 'react';
import { AppSidebar } from '../components/Layout/AppSidebar';
import { SidebarProvider, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useEditorState } from '../components/Editor/EditorState';
import { useEditorHandlers } from '../components/Editor/EditorHandlers';
import EditorContent from '../components/Editor/EditorContent';
import EditorLayoutFloatingControls from '../components/Editor/EditorLayoutFloatingControls';

const EditorInner: React.FC = () => {
  const { state: sidebarState, setOpen } = useSidebar();
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
      setOpen(true);
      editorState.setIsFocusMode(false);
      editorState.setIsHeaderHidden(false);
      editorState.setIsAssistantCollapsed(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background relative">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <EditorContent
          // Form state
          title={editorState.title}
          content={editorState.content}
          category={editorState.category}
          tags={editorState.tags}
          newTag={editorState.newTag}
          isFavorite={editorState.isFavorite}
          isSaving={editorState.isSaving}
          
          // UI state
          isFocusMode={editorState.isFocusMode}
          isHeaderCollapsed={editorState.isHeaderCollapsed}
          isHeaderHidden={editorState.isHeaderHidden || isDistractionFree}
          isAssistantCollapsed={editorState.isAssistantCollapsed || isDistractionFree}
          
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
          
          // UI handlers
          onFocusModeToggle={() => editorState.setIsFocusMode(true)}
          onHeaderCollapseToggle={() => editorState.setIsHeaderCollapsed(!editorState.isHeaderCollapsed)}
          onCollapseAllBars={editorHandlers.handleCollapseAllBars}
          onFocusModeClose={() => {
            editorState.setIsFocusMode(false);
            if (isDistractionFree) {
              setIsDistractionFree(false);
              setOpen(true);
              editorState.setIsHeaderHidden(false);
              editorState.setIsAssistantCollapsed(false);
            }
          }}
          
          // Refs and computed
          collapseAssistantRef={editorState.collapseAssistantRef}
          expandAssistantRef={editorState.expandAssistantRef}
          currentNote={editorState.currentNote}
        />
        
        <EditorLayoutFloatingControls
          isDistractionFree={isDistractionFree}
          onToggleDistractionFree={handleDistractionFreeToggle}
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
