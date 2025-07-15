import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageBannerService, BannerDisplaySettings } from '@/services/pageBannerService';
import { useToast } from '@/hooks/use-toast';

export const useBannerDisplaySettings = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [settings, setSettings] = useState<BannerDisplaySettings>(
    PageBannerService.getDefaultDisplaySettings()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const pagePath = location.pathname;

  // Load settings when page changes
  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id, pagePath]);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const pageSettings = await PageBannerService.getPageSettings(user.id, pagePath);
      
      if (pageSettings?.banner_settings) {
        setSettings(pageSettings.banner_settings as BannerDisplaySettings);
      } else {
        setSettings(PageBannerService.getDefaultDisplaySettings());
      }
    } catch (error) {
      console.error('Failed to load banner display settings:', error);
      setSettings(PageBannerService.getDefaultDisplaySettings());
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<BannerDisplaySettings>) => {
    if (!user?.id) return false;

    try {
      setIsSaving(true);
      const updatedSettings = { ...settings, ...newSettings };
      
      const success = await PageBannerService.updateBannerDisplaySettings(
        user.id,
        pagePath,
        updatedSettings
      );

      if (success) {
        setSettings(updatedSettings);
        toast({
          title: "Settings Saved",
          description: "Banner display settings have been updated.",
        });
        return true;
      } else {
        toast({
          title: "Save Failed",
          description: "Failed to save banner settings. Please try again.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to update banner display settings:', error);
      toast({
        title: "Save Failed",
        description: "An error occurred while saving settings.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async () => {
    const defaultSettings = PageBannerService.getDefaultDisplaySettings();
    return await updateSettings(defaultSettings);
  };

  return {
    settings,
    isLoading,
    isSaving,
    updateSettings,
    resetToDefaults,
    pagePath
  };
};