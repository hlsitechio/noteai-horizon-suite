import React, { useMemo, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { parseInitialValue } from '../utils/editorUtils';

interface SimpleTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onEditorReady?: (editor: any) => void;
}

export const SimpleTiptapEditor: React.FC<SimpleTiptapEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
  onEditorReady
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
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
    ],
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
      <EditorContent 
        editor={editor}
        style={{
          backgroundColor: 'transparent',
          fontSize: '16px',
          lineHeight: '1.6',
        }}
      />
    </div>
  );
};