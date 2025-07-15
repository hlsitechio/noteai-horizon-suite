import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardWorkspace } from './useDashboardWorkspace';
import { UserPreferencesService, UserPreferences } from '@/services/userPreferencesService';
import { useSettingsSync } from '@/utils/settingsSync';
import { toast } from 'sonner';

export interface UnifiedSettings {
  preferences: UserPreferences | null;
  workspace: any;
  isLoading: boolean;
}

/**
 * Unified settings hook that manages all user settings in one place
 * This prevents conflicts between different settings services
 */
export const useUnifiedSettings = () => {
  const { user } = useAuth();
  const { 
    workspace, 
    isLoading: workspaceLoading,
    updateWorkspace,
    ...workspaceMethods 
  } = useDashboardWorkspace();
  
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(true);

  // Load user preferences
  const loadPreferences = useCallback(async () => {
    if (!user) {
      setPreferences(null);
      setPreferencesLoading(false);
      return;
    }

    try {
      setPreferencesLoading(true);
      const userPrefs = await UserPreferencesService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
      toast.error('Failed to load user preferences');
    } finally {
      setPreferencesLoading(false);
    }
  }, [user]);

  // Update user preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user || !preferences) return false;

    try {
      const updatedPrefs = await UserPreferencesService.updateUserPreferences(updates);
      if (updatedPrefs) {
        setPreferences(updatedPrefs);
        toast.success('Preferences updated successfully');
        return true;
      } else {
        toast.error('Failed to update preferences');
        return false;
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
      return false;
    }
  }, [user, preferences]);

  // Settings synchronization manager
  const syncManager = useSettingsSync(
    updateWorkspace,
    () => workspace,
    !!user && !!workspace
  );

  // Unified setting update that handles both preferences and workspace
  const updateSetting = useCallback(async (
    settingType: 'preference' | 'workspace',
    updates: any
  ) => {
    if (settingType === 'preference') {
      return await updatePreferences(updates);
    } else {
      return await updateWorkspace(updates);
    }
  }, [updatePreferences, updateWorkspace]);

  // Enhanced update method that also syncs localStorage
  const updateSettingWithSync = useCallback(async (
    settingType: 'preference' | 'workspace',
    updates: any,
    localStorageKey?: string
  ) => {
    const success = await updateSetting(settingType, updates);
    
    // If there's a localStorage key, sync it
    if (success && localStorageKey && settingType === 'workspace') {
      await syncManager.syncToDatabase(localStorageKey, updates);
    }
    
    return success;
  }, [updateSetting, syncManager]);

  // Load preferences when user changes
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const isLoading = preferencesLoading || workspaceLoading;

  return {
    // State
    preferences,
    workspace,
    isLoading,
    
    // Methods
    updatePreferences,
    updateSetting,
    updateSettingWithSync,
    loadPreferences,
    syncManager,
    
    // Workspace methods
    ...workspaceMethods,
    updateWorkspace,
    
    // Unified data
    settings: {
      preferences,
      workspace
    }
  };
};