import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSettingsService, DashboardSettings } from '@/services/dashboardSettingsService';
import { toast } from 'sonner';

export const useDashboardSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings
  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const userSettings = await DashboardSettingsService.getUserSettings(user.id);
      
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to load dashboard settings:', error);
      toast.error('Failed to load dashboard settings');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Update banner selection
  const updateBannerSelection = useCallback(async (
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ) => {
    if (!user) return false;

    try {
      const success = await DashboardSettingsService.updateSelectedBanner(user.id, bannerUrl, bannerType);
      if (success && settings) {
        setSettings({
          ...settings,
          selected_banner_url: bannerUrl,
          selected_banner_type: bannerType
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to update banner selection:', error);
      toast.error('Failed to save banner selection');
      return false;
    }
  }, [user, settings]);

  // Update sidebar panel sizes
  const updateSidebarPanelSizes = useCallback(async (panelSizes: Record<string, number>) => {
    if (!user) return false;

    try {
      const success = await DashboardSettingsService.updateSidebarPanelSizes(user.id, panelSizes);
      if (success && settings) {
        setSettings({
          ...settings,
          sidebar_panel_sizes: panelSizes
        });
      }
      return success;
    } catch (error) {
      console.error('Failed to update sidebar panel sizes:', error);
      return false;
    }
  }, [user, settings]);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]); // Remove loadSettings dependency to prevent infinite loop

  return {
    settings,
    isLoading,
    updateBannerSelection,
    updateSidebarPanelSizes,
    refreshSettings: loadSettings
  };
};