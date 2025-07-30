import React, { useMemo, useEffect } from 'react';
import { Slate, Editable, ReactEditor } from 'slate-react';
import { withYjs, YjsEditor } from '@slate-yjs/core';

import { SlateValue } from '../types';
import { UserPresence, CursorOverlay } from '@/components/UserPresence';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useCollaborativeEditor } from '../hooks/useCollaborativeEditor';

interface CollaborativeEditorContentProps {
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

export const CollaborativeEditorContent: React.FC<CollaborativeEditorContentProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  documentId,
  userId,
  userName,
  enableCollaboration = false,
  onSelectionChange,
  className = ""
}) => {
  const {
    editor,
    slateValue,
    handleChange,
    setCursor,
    setSelection,
    isConnected,
    isCollaborative,
    collaborationEnabled
  } = useCollaborativeEditor({
    value,
    onChange,
    documentId,
    userId,
    userName,
    enabled: enableCollaboration
  });

  // Track selection changes for collaborative cursors
  useEffect(() => {
    const handleSelectionChange = () => {
      const { selection } = editor;
      if (selection && isCollaborative) {
        // Convert Slate selection to coordinates for cursor display
        try {
          const domRange = ReactEditor.toDOMRange(editor, selection);
          const rect = domRange.getBoundingClientRect();
          
          setCursor({
            x: rect.left,
            y: rect.top
          });
          
          setSelection(selection);
          onSelectionChange?.(selection);
        } catch (error) {
          // Ignore errors when converting selection
        }
      }
    };

    // Listen for selection changes
    const handleSlateChange = () => {
      handleSelectionChange();
    };

    if (isCollaborative) {
      document.addEventListener('selectionchange', handleSelectionChange);
    }

    return () => {
      if (isCollaborative) {
        document.removeEventListener('selectionchange', handleSelectionChange);
      }
    };
  }, [editor, isCollaborative, setCursor, setSelection, onSelectionChange]);

  // Get online users and cursors from YjsEditor if available
  const { onlineUsers, cursors } = useMemo(() => {
    if (!isCollaborative || !YjsEditor.isYjsEditor(editor)) {
      return { onlineUsers: [], cursors: [] };
    }

    try {
      // For now, return empty arrays - cursors will be handled by YjsCursors component
      return { onlineUsers: [], cursors: [] };
    } catch (error) {
      console.error('Error getting awareness data:', error);
    }

    return { onlineUsers: [], cursors: [] };
  }, [editor, isCollaborative]);

  return (
    <div className="relative">
      {/* Collaboration Status Bar */}
      {collaborationEnabled && (
        <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
          <ConnectionStatus 
            isConnected={isConnected}
            className="flex-1"
          />
          <UserPresence 
            users={onlineUsers}
            className="flex-shrink-0"
          />
        </div>
      )}

      {/* Editor Content */}
      <div className={`relative ${className}`}>
        <Slate
          editor={editor}
          initialValue={slateValue}
          onChange={handleChange}
        >
          <Editable
            placeholder={placeholder}
            className="focus:outline-none min-h-[200px] p-4"
            style={{
              backgroundColor: 'transparent',
              fontSize: '16px',
              lineHeight: '1.6',
            }}
          />
          
        </Slate>
      </div>
    </div>
  );
};