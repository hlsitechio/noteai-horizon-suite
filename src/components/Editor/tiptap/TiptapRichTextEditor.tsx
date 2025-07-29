import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTiptapEditor } from './hooks/useTiptapEditor';
import { useTiptapTextSelection } from './hooks/useTiptapTextSelection';
import { useTiptapFormatting } from './hooks/useTiptapFormatting';
import TiptapEditorContent from './components/TiptapEditorContent';

interface TiptapRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  onFocusModeToggle?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  placeholder?: string;
}

const TiptapRichTextEditor: React.FC<TiptapRichTextEditorProps> = ({
  value,
  onChange,
  onSave,
  onFocusModeToggle,
  canSave = true,
  isSaving = false,
  placeholder = "Start writing your masterpiece...",
}) => {
  // State management
  const [editorFontFamily, setEditorFontFamily] = useState('inter');
  const [editorFontSize, setEditorFontSize] = useState(16);
  const [images, setImages] = useState<Array<{
    id: string;
    src: string;
    width: number;
    height: number;
  }>>([]);

  // Refs for performance
  const previousValueRef = useRef(value);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Core editor hooks
  const {
    editor,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
  } = useTiptapEditor({ value, onChange, placeholder });

  const {
    selectedText,
    contextMenuPosition,
    handleTextSelection,
    handleContextMenuReplace,
    closeContextMenu,
  } = useTiptapTextSelection(editor);

  const {
    handleFormatClick,
    getActiveFormats,
    handleKeyboardShortcuts,
  } = useTiptapFormatting(editor);

  // Font handling
  const handleFontChange = useCallback((fontFamily: string, fontSize: number) => {
    setEditorFontFamily(fontFamily);
    setEditorFontSize(fontSize);
  }, []);

  const getFontFamilyStyle = useCallback((family: string) => {
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
  }, []);

  const editorStyle = useMemo(() => ({
    fontFamily: getFontFamilyStyle(editorFontFamily),
    fontSize: `${editorFontSize}px`,
  }), [editorFontFamily, editorFontSize, getFontFamilyStyle]);

  // Image handlers
  const handleImageInsert = useCallback((imageData: string, width = 300, height = 200) => {
    const newImage = {
      id: Date.now().toString(),
      src: imageData,
      width,
      height
    };
    setImages(prev => [...prev, newImage]);
  }, []);

  const handleImageRemove = useCallback((imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  }, []);

  const handleImageSizeChange = useCallback((imageId: string, width: number, height: number) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, width, height } : img
    ));
  }, []);

  // Debounced save function
  const handleOptimizedSave = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (onSave && value !== previousValueRef.current) {
        onSave();
        previousValueRef.current = value;
      }
    }, 500);
  }, [onSave, value]);

  return (
    <div className="h-full flex flex-col" style={editorStyle}>
      <TiptapEditorContent
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onSave={onSave}
        canSave={canSave}
        isSaving={isSaving}
        onFocusModeToggle={onFocusModeToggle}
        className="flex-1"
      />
    </div>
  );
};

export default TiptapRichTextEditor;