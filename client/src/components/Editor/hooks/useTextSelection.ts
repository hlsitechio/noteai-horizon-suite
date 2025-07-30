
import React, { useState, useCallback } from 'react';
import { Editor, Range, Transforms } from 'slate';

export const useTextSelection = (editor: Editor) => {
  const [selectedText, setSelectedText] = useState('');
  const [assistantPosition, setAssistantPosition] = useState<{ x: number; y: number } | undefined>();
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleTextSelection = useCallback(() => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      const selectedText = Editor.string(editor, selection);
      setSelectedText(selectedText);
      
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Set position for context menu
        setContextMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top
        });
        
        // Set position for AI assistant
        setAssistantPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
      }
    } else {
      setSelectedText('');
      setContextMenuPosition(null);
    }
  }, [editor]);

  const handleContextMenuReplace = useCallback((text: string) => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      Transforms.delete(editor, { at: selection });
      Transforms.insertText(editor, text, { at: selection });
      setContextMenuPosition(null);
      setSelectedText('');
    }
  }, [editor]);

  const closeContextMenu = useCallback(() => {
    setContextMenuPosition(null);
    setSelectedText('');
  }, []);

  return {
    selectedText,
    assistantPosition,
    contextMenuPosition,
    handleTextSelection,
    handleContextMenuReplace,
    closeContextMenu,
  };
};
