
import React, { useState } from 'react';
import SpeechToText from './SpeechToText';
import OCRScreenCapture from './OCRScreenCapture';
import ToolbarSection from './toolbar/ToolbarSection';
import TextFormattingSection from './toolbar/TextFormattingSection';
import BlockFormattingSection from './toolbar/BlockFormattingSection';
import FontControlsSection from './toolbar/FontControlsSection';
import MediaToolsGroup from './toolbar/MediaToolsGroup';
import SaveButton from './toolbar/SaveButton';
import AIAssistantToolbar from './toolbar/AIAssistantToolbar';
import { useAICopilot } from '@/hooks/useAICopilot';
import { toast } from 'sonner';

interface SmartToolbarProps {
  onFormatClick: (formatId: string, event: React.MouseEvent) => void;
  onSave: () => void;
  onTextInsert?: (text: string) => void;
  onTextReplace?: (text: string) => void;
  onImageInsert?: (imageData: string, width?: number, height?: number) => void;
  onFontChange?: (fontFamily: string, fontSize: number) => void;
  activeFormats: Set<string>;
  selectedText: string;
  canSave?: boolean;
  isSaving?: boolean;
}

const SmartToolbar: React.FC<SmartToolbarProps> = ({ 
  onFormatClick, 
  onSave,
  onTextInsert,
  onTextReplace,
  onImageInsert,
  onFontChange,
  activeFormats,
  selectedText,
  canSave = true,
  isSaving = false
}) => {
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('inter');
  const { processText, isLoading } = useAICopilot();

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

  const handleAIAction = async (action: string) => {
    if (!selectedText.trim()) {
      toast.error('Please select some text first');
      return;
    }

    try {
      const response = await processText({
        action: action as any,
        text: selectedText,
      });
      
      if (onTextReplace) {
        onTextReplace(response.result);
        toast.success(`Text ${action}d successfully!`);
      }
    } catch (error) {
      console.error('AI processing error:', error);
      toast.error('Failed to process text');
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-blue-200/50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-slate-600/50">
        {/* Text Formatting */}
        <ToolbarSection separatorColor="bg-blue-200 dark:bg-slate-500">
          <TextFormattingSection
            onFormatClick={onFormatClick}
            activeFormats={activeFormats}
          />
        </ToolbarSection>

        {/* Block Formatting */}
        <ToolbarSection separatorColor="bg-purple-200 dark:bg-slate-500">
          <BlockFormattingSection
            onFormatClick={onFormatClick}
            activeFormats={activeFormats}
          />
        </ToolbarSection>

        {/* Font Controls */}
        <ToolbarSection separatorColor="bg-orange-200 dark:bg-slate-500">
          <FontControlsSection
            fontFamily={fontFamily}
            fontSize={fontSize}
            onFontFamilyChange={handleFontFamilyChange}
            onFontSizeChange={handleFontSizeChange}
          />
        </ToolbarSection>

        {/* AI Assistant */}
        <ToolbarSection separatorColor="bg-green-200 dark:bg-slate-500">
          <AIAssistantToolbar
            selectedText={selectedText}
            onAIAction={handleAIAction}
            isLoading={isLoading}
          />
        </ToolbarSection>

        {/* Media Tools */}
        <ToolbarSection separatorColor="bg-pink-200 dark:bg-slate-500">
          <MediaToolsGroup
            onImageInsert={handleImageInsert}
            onSpeechToTextOpen={() => setShowSpeechToText(true)}
            onOCROpen={() => setShowOCR(true)}
          />
        </ToolbarSection>

        {/* Save Note Button */}
        <ToolbarSection showSeparator={false}>
          <SaveButton
            onSave={onSave}
            canSave={canSave}
            isSaving={isSaving}
          />
        </ToolbarSection>
      </div>

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
