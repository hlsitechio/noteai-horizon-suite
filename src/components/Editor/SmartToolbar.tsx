
import React, { useState } from 'react';
import { 
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  CodeBracketIcon,
  H1Icon,
  H2Icon,
  ChatBubbleLeftRightIcon,
  ListBulletIcon,
  NumberedListIcon
} from '@heroicons/react/24/outline';
import { Separator } from '@/components/ui/separator';
import SpeechToText from './SpeechToText';
import OCRScreenCapture from './OCRScreenCapture';
import FormatButton from './toolbar/FormatButton';
import FontFamilySelector from './toolbar/FontFamilySelector';
import FontSizeControl from './toolbar/FontSizeControl';
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

  const formatButtons = [
    { id: 'bold', icon: BoldIcon, title: 'Bold (Ctrl+B)' },
    { id: 'italic', icon: ItalicIcon, title: 'Italic (Ctrl+I)' },
    { id: 'underline', icon: UnderlineIcon, title: 'Underline (Ctrl+U)' },
    { id: 'code', icon: CodeBracketIcon, title: 'Code (Ctrl+`)' },
  ];

  const blockButtons = [
    { id: 'heading-one', icon: H1Icon, title: 'Heading 1' },
    { id: 'heading-two', icon: H2Icon, title: 'Heading 2' },
    { id: 'block-quote', icon: ChatBubbleLeftRightIcon, title: 'Quote' },
    { id: 'bulleted-list', icon: ListBulletIcon, title: 'Bullet List' },
    { id: 'numbered-list', icon: NumberedListIcon, title: 'Numbered List' },
  ];

  return (
    <>
      <div className="flex items-center gap-1 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-blue-200/50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-slate-600/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          {formatButtons.map(({ id, icon, title }) => (
            <FormatButton
              key={id}
              id={id}
              icon={icon}
              title={title}
              isActive={activeFormats.has(id)}
              onClick={onFormatClick}
              variant="text"
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-blue-200 dark:bg-slate-500" />

        {/* Block Formatting */}
        <div className="flex items-center gap-1">
          {blockButtons.map(({ id, icon, title }) => (
            <FormatButton
              key={id}
              id={id}
              icon={icon}
              title={title}
              isActive={activeFormats.has(id)}
              onClick={onFormatClick}
              variant="block"
            />
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-purple-200 dark:bg-slate-500" />

        {/* Font Controls */}
        <div className="flex items-center gap-2">
          <FontFamilySelector
            value={fontFamily}
            onChange={handleFontFamilyChange}
          />
          <FontSizeControl
            fontSize={fontSize}
            onChange={handleFontSizeChange}
          />
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-orange-200 dark:bg-slate-500" />

        {/* AI Assistant */}
        <AIAssistantToolbar
          selectedText={selectedText}
          onAIAction={handleAIAction}
          isLoading={isLoading}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-green-200 dark:bg-slate-500" />

        {/* Media Tools */}
        <MediaToolsGroup
          onImageInsert={handleImageInsert}
          onSpeechToTextOpen={() => setShowSpeechToText(true)}
          onOCROpen={() => setShowOCR(true)}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-pink-200 dark:bg-slate-500" />

        {/* Save Note Button */}
        <SaveButton
          onSave={onSave}
          canSave={canSave}
          isSaving={isSaving}
        />
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
