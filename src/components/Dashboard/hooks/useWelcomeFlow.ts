import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type WelcomeStep = 'welcome' | 'components' | 'initialize';

export const useWelcomeFlow = (onDashboardInitialized?: () => void) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WelcomeStep>('welcome');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

  const handleGetStarted = () => {
    setCurrentStep('components');
  };

  const handleComponentsSelected = async (components: string[]) => {
    setSelectedComponents(components);
    
    // Save selected components to user preferences
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          dashboard_components: components
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving component preferences:', error);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }

    setCurrentStep('initialize');
  };

  const handleSkipComponentSelection = () => {
    setCurrentStep('initialize');
  };

  const handleBackToComponents = () => {
    setCurrentStep('components');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
  };

  const handleDashboardInitialized = () => {
    onDashboardInitialized?.();
  };

  return {
    currentStep,
    selectedComponents,
    handlers: {
      handleGetStarted,
      handleComponentsSelected,
      handleSkipComponentSelection,
      handleBackToComponents,
      handleBackToWelcome,
      handleDashboardInitialized
    }
  };
};