
import React, { useState } from 'react';
import SmartToolbar from './SmartToolbar';
import EnhancedAIAssistant from './EnhancedAIAssistant';
import TextSelectionContextMenu from './TextSelectionContextMenu';
import EditorContent from './components/EditorContent';
import ResizableImage from './ResizableImage';
import { useRichTextEditor } from './hooks/useRichTextEditor';
import { useTextSelection } from './hooks/useTextSelection';
import { useEditorFormatting } from './hooks/useEditorFormatting';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  onFocusModeToggle?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing something amazing...",
  onSave,
  onFocusModeToggle,
  canSave = true,
  isSaving = false
}) => {
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [editorFontFamily, setEditorFontFamily] = useState('inter');
  const [editorFontSize, setEditorFontSize] = useState(16);
  const [images, setImages] = useState<Array<{
    id: string;
    src: string;
    width: number;
    height: number;
  }>>([]);

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

  const handleImageInsert = (imageData: string, width = 300, height = 200) => {
    const newImage = {
      id: Date.now().toString(),
      src: imageData,
      width,
      height
    };
    setImages(prev => [...prev, newImage]);
  };

  const handleImageRemove = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleImageSizeChange = (imageId: string, width: number, height: number) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, width, height } : img
    ));
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
      <div className="rounded-2xl shadow-large overflow-hidden bg-black border border-silver/20">
        <SmartToolbar
          onFormatClick={handleFormatClick}
          onAIClick={() => setShowAIAssistant(true)}
          onSave={onSave || (() => {})}
          onTextInsert={handleTextInsert}
          onImageInsert={handleImageInsert}
          onFontChange={handleFontChange}
          onFocusModeToggle={onFocusModeToggle}
          activeFormats={getActiveFormats()}
          selectedText={selectedText}
          canSave={canSave}
          isSaving={isSaving}
        />

        <div style={editorStyle} className="bg-black">
          <EditorContent
            editor={editor}
            slateValue={slateValue}
            onChange={handleChange}
            placeholder={placeholder}
            onSelect={handleTextSelection}
            onKeyDown={handleKeyboardShortcuts}
            onAIToggle={() => setShowAIAssistant(true)}
          />
          
          {/* Render images */}
          {images.length > 0 && (
            <div className="p-4 space-y-4 bg-black">
              {images.map((image) => (
                <ResizableImage
                  key={image.id}
                  src={image.src}
                  initialWidth={image.width}
                  initialHeight={image.height}
                  onRemove={() => handleImageRemove(image.id)}
                  onSizeChange={(width, height) => handleImageSizeChange(image.id, width, height)}
                />
              ))}
            </div>
          )}
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
