
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Video, X } from 'lucide-react';
import { toast } from 'sonner';

interface BannerUploadProps {
  currentBannerUrl?: string;
  onBannerUpdate?: (bannerUrl: string, type: 'image' | 'video') => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({ 
  currentBannerUrl,
  onBannerUpdate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('BannerUpload: File selected:', file.name, file.type, file.size);

    // Check if it's an image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    console.log('BannerUpload: File type check - isImage:', isImage, 'isVideo:', isVideo);

    if (!isImage && !isVideo) {
      console.log('BannerUpload: Invalid file type');
      toast.error('Please select an image or video file');
      return;
    }

    // Check file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log('BannerUpload: File too large:', file.size, 'max:', maxSize);
      toast.error(`File size must be less than ${isVideo ? '50MB' : '10MB'}`);
      return;
    }

    // For videos, check if it's MP4 - Fixed validation logic
    if (isVideo && !file.type.includes('mp4') && !file.name.toLowerCase().endsWith('.mp4')) {
      console.log('BannerUpload: Not MP4 format:', file.type);
      toast.error('Only MP4 videos are supported');
      return;
    }

    setBannerType(isVideo ? 'video' : 'image');
    console.log('BannerUpload: Banner type set to:', isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('BannerUpload: File read successfully, data URL length:', result.length);
      setSelectedBanner(result);
    };
    reader.onerror = (e) => {
      console.error('BannerUpload: FileReader error:', e);
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBanner = async () => {
    if (!selectedBanner) return;

    console.log('BannerUpload: Starting upload process, type:', bannerType);
    setIsUploading(true);
    try {
      // For now, we'll store the base64 banner in localStorage
      // In a production app, you'd want to upload to a storage service
      const bannerKey = 'dashboard_banner';
      const bannerData = {
        url: selectedBanner,
        type: bannerType,
        uploadedAt: new Date().toISOString()
      };
      
      localStorage.setItem(bannerKey, JSON.stringify(bannerData));
      console.log('BannerUpload: Banner saved to localStorage:', bannerData);

      onBannerUpdate?.(selectedBanner, bannerType);
      setIsOpen(false);
      setSelectedBanner(null);
      toast.success(`Dashboard ${bannerType} banner updated successfully!`);
    } catch (error) {
      console.error('BannerUpload: Upload error:', error);
      toast.error('Failed to update dashboard banner');
    } finally {
      setIsUploading(false);
    }
  };

  const resetBanner = () => {
    console.log('BannerUpload: Resetting banner');
    setSelectedBanner(null);
    setBannerType('image');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 border border-white/30"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Banner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Upload Dashboard Banner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!selectedBanner ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4,video/*"
                onChange={handleFileSelect}
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
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Banner Preview */}
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                <div className="flex justify-center mb-4">
                  {bannerType === 'image' ? (
                    <img
                      src={selectedBanner}
                      alt="Banner preview"
                      className="max-w-full h-64 object-cover border rounded"
                    />
                  ) : (
                    <video
                      src={selectedBanner}
                      className="max-w-full h-64 object-cover border rounded"
                      controls
                      muted
                      preload="metadata"
                      style={{ aspectRatio: '16/9' }}
                      onError={(e) => {
                        console.error('BannerUpload: Video preview error:', e);
                        toast.error('Video preview failed');
                      }}
                      onLoadedMetadata={() => {
                        console.log('BannerUpload: Video metadata loaded successfully');
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
                    onClick={resetBanner}
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUploadBanner} 
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? 'Uploading...' : 'Update Banner'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerUpload;
