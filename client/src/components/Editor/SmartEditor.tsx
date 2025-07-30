import React from 'react';
import { CollaborativeEditorContent } from './components/CollaborativeEditorContent';
import { SimpleEditorContent } from './components/SimpleEditorContent';

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
  // Collaborative editor completely disabled to prevent WebSocket connections
  console.log('Collaborative editor disabled - using simple editor');

  // Always use the simple editor to prevent WebSocket connections
  return <SimpleEditorContent value={props.value} onChange={props.onChange} placeholder={props.placeholder} className={props.className} />;
};