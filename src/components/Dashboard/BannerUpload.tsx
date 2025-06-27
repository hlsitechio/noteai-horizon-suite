
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { BannerStorageService } from '@/services/bannerStorage';
import { BannerUploadProps, BannerState } from './BannerUpload/types';
import { validateFile } from './BannerUpload/utils';
import BannerPreview from './BannerUpload/BannerPreview';
import FileSelector from './BannerUpload/FileSelector';

const BannerUpload: React.FC<BannerUploadProps> = ({ 
  currentBannerUrl,
  onBannerUpdate,
  onBannerDelete
}) => {
  const [state, setState] = useState<BannerState>({
    isOpen: false,
    selectedBanner: null,
    selectedFile: null,
    bannerType: 'image',
    isUploading: false,
    isDeleting: false,
    uploadError: null
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateState = (updates: Partial<BannerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateState({ uploadError: null });
    console.log('BannerUpload: File selected:', file.name, file.type, file.size);

    const validation = validateFile(file);
    
    if (!validation.isValid) {
      console.log('BannerUpload: File validation failed:', validation.error);
      toast.error(validation.error!);
      updateState({ uploadError: validation.error! });
      return;
    }

    updateState({ bannerType: validation.type!, selectedFile: file });
    console.log('BannerUpload: Banner type set to:', validation.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('BannerUpload: File read successfully, data URL length:', result.length);
      updateState({ selectedBanner: result });
    };
    reader.onerror = (e) => {
      console.error('BannerUpload: FileReader error:', e);
      toast.error('Failed to read file');
      updateState({ uploadError: 'Failed to read file' });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBanner = async () => {
    if (!state.selectedBanner || !state.selectedFile) {
      console.error('BannerUpload: No file selected - selectedBanner:', !!state.selectedBanner, 'selectedFile:', !!state.selectedFile);
      updateState({ uploadError: 'No file selected' });
      return;
    }

    console.log('BannerUpload: Starting upload process, type:', state.bannerType);
    updateState({ isUploading: true, uploadError: null });
    
    try {
      console.log('BannerUpload: Uploading file:', state.selectedFile.name, state.selectedFile.size, state.selectedFile.type);
      
      const bannerData = await BannerStorageService.uploadBanner(state.selectedFile, 'dashboard');
      
      if (bannerData) {
        console.log('BannerUpload: Upload successful:', bannerData);
        onBannerUpdate?.(bannerData.file_url, bannerData.file_type);
        updateState({ 
          isOpen: false, 
          selectedBanner: null, 
          selectedFile: null,
          uploadError: null 
        });
        toast.success('Banner uploaded successfully!');
      } else {
        console.error('BannerUpload: Upload returned null result');
        updateState({ uploadError: 'Upload failed. Please try again.' });
      }
    } catch (error) {
      console.error('BannerUpload: Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      updateState({ uploadError: `Upload failed: ${errorMessage}` });
      toast.error('Failed to update dashboard banner');
    } finally {
      updateState({ isUploading: false });
    }
  };

  const handleDeleteBanner = async () => {
    console.log('BannerUpload: Deleting banner');
    updateState({ isDeleting: true });
    try {
      const success = await BannerStorageService.deleteBanner('dashboard');
      if (success) {
        onBannerDelete?.();
        updateState({ isOpen: false });
        toast.success('Dashboard banner deleted successfully!');
      } else {
        toast.error('Failed to delete banner');
      }
    } catch (error) {
      console.error('BannerUpload: Delete error:', error);
      toast.error('Failed to delete banner');
    } finally {
      updateState({ isDeleting: false });
    }
  };

  const resetBanner = () => {
    console.log('BannerUpload: Resetting banner');
    updateState({ 
      selectedBanner: null, 
      selectedFile: null,
      bannerType: 'image', 
      uploadError: null 
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={state.isOpen} onOpenChange={(open) => updateState({ isOpen: open })}>
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
          <DialogDescription>
            Upload an image or video to personalize your dashboard banner. Images should be max 10MB and videos max 50MB in MP4 format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Error Display */}
          {state.uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{state.uploadError}</span>
            </div>
          )}
          
          {!state.selectedBanner ? (
            <FileSelector
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
              onDeleteBanner={handleDeleteBanner}
              currentBannerUrl={currentBannerUrl}
              isUploading={state.isUploading}
              isDeleting={state.isDeleting}
            />
          ) : (
            <div className="space-y-4">
              <BannerPreview
                selectedBanner={state.selectedBanner}
                bannerType={state.bannerType}
                onReset={resetBanner}
              />

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => updateState({ isOpen: false })}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUploadBanner} 
                  disabled={state.isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {state.isUploading ? 'Uploading...' : 'Update Banner'}
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
