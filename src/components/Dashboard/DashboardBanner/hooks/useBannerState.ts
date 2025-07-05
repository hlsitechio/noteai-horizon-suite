import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useDynamicAccent } from '../../../../contexts/DynamicAccentContext';
import { BannerStorageService } from '@/services/bannerStorage';

export interface BannerData {
  url: string;
  type: 'image' | 'video';
}

export const useBannerState = () => {
  const { user } = useAuth();
  const { extractColorFromMedia, isDynamicAccentEnabled } = useDynamicAccent();
  
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load banner data on mount
  useEffect(() => {
    let isMounted = true;

    const loadBanner = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        // Loading dashboard banner from Supabase
        
        const banner = await BannerStorageService.getBanner('dashboard');
        
        if (!isMounted) return;

        if (banner) {
          // Banner loaded successfully
          const bannerData: BannerData = {
            url: banner.file_url,
            type: banner.file_type as 'image' | 'video'
          };
          setBannerData(bannerData);
          
          // Extract color from the loaded banner if dynamic accent is enabled
          if (isDynamicAccentEnabled) {
            try {
              await extractColorFromMedia(banner.file_url);
            } catch (colorError) {
              console.warn('Color extraction failed:', colorError);
              // Don't treat color extraction failure as a critical error
            }
          }
        } else {
          // No banner found, using placeholder
          setBannerData(null);
        }
      } catch (error) {
        console.error('Error loading banner:', error);
        if (isMounted) {
          setError('Failed to load banner');
          setBannerData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBanner();

    return () => {
      isMounted = false;
    };
  }, [user, isDynamicAccentEnabled, extractColorFromMedia]);

  const updateBannerData = (newBannerData: BannerData | null) => {
    setBannerData(newBannerData);
    setError(null);
  };

  return {
    bannerData,
    isLoading,
    isFullscreenOpen,
    showControls,
    error,
    setShowControls,
    setIsFullscreenOpen,
    updateBannerData
  };
};