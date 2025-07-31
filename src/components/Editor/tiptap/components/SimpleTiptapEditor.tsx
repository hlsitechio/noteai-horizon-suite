import React, { useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Focus from '@tiptap/extension-focus';
import Typography from '@tiptap/extension-typography';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { AIAssistantToolbar } from '../ai/AIAssistantToolbar';
import { parseInitialValue } from '../utils/editorUtils';

interface SimpleTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onEditorReady?: (editor: any) => void;
  showAIToolbar?: boolean;
  enableAdvancedFeatures?: boolean;
}

export const SimpleTiptapEditor: React.FC<SimpleTiptapEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  onEditorReady,
  showAIToolbar = true,
  enableAdvancedFeatures = true
}) => {
  const extensions = useMemo(() => {
    const basicExtensions = [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      Typography,
    ];

    if (enableAdvancedFeatures) {
      return [
        ...basicExtensions,
        TextStyle,
        Color.configure({
          types: [TextStyle.name],
        }),
        Link.configure({
          HTMLAttributes: {
            class: 'text-primary underline cursor-pointer',
          },
          openOnClick: false,
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        })
      ];
    }

    return basicExtensions;
  }, [placeholder, enableAdvancedFeatures]);

  const editor = useEditor({
    extensions,
    content: parseInitialValue(value),
    onUpdate: ({ editor }) => {
      // Get HTML content for rich text storage
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] p-4 text-foreground',
      },
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className={`relative ${className}`}>
      {showAIToolbar && editor && (
        <AIAssistantToolbar 
          editor={editor}
          className="mb-4"
        />
      )}
      <EditorContent 
        editor={editor}
        className="prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
};