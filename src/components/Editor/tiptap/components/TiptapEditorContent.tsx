import React, { useCallback } from 'react';
import { EditorContent } from '@tiptap/react';
import { TiptapEditorProps } from '../types';
import { useTiptapEditor } from '../hooks/useTiptapEditor';
import { useTiptapFormatting } from '../hooks/useTiptapFormatting';
import EnhancedTiptapToolbar from './EnhancedTiptapToolbar';
import TiptapBubbleMenu from './TiptapBubbleMenu';
import EnhancedMobileToolbar from './EnhancedMobileToolbar';

const TiptapEditorContent: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  onSave,
  canSave,
  isSaving,
  onFocusModeToggle,
}) => {
  const { editor, handleTextInsert, handleAIInsert, handleAIReplace } = useTiptapEditor({
    value,
    onChange,
    placeholder,
  });

  const { handleKeyboardShortcuts } = useTiptapFormatting(editor);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    handleKeyboardShortcuts(event);
    
    // AI toggle shortcut
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault();
      // This would trigger AI assistant toggle if needed
    }
  }, [handleKeyboardShortcuts]);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <EnhancedTiptapToolbar 
        editor={editor}
        onSave={onSave}
        canSave={canSave}
        isSaving={isSaving}
        onFocusModeToggle={onFocusModeToggle}
      />
      
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <TiptapBubbleMenu editor={editor} />
        <div 
          className="h-full p-8 overflow-y-auto bg-background"
          onKeyDown={handleKeyDown}
        >
          <EditorContent 
            editor={editor}
            className="h-full prose-lg max-w-none [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:max-h-[700px] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:text-foreground [&_.ProseMirror]:leading-relaxed"
          />
        </div>
      </div>
      
      <EnhancedMobileToolbar editor={editor} />
    </div>
  );
};

export default TiptapEditorContent;