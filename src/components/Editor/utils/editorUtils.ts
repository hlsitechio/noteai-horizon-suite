import { Editor, Transforms, Element as SlateElement } from 'slate';
import { CustomText, CustomElement } from '../types';

// Helper functions for formatting
export const isMarkActive = (editor: Editor, format: keyof CustomText) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor: Editor, format: keyof CustomText) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (editor: Editor, format: CustomElement['type']) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as CustomElement).type === format,
    })
  );

  return !!match;
};

export const toggleBlock = (editor: Editor, format: CustomElement['type']) => {
  const isActive = isBlockActive(editor, format);
  const isList = format === 'numbered-list' || format === 'bulleted-list';

  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && ['numbered-list', 'bulleted-list'].includes((n as CustomElement).type),
    split: true,
  });

  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

export const parseInitialValue = (value: string) => {
  if (!value) {
    return [{ type: 'paragraph', children: [{ text: '' }] }];
  }
  
  try {
    // If it's already JSON, parse it
    if (value.startsWith('[') || value.startsWith('{')) {
      return JSON.parse(value);
    }
    // Otherwise, treat as plain text
    return [{ type: 'paragraph', children: [{ text: value }] }];
  } catch {
    // Fallback to plain text
    return [{ type: 'paragraph', children: [{ text: value }] }];
  }
};
