
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clearCorruptedSession, handleRefreshTokenError } from './utils';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid Refresh Token')) {
        await clearCorruptedSession();
        toast.error('Session expired. Please try logging in again.');
      } else {
        toast.error(error.message);
      }
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
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
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
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    } else {
      await clearCorruptedSession();
      toast.success('Logged out successfully');
    }
  } catch (error) {
    console.error('Logout exception:', error);
    toast.error('Logout failed');
  }
};

export const initializeAuthSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      
      if (await handleRefreshTokenError(error)) {
        return { session: null, error };
      }
      
      return { session: null, error };
    }

    console.log('Initial session check:', session?.user?.email || 'No session');
    return { session, error: null };
  } catch (error) {
    console.error('Error initializing auth:', error);
    
    if (error instanceof Error && await handleRefreshTokenError(error)) {
      return { session: null, error };
    }
    
    return { session: null, error };
  }
};

// Helper function for OAuth sign-in with redirect (no popup)
export const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        // Ensure we use redirect flow, not popup
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('OAuth sign-in error:', error);
      toast.error(`Failed to sign in with ${provider}`);
      return false;
    }

    // With redirect flow, we don't get immediate response
    // The user will be redirected and handled by onAuthStateChange
    return true;
  } catch (error) {
    console.error('OAuth sign-in exception:', error);
    toast.error(`Failed to sign in with ${provider}`);
    return false;
  }
};
