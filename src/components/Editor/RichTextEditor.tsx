
import React from 'react';
import TiptapRichTextEditor from './tiptap/TiptapRichTextEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  onFocusModeToggle?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  cursorPosition?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing something amazing...",
  onSave,
  onFocusModeToggle,
  canSave = true,
  isSaving = false,
}) => {
  return (
    <div className="rounded-2xl shadow-large overflow-hidden bg-black">
      <TiptapRichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onSave={onSave}
        onFocusModeToggle={onFocusModeToggle}
        canSave={canSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default RichTextEditor;
