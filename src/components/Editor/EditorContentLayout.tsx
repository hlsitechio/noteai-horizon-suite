
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { EditorFormState, EditorFormHandlers } from './EditorFormProps';
import { EditorRefs } from './EditorUIProps';
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

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Title Input */}
      <div className="p-6 border-b border-gray-200">
        <Input
          placeholder="Enter your title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 bg-transparent"
        />
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6">
        <Textarea
          placeholder="Start writing..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="h-full resize-none border-none shadow-none focus-visible:ring-0 text-base leading-relaxed bg-transparent"
        />
      </div>
    </div>
  );
};

export default EditorContentLayout;
