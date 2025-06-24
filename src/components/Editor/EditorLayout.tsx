
import React, { useState, useEffect } from 'react';
import EditorMainColumn from './EditorMainColumn';
import { CategoryOption } from '../../types/note';

interface EditorLayoutProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  categories: CategoryOption[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSuggestionApply: (original: string, suggestion: string) => void;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  collapseAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  expandAssistantRef?: React.MutableRefObject<(() => void) | undefined>;
  showCollapseAllButton?: boolean;
  onCollapseAllBars?: () => void;
  isAllBarsCollapsed?: boolean;
  isAssistantCollapsed?: boolean;
  isMobile?: boolean;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  title,
  content,
  category,
  tags,
  newTag,
  categories,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onSuggestionApply,
  onSave,
  canSave = true,
  isSaving = false,
  collapseAssistantRef,
  expandAssistantRef,
  isAssistantCollapsed = false,
  isMobile = false,
}) => {
  // Since we're preventing double sidebar, we'll use a single column layout
  // The AI assistant functionality will be integrated elsewhere or accessed via focus mode
  
  return (
    <div className="h-full">
      {/* Single Column Layout - No AI Assistant Sidebar */}
      <div className="h-full">
        <EditorMainColumn
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
          isDistractionFree={false}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default EditorLayout;
