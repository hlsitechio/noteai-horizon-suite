import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardStatus = () => {
  const { user } = useAuth();
  const [isDashboardInitialized, setIsDashboardInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

        // Reset onboarding for ALL users on every login
        // This ensures users always go through the dashboard onboarding flow
        
        // Reset onboarding status for all users
        await supabase
          .from('user_onboarding')
          .upsert({
            user_id: user.id,
            onboarding_completed: false,
            current_step: 0
          }, { onConflict: 'user_id' });

        // Reset theme to default and clear dashboard components for all users
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            dashboard_theme: 'default',
            dashboard_components: []
          }, { onConflict: 'user_id' });

        // Reset dashboard settings
        await supabase
          .from('dashboard_settings')
          .upsert({
            user_id: user.id,
            settings: {},
            dashboard_edit_mode: false,
            sidebar_edit_mode: false,
            sidebar_panel_sizes: {},
            selected_banner_url: null,
            selected_banner_type: null
          }, { onConflict: 'user_id' });
        
        // Always set as not initialized to force onboarding
        setIsDashboardInitialized(false);
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
    isLoading,
    setIsDashboardInitialized
  };
};