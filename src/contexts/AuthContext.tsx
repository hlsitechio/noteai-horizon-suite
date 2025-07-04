import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/useAuthState';
import { loginUser, registerUser, logoutUser, initializeAuthSession } from './auth/authService';
import { handleRefreshTokenError, clearCorruptedSession } from './auth/utils';
import { logger } from '../utils/logger';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    setLoading,
    setSession,
    clearAuth,
    refreshUser,
  } = useAuthState();

  useEffect(() => {
    logger.auth.debug('Setting up auth state listener');
    
    let mounted = true;
    
    const initializeAuth = async () => {
      const { session, error } = await initializeAuthSession();
      
      if (!mounted) return;
      
      if (error) {
        clearAuth();
        return;
      }
      
      setSession(session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.auth.debug('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        try {
          // Handle different auth events
          switch (event) {
            case 'TOKEN_REFRESHED':
              if (!session) {
                logger.auth.debug('Token refresh failed, clearing session');
                await clearCorruptedSession();
                clearAuth();
                return;
              }
              break;
              
            case 'SIGNED_OUT':
              clearAuth();
              return;
              
            case 'SIGNED_IN':
              logger.auth.debug(`User signed in: ${session?.user?.email}`);
              break;
          }
          
          setSession(session);
        } catch (error) {
          logger.auth.error('Error in auth state change:', error);
          if (error instanceof Error && await handleRefreshTokenError(error)) {
            clearAuth();
          }
        }
      }
    );

    initializeAuth();

    return () => {
      logger.auth.debug('Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array since functions are now stable

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      return await loginUser(email, password);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      return await registerUser(name, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context itself for use in App.tsx
export { AuthContext };
