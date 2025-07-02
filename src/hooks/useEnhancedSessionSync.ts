
import { useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import * as Sentry from '@sentry/react';
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
      console.log('Syncing session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session sync error:', error);
        Sentry.captureException(error, {
          tags: { context: 'session_sync' }
        });
        onError?.(error);
        return;
      }
      
      setSession(data?.session || null);
      console.log('Session synced successfully:', !!data?.session);
    } catch (error) {
      const sessionError = error instanceof Error ? error : new Error('Unknown session sync error');
      console.error('Session sync failed:', sessionError);
      Sentry.captureException(sessionError, {
        tags: { context: 'session_sync_catch' }
      });
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
        
        console.log('Auth state changed:', event, !!session);
        
        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
              console.log('User signed in');
              setSession(session);
              break;
            case 'SIGNED_OUT':
              console.log('User signed out');
              setSession(null);
              break;
            case 'TOKEN_REFRESHED':
              console.log('Token refreshed');
              setSession(session);
              break;
            case 'USER_UPDATED':
              console.log('User updated');
              setSession(session);
              break;
            case 'PASSWORD_RECOVERY':
              console.log('Password recovery initiated');
              break;
            default:
              setSession(session);
          }

          // Call custom session change handler
          onSessionChange?.(event, session);
        } catch (error) {
          const authError = error instanceof Error ? error : new Error('Auth state change error');
          console.error('Auth state change error:', authError);
          Sentry.captureException(authError, {
            tags: { 
              context: 'auth_state_change',
              event: event 
            }
          });
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
      console.log('Cleaning up enhanced session sync');
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setSession, onError, onSessionChange, syncSession, cleanup]);

  return { syncSession };
}
