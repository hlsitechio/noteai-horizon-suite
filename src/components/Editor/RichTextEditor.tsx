
import React, { useState } from 'react';
import SmartToolbar from './SmartToolbar';
import EditorContent from './components/EditorContent';
import ResizableImage from './ResizableImage';
import FloatingAIButton from '../AICopilot/FloatingAIButton';
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
  const [editorFontFamily, setEditorFontFamily] = useState('inter');
  const [editorFontSize, setEditorFontSize] = useState(16);
  const [images, setImages] = useState<Array<{
    id: string;
    src: string;
    width: number;
    height: number;
  }>>([]);
  const [showAIToggle, setShowAIToggle] = useState(false);

  // Custom hooks for editor functionality
  const {
    editor,
    slateValue,
    handleChange,
    handleTextInsert,
    handleAIReplace,
  } = useRichTextEditor({ value, onChange });

  const {
    selectedText,
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

  const handleSelect = () => {
    // Handle text selection for AI features
    console.log('Text selected in editor');
  };

  const handleAIToggle = () => {
    setShowAIToggle(!showAIToggle);
    console.log('AI toggle activated');
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
    <div className="glass rounded-2xl shadow-large overflow-hidden bg-white/10 backdrop-blur-lg dark:bg-slate-800/20 relative">
      <SmartToolbar
        onFormatClick={handleFormatClick}
        onSave={onSave || (() => {})}
        onTextInsert={handleTextInsert}
        onTextReplace={handleAIReplace}
        onImageInsert={handleImageInsert}
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
          onSelect={handleSelect}
          onKeyDown={handleKeyboardShortcuts}
          onAIToggle={handleAIToggle}
        />
        
        {/* Render images */}
        {images.length > 0 && (
          <div className="p-4 space-y-4">
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

      {/* Floating AI Assistant */}
      <FloatingAIButton
        onTextInsert={handleTextInsert}
      />
    </div>
  );
};

export default RichTextEditor;
