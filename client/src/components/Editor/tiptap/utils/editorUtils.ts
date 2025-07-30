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

// Execute command on editor
export const executeCommand = (editor: Editor, command: FormattingCommand, options?: any): void => {
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
      editor.chain().focus().toggleCode().run();
      break;
    case 'heading1':
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      break;
    case 'heading2':
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      break;
    case 'heading3':
      editor.chain().focus().toggleHeading({ level: 3 }).run();
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
    case 'taskList':
      editor.chain().focus().toggleTaskList().run();
      break;
    case 'highlight':
      editor.chain().focus().toggleHighlight().run();
      break;
    case 'textColor':
      if (options?.color) {
        editor.chain().focus().setColor(options.color).run();
      }
      break;
    case 'alignLeft':
      editor.chain().focus().setTextAlign('left').run();
      break;
    case 'alignCenter':
      editor.chain().focus().setTextAlign('center').run();
      break;
    case 'alignRight':
      editor.chain().focus().setTextAlign('right').run();
      break;
    case 'alignJustify':
      editor.chain().focus().setTextAlign('justify').run();
      break;
    case 'insertLink':
      if (options?.href) {
        editor.chain().focus().setLink({ href: options.href }).run();
      }
      break;
    case 'insertImage':
      if (options?.src) {
        editor.chain().focus().setImage({ src: options.src }).run();
      }
      break;
    case 'insertYoutube':
      if (options?.src) {
        editor.chain().focus().setYoutubeVideo({ src: options.src }).run();
      }
      break;
    case 'insertCodeBlock':
      editor.chain().focus().insertContent('\n').setCodeBlock().run();
      break;
    case 'insertTable':
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      break;
    case 'deleteTable':
      editor.chain().focus().deleteTable().run();
      break;
    case 'addColumnBefore':
      editor.chain().focus().addColumnBefore().run();
      break;
    case 'addColumnAfter':
      editor.chain().focus().addColumnAfter().run();
      break;
    case 'deleteColumn':
      editor.chain().focus().deleteColumn().run();
      break;
    case 'addRowBefore':
      editor.chain().focus().addRowBefore().run();
      break;
    case 'addRowAfter':
      editor.chain().focus().addRowAfter().run();
      break;
    case 'deleteRow':
      editor.chain().focus().deleteRow().run();
      break;
    case 'mergeCells':
      editor.chain().focus().mergeCells().run();
      break;
    case 'splitCell':
      editor.chain().focus().splitCell().run();
      break;
    case 'toggleHeaderColumn':
      editor.chain().focus().toggleHeaderColumn().run();
      break;
    case 'toggleHeaderRow':
      editor.chain().focus().toggleHeaderRow().run();
      break;
    case 'toggleHeaderCell':
      editor.chain().focus().toggleHeaderCell().run();
      break;
    case 'textAlign':
      // This is a generic case, specific alignment should use specific commands
      break;
  }
};

// Check if command is active
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
      return editor.isActive('code');
    case 'heading1':
      return editor.isActive('heading', { level: 1 });
    case 'heading2':
      return editor.isActive('heading', { level: 2 });
    case 'heading3':
      return editor.isActive('heading', { level: 3 });
    case 'blockquote':
      return editor.isActive('blockquote');
    case 'bulletList':
      return editor.isActive('bulletList');
    case 'orderedList':
      return editor.isActive('orderedList');
    case 'taskList':
      return editor.isActive('taskList');
    case 'highlight':
      return editor.isActive('highlight');
    case 'textColor':
      return editor.isActive('textStyle');
    case 'alignLeft':
      return editor.isActive({ textAlign: 'left' });
    case 'alignCenter':
      return editor.isActive({ textAlign: 'center' });
    case 'alignRight':
      return editor.isActive({ textAlign: 'right' });
    case 'alignJustify':
      return editor.isActive({ textAlign: 'justify' });
    case 'insertLink':
      return editor.isActive('link');
    default:
      return false;
  }
};

// Mobile command mapping
export const getMobileCommandId = (command: FormattingCommand): string => {
  const mapping: Record<FormattingCommand, string> = {
    'bold': 'bold',
    'italic': 'italic', 
    'underline': 'underline',
    'code': 'code',
    'heading1': 'heading-one',
    'heading2': 'heading-two',
    'heading3': 'heading-three',
    'blockquote': 'blockquote',
    'bulletList': 'bulleted-list',
    'orderedList': 'numbered-list',
    'taskList': 'task-list',
    'highlight': 'highlight',
    'textColor': 'text-color',
    'textAlign': 'text-align',
    'alignLeft': 'align-left',
    'alignCenter': 'align-center',
    'alignRight': 'align-right',
    'alignJustify': 'align-justify',
    'insertLink': 'insert-link',
    'insertImage': 'insert-image',
    'insertYoutube': 'insert-youtube',
    'insertCodeBlock': 'insert-code-block',
    'insertTable': 'insert-table',
    'deleteTable': 'delete-table',
    'addColumnBefore': 'add-column-before',
    'addColumnAfter': 'add-column-after',
    'deleteColumn': 'delete-column',
    'addRowBefore': 'add-row-before',
    'addRowAfter': 'add-row-after',
    'deleteRow': 'delete-row',
    'mergeCells': 'merge-cells',
    'splitCell': 'split-cell',
    'toggleHeaderColumn': 'toggle-header-column',
    'toggleHeaderRow': 'toggle-header-row',
    'toggleHeaderCell': 'toggle-header-cell'
  };
  
  return mapping[command] || command;
};

export const getCommandFromMobileId = (mobileId: string): FormattingCommand | null => {
  const mapping: Record<string, FormattingCommand> = {
    'bold': 'bold',
    'italic': 'italic',
    'underline': 'underline',
    'code': 'code',
    'heading-one': 'heading1',
    'heading-two': 'heading2',
    'heading-three': 'heading3',
    'blockquote': 'blockquote',
    'bulleted-list': 'bulletList',
    'numbered-list': 'orderedList',
    'task-list': 'taskList',
    'highlight': 'highlight',
    'text-color': 'textColor',
    'text-align': 'textAlign',
    'align-left': 'alignLeft',
    'align-center': 'alignCenter',
    'align-right': 'alignRight',
    'align-justify': 'alignJustify',
    'insert-link': 'insertLink',
    'insert-image': 'insertImage',
    'insert-youtube': 'insertYoutube',
    'insert-code-block': 'insertCodeBlock',
    'insert-table': 'insertTable',
    'delete-table': 'deleteTable',
    'add-column-before': 'addColumnBefore',
    'add-column-after': 'addColumnAfter',
    'delete-column': 'deleteColumn',
    'add-row-before': 'addRowBefore',
    'add-row-after': 'addRowAfter',
    'delete-row': 'deleteRow',
    'merge-cells': 'mergeCells',
    'split-cell': 'splitCell',
    'toggle-header-column': 'toggleHeaderColumn',
    'toggle-header-row': 'toggleHeaderRow',
    'toggle-header-cell': 'toggleHeaderCell'
  };
  
  return mapping[mobileId] || null;
};