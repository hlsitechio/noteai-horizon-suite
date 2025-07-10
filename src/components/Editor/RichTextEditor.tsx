
import React, { useState } from 'react';
import SmartToolbar from './SmartToolbar';
import TextSelectionContextMenu from './TextSelectionContextMenu';
import EditorContent from './components/EditorContent';
import ResizableImage from './ResizableImage';
import UnifiedAIAssistant from './AIAssistant';

import { useOptimizedRichTextEditor } from './hooks/useOptimizedRichTextEditor';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  onFocusModeToggle?: () => void;
  canSave?: boolean;
  isSaving?: boolean;
  cursorPosition?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Start writing something amazing...",
  onSave,
  onFocusModeToggle,
  canSave = true,
  isSaving = false,
  cursorPosition = 0
}) => {
  // Use the optimized hook for all editor functionality
  const {
    images,
    editor,
    slateValue,
    selectedText,
    contextMenuPosition,
    editorStyle,
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
    handleOptimizedSave,
  } = useOptimizedRichTextEditor({ value, onChange, onSave });

  return (
    <>
      <div className="rounded-2xl shadow-large overflow-hidden bg-black border border-silver/20">
        <SmartToolbar
          onFormatClick={handleFormatClick}
          onAIClick={() => {}} // AI is now always visible
          onSave={handleOptimizedSave}
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
            onAIToggle={() => {}} // AI is now always visible
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


      {/* AI Assistant popup removed - now always visible below editor controls */}
    </>
  );
};

export default RichTextEditor;
