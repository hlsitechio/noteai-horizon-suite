import React from 'react';
import BaseRichTextEditor from '@/components/Editor/RichTextEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  isMobile?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing something amazing...",
  onSave,
  canSave = true,
  isSaving = false,
  isMobile = false
}) => {
  return (
    <div className="h-full">
      <BaseRichTextEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onSave={onSave}
        canSave={canSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default RichTextEditor;