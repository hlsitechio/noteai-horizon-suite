import { useState, useCallback } from 'react';
import { Editor } from '@tiptap/core';

interface Position {
  x: number;
  y: number;
}

export const useTiptapTextSelection = (editor: Editor | null) => {
  const [selectedText, setSelectedText] = useState('');
  const [contextMenuPosition, setContextMenuPosition] = useState<Position | null>(null);

  const handleTextSelection = useCallback(() => {
    if (!editor) return;

    const { state } = editor;
    const { selection } = state;
    
    if (selection.empty) {
      setSelectedText('');
      setContextMenuPosition(null);
      return;
    }

    const selectedContent = state.doc.textBetween(selection.from, selection.to);
    setSelectedText(selectedContent);
    
    // Get selection position for context menu
    const { view } = editor;
    const coords = view.coordsAtPos(selection.from);
    
    setContextMenuPosition({
      x: coords.left,
      y: coords.top - 10,
    });
  }, [editor]);

  const handleContextMenuReplace = useCallback((newText: string) => {
    if (!editor || !selectedText) return;
    
    const { state } = editor;
    const { selection } = state;
    
    if (!selection.empty) {
      editor.chain().focus().deleteSelection().insertContent(newText).run();
    }
    
    setSelectedText('');
    setContextMenuPosition(null);
  }, [editor, selectedText]);

  const closeContextMenu = useCallback(() => {
    setSelectedText('');
    setContextMenuPosition(null);
  }, []);

  return {
    selectedText,
    contextMenuPosition,
    handleTextSelection,
    handleContextMenuReplace,
    closeContextMenu,
  };
};