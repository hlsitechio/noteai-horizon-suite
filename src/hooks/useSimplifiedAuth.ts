
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useSimplifiedAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const mounted = useRef(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted.current) return;
        
        if (error) {
          console.error('Auth initialization error:', error);
          setAuthState({ user: null, isLoading: false, isAuthenticated: false });
          return;
        }

        setAuthState({
          user: session?.user || null,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      } catch (error) {
        console.error('Auth initialization exception:', error);
        if (mounted.current) {
          setAuthState({ user: null, isLoading: false, isAuthenticated: false });
        }
      }
    };

    // Set up auth state listener with debouncing
    let debounceTimer: NodeJS.Timeout;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted.current) return;
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (!mounted.current) return;
          
          setAuthState({
            user: session?.user || null,
            isLoading: false,
            isAuthenticated: !!session?.user,
          });
        }, 100);
      }
    );

    initializeAuth();

    return () => {
      mounted.current = false;
      initialized.current = false;
      clearTimeout(debounceTimer);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
};
