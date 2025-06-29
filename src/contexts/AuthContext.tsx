
import React, { createContext, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useAuthState } from './auth/useAuthState';
import { loginUser, registerUser, logoutUser, initializeAuthSession } from './auth/authService';
import { handleRefreshTokenError, clearCorruptedSession } from './auth/utils';
import { authSecurityEnhancer } from '@/utils/authSecurityEnhancer';
import { securityMonitor } from '@/utils/securityMonitor';
import { secureLog } from '@/utils/securityUtils';

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

  secureLog.info('AuthProvider render - Auth state', {
    hasUser: !!user,
    hasSession: !!session,
    isLoading,
    userEmail: user?.email
  });

  useEffect(() => {
    secureLog.info('AuthProvider: Setting up enhanced auth state listener');
    
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { session, error } = await initializeAuthSession();
        
        if (!mounted) return;
        
        if (error) {
          secureLog.error('Auth initialization error', error);
          clearAuth();
          return;
        }
        
        setSession(session);
        
        // Validate session security
        if (session) {
          const isSecure = await authSecurityEnhancer.checkSessionSecurity();
          if (!isSecure) {
            secureLog.security('Session security check failed, clearing session');
            clearAuth();
            return;
          }
        }
      } catch (error) {
        secureLog.error('Auth initialization exception', error);
        clearAuth();
      }
    };

    // Set up enhanced auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        secureLog.info('Auth state changed', { event, hasSession: !!session });
        
        if (!mounted) return;
        
        try {
          // Log authentication events for security monitoring
          securityMonitor.applyRules({
            type: 'auth_event',
            event,
            hasSession: !!session,
            timestamp: new Date().toISOString()
          });
          
          // Handle token refresh errors
          if (event === 'TOKEN_REFRESHED' && !session) {
            secureLog.security('Token refresh failed, clearing session');
            await clearCorruptedSession();
            clearAuth();
            return;
          }
          
          // Additional security checks for sign-in events
          if (event === 'SIGNED_IN' && session) {
            const isSecure = await authSecurityEnhancer.checkSessionSecurity();
            if (!isSecure) {
              secureLog.security('New session failed security check');
              await logoutUser();
              return;
            }
          }
          
          setSession(session);
          secureLog.info(session?.user ? `User authenticated: ${session.user.email}` : 'User logged out');
        } catch (error) {
          secureLog.error('Auth state change error', error);
          clearAuth();
        }
      }
    );

    initializeAuth();

    return () => {
      secureLog.info('AuthProvider: Cleaning up enhanced auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setSession, clearAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Enhanced security checks
      const emailValidation = authSecurityEnhancer.validateEmail(email);
      if (!emailValidation.isValid) {
        secureLog.security('Invalid email format in login attempt', { email });
        return false;
      }

      const passwordValidation = authSecurityEnhancer.validatePassword(password);
      if (!passwordValidation.isValid) {
        secureLog.security('Weak password in login attempt');
        return false;
      }

      // Check login attempts
      const attemptCheck = authSecurityEnhancer.checkLoginAttempts(email);
      if (!attemptCheck.canAttempt) {
        secureLog.security('Login attempt blocked due to rate limiting', { email });
        return false;
      }

      const success = await loginUser(email, password);
      authSecurityEnhancer.recordLoginAttempt(email, success);
      
      if (success) {
        secureLog.info('User login successful', { email });
      } else {
        secureLog.security('User login failed', { email });
      }
      
      return success;
    } catch (error) {
      secureLog.error('Login exception', error);
      authSecurityEnhancer.recordLoginAttempt(email, false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Enhanced security validation
      const emailValidation = authSecurityEnhancer.validateEmail(email);
      if (!emailValidation.isValid) {
        secureLog.security('Invalid email format in registration', { email });
        return false;
      }

      const passwordValidation = authSecurityEnhancer.validatePassword(password);
      if (!passwordValidation.isValid) {
        secureLog.security('Weak password in registration attempt');
        return false;
      }

      // Sanitize name input
      const sanitizedName = authSecurityEnhancer.sanitizeInput(name);
      
      const success = await registerUser(sanitizedName, email, password);
      
      if (success) {
        secureLog.info('User registration successful', { email });
      } else {
        secureLog.security('User registration failed', { email });
      }
      
      return success;
    } catch (error) {
      secureLog.error('Registration exception', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      secureLog.info('User logout initiated');
      await logoutUser();
      secureLog.info('User logout completed');
    } catch (error) {
      secureLog.error('Logout error', error);
    }
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
