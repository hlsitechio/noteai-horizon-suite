import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStatus = () => {
  const { user } = useAuth();
  const [isDashboardInitialized, setIsDashboardInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasResetCompleted, setHasResetCompleted] = useState(false);

  useEffect(() => {
    const checkDashboardStatus = async () => {
      if (!user) {
        setIsDashboardInitialized(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has completed onboarding before
        const onboardingQuery = await supabase
          .from('user_onboarding')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        // Check if user has dashboard settings (indicating initialization)
        const dashboardQuery = await supabase
          .from('dashboard_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();

        // Check if user has any notes (another indicator)
        const notesQuery = await supabase
          .from('notes_v2')
          .select('id')
          .eq('user_id', user.id);

        // Check if user has folders
        const foldersQuery = await supabase
          .from('folders')
          .select('id')
          .eq('user_id', user.id);

        // Check if user is truly new (no existing data)
        const isNewUser = !onboardingQuery.data?.onboarding_completed && 
                         !dashboardQuery.data && 
                         (!notesQuery.data || notesQuery.data.length === 0) && 
                         (!foldersQuery.data || foldersQuery.data.length === 0);

        if (isNewUser) {
          // Development logging only
          if (import.meta.env.DEV) {
            console.log('New user detected, initializing dashboard onboarding');
          }
          
          // Only reset for new users
          await supabase
            .from('user_onboarding')
            .upsert({
              user_id: user.id,
              onboarding_completed: false,
              current_step: 0
            }, { onConflict: 'user_id' });

          setIsDashboardInitialized(false);
        } else {
          // Development logging only
          if (import.meta.env.DEV) {
            console.log('Existing user detected, skipping dashboard reset');
          }
          // For existing users, consider them initialized
          setIsDashboardInitialized(true);
        }
        
        setHasResetCompleted(true);
      } catch (error) {
        console.error('Error checking dashboard status:', error);
        setIsDashboardInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkDashboardStatus();
  }, [user]);

  return {
    isDashboardInitialized,
    isLoading: isLoading || !hasResetCompleted,
    setIsDashboardInitialized,
    hasResetCompleted
  };
};