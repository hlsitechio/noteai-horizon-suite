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
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { TextAlign } from '@tiptap/extension-text-align';
import { Focus } from '@tiptap/extension-focus';
import { CharacterCount } from '@tiptap/extension-character-count';
import { useCallback } from 'react';
import { createLowlight } from 'lowlight';

// Create lowlight instance and register common languages
const lowlight = createLowlight();
import { parseInitialValue } from '../utils/editorUtils';

interface UseTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  characterLimit?: number;
}

export const useTiptapEditor = ({ value, onChange, placeholder, characterLimit }: UseTiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false, // Disable default code block
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'hljs rounded-lg',
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
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'deepest',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'task-item flex items-start gap-2',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-border rounded-lg',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      ...(characterLimit ? [CharacterCount.configure({ limit: characterLimit })] : []),
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