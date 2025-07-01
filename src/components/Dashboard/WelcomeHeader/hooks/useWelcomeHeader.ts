
import { useState, useEffect } from 'react';
import { useDynamicAccent } from '../../../../contexts/DynamicAccentContext';

export const useWelcomeHeader = () => {
  const { extractColorFromMedia, isDynamicAccentEnabled } = useDynamicAccent();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bannerData, setBannerData] = useState<{url: string, type: 'image' | 'video'} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    setBannerData({ url: imageUrl, type: 'image' });
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
