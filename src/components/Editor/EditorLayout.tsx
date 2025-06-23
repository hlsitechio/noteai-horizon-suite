
import React, { useState, useEffect } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile || isAssistantCollapsed);

  // Auto-collapse sidebar on mobile or when assistant is collapsed
  useEffect(() => {
    if (isMobile || isAssistantCollapsed) {
      setIsSidebarCollapsed(true);
    } else {
      setIsSidebarCollapsed(false);
    }
  }, [isMobile, isAssistantCollapsed]);

  // Update refs to control assistant collapse state
  React.useEffect(() => {
    if (collapseAssistantRef) {
      collapseAssistantRef.current = () => setIsSidebarCollapsed(true);
    }
    if (expandAssistantRef) {
      expandAssistantRef.current = () => setIsSidebarCollapsed(false);
    }
  }, [collapseAssistantRef, expandAssistantRef]);

  return (
    <div className="h-full">
      {/* Main Editor Layout - Proper grid structure */}
      <div className={`h-full grid transition-all duration-500 ease-in-out ${
        isMobile 
          ? 'grid-cols-1' 
          : isSidebarCollapsed
            ? 'grid-cols-[1fr_4rem] gap-4' 
            : 'grid-cols-[1fr_20rem] gap-6'
      }`}>
        {/* Main Editor Column */}
        <div className="min-h-0 overflow-hidden">
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

        {/* AI Assistant Sidebar - Only show on desktop */}
        {!isMobile && (
          <div className="min-h-0">
            <EditorSidebar
              content={content}
              onSuggestionApply={onSuggestionApply}
              onCollapseChange={setIsSidebarCollapsed}
              isCollapsed={isSidebarCollapsed}
              onCollapseToggle={setIsSidebarCollapsed}
              isDistractionFree={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorLayout;
