/**
 * Clear Legacy Data Script
 * Removes any lingering weather data, cached errors, or outdated storage entries
 */

export const clearLegacyData = () => {
  if (typeof window === 'undefined') return;

  try {
    // Clear weather-related localStorage entries
    const keysToRemove: string[] = [];
    
    // Safely iterate through localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('weather') || 
          key.includes('Weather') ||
          key.includes('WEATHER')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          console.log('🧹 Cleared legacy data:', key);
        } catch (error) {
          console.warn('Failed to remove localStorage key:', key, error);
        }
      });
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }

    // Clear weather-related sessionStorage entries
    const sessionKeysToRemove: string[] = [];
    
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('weather') || 
          key.includes('Weather') ||
          key.includes('WEATHER')
        )) {
          sessionKeysToRemove.push(key);
        }
      }
      
      sessionKeysToRemove.forEach(key => {
        try {
          sessionStorage.removeItem(key);
          console.log('🧹 Cleared legacy session data:', key);
        } catch (error) {
          console.warn('Failed to remove sessionStorage key:', key, error);
        }
      });
    } catch (error) {
      console.warn('Failed to access sessionStorage:', error);
    }

    // Clear any cached fetch responses that might contain weather data
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        const promises = cacheNames
          .filter(cacheName => 
            cacheName.includes('weather') || cacheName.includes('Weather')
          )
          .map(cacheName => {
            return caches.delete(cacheName).then(success => {
              if (success) {
                console.log('🧹 Cleared legacy cache:', cacheName);
              }
              return success;
            }).catch(error => {
              console.warn('Failed to delete cache:', cacheName, error);
              return false;
            });
          });
        
        return Promise.allSettled(promises);
      }).catch(error => {
        console.warn('Failed to access caches:', error);
      });
    }

    if (keysToRemove.length > 0 || sessionKeysToRemove.length > 0) {
      console.log('🧹 Legacy data cleanup completed');
    }
  } catch (error) {
    console.warn('Legacy data cleanup failed:', error);
  }
};

// Auto-run on import
clearLegacyData();