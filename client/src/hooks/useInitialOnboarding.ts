import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useInitialOnboarding = () => {
  const { user } = useAuth();
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setNeedsOnboarding(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has completed initial onboarding
        const { data: onboardingData, error: onboardingError } = await supabase
          .from('user_onboarding')
          .select('initial_onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (onboardingError && onboardingError.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', onboardingError);
          setNeedsOnboarding(false);
          setIsLoading(false);
          return;
        }

        // Check if user has preferences (role selected)
        const { data: preferencesData, error: preferencesError } = await supabase
          .from('user_preferences')
          .select('user_role')
          .eq('user_id', user.id)
          .single();

        if (preferencesError && preferencesError.code !== 'PGRST116') {
          console.error('Error checking preferences:', preferencesError);
          setNeedsOnboarding(false);
          setIsLoading(false);
          return;
        }

        // User needs onboarding if:
        // 1. No onboarding record OR initial_onboarding_completed is false
        // 2. AND no user preferences record OR no role selected
        const hasCompletedOnboarding = onboardingData?.initial_onboarding_completed === true;
        const hasRole = preferencesData?.user_role && preferencesData.user_role !== 'other';

        setNeedsOnboarding(!hasCompletedOnboarding || !hasRole);
        
      } catch (error) {
        console.error('Error in onboarding check:', error);
        setNeedsOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

  return { needsOnboarding, isLoading };
};