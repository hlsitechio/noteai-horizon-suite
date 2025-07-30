import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useRichTextEditor } from './useRichTextEditor';
import { useTextSelection } from './useTextSelection';
import { useEditorFormatting } from './useEditorFormatting';

interface UseOptimizedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
}

export const useOptimizedRichTextEditor = ({
  value,
  onChange,
  onSave
}: UseOptimizedRichTextEditorProps) => {
  // State management with optimized updates
  // Removed showAIAssistant state - AI is now always visible
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
    slateValue,
    handleChange,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
  } = useRichTextEditor({ value, onChange });

  const {
    selectedText,
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

  // Optimized font change handler
  const handleFontChange = useCallback((fontFamily: string, fontSize: number) => {
    setEditorFontFamily(fontFamily);
    setEditorFontSize(fontSize);
  }, []);

  // Memoized font family style
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

  // Memoized editor style
  const editorStyle = useMemo(() => ({
    fontFamily: getFontFamilyStyle(editorFontFamily),
    fontSize: `${editorFontSize}px`,
  }), [editorFontFamily, editorFontSize, getFontFamilyStyle]);

  // Optimized image handlers
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

  // AI Assistant handlers removed - AI is now always visible below editor controls

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

  return {
    // State (removed showAIAssistant - AI is now always visible)
    editorFontFamily,
    editorFontSize,
    images,
    
    // Editor hooks
    editor,
    slateValue,
    selectedText,
    contextMenuPosition,
    
    // Styles
    editorStyle,
    
    // Handlers
    handleChange,
    handleTextInsert,
    handleAIInsert,
    handleAIReplace,
    handleTextSelection,
    handleContextMenuReplace,
    closeContextMenu,
    handleFormatClick,
    getActiveFormats,
    handleKeyboardShortcuts,
    handleFontChange,
    handleImageInsert,
    handleImageRemove,
    handleImageSizeChange,
    
    // Removed AI toggle/close handlers - AI is now always visible
    handleOptimizedSave,
  };
};