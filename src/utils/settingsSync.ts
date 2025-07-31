import { useEffect, useMemo } from 'react';

/**
 * Settings synchronization utility
 * Ensures localStorage and database settings stay in sync
 */

export interface SettingsSyncManager {
  syncToDatabase: (key: string, value: any) => Promise<boolean>;
  syncFromDatabase: (key: string) => Promise<any>;
  clearLocalStorage: () => void;
  migrateLocalStorageToDatabase: () => Promise<void>;
}

/**
 * Keys that should be migrated from localStorage to database
 */
const MIGRATABLE_KEYS = [
  
  'glow-effect-intensity', 
  'accent-color',
  'accent-color-hsl',
  'dynamic-accent-enabled',
  'sidebar-section-order',
  'floating-notes-state'
];

/**
 * Creates a settings sync manager for a specific service
 */
export const createSettingsSyncManager = (
  updateFn: (updates: any) => Promise<boolean>,
  getFn: () => any
): SettingsSyncManager => {

  const syncToDatabase = async (key: string, value: any): Promise<boolean> => {
    try {
      // Map localStorage keys to database fields
      const dbUpdate = mapLocalStorageToDatabase(key, value);
      if (dbUpdate) {
        const success = await updateFn(dbUpdate);
        if (success) {
          // Remove from localStorage after successful database save
          localStorage.removeItem(key);
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error(`Failed to sync ${key} to database:`, error);
      return false;
    }
  };

  const syncFromDatabase = async (key: string): Promise<any> => {
    try {
      const settings = getFn();
      return mapDatabaseToLocalStorage(key, settings);
    } catch (error) {
      console.error(`Failed to sync ${key} from database:`, error);
      return null;
    }
  };

  const clearLocalStorage = (): void => {
    MIGRATABLE_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });
  };

  const migrateLocalStorageToDatabase = async (): Promise<void> => {
    const migrations: Promise<boolean>[] = [];
    
    MIGRATABLE_KEYS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          const parsedValue = JSON.parse(value);
          migrations.push(syncToDatabase(key, parsedValue));
        } catch {
          // Handle string values
          migrations.push(syncToDatabase(key, value));
        }
      }
    });

    await Promise.all(migrations);
  };

  return {
    syncToDatabase,
    syncFromDatabase,
    clearLocalStorage,
    migrateLocalStorageToDatabase
  };
};

/**
 * Maps localStorage keys to database field updates
 */
const mapLocalStorageToDatabase = (key: string, value: any): any => {
  switch (key) {
    
    case 'glow-effect-intensity':
      return {
        glowing_effects_enabled: parseFloat(value) > 0,
        theme_settings: { glowIntensity: parseFloat(value) }
      };
    
    case 'accent-color':
    case 'accent-color-hsl':
      // These will be handled together
      return {
        theme_settings: { 
          accentColor: localStorage.getItem('accent-color'),
          accentColorHsl: localStorage.getItem('accent-color-hsl')
        }
      };
    
    case 'dynamic-accent-enabled':
      return {
        theme_settings: { dynamicAccentEnabled: value }
      };
    
    case 'floating-notes-state':
      return {
        custom_settings: { floatingNotes: value }
      };
    
    default:
      return null;
  }
};

/**
 * Maps database settings to localStorage equivalent
 */
const mapDatabaseToLocalStorage = (key: string, settings: any): any => {
  if (!settings) return null;

  switch (key) {
    
    case 'glow-effect-intensity':
      return settings.theme_settings?.glowIntensity || 1;
    
    case 'accent-color':
      return settings.theme_settings?.accentColor;
    
    case 'accent-color-hsl':
      return settings.theme_settings?.accentColorHsl;
    
    case 'dynamic-accent-enabled':
      return settings.theme_settings?.dynamicAccentEnabled || false;
    
    case 'floating-notes-state':
      return settings.custom_settings?.floatingNotes || {};
    
    default:
      return null;
  }
};

/**
 * Hook for automatic settings synchronization
 */
export const useSettingsSync = (
  updateFn: (updates: any) => Promise<boolean>,
  getFn: () => any,
  enabled: boolean = true
) => {
  const syncManager = useMemo(() => 
    createSettingsSyncManager(updateFn, getFn), 
    [updateFn, getFn]
  );

  // Auto-migrate on mount - only once when enabled becomes true
  useEffect(() => {
    if (enabled) {
      let migrationStarted = false;
      
      const performMigration = async () => {
        if (migrationStarted) return;
        migrationStarted = true;
        
        try {
          await syncManager.migrateLocalStorageToDatabase();
        } catch (error) {
          console.error('Settings migration failed:', error);
        }
      };
      
      performMigration();
    }
  }, [enabled]); // Remove syncManager from dependencies

  return syncManager;
};