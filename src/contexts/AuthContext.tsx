
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider render - Auth state:', {
    hasUser: !!user,
    hasSession: !!session,
    isLoading,
    userEmail: user?.email
  });

  // Transform Supabase user to our User interface
  const transformUser = (supabaseUser: SupabaseUser): User => {
    try {
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.email || 'User',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email || 'User')}&background=6366f1&color=fff`
      };
    } catch (error) {
      console.error('Error transforming user:', error);
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: 'User',
        avatar: `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff`
      };
    }
  };

  // Function to refresh user data from the database
  const refreshUser = async () => {
    if (session?.user) {
      try {
        const transformedUser = transformUser(session.user);
        setUser(transformedUser);
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    
    let mounted = true;
    
    // Check for existing session first
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setIsLoading(false);
          }
          return;
        }

        console.log('Initial session check:', session?.user?.email || 'No session');
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          const transformedUser = transformUser(session.user);
          setUser(transformedUser);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          const transformedUser = transformUser(session.user);
          setUser(transformedUser);
          console.log('User authenticated:', transformedUser.email);
        } else {
          setUser(null);
          console.log('User logged out');
        }
        
        setIsLoading(false);
      }
    );

    initializeAuth();

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
      setIsLoading(false);
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
      }
    } catch (error) {
      console.error('Logout exception:', error);
      toast.error('Logout failed');
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user && !!session,
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
