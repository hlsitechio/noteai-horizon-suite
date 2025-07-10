import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSettingsService, DashboardSettings } from '@/services/dashboardSettingsService';
import { toast } from 'sonner';

// Cache to prevent duplicate API calls
const settingsCache = new Map<string, { data: DashboardSettings; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const useDashboardSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<DashboardSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized cache key
  const cacheKey = useMemo(() => user?.id || '', [user?.id]);

  // Load settings with caching
  const loadSettings = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Check cache first
      const cached = settingsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setSettings(cached.data);
        setIsLoading(false);
        return;
      }

      // Ensure settings exist first
      await DashboardSettingsService.ensureSettingsExist(user.id);
      
      const userSettings = await DashboardSettingsService.getUserSettings(user.id);
      
      // Update cache
      settingsCache.set(cacheKey, {
        data: userSettings,
        timestamp: Date.now()
      });
      
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to load dashboard settings:', error);
      toast.error('Failed to load dashboard settings');
    } finally {
      setIsLoading(false);
    }
  }, [user, cacheKey]);

  // Update banner selection with optimistic updates
  const updateBannerSelection = useCallback(async (
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ) => {
    if (!user || !settings) return false;

    // Optimistic update
    const optimisticSettings = {
      ...settings,
      selected_banner_url: bannerUrl,
      selected_banner_type: bannerType
    };
    setSettings(optimisticSettings);

    try {
      const success = await DashboardSettingsService.updateSelectedBanner(user.id, bannerUrl, bannerType);
      if (success) {
        // Update cache
        settingsCache.set(cacheKey, {
          data: optimisticSettings,
          timestamp: Date.now()
        });
      } else {
        // Revert on failure
        setSettings(settings);
      }
      return success;
    } catch (error) {
      console.error('Failed to update banner selection:', error);
      setSettings(settings); // Revert
      toast.error('Failed to save banner selection');
      return false;
    }
  }, [user, settings, cacheKey]);

  // Update sidebar panel sizes with throttling
  const updateSidebarPanelSizes = useCallback(async (panelSizes: Record<string, number>) => {
    if (!user || !settings) return false;

    // Optimistic update
    const optimisticSettings = {
      ...settings,
      sidebar_panel_sizes: panelSizes
    };
    setSettings(optimisticSettings);

    try {
      const success = await DashboardSettingsService.updateSidebarPanelSizes(user.id, panelSizes);
      if (success) {
        // Update cache
        settingsCache.set(cacheKey, {
          data: optimisticSettings,
          timestamp: Date.now()
        });
      } else {
        // Revert on failure
        setSettings(settings);
      }
      return success;
    } catch (error) {
      console.error('Failed to update sidebar panel sizes:', error);
      setSettings(settings); // Revert
      return false;
    }
  }, [user, settings, cacheKey]);

  // Load settings only once when user changes
  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setSettings(null);
      setIsLoading(false);
    }
  }, [user?.id]); // Only depend on user ID to prevent unnecessary reloads

  return {
    settings,
    isLoading,
    updateBannerSelection,
    updateSidebarPanelSizes,
    refreshSettings: loadSettings
  };
};