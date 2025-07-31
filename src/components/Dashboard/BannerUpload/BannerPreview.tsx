
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Video, X } from 'lucide-react';

interface BannerPreviewProps {
  selectedBanner: string;
  bannerType: 'image' | 'video';
  onReset: () => void;
}

const BannerPreview: React.FC<BannerPreviewProps> = ({
  selectedBanner,
  bannerType,
  onReset
}) => {
  return (
    <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
      <div className="flex justify-center mb-4">
        {bannerType === 'image' ? (
          <img
            src={selectedBanner}
            alt="Banner preview"
            className="max-w-full h-96 object-cover border rounded"
          />
        ) : (
          <video
            src={selectedBanner}
            className="max-w-full h-96 object-cover border rounded"
            controls
            muted
            preload="metadata"
            style={{ aspectRatio: '16/9' }}
            onError={(e) => {
              console.error('BannerUpload: Video preview error:', e);
            }}
            onLoadedMetadata={() => {
              // Development logging only
              if (import.meta.env.DEV) {
                console.log('BannerUpload: Video metadata loaded successfully');
              }
            }}
          >
            Your browser does not support video playback.
          </video>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {bannerType === 'image' ? (
            <>
              <ImageIcon className="w-4 h-4" />
              <span>Image Banner (1920x1080 recommended)</span>
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              <span>Video Banner (1920x1080 MP4)</span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          title="Remove File"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default BannerPreview;
