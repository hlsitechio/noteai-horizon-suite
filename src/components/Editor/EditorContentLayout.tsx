
import React from 'react';
import EditorLayout from './EditorLayout';
import { EditorFormState, EditorFormHandlers } from './EditorFormProps';
import { EditorUIState, EditorRefs } from './EditorUIProps';
import { NoteCategory } from '../../types/note';

const categories: NoteCategory[] = [
  { value: 'general', label: 'General', color: 'gray' },
  { value: 'meeting', label: 'Meeting', color: 'blue' },
  { value: 'learning', label: 'Learning', color: 'green' },
  { value: 'brainstorm', label: 'Brainstorm', color: 'purple' },
  { value: 'project', label: 'Project', color: 'orange' },
];

interface EditorContentLayoutProps extends EditorFormState, EditorFormHandlers, EditorRefs {
  isHeaderHidden: boolean;
  isHeaderCollapsed: boolean;
  isAssistantCollapsed: boolean;
  onCollapseAllBars: () => void;
  isMobile?: boolean;
}

const EditorContentLayout: React.FC<EditorContentLayoutProps> = ({
  title,
  content,
  category,
  tags,
  newTag,
  isSaving,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onSave,
  onSuggestionApply,
  collapseAssistantRef,
  expandAssistantRef,
  isHeaderHidden,
  isHeaderCollapsed,
  isAssistantCollapsed,
  onCollapseAllBars,
  isMobile = false,
}) => {
  const getLayoutHeight = () => {
    if (isHeaderHidden) {
      return "h-[calc(100vh-32px)]";
    }
    return isHeaderCollapsed ? "h-[calc(100vh-80px)]" : "h-[calc(100vh-120px)]";
  };

  const canSave = title.trim().length > 0;

  return (
    <div className={getLayoutHeight()}>
      <EditorLayout
        title={title}
        content={content}
        category={category}
        tags={tags}
        newTag={newTag}
        categories={categories}
        onTitleChange={onTitleChange}
        onContentChange={onContentChange}
        onCategoryChange={onCategoryChange}
        onNewTagChange={onNewTagChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSuggestionApply={onSuggestionApply}
        onSave={onSave}
        canSave={canSave}
        isSaving={isSaving}
        collapseAssistantRef={collapseAssistantRef}
        expandAssistantRef={expandAssistantRef}
        showCollapseAllButton={isHeaderHidden}
        onCollapseAllBars={onCollapseAllBars}
        isAllBarsCollapsed={isHeaderHidden}
        isAssistantCollapsed={isAssistantCollapsed}
        isMobile={isMobile}
      />
    </div>
  );
};

export default EditorContentLayout;
