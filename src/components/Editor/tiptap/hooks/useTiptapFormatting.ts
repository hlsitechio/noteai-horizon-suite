import { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { FormattingCommand } from '../types';
import { executeCommand, isCommandActive } from '../utils/editorUtils';

export const useTiptapFormatting = (editor: Editor | null) => {
  const handleFormatClick = useCallback((command: FormattingCommand, event: React.MouseEvent) => {
    event.preventDefault();
    if (!editor) return;
    
    executeCommand(editor, command);
  }, [editor]);

  const getActiveFormats = useCallback((): Set<string> => {
    const formats = new Set<string>();
    
    if (!editor) return formats;

    const commands: FormattingCommand[] = [
      'bold', 'italic', 'underline', 'code',
      'heading1', 'heading2', 'blockquote',
      'bulletList', 'orderedList'
    ];

    commands.forEach(command => {
      if (isCommandActive(editor, command)) {
        formats.add(command);
      }
    });

    return formats;
  }, [editor]);

  const handleKeyboardShortcuts = useCallback((event: React.KeyboardEvent) => {
    if (!editor || (!event.ctrlKey && !event.metaKey)) return;

    switch (event.key) {
      case 'b': {
        event.preventDefault();
        executeCommand(editor, 'bold');
        break;
      }
      case 'i': {
        event.preventDefault();
        executeCommand(editor, 'italic');
        break;
      }
      case 'u': {
        event.preventDefault();
        executeCommand(editor, 'underline');
        break;
      }
      case '`': {
        event.preventDefault();
        executeCommand(editor, 'code');
        break;
      }
      case '1': {
        if (event.shiftKey) {
          event.preventDefault();
          executeCommand(editor, 'heading1');
        }
        break;
      }
      case '2': {
        if (event.shiftKey) {
          event.preventDefault();
          executeCommand(editor, 'heading2');
        }
        break;
      }
      case 'q': {
        event.preventDefault();
        executeCommand(editor, 'blockquote');
        break;
      }
    }
  }, [editor]);

  return {
    handleFormatClick,
    getActiveFormats,
    handleKeyboardShortcuts,
  };
};