import React from 'react';
import { SimpleTiptapEditor } from '@/components/Editor/tiptap/components/SimpleTiptapEditor';

interface PlainTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isMobile?: boolean;
}

const PlainTextEditor: React.FC<PlainTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your note...",
  isMobile = false
}) => {
  return (
    <div className="h-full">
      <SimpleTiptapEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-full
          ${isMobile ? 'text-base' : 'text-lg'}
        `}
      />
    </div>
  );
};

export default PlainTextEditor;