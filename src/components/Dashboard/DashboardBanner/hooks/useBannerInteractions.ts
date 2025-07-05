import { useCallback } from 'react';
import { useDynamicAccent } from '../../../../contexts/DynamicAccentContext';
import { BannerStorageService } from '@/services/bannerStorage';
import { BannerData } from './useBannerState';

interface UseBannerInteractionsProps {
  setIsFullscreenOpen: (open: boolean) => void;
  updateBannerData?: (data: BannerData | null) => void;
}

export const useBannerInteractions = ({ 
  setIsFullscreenOpen,
  updateBannerData 
}: UseBannerInteractionsProps) => {
  const { extractColorFromMedia, isDynamicAccentEnabled } = useDynamicAccent();

  const handleBannerUpdate = useCallback((bannerUrl: string, type: 'image' | 'video') => {
    console.log('Banner updated:', type, bannerUrl.substring(0, 50) + '...');
    const newBannerData: BannerData = { url: bannerUrl, type };
    updateBannerData?.(newBannerData);
  }, [updateBannerData]);

  const handleBannerDelete = useCallback(() => {
    console.log('Banner deleted');
    updateBannerData?.(null);
  }, [updateBannerData]);

  const handleAIBannerGenerated = useCallback(async (imageUrl: string) => {
    console.log('AI banner generated:', imageUrl.substring(0, 50) + '...');
    
    try {
      // First update the UI immediately for better UX
      const tempBannerData: BannerData = { url: imageUrl, type: 'image' };
      updateBannerData?.(tempBannerData);

      // Then try to save to storage
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'ai-generated-banner.png', { type: 'image/png' });
      
      const bannerData = await BannerStorageService.uploadBanner(file, 'dashboard');
      
      if (bannerData) {
        const finalBannerData: BannerData = {
          url: bannerData.file_url,
          type: bannerData.file_type as 'image' | 'video'
        };
        updateBannerData?.(finalBannerData);
        
        // Extract color from AI generated banner if dynamic accent is enabled
        if (isDynamicAccentEnabled) {
          try {
            await extractColorFromMedia(bannerData.file_url);
          } catch (error) {
            console.warn('Color extraction from AI banner failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error saving AI banner:', error);
      // Keep the temporary banner data if storage fails
      const fallbackBannerData: BannerData = { url: imageUrl, type: 'image' };
      updateBannerData?.(fallbackBannerData);
    }
  }, [updateBannerData, isDynamicAccentEnabled, extractColorFromMedia]);

  const handleBannerClick = useCallback(() => {
    setIsFullscreenOpen(true);
  }, [setIsFullscreenOpen]);

  return {
    handleBannerUpdate,
    handleBannerDelete,
    handleAIBannerGenerated,
    handleBannerClick
  };
};
