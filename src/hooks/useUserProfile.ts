import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching user profile via edge function...');

      const { data, error } = await supabase.functions.invoke('get-user-profile');

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.profile) {
        setProfile(data.profile);
        
        if (data.created) {
          // Development logging only
          if (import.meta.env.DEV) {
            console.log('New user profile created');
          }
          toast.success(`Welcome ${data.profile.display_name}! Your profile has been created.`);
        }
      }

    } catch (error: any) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<Pick<UserProfile, 'display_name' | 'avatar_url'>>) => {
    if (!user || !profile) return false;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
      return true;

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  }, [user, profile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    updateProfile,
    refreshProfile: fetchProfile
  };
};