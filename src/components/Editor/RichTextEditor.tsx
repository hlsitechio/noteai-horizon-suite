
import React, { useState } from 'react';
import SmartToolbar from './SmartToolbar';
import EnhancedAIAssistant from './EnhancedAIAssistant';
import TextSelectionContextMenu from './TextSelectionContextMenu';
import EditorContent from './components/EditorContent';
import { useRichTextEditor } from './hooks/useRichTextEditor';
import { useTextSelection } from './hooks/useTextSelection';
import { useEditorFormatting } from './hooks/useEditorFormatting';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing something amazing...",
  onSave,
  canSave = true,
  isSaving = false
}) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [editorFontFamily, setEditorFontFamily] = useState('inter');
  const [editorFontSize, setEditorFontSize] = useState(16);

  // Custom hooks for editor functionality
  const {
    editor,
    slateValue,
    handleChange,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
  } = useRichTextEditor({ value, onChange });

  const {
    selectedText,
    assistantPosition,
    contextMenuPosition,
    handleTextSelection,
    handleContextMenuReplace,
    closeContextMenu,
  } = useTextSelection(editor);

  const {
    handleFormatClick,
    getActiveFormats,
    handleKeyboardShortcuts,
  } = useEditorFormatting(editor);

  const handleFontChange = (fontFamily: string, fontSize: number) => {
    setEditorFontFamily(fontFamily);
    setEditorFontSize(fontSize);
  };

  const getFontFamilyStyle = (family: string) => {
    const fontMap: Record<string, string> = {
      'inter': 'Inter, system-ui, sans-serif',
      'arial': 'Arial, sans-serif',
      'helvetica': 'Helvetica, Arial, sans-serif',
      'georgia': 'Georgia, serif',
      'times': '"Times New Roman", serif',
      'courier': '"Courier New", monospace',
      'verdana': 'Verdana, sans-serif',
    };
    return fontMap[family] || fontMap['inter'];
  };

  const editorStyle = {
    fontFamily: getFontFamilyStyle(editorFontFamily),
    fontSize: `${editorFontSize}px`,
  };

  return (
    <>
      <div className="glass rounded-2xl shadow-large overflow-hidden bg-white/10 backdrop-blur-lg dark:bg-slate-800/20">
        <SmartToolbar
          onFormatClick={handleFormatClick}
          onAIClick={() => setShowAIAssistant(true)}
          onSave={onSave || (() => {})}
          onTextInsert={handleTextInsert}
          onFontChange={handleFontChange}
          activeFormats={getActiveFormats()}
          selectedText={selectedText}
          canSave={canSave}
          isSaving={isSaving}
        />

        <div style={editorStyle}>
          <EditorContent
            editor={editor}
            slateValue={slateValue}
            onChange={handleChange}
            placeholder={placeholder}
            onSelect={handleTextSelection}
            onKeyDown={handleKeyboardShortcuts}
            onAIToggle={() => setShowAIAssistant(true)}
          />
        </div>
      </div>

      {/* Context Menu for Text Selection */}
      <TextSelectionContextMenu
        selectedText={selectedText}
        onTextReplace={handleContextMenuReplace}
        onTextInsert={handleAIInsert}
        position={contextMenuPosition}
        onClose={closeContextMenu}
      />

      <EnhancedAIAssistant
        selectedText={selectedText}
        onTextInsert={handleAIInsert}
        onTextReplace={handleAIReplace}
        isVisible={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        position={assistantPosition}
      />
    </>
  );
};

export default RichTextEditor;
