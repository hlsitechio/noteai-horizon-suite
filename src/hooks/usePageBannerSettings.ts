import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageBannerService } from '@/services/pageBannerService';
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<PageBannerSettings>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get current page path
  const pagePath = location.pathname;

  // Load settings for current page
  useEffect(() => {
    if (user?.id) {
      loadPageSettings();
    }
  }, [pagePath, user?.id]);

  const loadPageSettings = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const pageSettings = await PageBannerService.getPageSettings(user.id, pagePath);
      
      if (pageSettings) {
        setSettings({
          bannerUrl: pageSettings.banner_url,
          bannerType: pageSettings.banner_type,
          bannerHeight: pageSettings.banner_height || 100,
          bannerPositionX: pageSettings.banner_position_x || 0,
          bannerPositionY: pageSettings.banner_position_y || 0,
          bannerWidth: pageSettings.banner_width || 100,
          isEnabled: pageSettings.is_enabled ?? true,
        });
      } else {
        setSettings({});
      }
    } catch (error) {
      console.error('Failed to load page banner settings:', error);
      setSettings({});
    } finally {
      setIsLoading(false);
    }
  };

  const updateBannerSettings = async (updates: Partial<PageBannerSettings>) => {
    if (!user?.id) return false;

    try {
      const success = await PageBannerService.updatePageSettings(user.id, pagePath, {
        banner_url: updates.bannerUrl,
        banner_type: updates.bannerType,
        banner_height: updates.bannerHeight,
        banner_position_x: updates.bannerPositionX,
        banner_position_y: updates.bannerPositionY,
        banner_width: updates.bannerWidth,
        is_enabled: updates.isEnabled,
      });

      if (success) {
        setSettings(prev => ({ ...prev, ...updates }));
        return true;
      }
      return false;
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
    if (!user?.id) return false;

    try {
      const success = await PageBannerService.deletePageSettings(user.id, pagePath);
      if (success) {
        setSettings({});
        toast({
          title: "Settings Reset",
          description: `Banner settings reset for ${pagePath} page.`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to reset page settings:', error);
      return false;
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload banners.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement file upload to Supabase storage
      // For now, show a message that this feature needs implementation
      toast({
        title: "Upload Feature",
        description: "Banner upload feature will be implemented next.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload banner. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload videos.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement video upload to Supabase storage
      toast({
        title: "Upload Feature",
        description: "Video upload feature will be implemented next.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to upload video:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAIGenerate = async (prompt: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate banners.",
        variant: "destructive",
      });
      return;
    }

    try {
      // TODO: Implement AI banner generation
      toast({
        title: "AI Generation",
        description: "AI banner generation will be implemented next.",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to generate banner:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate banner. Please try again.",
        variant: "destructive",
      });
    }
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