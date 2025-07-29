import React, { useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { parseInitialValue } from '../utils/editorUtils';

interface SimpleTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SimpleTiptapEditor: React.FC<SimpleTiptapEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = ""
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
    ],
    content: parseInitialValue(value),
    onUpdate: ({ editor }) => {
      // Convert HTML back to plain text for simple use cases
      const text = editor.getText();
      onChange(text);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[200px] p-4 text-foreground',
      },
    },
  });

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