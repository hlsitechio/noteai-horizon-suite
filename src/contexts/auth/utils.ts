
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from './types';
import { supabase } from '@/integrations/supabase/client';

export const transformUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    // Fetch the user profile from our profiles table
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('display_name, avatar_url')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: profile?.display_name || supabaseUser.email || 'User',
      avatar: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || supabaseUser.email || 'User')}&background=6366f1&color=fff`
    };
  } catch (error) {
    console.error('Error transforming user:', error);
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.email || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(supabaseUser.email || 'User')}&background=6366f1&color=fff`
    };
  }
};

export const clearCorruptedSession = async () => {
  console.log('Clearing potentially corrupted session data');
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-qrdulwzjgbfgaplazgsh-auth-token');
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
