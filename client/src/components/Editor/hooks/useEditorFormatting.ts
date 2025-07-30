
import React, { useCallback } from 'react';
import { Editor, Element as SlateElement } from 'slate';
import { CustomText, CustomElement } from '../types';
import { toggleMark, toggleBlock } from '../utils/editorUtils';

export const useEditorFormatting = (editor: Editor) => {
  const handleFormatClick = useCallback((formatId: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    const textFormats = ['bold', 'italic', 'underline', 'code'];
    const blockFormats = ['heading-one', 'heading-two', 'block-quote', 'numbered-list', 'bulleted-list'];
    
    if (textFormats.includes(formatId)) {
      toggleMark(editor, formatId as keyof CustomText);
    } else if (blockFormats.includes(formatId)) {
      toggleBlock(editor, formatId as CustomElement['type']);
    }
  }, [editor]);

  const getActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    
    // Check text formatting
    const marks = Editor.marks(editor);
    if (marks) {
      Object.keys(marks).forEach(mark => {
        if (marks[mark]) formats.add(mark);
      });
    }
    
    // Check block formatting
    const { selection } = editor;
    if (selection) {
      const [match] = Array.from(
        Editor.nodes(editor, {
          at: Editor.unhangRange(editor, selection),
          match: n => !Editor.isEditor(n) && SlateElement.isElement(n),
        })
      );
      
      if (match) {
        const [node] = match;
        const element = node as CustomElement;
        formats.add(element.type);
      }
    }
    
    return formats;
  }, [editor]);

  const handleKeyboardShortcuts = useCallback((event: React.KeyboardEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;

    switch (event.key) {
      case 'b': {
        event.preventDefault();
        toggleMark(editor, 'bold');
        break;
      }
      case 'i': {
        event.preventDefault();
        toggleMark(editor, 'italic');
        break;
      }
      case 'u': {
        event.preventDefault();
        toggleMark(editor, 'underline');
        break;
      }
      case '`': {
        event.preventDefault();
        toggleMark(editor, 'code');
        break;
      }
      case '1': {
        if (event.shiftKey) {
          event.preventDefault();
          toggleBlock(editor, 'heading-one');
        }
        break;
      }
      case '2': {
        if (event.shiftKey) {
          event.preventDefault();
          toggleBlock(editor, 'heading-two');
        }
        break;
      }
      case 'q': {
        event.preventDefault();
        toggleBlock(editor, 'block-quote');
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
