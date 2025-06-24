
import React from 'react';
import EditorLayout from './EditorLayout';
import { EditorFormState, EditorFormHandlers } from './EditorFormProps';
import { CategoryOption } from '../../types/note';

interface EditorContentLayoutProps extends EditorFormState, EditorFormHandlers {
  collapseAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  expandAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  isHeaderHidden?: boolean;
  isHeaderCollapsed?: boolean;
  isAssistantCollapsed?: boolean;
  onCollapseAllBars?: () => void;
  isMobile?: boolean;
}

const EditorContentLayout: React.FC<EditorContentLayoutProps> = (props) => {
  console.log('EditorContentLayout rendering with props:', {
    title: props.title,
    isMobile: props.isMobile,
    isAssistantCollapsed: props.isAssistantCollapsed
  });

  // Get available categories - using CategoryOption interface
  const categories: CategoryOption[] = [
    { value: 'general', label: 'General', color: '#6366f1' },
    { value: 'work', label: 'Work', color: '#059669' },
    { value: 'personal', label: 'Personal', color: '#dc2626' },
    { value: 'ideas', label: 'Ideas', color: '#7c3aed' },
    { value: 'research', label: 'Research', color: '#ea580c' },
  ];

  return (
    <EditorLayout
      title={props.title}
      content={props.content}
      category={props.category}
      tags={props.tags}
      newTag={props.newTag}
      categories={categories}
      onTitleChange={props.onTitleChange}
      onContentChange={props.onContentChange}
      onCategoryChange={props.onCategoryChange}
      onNewTagChange={props.onNewTagChange}
      onAddTag={props.onAddTag}
      onRemoveTag={props.onRemoveTag}
      onSuggestionApply={props.onSuggestionApply}
      onSave={props.onSave}
      canSave={props.title?.trim().length > 0}
      isSaving={props.isSaving}
      collapseAssistantRef={props.collapseAssistantRef}
      expandAssistantRef={props.expandAssistantRef}
      isAssistantCollapsed={props.isAssistantCollapsed}
      isMobile={props.isMobile}
    />
  );
};

export default EditorContentLayout;
