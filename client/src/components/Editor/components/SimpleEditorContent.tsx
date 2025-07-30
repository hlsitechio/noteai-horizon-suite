import React, { useMemo, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import ElementRenderer from '../rendering/ElementRenderer';
import LeafRenderer from '../rendering/LeafRenderer';

interface SimpleEditorContentProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SimpleEditorContent: React.FC<SimpleEditorContentProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className = ""
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Convert string to Slate value
  const slateValue: Descendant[] = useMemo(() => {
    if (!value) {
      return [{ type: 'paragraph', children: [{ text: '' }] }];
    }
    
    // Simple conversion: split by newlines and create paragraphs
    const lines = value.split('\n');
    return lines.map(line => ({
      type: 'paragraph',
      children: [{ text: line }]
    }));
  }, [value]);

  // Convert Slate value back to string
  const handleChange = useCallback((newValue: Descendant[]) => {
    const text = newValue
      .map(node => {
        if ('children' in node) {
          return node.children
            .map(child => ('text' in child ? child.text : ''))
            .join('');
        }
        return '';
      })
      .join('\n');
    
    onChange(text);
  }, [onChange]);

  const renderElement = useCallback((props: any) => <ElementRenderer {...props} />, []);
  const renderLeaf = useCallback((props: any) => <LeafRenderer {...props} />, []);

  return (
    <div className={`relative ${className}`}>
      <Slate
        editor={editor}
        initialValue={slateValue}
        onChange={handleChange}
      >
        <Editable
          placeholder={placeholder}
          className="focus:outline-none min-h-[200px] p-4"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          style={{
            backgroundColor: 'transparent',
            fontSize: '16px',
            lineHeight: '1.6',
          }}
        />
      </Slate>
    </div>
  );
};