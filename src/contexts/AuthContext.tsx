import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/useAuthState';
import { loginUser, registerUser, logoutUser, initializeAuthSession } from './auth/authService';
import { handleRefreshTokenError, clearCorruptedSession } from './auth/utils';

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

  console.log('AuthProvider render - Auth state:', {
    hasUser: !!user,
    hasSession: !!session,
    isLoading,
    userEmail: user?.email
  });

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
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

    // Set up auth state listener with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        try {
          // Handle different auth events
          switch (event) {
            case 'TOKEN_REFRESHED':
              if (!session) {
                console.log('Token refresh failed, clearing session');
                await clearCorruptedSession();
                clearAuth();
                return;
              }
              break;
              
            case 'SIGNED_OUT':
              clearAuth();
              return;
              
            case 'SIGNED_IN':
              console.log(`User signed in: ${session?.user?.email}`);
              break;
          }
          
          setSession(session);
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (error instanceof Error && await handleRefreshTokenError(error)) {
            clearAuth();
          }
        }
      }
    );

    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, clearAuth]);

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
