import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createEditor, Descendant, Editor, Transforms, Range } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { withYjs, YjsEditor } from '@slate-yjs/core';
import * as Y from 'yjs';
import { SlateValue } from '../types';
import { parseInitialValue } from '../utils/editorUtils';

interface UseCollaborativeEditorProps {
  value: string;
  onChange: (value: string) => void;
  documentId?: string;
  userId?: string;
  userName?: string;
  enabled?: boolean;
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const useCollaborativeEditor = ({ 
  value, 
  onChange, 
  documentId,
  userId,
  userName,
  enabled = false 
}: UseCollaborativeEditorProps) => {
  // Collaborative functionality completely disabled
  
  // Create simple editor without collaboration
  const editor = useMemo(() => {
    return withHistory(withReact(createEditor()));
  }, []);

  // Parse the value from string to Slate value
  const parsedValue = useMemo(() => {
    if (!value) return initialValue;
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  }, [value]);

  const [slateValue, setSlateValue] = useState<SlateValue>(parsedValue);
  const [isConnected, setIsConnected] = useState(false);

  // Collaborative functionality completely disabled
  useEffect(() => {
    setIsConnected(false);
  }, []);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setSlateValue(newValue);
    
    // Convert Slate value to string for storage
    const contentString = JSON.stringify(newValue);
    onChange(contentString);
  }, [onChange]);

  const handleTextInsert = useCallback((text: string) => {
    const { selection } = editor;
    if (selection) {
      // Insert text at current cursor position
      Transforms.insertText(editor, text, { at: selection });
    } else {
      // If no selection, insert at the end
      const endPoint = Editor.end(editor, []);
      Transforms.select(editor, endPoint);
      Transforms.insertText(editor, text);
    }
    
    // Focus the editor after insertion
    ReactEditor.focus(editor);
  }, [editor]);

  const handleAIInsert = useCallback((text: string) => {
    const { selection } = editor;
    if (selection) {
      Transforms.insertText(editor, `\n\n${text}`, { at: selection });
    }
  }, [editor]);

  const handleAIReplace = useCallback((text: string) => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) {
      Transforms.delete(editor, { at: selection });
      Transforms.insertText(editor, text, { at: selection });
    }
  }, [editor]);

  const setCursor = useCallback((position: any) => {
    // For now, just log the cursor position
    // In a full implementation, this would integrate with awareness
    console.log('Cursor position:', position);
  }, []);

  const setSelection = useCallback((selection: any) => {
    // For now, just log the selection
    // In a full implementation, this would integrate with awareness
    console.log('Selection changed:', selection);
  }, []);

  return {
    editor,
    slateValue,
    handleChange,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
    setCursor,
    setSelection,
    isConnected,
    isCollaborative: false,
    collaborationEnabled: false,
  };
};