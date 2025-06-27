
import React from 'react';
import EditorHeader from './EditorHeader';
import EditorContentLayout from './EditorContentLayout';
import FocusMode from './FocusMode';
import { EditorFormState, EditorFormHandlers } from './EditorFormProps';
import { EditorUIState, EditorUIHandlers, EditorRefs } from './EditorUIProps';

interface EditorContentProps extends EditorFormState, EditorFormHandlers, EditorUIState, EditorUIHandlers, EditorRefs {
  currentNote: any;
  isAssistantCollapsed: boolean;
  isDistractionFree?: boolean;
  isMobile?: boolean;
}

const EditorContent: React.FC<EditorContentProps> = ({
  // Form state and handlers
  title,
  content,
  category,
  tags,
  newTag,
  isFavorite,
  isSaving,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onFavoriteToggle,
  onSave,
  onSuggestionApply,
  
  // UI state and handlers
  isFocusMode,
  isHeaderCollapsed,
  isHeaderHidden,
  isAssistantCollapsed,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onCollapseAllBars,
  onFocusModeClose,
  
  // Refs and computed
  collapseAssistantRef,
  expandAssistantRef,
  currentNote,
  isDistractionFree = false,
  isMobile = false,
}) => {
  const shouldShowLayout = !isFocusMode;
  const canSave = title.trim().length > 0;

  return (
    <div className="h-screen overflow-hidden">
      <div className={`h-full flex flex-col ${isMobile ? 'p-2' : 'p-4'}`}>
        {/* Header - Mobile responsive */}
        {!isHeaderHidden && (
          <div className="flex-shrink-0 mb-4">
            <EditorHeader
              note={currentNote}
              title={title}
              category={category}
              tags={tags}
              newTag={newTag}
              isEditing={true}
              isSaving={isSaving}
              onBack={() => {}}
              onSave={onSave}
              onTitleChange={onTitleChange}
              onCategoryChange={onCategoryChange}
              onTagsChange={(tags) => {
                // Handle tags change logic here
                tags.forEach(tag => {
                  if (!tags.includes(tag)) {
                    onAddTag();
                  }
                });
              }}
              onNewTagChange={onNewTagChange}
              onToggleFavorite={onFavoriteToggle}
            />
          </div>
        )}

        {/* Main Editor Layout */}
        {shouldShowLayout && (
          <div className="flex-1 min-h-0">
            <EditorContentLayout
              title={title}
              content={content}
              category={category}
              tags={tags}
              newTag={newTag}
              isFavorite={isFavorite}
              isSaving={isSaving}
              onTitleChange={onTitleChange}
              onContentChange={onContentChange}
              onCategoryChange={onCategoryChange}
              onNewTagChange={onNewTagChange}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onFavoriteToggle={onFavoriteToggle}
              onSave={onSave}
              onSuggestionApply={onSuggestionApply}
              collapseAssistantRef={collapseAssistantRef}
              expandAssistantRef={expandAssistantRef}
              isHeaderHidden={isHeaderHidden}
              isHeaderCollapsed={isHeaderCollapsed}
              isAssistantCollapsed={isAssistantCollapsed || isMobile}
              onCollapseAllBars={onCollapseAllBars}
              isMobile={isMobile}
            />
          </div>
        )}

        {/* Focus Mode Modal */}
        <FocusMode
          isOpen={isFocusMode}
          onClose={onFocusModeClose}
          title={title}
          content={content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
          onSave={onSave}
          isSaving={isSaving}
          isDistractionFree={isDistractionFree}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default EditorContent;
