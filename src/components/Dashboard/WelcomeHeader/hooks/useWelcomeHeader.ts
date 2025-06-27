
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { BannerStorageService } from '@/services/bannerStorage';

export const useWelcomeHeader = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannerData, setBannerData] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadBanner = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('WelcomeHeader: Loading dashboard banner from Supabase');
        const banner = await BannerStorageService.getBanner('dashboard');
        if (banner) {
          console.log('WelcomeHeader: Banner loaded:', banner);
          setBannerData({
            url: banner.file_url,
            type: banner.file_type
          });
        } else {
          console.log('WelcomeHeader: No banner found');
          setBannerData(null);
        }
      } catch (error) {
        console.error('WelcomeHeader: Error loading banner:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanner();
  }, [user]);

  const handleBannerUpdate = (bannerUrl: string, type: 'image' | 'video') => {
    console.log('WelcomeHeader: Banner updated:', type, bannerUrl.substring(0, 50) + '...');
    setBannerData({ url: bannerUrl, type });
  };

  const handleBannerDelete = () => {
    console.log('WelcomeHeader: Banner deleted');
    setBannerData(null);
  };

  const handleAIBannerGenerated = async (imageUrl: string) => {
    console.log('WelcomeHeader: AI banner generated:', imageUrl.substring(0, 50) + '...');
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'ai-generated-banner.png', { type: 'image/png' });
      
      const bannerData = await BannerStorageService.uploadBanner(file, 'dashboard');
      
      if (bannerData) {
        setBannerData({
          url: bannerData.file_url,
          type: bannerData.file_type
        });
      }
    } catch (error) {
      console.error('WelcomeHeader: Error saving AI banner:', error);
      setBannerData({ url: imageUrl, type: 'image' });
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreenOpen(!isFullscreenOpen);
  };

  const handleBannerClick = () => {
    if (bannerData) {
      setIsFullscreenOpen(true);
    }
  };

  return {
    currentTime,
    bannerData,
    isLoading,
    isFullscreenOpen,
    showControls,
    setShowControls,
    handleBannerUpdate,
    handleBannerDelete,
    handleAIBannerGenerated,
    handleFullscreenToggle,
    handleBannerClick,
    setIsFullscreenOpen
  };
};
