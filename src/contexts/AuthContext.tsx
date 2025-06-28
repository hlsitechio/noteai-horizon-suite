import React, { createContext, useContext, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useSimplifiedAuthState } from './auth/useSimplifiedAuthState';
import { toast } from 'sonner';

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
  } = useSimplifiedAuthState();

  const mounted = useRef(true);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    initialized.current = true;

    console.log('AuthProvider: Initializing auth state');

    const initializeAuth = async () => {
      try {
        // Set a shorter timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          if (mounted.current) {
            console.log('Auth initialization timeout, clearing auth and setting loading to false');
            clearAuth();
          }
        }, 3000); // Reduced from 5000 to 3000ms

        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (!mounted.current) return;
        
        if (error) {
          console.error('Auth initialization error:', error);
          clearAuth();
          return;
        }

        console.log('Auth: Session retrieved, setting session state');
        setSession(session);
        console.log(session?.user ? `User authenticated: ${session.user.email}` : 'No active session');
      } catch (error) {
        console.error('Auth initialization exception:', error);
        if (mounted.current) {
          clearAuth();
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted.current) return;
        
        console.log('Auth state changed:', event, session ? 'with session' : 'no session');
        setSession(session);
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up');
      mounted.current = false;
      initialized.current = false;
      subscription.unsubscribe();
    };
  }, [setSession, clearAuth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Welcome back!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: name,
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Account created successfully! Please check your email to verify your account.');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration exception:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout failed');
      } else {
        toast.success('Logged out successfully');
        // Clear local storage
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-qrdulwzjgbfgaplazgsh-auth-token');
      }
    } catch (error) {
      console.error('Logout exception:', error);
      toast.error('Logout failed');
    }
  };

  const refreshUser = async () => {
    // Simplified refresh - just use current session data
    if (session?.user) {
      console.log('User data refreshed from session');
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

export { AuthContext };
