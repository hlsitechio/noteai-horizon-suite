import { useCallback } from 'react';

interface UseOptimizedRealtimeOptions {
  onInsert?: (note: any) => void;
  onUpdate?: (note: any) => void;
  onDelete?: (noteId: string) => void;
  enabled?: boolean;
  throttleMs?: number;
}

export const useOptimizedRealtime = ({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
  throttleMs = 1000,
}: UseOptimizedRealtimeOptions) => {
  // Real-time functionality completely removed
  console.log('Real-time subscription for tasks disabled');

  const cleanup = useCallback(() => {
    // No cleanup needed as realtime is disabled
  }, []);

  const setupRealtime = useCallback(async () => {
    // Realtime functionality removed
    return;
  }, []);

  return {
    isConnected: false, // Always false since realtime is disabled
    reconnect: setupRealtime,
    disconnect: cleanup,
  };
};