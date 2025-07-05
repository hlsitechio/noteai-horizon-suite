
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { BannerStorageService } from '@/services/bannerStorage';
import { useDynamicAccent } from '../../contexts/DynamicAccentContext';
import { BannerUploadProps, BannerState } from './BannerUpload/types';
import { validateFile } from './BannerUpload/utils';
import BannerPreview from './BannerUpload/BannerPreview';
import FileSelector from './BannerUpload/FileSelector';
import { logger } from '../../utils/logger';

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
  
  const { extractColorFromMedia, isDynamicAccentEnabled, isExtracting } = useDynamicAccent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateState = (updates: Partial<BannerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    updateState({ uploadError: null });
    logger.debug('BANNER', 'File selected:', file.name, file.type, file.size);

    const validation = validateFile(file);
    
    if (!validation.isValid) {
      logger.debug('BANNER', 'File validation failed:', validation.error);
      toast.error(validation.error!);
      updateState({ uploadError: validation.error! });
      return;
    }

    updateState({ bannerType: validation.type!, selectedFile: file });
    logger.debug('BANNER', 'Banner type set to:', validation.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      logger.debug('BANNER', 'File read successfully, data URL length:', result.length);
      updateState({ selectedBanner: result });
      
      // Extract color from the selected file if dynamic accent is enabled
      if (isDynamicAccentEnabled) {
        logger.debug('BANNER', 'Extracting color from selected file');
        extractColorFromMedia(file).catch(error => {
          logger.error('BANNER', 'Color extraction failed:', error);
        });
      }
    };
    reader.onerror = (e) => {
      logger.error('BANNER', 'FileReader error:', e);
      toast.error('Failed to read file');
      updateState({ uploadError: 'Failed to read file' });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBanner = async () => {
    if (!state.selectedBanner || !state.selectedFile) {
      logger.error('BANNER', 'No file selected - selectedBanner:', !!state.selectedBanner, 'selectedFile:', !!state.selectedFile);
      updateState({ uploadError: 'No file selected' });
      return;
    }

    logger.debug('BANNER', 'Starting upload process, type:', state.bannerType);
    updateState({ isUploading: true, uploadError: null });
    
    try {
      logger.debug('BANNER', 'Uploading file:', state.selectedFile.name, state.selectedFile.size, state.selectedFile.type);
      
      const bannerData = await BannerStorageService.uploadBanner(state.selectedFile, 'dashboard');
      
      if (bannerData) {
        logger.debug('BANNER', 'Upload successful:', bannerData);
        onBannerUpdate?.(bannerData.file_url, bannerData.file_type);
        
        // Extract color from the uploaded banner URL if dynamic accent is enabled
        if (isDynamicAccentEnabled) {
          logger.debug('BANNER', 'Extracting color from uploaded banner');
          try {
            await extractColorFromMedia(bannerData.file_url);
            toast.success('Banner uploaded and accent color updated!');
          } catch (error) {
            logger.error('BANNER', 'Color extraction from uploaded banner failed:', error);
            toast.success('Banner uploaded successfully!');
          }
        } else {
          toast.success('Banner uploaded successfully!');
        }
        
        updateState({ 
          isOpen: false, 
          selectedBanner: null, 
          selectedFile: null,
          uploadError: null 
        });
      } else {
        logger.error('BANNER', 'Upload returned null result');
        updateState({ uploadError: 'Upload failed. Please try again.' });
      }
    } catch (error) {
      logger.error('BANNER', 'Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      updateState({ uploadError: `Upload failed: ${errorMessage}` });
      toast.error('Failed to update dashboard banner');
    } finally {
      updateState({ isUploading: false });
    }
  };

  const handleDeleteBanner = async () => {
    logger.debug('BANNER', 'Deleting banner');
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
      logger.error('BANNER', 'Delete error:', error);
      toast.error('Failed to delete banner');
    } finally {
      updateState({ isDeleting: false });
    }
  };

  const resetBanner = () => {
    logger.debug('BANNER', 'Resetting banner');
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
          variant="outline"
          size="sm"
          className="bg-background/80 hover:bg-background/90 backdrop-blur-sm border-border/50"
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
            {isDynamicAccentEnabled && (
              <span className="flex items-center gap-1 mt-2 text-accent">
                <Sparkles className="w-4 h-4" />
                Dynamic accent colors are enabled - your theme will automatically match your banner!
              </span>
            )}
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

          {/* Color Extraction Status */}
          {isExtracting && (
            <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg text-accent">
              <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
              <span>Extracting colors from your media...</span>
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
                  disabled={state.isUploading || isExtracting}
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
