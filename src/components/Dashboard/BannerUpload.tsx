
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, Video, X, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BannerStorageService } from '@/services/bannerStorageService';

interface BannerUploadProps {
  currentBannerUrl?: string;
  onBannerUpdate?: (bannerUrl: string, type: 'image' | 'video') => void;
  onBannerDelete?: () => void;
}

const BannerUpload: React.FC<BannerUploadProps> = ({ 
  currentBannerUrl,
  onBannerUpdate,
  onBannerDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<'image' | 'video'>('image');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    console.log('BannerUpload: File selected:', file.name, file.type, file.size);

    // Check if it's an image or video
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    console.log('BannerUpload: File type check - isImage:', isImage, 'isVideo:', isVideo);

    if (!isImage && !isVideo) {
      console.log('BannerUpload: Invalid file type');
      toast.error('Please select an image or video file');
      setUploadError('Please select an image or video file');
      return;
    }

    // Check file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      console.log('BannerUpload: File too large:', file.size, 'max:', maxSize);
      const maxSizeText = isVideo ? '50MB' : '10MB';
      toast.error(`File size must be less than ${maxSizeText}`);
      setUploadError(`File size must be less than ${maxSizeText}`);
      return;
    }

    // For videos, check if it's MP4
    if (isVideo && !file.type.includes('mp4') && !file.name.toLowerCase().endsWith('.mp4')) {
      console.log('BannerUpload: Not MP4 format:', file.type);
      toast.error('Only MP4 videos are supported');
      setUploadError('Only MP4 videos are supported');
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
      setUploadError('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBanner = async () => {
    if (!selectedBanner || !fileInputRef.current?.files?.[0]) {
      setUploadError('No file selected');
      return;
    }

    console.log('BannerUpload: Starting upload process, type:', bannerType);
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const file = fileInputRef.current.files[0];
      console.log('BannerUpload: Uploading file:', file.name, file.size, file.type);
      
      const bannerData = await BannerStorageService.uploadBanner(file, 'dashboard');
      
      if (bannerData) {
        console.log('BannerUpload: Upload successful:', bannerData);
        onBannerUpdate?.(bannerData.file_url, bannerData.file_type);
        setIsOpen(false);
        setSelectedBanner(null);
        setUploadError(null);
        // Success toast is now handled in the service
      } else {
        setUploadError('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('BannerUpload: Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadError(`Upload failed: ${errorMessage}`);
      toast.error('Failed to update dashboard banner');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async () => {
    console.log('BannerUpload: Deleting banner');
    setIsDeleting(true);
    try {
      const success = await BannerStorageService.deleteBanner('dashboard');
      if (success) {
        onBannerDelete?.();
        setIsOpen(false);
        toast.success('Dashboard banner deleted successfully!');
      } else {
        toast.error('Failed to delete banner');
      }
    } catch (error) {
      console.error('BannerUpload: Delete error:', error);
      toast.error('Failed to delete banner');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetBanner = () => {
    console.log('BannerUpload: Resetting banner');
    setSelectedBanner(null);
    setBannerType('image');
    setUploadError(null);
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
          className="text-white hover:bg-white/20 border border-white/30 bg-black/20 backdrop-blur-sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          {currentBannerUrl ? 'Update Banner' : 'Upload Banner'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Dashboard Banner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Error Display */}
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
          
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
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                {currentBannerUrl && (
                  <Button
                    onClick={handleDeleteBanner}
                    disabled={isDeleting}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete Current'}
                  </Button>
                )}
              </div>
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
                        setUploadError('Video preview failed');
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
