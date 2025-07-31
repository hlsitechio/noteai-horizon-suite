import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseOptimizedAuthReturn {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (name: string, email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useOptimizedAuth = (): UseOptimizedAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializingRef = useRef(false);
  const mountedRef = useRef(true);

  const isAuthenticated = !!user && !!session;

  // Optimized session handler
  const handleAuthChange = useCallback((session: Session | null) => {
    if (!mountedRef.current) return;
    
    setSession(session);
    setUser(session?.user ?? null);
    
    if (isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    if (initializingRef.current) return;
    initializingRef.current = true;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!mountedRef.current) return;
      
      if (error) {
        console.error('Error getting session:', error);
        handleAuthChange(null);
        return;
      }

      handleAuthChange(session);
    } catch (error) {
      console.error('Error initializing auth:', error);
      if (mountedRef.current) {
        handleAuthChange(null);
      }
    } finally {
      if (mountedRef.current) {
        initializingRef.current = false;
      }
    }
  }, [handleAuthChange]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mountedRef.current) return;
        
        // Handle auth state change without logging
        
        // Handle auth events synchronously to prevent deadlocks
        handleAuthChange(session);
        
        // Handle specific events
        if (event === 'SIGNED_OUT') {
          // Clear any cached data
          localStorage.removeItem('supabase.auth.token');
        }
      }
    );

    // Initialize auth state
    initializeAuth();

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange, initializeAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!mountedRef.current) return;
      
      if (error) {
        console.error('Error refreshing user:', error);
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };
};