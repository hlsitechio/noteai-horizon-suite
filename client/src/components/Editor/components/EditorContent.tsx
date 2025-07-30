
import React, { useCallback } from 'react';
import { Slate, Editable, ReactEditor } from 'slate-react';
import { SlateValue } from '../types';
import ElementRenderer from '../rendering/ElementRenderer';
import LeafRenderer from '../rendering/LeafRenderer';

interface EditorContentProps {
  editor: ReactEditor;
  slateValue: SlateValue;
  onChange: (value: any[]) => void;
  placeholder: string;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onAIToggle: () => void;
}

const EditorContent: React.FC<EditorContentProps> = ({
  editor,
  slateValue,
  onChange,
  placeholder,
  onSelect,
  onKeyDown,
  onAIToggle,
}) => {
  const renderElement = useCallback((props: any) => <ElementRenderer {...props} />, []);
  const renderLeaf = useCallback((props: any) => <LeafRenderer {...props} />, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    onKeyDown(event);
    
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault();
      onAIToggle();
    }
  }, [onKeyDown, onAIToggle]);

  return (
    <div className="editor-content p-8 min-h-[500px] max-h-[700px] overflow-y-auto bg-slate-900">
      <Slate editor={editor} initialValue={slateValue} onValueChange={onChange}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          className="focus:outline-none prose prose-lg max-w-none text-slate-100 leading-relaxed placeholder:text-slate-400 [&_*]:text-slate-100"
          spellCheck
          onSelect={onSelect}
          onKeyDown={handleKeyDown}
        />
      </Slate>
    </div>
  );
};

export default EditorContent;
