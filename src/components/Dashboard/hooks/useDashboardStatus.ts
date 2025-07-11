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
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has completed onboarding before
        const { data: onboardingData } = await supabase
          .from('user_onboarding')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        // Check if user has dashboard settings (indicating initialization)
        const { data: dashboardSettings } = await supabase
          .from('dashboard_settings')
          .select('settings')
          .eq('user_id', user.id)
          .single();

        // Check if user has any notes (another indicator)
        const { data: notes, count } = await supabase
          .from('notes_v2')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .limit(1);

        // Check if user has folders
        const { data: folders, count: foldersCount } = await supabase
          .from('folders')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .limit(1);

        // Check if user is truly new (no existing data)
        const isNewUser = !onboardingData?.onboarding_completed && 
                         !dashboardSettings && 
                         (!notes || count === 0) && 
                         (!folders || foldersCount === 0);

        if (isNewUser) {
          console.log('New user detected, initializing dashboard onboarding for:', user.email);
          
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
          console.log('Existing user detected, skipping dashboard reset for:', user.email);
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