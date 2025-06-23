
import React, { useState, useEffect } from 'react';
import EditorLayoutFloatingControls from './EditorLayoutFloatingControls';
import EditorMainColumn from './EditorMainColumn';
import EditorSidebar from './EditorSidebar';
import { NoteCategory } from '../../types/note';

interface EditorLayoutProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  newTag: string;
  categories: NoteCategory[];
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
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDistractionFree, setIsDistractionFree] = useState(false);

  // Update refs to control assistant collapse state
  React.useEffect(() => {
    if (collapseAssistantRef) {
      collapseAssistantRef.current = () => setIsSidebarCollapsed(true);
    }
    if (expandAssistantRef) {
      expandAssistantRef.current = () => setIsSidebarCollapsed(false);
    }
  }, [collapseAssistantRef, expandAssistantRef]);

  const toggleDistractionFree = () => {
    setIsDistractionFree(!isDistractionFree);
    if (!isDistractionFree) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  };

  return (
    <div className="relative">
      {/* Floating Layout Control */}
      <EditorLayoutFloatingControls
        isDistractionFree={isDistractionFree}
        onToggleDistractionFree={toggleDistractionFree}
      />

      {/* Main Editor Column */}
      <div className={`grid gap-6 h-full transition-all duration-500 ease-in-out ${
        isSidebarCollapsed || isDistractionFree
          ? 'grid-cols-1 lg:grid-cols-[1fr_4rem]' 
          : 'grid-cols-1 lg:grid-cols-4'
      }`}>
        <div className={isSidebarCollapsed || isDistractionFree ? 'lg:col-span-1' : 'lg:col-span-3'}>
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
            isDistractionFree={isDistractionFree}
          />
        </div>

        {/* Collapsible AI Sidebar */}
        <EditorSidebar
          content={content}
          onSuggestionApply={onSuggestionApply}
          onCollapseChange={setIsSidebarCollapsed}
          isCollapsed={isAssistantCollapsed || isSidebarCollapsed}
          onCollapseToggle={setIsSidebarCollapsed}
          isDistractionFree={isDistractionFree}
        />
      </div>
    </div>
  );
};

export default EditorLayout;
