
import { useMemo, useState, useCallback } from 'react';
import { createEditor, Descendant, Editor, Transforms, Range } from 'slate';
import { withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { SlateValue } from '../types';
import { parseInitialValue, toggleMark, toggleBlock } from '../utils/editorUtils';

interface UseRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const useRichTextEditor = ({ value, onChange }: UseRichTextEditorProps) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Parse the value from string to Slate value
  const initialValue: Descendant[] = useMemo(() => parseInitialValue(value), [value]);
  const [slateValue, setSlateValue] = useState<SlateValue>(initialValue);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setSlateValue(newValue);
    // Convert Slate value to string for storage
    onChange(JSON.stringify(newValue));
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

  return {
    editor,
    slateValue,
    handleChange,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
  };
};
