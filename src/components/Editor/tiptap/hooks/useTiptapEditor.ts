import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { FontFamily } from '@tiptap/extension-font-family';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { FloatingMenu } from '@tiptap/extension-floating-menu';
import { useCallback } from 'react';
import { parseInitialValue } from '../utils/editorUtils';

interface UseTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const useTiptapEditor = ({ value, onChange, placeholder }: UseTiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'hljs',
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
      Typography,
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: parseInitialValue(value),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none text-foreground leading-relaxed',
      },
    },
  });

  const handleTextInsert = useCallback((text: string) => {
    if (!editor) return;
    
    editor.chain().focus().insertContent(text).run();
  }, [editor]);

  const handleAIInsert = useCallback((text: string) => {
    if (!editor) return;
    
    editor.chain().focus().insertContent(`\n\n${text}`).run();
  }, [editor]);

  const handleAIReplace = useCallback((text: string) => {
    if (!editor) return;
    
    if (editor.state.selection.empty) return;
    
    editor.chain().focus().deleteSelection().insertContent(text).run();
  }, [editor]);

  return {
    editor,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
  };
};