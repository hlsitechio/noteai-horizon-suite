
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';

export const transformUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Fetch the user profile from our profiles table
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('display_name, avatar_url, welcome_message')
      .eq('id', supabaseUser.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching user profile:', error);
    }

    // Create profile if it doesn't exist
    if (!profile) {
      const newProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        display_name: supabaseUser.email?.split('@')[0] || 'User',
      };

      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert(newProfile);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
      }
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.display_name || supabaseUser.email?.split('@')[0] || 'User',
      avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || supabaseUser.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`,
      welcome_message: profile?.welcome_message || 'Welcome back'
    };
  } catch (error) {
    console.error('Error transforming user:', error);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`,
      welcome_message: 'Welcome back'
    };
  }
};

export const clearCorruptedSession = async () => {
  console.log('Clearing potentially corrupted session data');
  try {
    // Clear all possible session storage keys
    const authKeys = [
      'supabase.auth.token',
      'sb-qrdulwzjgbfgaplazgsh-auth-token',
      'supabase-auth-token',
      'sb-auth-token'
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Force sign out without waiting for response to avoid hanging
    supabase.auth.signOut({ scope: 'local' });
    
    console.log('Session data cleared successfully');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

export const handleRefreshTokenError = async (error: Error) => {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('invalid refresh token') || 
      errorMessage.includes('refresh token not found') ||
      errorMessage.includes('jwt') ||
      errorMessage.includes('expired')) {
    console.log('Authentication error detected, clearing session:', error.message);
    await clearCorruptedSession();
    return true;
  }
  return false;
};
