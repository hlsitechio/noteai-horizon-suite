
import { useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseSessionSyncProps {
  setSession: (session: Session | null) => void;
  onError?: (error: Error) => void;
}

export function useSessionSync({ setSession, onError }: UseSessionSyncProps) {
  const syncSession = useCallback(async () => {
    try {
      // Syncing session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session sync error:', error);
        onError?.(error);
        return;
      }
      
      setSession(data?.session || null);
      // Session synced successfully
    } catch (error) {
      const sessionError = error instanceof Error ? error : new Error('Unknown session sync error');
      console.error('Session sync failed:', sessionError);
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
        } catch (error) {
          const authError = error instanceof Error ? error : new Error('Auth state change error');
          console.error('Auth state change error:', authError);
          
          onError?.(authError);
        }
      }
    );

    // Cleanup function
    return () => {
      // Cleaning up session sync
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [setSession, onError, syncSession]);

  return { syncSession };
}
