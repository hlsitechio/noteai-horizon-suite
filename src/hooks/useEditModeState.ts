import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSettingsService } from '@/services/dashboardSettingsService';
import { toast } from 'sonner';

export const useEditModeState = () => {
  const { user } = useAuth();
  const [isDashboardEditMode, setIsDashboardEditMode] = useState(false);
  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Load edit mode states from Supabase
  const loadEditModes = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Check and clear expired edit modes first
      const wasCleared = await DashboardSettingsService.checkAndClearExpiredEditModes(user.id);
      
      if (wasCleared) {
        toast.info('Edit mode automatically disabled due to inactivity');
      }

      const settings = await DashboardSettingsService.getUserSettings(user.id);
      
      if (settings) {
        setIsDashboardEditMode(settings.dashboard_edit_mode);
        setIsSidebarEditMode(settings.sidebar_edit_mode);
        
        // Set up auto-disable timer if any edit mode is active
        if (settings.dashboard_edit_mode || settings.sidebar_edit_mode) {
          setupAutoDisableTimer();
        }
      }
    } catch (error) {
      console.error('Failed to load edit modes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Setup auto-disable timer (30 minutes)
  const setupAutoDisableTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (user && (isDashboardEditMode || isSidebarEditMode)) {
        await DashboardSettingsService.updateEditModes(user.id, false, false);
        setIsDashboardEditMode(false);
        setIsSidebarEditMode(false);
        toast.info('Edit mode automatically disabled due to inactivity');
      }
    }, 30 * 60 * 1000); // 30 minutes
  }, [user, isDashboardEditMode, isSidebarEditMode]);

  // Update dashboard edit mode
  const updateDashboardEditMode = useCallback(async (enabled: boolean) => {
    if (!user) return;

    try {
      const success = await DashboardSettingsService.updateEditModes(
        user.id,
        enabled,
        isSidebarEditMode
      );

      if (success) {
        setIsDashboardEditMode(enabled);
        
        if (enabled || isSidebarEditMode) {
          setupAutoDisableTimer();
        } else if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        toast.success(enabled ? 'Dashboard edit mode enabled' : 'Dashboard edit mode disabled');
      } else {
        toast.error('Failed to update dashboard edit mode');
      }
    } catch (error) {
      console.error('Failed to update dashboard edit mode:', error);
      toast.error('Failed to update dashboard edit mode');
    }
  }, [user, isSidebarEditMode, setupAutoDisableTimer]);

  // Update sidebar edit mode
  const updateSidebarEditMode = useCallback(async (enabled: boolean) => {
    if (!user) return;

    try {
      const success = await DashboardSettingsService.updateEditModes(
        user.id,
        isDashboardEditMode,
        enabled
      );

      if (success) {
        setIsSidebarEditMode(enabled);
        
        if (enabled || isDashboardEditMode) {
          setupAutoDisableTimer();
        } else if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        toast.success(enabled ? 'Sidebar edit mode enabled' : 'Sidebar edit mode disabled');
      } else {
        toast.error('Failed to update sidebar edit mode');
      }
    } catch (error) {
      console.error('Failed to update sidebar edit mode:', error);
      toast.error('Failed to update sidebar edit mode');
    }
  }, [user, isDashboardEditMode, setupAutoDisableTimer]);

  // Auto-save and disable on panel size save
  const handlePanelSizeSave = useCallback(async () => {
    if (!user || (!isDashboardEditMode && !isSidebarEditMode)) return;

    // Auto-disable edit modes after successful save
    await DashboardSettingsService.updateEditModes(user.id, false, false);
    setIsDashboardEditMode(false);
    setIsSidebarEditMode(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    toast.success('Layout saved and locked');
  }, [user, isDashboardEditMode, isSidebarEditMode]);

  // Load edit modes on mount and user change
  useEffect(() => {
    loadEditModes();
  }, [loadEditModes]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Periodic check for expired modes (every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const wasCleared = await DashboardSettingsService.checkAndClearExpiredEditModes(user.id);
      if (wasCleared) {
        setIsDashboardEditMode(false);
        setIsSidebarEditMode(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        toast.info('Edit mode automatically disabled due to inactivity');
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  return {
    isDashboardEditMode,
    isSidebarEditMode,
    isLoading,
    setIsDashboardEditMode: updateDashboardEditMode,
    setIsSidebarEditMode: updateSidebarEditMode,
    handlePanelSizeSave,
    refreshEditModes: loadEditModes
  };
};