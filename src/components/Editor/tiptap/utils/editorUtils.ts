import { Editor } from '@tiptap/core';
import { FormattingCommand } from '../types';

export const parseInitialValue = (value: string): string => {
  if (!value) return '';
  
  try {
    // If it's JSON from Slate, convert to plain text
    if (value.startsWith('[') || value.startsWith('{')) {
      const parsed = JSON.parse(value);
      return extractTextFromSlateValue(parsed);
    }
    return value;
  } catch {
    return value;
  }
};

export const extractTextFromSlateValue = (slateValue: any[]): string => {
  if (!Array.isArray(slateValue)) return '';
  
  return slateValue
    .map(node => {
      if (node.children) {
        return node.children
          .map((child: any) => child.text || '')
          .join('');
      }
      return '';
    })
    .join('\n');
};

export const executeCommand = (editor: Editor, command: FormattingCommand) => {
  if (!editor) return;

  switch (command) {
    case 'bold':
      editor.chain().focus().toggleBold().run();
      break;
    case 'italic':
      editor.chain().focus().toggleItalic().run();
      break;
    case 'underline':
      editor.chain().focus().toggleUnderline().run();
      break;
    case 'code':
      editor.chain().focus().toggleCodeBlock().run();
      break;
    case 'heading1':
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      break;
    case 'heading2':
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      break;
    case 'blockquote':
      editor.chain().focus().toggleBlockquote().run();
      break;
    case 'bulletList':
      editor.chain().focus().toggleBulletList().run();
      break;
    case 'orderedList':
      editor.chain().focus().toggleOrderedList().run();
      break;
  }
};

export const isCommandActive = (editor: Editor, command: FormattingCommand): boolean => {
  if (!editor) return false;

  switch (command) {
    case 'bold':
      return editor.isActive('bold');
    case 'italic':
      return editor.isActive('italic');
    case 'underline':
      return editor.isActive('underline');
    case 'code':
      return editor.isActive('codeBlock');
    case 'heading1':
      return editor.isActive('heading', { level: 1 });
    case 'heading2':
      return editor.isActive('heading', { level: 2 });
    case 'blockquote':
      return editor.isActive('blockquote');
    case 'bulletList':
      return editor.isActive('bulletList');
    case 'orderedList':
      return editor.isActive('orderedList');
    default:
      return false;
  }
};