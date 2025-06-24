
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
  RocketLaunchIcon,
  MicrophoneIcon,
  CameraIcon,
  BookmarkIcon,
  PencilIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import SpeechToText from './SpeechToText';
import OCRScreenCapture from './OCRScreenCapture';
import ImageUpload from './ImageUpload';

interface SmartToolbarProps {
  onFormatClick: (formatId: string, event: React.MouseEvent) => void;
  onAIClick: () => void;
  onSave: () => void;
  onTextInsert?: (text: string) => void;
  onImageInsert?: (imageData: string, width?: number, height?: number) => void;
  onFontChange?: (fontFamily: string, fontSize: number) => void;
  activeFormats: Set<string>;
  selectedText: string;
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
  activeFormats,
  selectedText,
  canSave = true,
  isSaving = false
}) => {
  const [showSpeechToText, setShowSpeechToText] = useState(false);
  const [showOCR, setShowOCR] = useState(false);
  const [fontSize, setFontSize] = useState([16]);
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

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
    if (onFontChange) {
      onFontChange(fontFamily, value[0]);
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    if (onFontChange) {
      onFontChange(family, fontSize[0]);
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

  const fontFamilies = [
    { value: 'inter', label: 'Inter' },
    { value: 'arial', label: 'Arial' },
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'times', label: 'Times New Roman' },
    { value: 'courier', label: 'Courier New' },
    { value: 'verdana', label: 'Verdana' },
  ];

  return (
    <>
      <div className="flex items-center gap-1 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-blue-200/50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border-slate-600/50">
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          {formatButtons.map(({ id, icon: Icon, title }) => (
            <Button
              key={id}
              variant={activeFormats.has(id) ? "default" : "ghost"}
              size="sm"
              title={title}
              onClick={(e) => onFormatClick(id, e)}
              className={`h-8 w-8 p-0 ${
                activeFormats.has(id) 
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                  : 'hover:bg-blue-100 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-blue-200 dark:bg-slate-500" />

        {/* Block Formatting */}
        <div className="flex items-center gap-1">
          {blockButtons.map(({ id, icon: Icon, title }) => (
            <Button
              key={id}
              variant={activeFormats.has(id) ? "default" : "ghost"}
              size="sm"
              title={title}
              onClick={(e) => onFormatClick(id, e)}
              className={`h-8 w-8 p-0 ${
                activeFormats.has(id) 
                  ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700' 
                  : 'hover:bg-purple-100 dark:hover:bg-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-purple-200 dark:bg-slate-500" />

        {/* Font Controls */}
        <div className="flex items-center gap-2">
          {/* Font Family */}
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <PencilIcon className="w-3 h-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs hover:bg-orange-100 dark:hover:bg-slate-600"
                title="Font Size"
              >
                <PencilIcon className="w-3 h-3 mr-1" />
                {fontSize[0]}px
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3 dark:bg-slate-800 dark:border-slate-600">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium dark:text-slate-200">Font Size</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">{fontSize[0]}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFontSizeChange([Math.max(8, fontSize[0] - 1)])}
                    className="h-6 w-6 p-0"
                  >
                    <MinusIcon className="w-3 h-3" />
                  </Button>
                  <Slider
                    value={fontSize}
                    onValueChange={handleFontSizeChange}
                    max={72}
                    min={8}
                    step={1}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFontSizeChange([Math.min(72, fontSize[0] + 1)])}
                    className="h-6 w-6 p-0"
                  >
                    <PlusIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-orange-200 dark:bg-slate-500" />

        {/* Media Tools */}
        <div className="flex items-center gap-1">
          <ImageUpload onImageInsert={handleImageInsert} />
          <Button
            variant="ghost"
            size="sm"
            title="Speech to Text"
            onClick={() => setShowSpeechToText(true)}
            className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 hover:text-green-700 dark:hover:bg-slate-600 dark:text-green-400"
          >
            <MicrophoneIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="OCR Screen Capture"
            onClick={() => setShowOCR(true)}
            className="h-8 w-8 p-0 hover:bg-purple-100 text-purple-600 hover:text-purple-700 dark:hover:bg-slate-600 dark:text-purple-400"
          >
            <CameraIcon className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-2 bg-green-200 dark:bg-slate-500" />

        {/* AI Assistant */}
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg transition-all"
              >
                <RocketLaunchIcon className="w-4 h-4 mr-1" />
                AI Assistant
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3 dark:bg-slate-800 dark:border-slate-600">
              <div className="space-y-2">
                <p className="text-sm font-medium dark:text-slate-200">AI Writing Assistant</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  {selectedText ? `Selected: "${selectedText.slice(0, 50)}..."` : 'Select text to get AI suggestions'}
                </p>
                <Button 
                  size="sm" 
                  onClick={onAIClick}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Open AI Assistant
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Save Note Button - moved after AI Assistant */}
          <Button
            onClick={onSave}
            disabled={!canSave || isSaving}
            size="sm"
            className="h-8 px-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <BookmarkIcon className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
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
