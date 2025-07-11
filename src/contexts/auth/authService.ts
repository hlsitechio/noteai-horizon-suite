
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { clearCorruptedSession, handleRefreshTokenError } from './utils';
import { logger } from '../../utils/logger';

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    // Clear any existing session first
    await supabase.auth.signOut();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('Login error:', error);
      
      if (error.message.includes('Invalid Refresh Token')) {
        await clearCorruptedSession();
        toast.error('Session expired. Please try logging in again.');
      } else if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please check your credentials.');
      } else {
        toast.error(error.message);
      }
      return false;
    }

    if (data.user && data.session) {
      // Development logging only
      if (import.meta.env.DEV) {
        console.log('Login successful');
      }
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
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: name.trim(),
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      
      if (error.message.includes('User already registered')) {
        toast.error('An account with this email already exists. Please try logging in instead.');
      } else if (error.message.includes('Password should be at least')) {
        toast.error('Password must be at least 6 characters long.');
      } else {
        toast.error(error.message);
      }
      return false;
    }

    if (data.user) {
      if (!data.session) {
        toast.success('Account created successfully! Please check your email to verify your account before signing in.');
      } else {
        toast.success('Account created and verified successfully!');
      }
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
    logger.auth.debug('Initializing auth session...');
    
    // First, try to get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      logger.auth.error('Error getting session:', error);
      
      // Handle refresh token errors immediately
      if (await handleRefreshTokenError(error)) {
        logger.auth.debug('Cleared corrupted session, user needs to login again');
        return { session: null, error: null }; // Don't propagate auth errors
      }
      
      return { session: null, error };
    }

    if (session) {
      logger.auth.debug('Valid session found:', session.user?.email);
      // Verify the session is actually valid by making a test request
      try {
        const { error: testError } = await supabase.auth.getUser();
        if (testError && await handleRefreshTokenError(testError)) {
          logger.auth.debug('Session validation failed, clearing corrupted session');
          return { session: null, error: null };
        }
      } catch (testError) {
        logger.auth.error('Session validation error:', testError);
        if (testError instanceof Error && await handleRefreshTokenError(testError)) {
          return { session: null, error: null };
        }
      }
    } else {
      logger.auth.debug('No active session found');
    }

    return { session, error: null };
  } catch (error) {
    logger.auth.error('Error initializing auth:', error);
    
    if (error instanceof Error && await handleRefreshTokenError(error)) {
      return { session: null, error: null };
    }
    
    return { session: null, error };
  }
};

// Password reset function (email/password only)
export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      toast.error(error.message);
      return false;
    }

    toast.success('Password reset email sent! Please check your inbox.');
    return true;
  } catch (error) {
    console.error('Password reset exception:', error);
    toast.error('Failed to send password reset email. Please try again.');
    return false;
  }
};

// Update password function
export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Password update error:', error);
      toast.error(error.message);
      return false;
    }

    toast.success('Password updated successfully!');
    return true;
  } catch (error) {
    console.error('Password update exception:', error);
    toast.error('Failed to update password. Please try again.');
    return false;
  }
};
