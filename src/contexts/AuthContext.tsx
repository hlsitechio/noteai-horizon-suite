import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useStableAuth } from '@/hooks/useStableAuth';
import { loginUser, registerUser, logoutUser } from './auth/authService';
import { logger } from '../utils/logger';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PasskeySetupModal } from '@/components/Auth/PasskeySetupModal';
import { isPasskeySupported } from '@/services/webauthn/client';

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

  const [showPasskeySetup, setShowPasskeySetup] = useState(false);

  // Check if we should show passkey setup after successful auth
  useEffect(() => {
    const checkPasskeySetup = async () => {
      if (isAuthenticated && user && !isLoading) {
        // Check if user has any passkeys already
        try {
          const response = await fetch('/functions/v1/passkey-manage');
          if (response.ok) {
            const passkeys = await response.json();
            // Show setup modal if user has no passkeys and browser supports it
            if (passkeys.length === 0 && isPasskeySupported()) {
              // Only show once per session
              const hasShownSetup = sessionStorage.getItem('passkey-setup-shown');
              if (!hasShownSetup) {
                setShowPasskeySetup(true);
                sessionStorage.setItem('passkey-setup-shown', 'true');
              }
            }
          }
        } catch (error) {
          logger.auth.error('Error checking passkey setup:', error);
        }
      }
    };

    checkPasskeySetup();
  }, [isAuthenticated, user, isLoading]);

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
    showPasskeySetup,
    setShowPasskeySetup,
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={contextValue}>
        {children}
        <PasskeySetupModal
          isOpen={showPasskeySetup}
          onClose={() => setShowPasskeySetup(false)}
          onSkip={() => setShowPasskeySetup(false)}
        />
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};

// Export the context itself for use in App.tsx
export { AuthContext };
