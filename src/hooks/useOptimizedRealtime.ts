import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '../types/note';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';

interface UseOptimizedRealtimeOptions {
  onInsert?: (note: Note) => void;
  onUpdate?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  enabled?: boolean;
  throttleMs?: number;
}

export const useOptimizedRealtime = ({
  onInsert,
  onUpdate,
  onDelete,
  enabled = true,
  throttleMs = 1000, // 1 second throttle
}: UseOptimizedRealtimeOptions) => {
  const { user, isAuthenticated } = useAuth();
  const channelRef = useRef<any>(null);
  const subscriptionActiveRef = useRef(false);
  const lastEventTimeRef = useRef<Record<string, number>>({});
  const callbacksRef = useRef({ onInsert, onUpdate, onDelete });
  
  // Update callbacks without changing hook order
  callbacksRef.current = { onInsert, onUpdate, onDelete };

  // Throttle function to prevent event flooding
  const throttleEvent = useCallback((eventKey: string, callback: () => void) => {
    const now = Date.now();
    const lastTime = lastEventTimeRef.current[eventKey] || 0;
    
    if (now - lastTime >= throttleMs) {
      lastEventTimeRef.current[eventKey] = now;
      callback();
    }
  }, [throttleMs]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      logger.realtime.debug('Cleaning up realtime subscription');
      try {
        channelRef.current.unsubscribe();
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        logger.realtime.error('Error cleaning up realtime subscription:', error);
      }
      channelRef.current = null;
      subscriptionActiveRef.current = false;
    }
  }, []);

  const setupRealtime = useCallback(async () => {
    if (!enabled || !isAuthenticated || !user) {
      logger.realtime.debug('Realtime disabled or user not authenticated');
      return;
    }

    // Realtime connections disabled to prevent connection errors
    logger.realtime.debug('Realtime connections disabled');
    subscriptionActiveRef.current = false;
    return;
  }, [enabled, isAuthenticated, user?.id]);

  useEffect(() => {
    setupRealtime();
    return cleanup;
  }, [setupRealtime, cleanup]);

  return {
    isConnected: false, // Always false since realtime is disabled
    reconnect: setupRealtime,
    disconnect: cleanup,
  };
};