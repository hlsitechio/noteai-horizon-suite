
import React from 'react';
import { Button } from '@/components/ui/button';
import { MicrophoneIcon, CameraIcon } from '@heroicons/react/24/outline';
import ImageUpload from '../ImageUpload';

interface MediaToolsGroupProps {
  onImageInsert: (imageData: string, width?: number, height?: number) => void;
  onSpeechToTextOpen: () => void;
  onOCROpen: () => void;
}

const MediaToolsGroup: React.FC<MediaToolsGroupProps> = ({
  onImageInsert,
  onSpeechToTextOpen,
  onOCROpen
}) => {
  return (
    <div className="flex items-center gap-1">
      <ImageUpload onImageInsert={onImageInsert} />
      <Button
        variant="ghost"
        size="sm"
        title="Speech to Text"
        onClick={onSpeechToTextOpen}
        className="h-8 w-8 p-0 hover:bg-green-100 text-green-600 hover:text-green-700 dark:hover:bg-slate-600 dark:text-green-400"
      >
        <MicrophoneIcon className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="OCR Screen Capture"
        onClick={onOCROpen}
        className="h-8 w-8 p-0 hover:bg-purple-100 text-purple-600 hover:text-purple-700 dark:hover:bg-slate-600 dark:text-purple-400"
      >
        <CameraIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default MediaToolsGroup;
