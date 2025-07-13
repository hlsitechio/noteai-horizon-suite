
import { useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
// Sentry removed

interface UseSessionSyncProps {
  setSession: (session: Session | null) => void;
  onError?: (error: Error) => void;
}

export function useSessionSync({ setSession, onError }: UseSessionSyncProps) {
  const syncSession = useCallback(async () => {
    try {
      console.log('Syncing session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session sync error:', error);
        // Sentry removed
        onError?.(error);
        return;
      }
      
      setSession(data?.session || null);
      console.log('Session synced successfully:', !!data?.session);
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
        } catch (error) {
          const authError = error instanceof Error ? error : new Error('Auth state change error');
          console.error('Auth state change error:', authError);
          // Sentry removed
          onError?.(authError);
        }
      }
    );

    // Cleanup function
    return () => {
      console.log('Cleaning up session sync');
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setSession, onError, syncSession]);

  return { syncSession };
}
