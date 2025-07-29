import { Editor } from '@tiptap/core';

export interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  onFocusModeToggle?: () => void;
}

export interface TiptapFormattingProps {
  editor: Editor | null;
}

export interface TiptapToolbarProps {
  editor: Editor | null;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  onFocusModeToggle?: () => void;
}

export type FormattingCommand = 
  | 'bold' 
  | 'italic' 
  | 'underline' 
  | 'code'
  | 'heading1'
  | 'heading2'
  | 'blockquote'
  | 'bulletList'
  | 'orderedList';