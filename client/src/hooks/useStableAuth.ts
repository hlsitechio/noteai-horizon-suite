import { useState, useEffect, useCallback, useRef } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '@/contexts/auth/types';
import { supabase } from '@/integrations/supabase/client';
import { transformUser, handleRefreshTokenError, clearCorruptedSession } from '@/contexts/auth/utils';
import { logger } from '@/utils/logger';

interface UseStableAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  retryAuth: () => Promise<void>;
}

/**
 * Stable auth hook that prevents reload loops and handles errors gracefully
 */
export const useStableAuth = (): UseStableAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);
  const lastSessionRef = useRef<Session | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const isAuthenticated = !!user && !!session;

  // Stable session handler that prevents unnecessary updates
  const handleAuthChange = useCallback(async (newSession: Session | null, skipLoading = false) => {
    if (!mountedRef.current) return;
    
    // Prevent unnecessary state updates if session hasn't actually changed
    const sessionChanged = lastSessionRef.current?.user?.id !== newSession?.user?.id ||
                           lastSessionRef.current?.access_token !== newSession?.access_token;
    
    // Minimal auth state logging - only for critical debugging
    if (import.meta.env.DEV && sessionChanged) {
      const maskedUserId = newSession?.user?.id?.substring(0, 8) + '***' || null;
      logger.auth.debug('Auth session updated', {
        hasSession: !!newSession,
        userId: maskedUserId
      });
    }
    
    if (!sessionChanged && lastSessionRef.current !== null && newSession !== null) {
      return; // Remove the verbose "Session unchanged" logging
    }
    
    lastSessionRef.current = newSession;
    setSession(newSession);
    
    // Transform user if session exists
    if (newSession?.user) {
      try {
        const transformedUser = await transformUser(newSession.user);
        setUser(transformedUser);
      } catch (error) {
        logger.auth.error('Error transforming user:', error);
        // Fallback to basic user data
        const fallbackUser: User = {
          id: newSession.user.id,
          email: newSession.user.email || '',
          name: newSession.user.email?.split('@')[0] || 'User',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newSession.user.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
        };
        setUser(fallbackUser);
      }
    } else {
      setUser(null);
    }
    
    setAuthError(null);
    retryCountRef.current = 0; // Reset retry count on successful auth change
    
    if (!skipLoading && isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Retry auth with exponential backoff
  const retryAuth = useCallback(async () => {
    if (retryCountRef.current >= maxRetries) {
      logger.auth.error('Max auth retries reached');
      return;
    }

    retryCountRef.current++;
    const delay = Math.pow(2, retryCountRef.current) * 1000; // Exponential backoff
    
    logger.auth.debug(`Retrying auth (attempt ${retryCountRef.current}/${maxRetries}) in ${delay}ms`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        // Handle refresh token errors specifically in retry
        if (await handleRefreshTokenError(error)) {
          logger.auth.info('Corrupted session cleared during retry');
          setSession(null);
          setUser(null);
          setAuthError(null);
          return;
        }
        throw error;
      }
      
      await handleAuthChange(session);
    } catch (error) {
      logger.auth.error('Auth retry failed:', error);
      
      // Handle refresh token errors specifically in catch
      if (error instanceof Error && await handleRefreshTokenError(error)) {
        logger.auth.info('Corrupted session cleared during retry catch');
        setSession(null);
        setUser(null);
        setAuthError(null);
        return;
      }
      
      setAuthError(error instanceof Error ? error.message : 'Authentication retry failed');
    }
  }, [handleAuthChange]);

  // Initialize auth state with error handling
  const initializeAuth = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!mountedRef.current) return;
      
      if (error) {
        // Handle refresh token errors specifically
        if (await handleRefreshTokenError(error)) {
          logger.auth.info('Corrupted session cleared, user needs to sign in again');
          setSession(null);
          setUser(null);
          setAuthError(null);
          return;
        }
        throw error;
      }

      await handleAuthChange(session);
      logger.auth.debug('Auth initialized successfully');
    } catch (error) {
      logger.auth.error('Error initializing auth:', error);
      
      // Handle refresh token errors specifically
      if (error instanceof Error && await handleRefreshTokenError(error)) {
        logger.auth.info('Corrupted session cleared during initialization');
        setSession(null);
        setUser(null);
        setAuthError(null);
        return;
      }
      
      setAuthError(error instanceof Error ? error.message : 'Failed to initialize authentication');
      
      // Attempt retry after initial failure
      if (retryCountRef.current < maxRetries) {
        retryAuth();
      }
    } finally {
      if (mountedRef.current) {
        initializingRef.current = false;
        setIsLoading(false);
      }
    }
  }, [handleAuthChange, retryAuth]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Set up auth state listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        
        logger.auth.debug('Auth state changed:', event, session?.user?.email);
        
        try {
          // Handle auth events with error recovery
          switch (event) {
            case 'TOKEN_REFRESHED':
              if (!session) {
                logger.auth.warn('Token refresh failed, session is null');
                setAuthError('Session expired. Please sign in again.');
                return;
              }
              break;
              
            case 'SIGNED_OUT':
              setAuthError(null); // Clear any previous errors on sign out
              break;
              
            case 'SIGNED_IN':
              logger.auth.debug(`User signed in: ${session?.user?.email}`);
              setAuthError(null); // Clear any previous errors on sign in
              break;
          }
          
          handleAuthChange(session, true);
        } catch (error) {
          logger.auth.error('Error in auth state change:', error);
          setAuthError(error instanceof Error ? error.message : 'Authentication error occurred');
          
        }
      }
    );

    // Listen for custom auth state change events from login
    const handleCustomAuthChange = () => {
      logger.auth.debug('Custom auth state change triggered, refreshing session');
      retryAuth();
    };

    window.addEventListener('auth-state-change', handleCustomAuthChange);

    // Initialize auth state
    initializeAuth();

    return () => {
      logger.auth.debug('Cleaning up stable auth');
      mountedRef.current = false;
      subscription.unsubscribe();
      window.removeEventListener('auth-state-change', handleCustomAuthChange);
    };
  }, [handleAuthChange, initializeAuth, retryAuth]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    authError,
    retryAuth,
  };
};