
import { useEffect, useRef } from 'react';
import { EnhancedCleanupManager } from '@/utils/enhancedMemoryCleanup';

/**
 * Hook to manage component cleanup automatically with enhanced features
 */
export function useEnhancedCleanupManager() {
  const cleanupManagerRef = useRef<EnhancedCleanupManager | null>(null);

  // Initialize cleanup manager
  if (!cleanupManagerRef.current) {
    cleanupManagerRef.current = new EnhancedCleanupManager();
  }

  const cleanup = cleanupManagerRef.current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupManagerRef.current) {
        cleanupManagerRef.current.cleanup();
        cleanupManagerRef.current = null;
      }
    };
  }, []);

  return cleanup;
}
