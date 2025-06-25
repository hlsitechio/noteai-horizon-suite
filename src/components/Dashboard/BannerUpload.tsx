
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

    // Check if it's an image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error('Please select an image or video file');
      return;
    }

    // Check file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${isVideo ? '50MB' : '10MB'}`);
      return;
    }

    // For MP4 videos, check if it's actually MP4
    if (isVideo && !file.type.includes('mp4')) {
      toast.error('Only MP4 videos are supported');
      return;
    }

    setBannerType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedBanner(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBanner = async () => {
    if (!selectedBanner) return;

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

      onBannerUpdate?.(selectedBanner, bannerType);
      setIsOpen(false);
      setSelectedBanner(null);
      toast.success('Dashboard banner updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to update dashboard banner');
    } finally {
      setIsUploading(false);
    }
  };

  const resetBanner = () => {
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Dashboard Banner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!selectedBanner ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/mp4"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex justify-center space-x-4 mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <Video className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Select a banner image or MP4 video for your dashboard</p>
              <p className="text-sm text-gray-500 mb-4">
                Images: Max 10MB • Videos: Max 50MB (MP4 only)
                <br />
                Recommended: 1200x400px for images
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
                      className="max-w-full h-48 object-cover border rounded"
                    />
                  ) : (
                    <video
                      src={selectedBanner}
                      className="max-w-full h-48 object-cover border rounded"
                      controls
                      muted
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
                        <span>Image Banner</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>Video Banner</span>
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
