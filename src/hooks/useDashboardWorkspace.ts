import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardWorkspaceService, DashboardWorkspace } from '@/services/dashboardWorkspaceService';
import { toast } from 'sonner';

// Cache to prevent duplicate API calls
const workspaceCache = new Map<string, { data: DashboardWorkspace; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds

export const useDashboardWorkspace = () => {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<DashboardWorkspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized cache key
  const cacheKey = useMemo(() => user?.id || '', [user?.id]);

  // Load workspace with caching
  const loadWorkspace = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Check cache first
      const cached = workspaceCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setWorkspace(cached.data);
        setIsLoading(false);
        return;
      }

      // Ensure workspace exists first
      await DashboardWorkspaceService.ensureWorkspaceExists(user.id);
      
      const userWorkspace = await DashboardWorkspaceService.getUserWorkspace(user.id);
      
      if (userWorkspace) {
        // Update cache
        workspaceCache.set(cacheKey, {
          data: userWorkspace,
          timestamp: Date.now()
        });
        
        setWorkspace(userWorkspace);
      }
    } catch (error) {
      console.error('Failed to load dashboard workspace:', error);
      toast.error('Failed to load dashboard settings');
    } finally {
      setIsLoading(false);
    }
  }, [user, cacheKey]);

  // Generic update function with optimistic updates
  const updateWorkspace = useCallback(async (
    updates: Partial<Omit<DashboardWorkspace, 'id' | 'user_id' | 'created_at' | 'updated_at'>>,
    skipToast = false
  ) => {
    if (!user || !workspace) return false;

    // Optimistic update
    const optimisticWorkspace = {
      ...workspace,
      ...updates,
      updated_at: new Date().toISOString()
    };
    setWorkspace(optimisticWorkspace);

    try {
      const success = await DashboardWorkspaceService.updateWorkspace(user.id, updates);
      if (success) {
        // Update cache
        workspaceCache.set(cacheKey, {
          data: optimisticWorkspace,
          timestamp: Date.now()
        });
        
        if (!skipToast) {
          toast.success('Settings saved successfully');
        }
      } else {
        // Revert on failure
        setWorkspace(workspace);
        if (!skipToast) {
          toast.error('Failed to save settings');
        }
      }
      return success;
    } catch (error) {
      console.error('Failed to update workspace:', error);
      setWorkspace(workspace); // Revert
      if (!skipToast) {
        toast.error('Failed to save settings');
      }
      return false;
    }
  }, [user, workspace, cacheKey]);

  // Specific update methods
  const updateBannerSelection = useCallback(async (
    bannerUrl: string | null,
    bannerType: 'image' | 'video' | null
  ) => {
    return updateWorkspace({
      selected_banner_url: bannerUrl,
      selected_banner_type: bannerType
    });
  }, [updateWorkspace]);

  const updatePanelSizes = useCallback(async (panelSizes: Record<string, number>) => {
    return updateWorkspace({ panel_sizes: panelSizes }, true); // Skip toast for frequent updates
  }, [updateWorkspace]);

  const updateWeatherSettings = useCallback(async (
    location: string,
    enabled: boolean,
    units: 'celsius' | 'fahrenheit'
  ) => {
    return updateWorkspace({
      weather_location: location,
      weather_enabled: enabled,
      weather_units: units
    });
  }, [updateWorkspace]);

  const updateLayoutSettings = useCallback(async (
    dashboardLayout: Record<string, unknown>,
    sidebarLayout: Record<string, unknown>
  ) => {
    return updateWorkspace({
      dashboard_layout: dashboardLayout,
      sidebar_layout: sidebarLayout
    });
  }, [updateWorkspace]);

  const updateUISettings = useCallback(async (
    glowingEffects: boolean,
    themeSettings: Record<string, unknown>
  ) => {
    return updateWorkspace({
      glowing_effects_enabled: glowingEffects,
      theme_settings: themeSettings
    });
  }, [updateWorkspace]);

  const updateEditModes = useCallback(async (
    dashboardEditMode: boolean,
    sidebarEditMode: boolean
  ) => {
    const expiresAt = dashboardEditMode || sidebarEditMode 
      ? new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
      : null;

    return updateWorkspace({
      dashboard_edit_mode: dashboardEditMode,
      sidebar_edit_mode: sidebarEditMode,
      edit_mode_expires_at: expiresAt
    });
  }, [updateWorkspace]);

  // Load workspace only once when user changes
  useEffect(() => {
    if (user) {
      loadWorkspace();
    } else {
      setWorkspace(null);
      setIsLoading(false);
    }
  }, [user?.id]); // Only depend on user ID to prevent unnecessary reloads

  // Media management methods
  const uploadBanner = useCallback(async (file: File) => {
    if (!user || !workspace) return false;
    
    try {
      const success = await DashboardWorkspaceService.uploadAndSetBanner(user.id, file, workspace.id);
      if (success) {
        // Refresh workspace to get updated banner
        await loadWorkspace();
        toast.success('Banner uploaded successfully');
      } else {
        toast.error('Failed to upload banner');
      }
      return success;
    } catch (error) {
      console.error('Failed to upload banner:', error);
      toast.error('Failed to upload banner');
      return false;
    }
  }, [user, workspace, loadWorkspace]);

  const getWorkspaceMedia = useCallback(async (type?: 'image' | 'video' | 'document' | 'note-attachment') => {
    if (!user) return [];
    return await DashboardWorkspaceService.getWorkspaceMedia(user.id, type);
  }, [user]);

  const getWorkspaceBanners = useCallback(async () => {
    if (!user) return [];
    return await DashboardWorkspaceService.getWorkspaceBanners(user.id);
  }, [user]);

  const cleanupMedia = useCallback(async () => {
    if (!user) return 0;
    const deletedCount = await DashboardWorkspaceService.cleanupWorkspaceMedia(user.id);
    if (deletedCount > 0) {
      toast.success(`Cleaned up ${deletedCount} unused files`);
    }
    return deletedCount;
  }, [user]);

  // Convenience getters
  const getLayoutSettings = useCallback(() => {
    if (!workspace) return { dashboard: {}, sidebar: {} };
    return {
      dashboard: workspace.dashboard_layout,
      sidebar: workspace.sidebar_layout
    };
  }, [workspace]);

  const getPanelSizes = useCallback(() => {
    return workspace?.panel_sizes || {};
  }, [workspace]);

  const getBannerSettings = useCallback(() => {
    if (!workspace) return { url: null, type: null };
    return {
      url: workspace.selected_banner_url,
      type: workspace.selected_banner_type
    };
  }, [workspace]);

  const getWeatherSettings = useCallback(() => {
    if (!workspace) return { location: 'New York', enabled: true, units: 'celsius' as const };
    return {
      location: workspace.weather_location,
      enabled: workspace.weather_enabled,
      units: workspace.weather_units
    };
  }, [workspace]);

  const getUISettings = useCallback(() => {
    if (!workspace) return { glowingEffects: true, theme: {} };
    return {
      glowingEffects: workspace.glowing_effects_enabled,
      theme: workspace.theme_settings
    };
  }, [workspace]);

  const getEditModes = useCallback(() => {
    if (!workspace) return { dashboard: false, sidebar: false };
    return {
      dashboard: workspace.dashboard_edit_mode,
      sidebar: workspace.sidebar_edit_mode
    };
  }, [workspace]);

  return {
    workspace,
    isLoading,
    
    // Update methods
    updateBannerSelection,
    updatePanelSizes,
    updateWeatherSettings,
    updateLayoutSettings,
    updateUISettings,
    updateEditModes,
    updateWorkspace,
    
    // Media management
    uploadBanner,
    getWorkspaceMedia,
    getWorkspaceBanners,
    cleanupMedia,
    
    // Convenience getters
    getLayoutSettings,
    getPanelSizes,
    getBannerSettings,
    getWeatherSettings,
    getUISettings,
    getEditModes,
    
    // Utility methods
    refreshWorkspace: loadWorkspace
  };
};