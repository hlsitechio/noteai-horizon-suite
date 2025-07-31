/**
 * Clear Legacy Data Script
 * Removes any lingering weather data, cached errors, or outdated storage entries
 */

export const clearLegacyData = () => {
  if (typeof window === 'undefined') return;

  try {
    // Clear weather-related localStorage entries
    const keysToRemove: string[] = [];
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
      localStorage.removeItem(key);
      console.log('🧹 Cleared legacy data:', key);
    });

    // Clear weather-related sessionStorage entries
    const sessionKeysToRemove: string[] = [];
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
      sessionStorage.removeItem(key);
      console.log('🧹 Cleared legacy session data:', key);
    });

    // Clear any cached fetch responses that might contain weather data
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('weather') || cacheName.includes('Weather')) {
            caches.delete(cacheName);
            console.log('🧹 Cleared legacy cache:', cacheName);
          }
        });
      }).catch(() => {
        // Cache clearing failed, but it's non-critical
      });
    }

    if (keysToRemove.length > 0 || sessionKeysToRemove.length > 0) {
      console.log('🧹 Legacy data cleanup completed');
    }
  } catch (error) {
    // Silent fail - legacy data cleanup is non-critical
  }
};

// Auto-run on import
clearLegacyData();