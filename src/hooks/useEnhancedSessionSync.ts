
import { useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Sentry removed
import { useAdvancedCleanup } from './useAdvancedCleanup';

interface UseEnhancedSessionSyncProps {
  setSession: (session: Session | null) => void;
  onError?: (error: Error) => void;
  onSessionChange?: (event: string, session: Session | null) => void;
}

export function useEnhancedSessionSync({ 
  setSession, 
  onError, 
  onSessionChange 
}: UseEnhancedSessionSyncProps) {
  const cleanup = useAdvancedCleanup();

  const syncSession = useCallback(async () => {
    try {
      // Syncing session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session sync error:', error);
        // Sentry removed
        onError?.(error);
        return;
      }
      
      setSession(data?.session || null);
      // Session synced successfully
    } catch (error) {
      const sessionError = error instanceof Error ? error : new Error('Unknown session sync error');
      console.error('Session sync failed:', sessionError);
      // Sentry removed
      onError?.(sessionError);
    }
  }, [setSession, onError]);

  useEffect(() => {
    let mounted = true;
    
    // Initial session sync
    syncSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        // Handle auth state changes without logging sensitive data
        
        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
              setSession(session);
              break;
            case 'SIGNED_OUT':
              setSession(null);
              break;
            case 'TOKEN_REFRESHED':
              setSession(session);
              break;
            case 'USER_UPDATED':
              setSession(session);
              break;
            case 'PASSWORD_RECOVERY':
              // Password recovery initiated
              break;
            default:
              setSession(session);
          }

          // Call custom session change handler
          onSessionChange?.(event, session);
        } catch (error) {
          const authError = error instanceof Error ? error : new Error('Auth state change error');
          console.error('Auth state change error:', authError);
          // Sentry removed
          onError?.(authError);
        }
      }
    );

    // Add subscription to cleanup manager
    cleanup.addListener(window, 'beforeunload', () => {
      subscription?.unsubscribe();
    });

    // Cleanup function
    return () => {
      // Cleaning up enhanced session sync
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setSession, onError, onSessionChange, syncSession, cleanup]);

  return { syncSession };
}
