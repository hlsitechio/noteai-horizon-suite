
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import SpeechToText from './SpeechToText';
import OCRScreenCapture from './OCRScreenCapture';
import TextFormattingGroup from './toolbar/TextFormattingGroup';
import BlockFormattingGroup from './toolbar/BlockFormattingGroup';
import FontControlsGroup from './toolbar/FontControlsGroup';
import MediaToolsGroup from './toolbar/MediaToolsGroup';
import ToolbarActionsGroup from './toolbar/ToolbarActionsGroup';
import UnifiedAIAssistant from './AIAssistant';

interface SmartToolbarProps {
  onFormatClick: (formatId: string, event: React.MouseEvent) => void;
  onAIClick: () => void;
  onSave: () => void;
  onTextInsert?: (text: string) => void;
  onImageInsert?: (imageData: string, width?: number, height?: number) => void;
  onFontChange?: (fontFamily: string, fontSize: number) => void;
  onFocusModeToggle?: () => void;
  activeFormats: Set<string>;
  
  selectedText?: string;
  canSave?: boolean;
  isSaving?: boolean;
}

const SmartToolbar: React.FC<SmartToolbarProps> = ({ 
  onFormatClick, 
  onAIClick,
  onSave,
  onTextInsert,
  onImageInsert,
  onFontChange,
  onFocusModeToggle,
  activeFormats,
  
  selectedText,
  canSave = true,
  isSaving = false
}) => {
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [showAIBar, setShowAIBar] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('inter');

  const handleTextReceived = (text: string) => {
    if (onTextInsert) {
      onTextInsert(text);
    }
  };

  const handleImageInsert = (imageData: string, width?: number, height?: number) => {
    if (onImageInsert) {
      onImageInsert(imageData, width, height);
    }
  };

  const handleFontSizeChange = (newFontSize: number) => {
    setFontSize(newFontSize);
    if (onFontChange) {
      onFontChange(fontFamily, newFontSize);
    }
  };

  const handleFontFamilyChange = (newFontFamily: string) => {
    setFontFamily(newFontFamily);
    if (onFontChange) {
      onFontChange(newFontFamily, fontSize);
    }
  };

  const handleAIProcess = (action: string, customInstruction?: string) => {
    // Handle AI processing logic here
    console.log('AI Action:', action, customInstruction);
    // You can integrate this with your existing AI functionality
    onAIClick();
  };


  return (
    <>
      <div className="flex items-center gap-1 p-4 bg-black border-b border-gray-400/30">
        {/* Text Formatting */}
        <TextFormattingGroup
          onFormatClick={onFormatClick}
          activeFormats={activeFormats}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

        {/* Block Formatting */}
        <BlockFormattingGroup
          onFormatClick={onFormatClick}
          activeFormats={activeFormats}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

        {/* Font Controls */}
        <FontControlsGroup
          fontFamily={fontFamily}
          fontSize={fontSize}
          onFontFamilyChange={handleFontFamilyChange}
          onFontSizeChange={handleFontSizeChange}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

        {/* Media Tools */}
        <MediaToolsGroup
          onImageInsert={handleImageInsert}
          onSpeechToTextOpen={() => setShowSpeechToText(true)}
          onOCROpen={() => setShowOCR(true)}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

        {/* AI Assistant & Actions */}
        <ToolbarActionsGroup
          onAIClick={() => setShowAIBar(!showAIBar)}
          onFocusModeToggle={onFocusModeToggle}
          onSave={onSave}
          canSave={canSave}
          isSaving={isSaving}
        />
      </div>

      {/* AI Assistant Bar */}
      <UnifiedAIAssistant
        selectedText={selectedText || ''}
        onTextInsert={onTextInsert || (() => {})}
        onTextReplace={(text) => onTextInsert?.(text)}
        isVisible={showAIBar}
        onClose={() => setShowAIBar(false)}
        mode="bar"
      />

      {/* Speech to Text Modal */}
      <SpeechToText
        isVisible={showSpeechToText}
        onClose={() => setShowSpeechToText(false)}
        onTextReceived={handleTextReceived}
      />

      {/* OCR Screen Capture Modal */}
      <OCRScreenCapture
        isVisible={showOCR}
        onClose={() => setShowOCR(false)}
        onTextReceived={handleTextReceived}
      />
    </>
  );
};

export default SmartToolbar;
