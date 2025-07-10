import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageBannerService } from '@/services/bannerStorage/pageSpecificBannerService';
import { useToast } from '@/hooks/use-toast';

export interface PageBannerSettings {
  bannerUrl?: string | null;
  bannerType?: string | null;
  bannerHeight?: number;
  bannerPositionX?: number;
  bannerPositionY?: number;
  bannerWidth?: number;
  isEnabled?: boolean;
}

export const usePageBannerSettings = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PageBannerSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get current page path
  const pagePath = location.pathname;

  // Load settings for current page
  useEffect(() => {
    loadPageSettings();
  }, [pagePath]);

  const loadPageSettings = async () => {
    try {
      setIsLoading(true);
      const pageSettings = await PageBannerService.getPageBannerSettings(pagePath);
      setSettings(pageSettings || {});
    } catch (error) {
      console.error('Failed to load page banner settings:', error);
      setSettings({});
    } finally {
      setIsLoading(false);
    }
  };

  const updateBannerSettings = async (updates: Partial<PageBannerSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      await PageBannerService.updatePageBannerSettings(pagePath, newSettings);
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Failed to update banner settings:', error);
      return false;
    }
  };

  const updateBannerSelection = async (bannerUrl: string | null, bannerType?: string) => {
    return updateBannerSettings({
      bannerUrl,
      bannerType: bannerType || 'image'
    });
  };

  const updateBannerPosition = async (x: number, y: number, height?: number) => {
    return updateBannerSettings({
      bannerPositionX: x,
      bannerPositionY: y,
      ...(height !== undefined && { bannerHeight: height })
    });
  };

  const resetPageSettings = async () => {
    try {
      await PageBannerService.deletePageBannerSettings(pagePath);
      setSettings({});
      return true;
    } catch (error) {
      console.error('Failed to reset page settings:', error);
      return false;
    }
  };

  const handleImageUpload = (file: File) => {
    // This would be handled by the banner service to upload and return URL
    console.log('Image uploaded:', file.name);
  };

  const handleVideoUpload = (file: File) => {
    // This would be handled by the banner service to upload and return URL
    console.log('Video uploaded:', file.name);
  };

  const handleAIGenerate = (prompt: string) => {
    // This would be handled by the AI service to generate and return URL
    console.log('AI Generate with prompt:', prompt);
  };

  const handleImageSelect = async (imageUrl: string) => {
    const success = await updateBannerSelection(imageUrl, 'image');
    
    if (success) {
      toast({
        title: "Banner Updated",
        description: `Banner updated for ${pagePath} page.`,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "Failed to update banner. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    // Current settings
    settings,
    isLoading,
    pagePath,
    
    // Derived values for compatibility
    selectedBannerUrl: settings.bannerUrl,
    selectedBannerType: settings.bannerType,
    bannerHeight: settings.bannerHeight || 100,
    bannerPosition: {
      x: settings.bannerPositionX || 0,
      y: settings.bannerPositionY || 0
    },
    
    // Update functions
    updateBannerSettings,
    updateBannerSelection,
    updateBannerPosition,
    resetPageSettings,
    
    // Handlers
    handleImageUpload,
    handleVideoUpload,
    handleAIGenerate,
    handleImageSelect,
  };
};