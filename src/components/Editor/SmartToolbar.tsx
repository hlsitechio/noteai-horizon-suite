
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
  NumberedListIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SpeechToText from './SpeechToText';
import OCRScreenCapture from './OCRScreenCapture';
import FormatButton from './toolbar/FormatButton';
import FontFamilySelector from './toolbar/FontFamilySelector';
import FontSizeControl from './toolbar/FontSizeControl';
import MediaToolsGroup from './toolbar/MediaToolsGroup';
import AIAssistantControl from './toolbar/AIAssistantControl';
import SaveButton from './toolbar/SaveButton';

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
      <div className="flex items-center gap-1 p-4 bg-black border-b border-gray-400/30">
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

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

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

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

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

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

        {/* Media Tools */}
        <MediaToolsGroup
          onImageInsert={handleImageInsert}
          onSpeechToTextOpen={() => setShowSpeechToText(true)}
          onOCROpen={() => setShowOCR(true)}
        />

        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-400/50" />

        {/* AI Assistant & Focus Mode */}
        <div className="flex items-center gap-2">
          <AIAssistantControl
            selectedText={selectedText}
            onAIClick={onAIClick}
          />

          {/* Focus Mode Button */}
          {onFocusModeToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFocusModeToggle}
              className="h-8 px-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border border-gray-400/30 shadow-md hover:shadow-lg transition-all"
              title="Enter Focus Mode (F11)"
            >
              <EyeIcon className="w-4 h-4 mr-1" />
              Focus
            </Button>
          )}

          {/* Save Note Button */}

        <SaveButton
            onSave={onSave}
            canSave={canSave}
            isSaving={isSaving}
          />
        </div>
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
