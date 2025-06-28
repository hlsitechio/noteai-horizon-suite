
import { useEffect, useRef } from 'react';
import { CleanupManager } from '@/utils/memoryCleanup';

/**
 * Hook to manage component cleanup automatically
 */
export function useCleanupManager() {
  const cleanupManagerRef = useRef<CleanupManager | null>(null);

  // Initialize cleanup manager
  if (!cleanupManagerRef.current) {
    cleanupManagerRef.current = new CleanupManager();
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
