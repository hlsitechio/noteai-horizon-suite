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

        // Check if this is the demo user (should always go through onboarding unless explicitly completed)
        const isDemoUser = user.email === 'demo@onlinenote.ai';
        
        // Consider dashboard initialized if they have:
        // 1. Completed onboarding before
        // 2. Dashboard settings with initialized flag  
        // 3. Any existing content (notes or folders)
        // 4. For demo user: only if onboarding is explicitly completed
        const hasCompletedOnboarding = onboardingData?.onboarding_completed === true;
        const hasSettings = dashboardSettings?.settings && 
          typeof dashboardSettings.settings === 'object' && 
          (dashboardSettings.settings as any)?.initialized;
        const hasContent = (count || 0) > 0 || (foldersCount || 0) > 0;
        
        // Demo user should ALWAYS go through onboarding (reset every time)
        if (isDemoUser) {
          // Reset demo user onboarding status
          await supabase
            .from('user_onboarding')
            .upsert({
              user_id: user.id,
              onboarding_completed: false,
              current_step: 0
            }, { onConflict: 'user_id' });
          
          setIsDashboardInitialized(false);
        } else {
          // Regular users: consider initialized if they have onboarding completed, settings, or content
          setIsDashboardInitialized(hasCompletedOnboarding || hasSettings || hasContent);
        }
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