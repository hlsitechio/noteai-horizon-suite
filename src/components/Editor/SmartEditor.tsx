import React from 'react';
import { CollaborativeEditorContent } from './components/CollaborativeEditorContent';
import EditorContent from './components/EditorContent';

interface SmartEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  documentId?: string;
  userId?: string;
  userName?: string;
  enableCollaboration?: boolean;
  onSelectionChange?: (selection: any) => void;
  className?: string;
}

export const SmartEditor: React.FC<SmartEditorProps> = ({
  enableCollaboration = false,
  ...props
}) => {
  // Use collaborative editor if collaboration is enabled and we have the required props
  const useCollaborative = enableCollaboration && props.documentId && props.userId;

  if (useCollaborative) {
    return <CollaborativeEditorContent {...props} enableCollaboration={true} />;
  }

  // Fall back to regular editor
  return <EditorContent value={props.value} onChange={props.onChange} />;
};