
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ImageIcon, Video, Trash2 } from 'lucide-react';

interface FileSelectorProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteBanner?: () => void;
  currentBannerUrl?: string;
  isUploading: boolean;
  isDeleting: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  fileInputRef,
  onFileSelect,
  onDeleteBanner,
  currentBannerUrl,
  isUploading,
  isDeleting
}) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/mp4,video/*"
        onChange={onFileSelect}
        className="hidden"
      />
      <div className="flex justify-center space-x-4 mb-4">
        <ImageIcon className="w-8 h-8 text-gray-400" />
        <Video className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-600 mb-4">Select a banner image or MP4 video for your dashboard</p>
      <p className="text-sm text-gray-500 mb-4">
        Images: Max 10MB • Videos: Max 50MB (MP4 format)
        <br />
        Recommended: 1920x1080px for optimal quality
      </p>
      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </Button>
        {currentBannerUrl && onDeleteBanner && (
          <Button
            onClick={onDeleteBanner}
            disabled={isDeleting}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Current'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileSelector;
