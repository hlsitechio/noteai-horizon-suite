
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { EditorFormState, EditorFormHandlers } from './EditorFormProps';
import { EditorRefs } from './EditorUIProps';
import EditorToolbar from './EditorToolbar';
import { useNotes } from '../../contexts/NotesContext';

interface EditorContentLayoutProps extends EditorFormState, EditorFormHandlers, EditorRefs {
  collapseAssistantRef: any;
  expandAssistantRef: any;
  isHeaderHidden: boolean;
  isHeaderCollapsed: boolean;
  isAssistantCollapsed: boolean;
  onCollapseAllBars: () => void;
  isMobile?: boolean;
}

const EditorContentLayout: React.FC<EditorContentLayoutProps> = ({
  title,
  content,
  isSaving,
  onTitleChange,
  onContentChange,
  onSave,
  isMobile = false,
}) => {
  const { currentNote, refreshNotes } = useNotes();
  const canSave = title.trim().length > 0;

  const handleReminderSet = () => {
    // Refresh notes to get updated reminder data
    refreshNotes();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Toolbar */}
      <EditorToolbar
        note={currentNote}
        canSave={canSave}
        isSaving={isSaving}
        onSave={onSave}
        onReminderSet={handleReminderSet}
      />

      {/* Title Input */}
      <div className="p-4 border-b">
        <Input
          placeholder="Enter your brilliant title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl font-semibold border-none shadow-none focus-visible:ring-0 px-0"
        />
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-4">
        <Textarea
          placeholder="Start writing your masterpiece..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="h-full resize-none border-none shadow-none focus-visible:ring-0 text-base leading-relaxed"
        />
      </div>
    </div>
  );
};

export default EditorContentLayout;
