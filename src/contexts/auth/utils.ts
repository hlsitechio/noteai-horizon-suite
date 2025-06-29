
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
if (!supabaseUrl) {
  console.warn('Supabase URL is not configured')
}
const supabaseProjectRef = supabaseUrl ?
  new URL(supabaseUrl).hostname.split('.')[0] : ''
const AUTH_TOKEN_KEY = supabaseProjectRef
  ? `sb-${supabaseProjectRef}-auth-token`
  : 'supabase.auth.token'

export const transformUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Fetch the user profile from our profiles table
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('display_name, avatar_url')
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
      avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || supabaseUser.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
    };
  } catch (error) {
    console.error('Error transforming user:', error);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email?.split('@')[0] || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email?.split('@')[0] || 'User')}&background=6366f1&color=fff`
    };
  }
};

export const clearCorruptedSession = async () => {
  console.log('Clearing potentially corrupted session data');
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

export const handleRefreshTokenError = async (error: Error) => {
  if (error.message.includes('Invalid Refresh Token') || 
      error.message.includes('Refresh Token Not Found')) {
    console.log('Invalid refresh token detected, clearing session');
    await clearCorruptedSession();
    return true;
  }
  return false;
};
