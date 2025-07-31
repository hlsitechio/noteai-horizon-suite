
import { toast } from 'sonner';
import { clearCorruptedSession, handleRefreshTokenError } from './utils';
import { logger } from '../../utils/logger';

const API_BASE_URL = window.location.origin + '/api';

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export const loginUser = async (email: string, password: string): Promise<{ success: boolean; user?: any }> => {
  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (data.user) {
      // Development logging only
      if (import.meta.env.DEV) {
        console.log('Login successful');
      }
      toast.success('Welcome back!');
      
      // Trigger a window event to update auth state
      window.dispatchEvent(new Event('auth-state-change'));
      
      return { success: true, user: data.user };
    }

    return { success: false };
  } catch (error: any) {
    console.error('Login exception:', error);
    
    if (error.message.includes('Invalid credentials')) {
      toast.error('Invalid email or password. Please check your credentials.');
    } else if (error.message.includes('Session expired')) {
      await clearCorruptedSession();
      toast.error('Session expired. Please try logging in again.');
    } else {
      toast.error(error.message || 'Login failed. Please try again.');
    }
    return { success: false };
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    });

    if (data.user) {
      // Development logging only
      if (import.meta.env.DEV) {
        console.log('Registration successful');
      }
      toast.success('Account created successfully! Please log in.');
      
      return true;
    }

    return false;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message.includes('already exists')) {
      toast.error('An account with this email already exists. Please try logging in instead.');
    } else if (error.message.includes('Password')) {
      toast.error('Password must be at least 6 characters long.');
    } else {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
    return false;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
    
    await clearCorruptedSession();
    toast.success('Logged out successfully');
    
    // Trigger a window event to update auth state
    window.dispatchEvent(new Event('auth-state-change'));
  } catch (error) {
    console.error('Logout exception:', error);
    toast.error('Logout failed');
  }
};

export const initializeAuthSession = async () => {
  try {
    logger.auth.debug('Initializing auth session...');
    
    // Get the current session from our API
    try {
      const data = await apiRequest('/auth/me');
      
      if (data.user) {
        logger.auth.debug('Valid session found:', data.user.email);
        return { session: { user: data.user }, error: null };
      } else {
        logger.auth.debug('No active session found');
        return { session: null, error: null };
      }
    } catch (error) {
      logger.auth.error('Error getting session:', error);
      
      // Handle authentication errors
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        logger.auth.debug('No valid session, user needs to login');
        return { session: null, error: null };
      }
      
      return { session: null, error };
    }
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
    await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      }),
    });

    toast.success('Password reset email sent! Please check your inbox.');
    return true;
  } catch (error: any) {
    console.error('Password reset exception:', error);
    toast.error(error.message || 'Failed to send password reset email. Please try again.');
    return false;
  }
};

// Update password function
export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    await apiRequest('/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({
        password: newPassword,
      }),
    });

    toast.success('Password updated successfully!');
    return true;
  } catch (error: any) {
    console.error('Password update exception:', error);
    toast.error(error.message || 'Failed to update password. Please try again.');
    return false;
  }
};
