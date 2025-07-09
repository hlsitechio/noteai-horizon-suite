import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useStableAuth } from '@/hooks/useStableAuth';
import { loginUser, registerUser, logoutUser } from './auth/authService';
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
    authError,
    retryAuth,
  } = useStableAuth();

  // The stable auth hook handles all auth state management internally

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      return await loginUser(email, password);
    } catch (error) {
      logger.auth.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      return await registerUser(name, email, password);
    } catch (error) {
      logger.auth.error('Registration failed:', error);
      return false;
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
    refreshUser: retryAuth, // Use retryAuth as refreshUser
    authError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context itself for use in App.tsx
export { AuthContext };
