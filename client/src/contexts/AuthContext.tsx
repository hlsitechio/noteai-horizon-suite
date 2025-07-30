import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useStableAuth } from '@/hooks/useStableAuth';
import { loginUser, registerUser, logoutUser } from './auth/authService';
import { logger } from '../utils/logger';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PasskeySetupModal } from '@/components/Auth/PasskeySetupModal';
import { StorageSetupModal } from '@/components/Auth/StorageSetupModal';
import { isPasskeySupported } from '@/services/webauthn/client';
import { useStorageInitialization } from '@/hooks/useStorageInitialization';

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
  const [showStorageSetup, setShowStorageSetup] = useState(false);

  // Check storage initialization status
  const storageInit = useStorageInitialization(user?.id || null);

  // Check if we should show storage setup first, then passkey setup
  useEffect(() => {
    const checkSetupFlow = async () => {
      if (isAuthenticated && user && !isLoading && !storageInit.isLoading) {
        // First priority: Storage setup
        if (storageInit.needsInitialization && !showStorageSetup) {
          const hasShownStorageSetup = sessionStorage.getItem('storage-setup-shown');
          if (!hasShownStorageSetup) {
            setShowStorageSetup(true);
            sessionStorage.setItem('storage-setup-shown', 'true');
            return; // Don't check passkey setup yet
          }
        }

        // Second priority: Passkey setup (only after storage is initialized)
        if (storageInit.isInitialized && !showPasskeySetup) {
          try {
            const response = await fetch('/functions/v1/passkey-manage');
            if (response.ok) {
              const passkeys = await response.json();
              // Show setup modal if user has no passkeys and browser supports it
              if (passkeys.length === 0 && isPasskeySupported()) {
                // Only show once per session
                const hasShownPasskeySetup = sessionStorage.getItem('passkey-setup-shown');
                if (!hasShownPasskeySetup) {
                  setShowPasskeySetup(true);
                  sessionStorage.setItem('passkey-setup-shown', 'true');
                }
              }
            }
          } catch (error) {
            logger.auth.error('Error checking passkey setup:', error);
          }
        }
      }
    };

    checkSetupFlow();
  }, [isAuthenticated, user, isLoading, storageInit.isLoading, storageInit.needsInitialization, storageInit.isInitialized, showStorageSetup, showPasskeySetup]);

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
    showStorageSetup,
    setShowStorageSetup,
    storageInitialization: storageInit,
  };

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={contextValue}>
        {children}
        <StorageSetupModal
          isOpen={showStorageSetup}
          onClose={() => {
            setShowStorageSetup(false);
            storageInit.refreshStatus();
          }}
          onComplete={() => {
            storageInit.markAsInitialized();
            setShowStorageSetup(false);
          }}
        />
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
