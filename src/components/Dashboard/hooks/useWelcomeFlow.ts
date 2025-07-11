import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type WelcomeStep = 'welcome' | 'components' | 'theme' | 'tour' | 'initialize';

export const useWelcomeFlow = (onDashboardInitialized?: () => void) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<WelcomeStep>('welcome');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

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

    setCurrentStep('theme');
  };

  const handleSkipComponentSelection = () => {
    setCurrentStep('theme');
  };

  const handleThemeSelected = async (theme: string) => {
    setSelectedTheme(theme);
    
    // Save selected theme to user preferences
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user!.id,
          dashboard_theme: theme
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving theme preference:', error);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }

    setCurrentStep('tour');
  };

  const handleSkipThemeSelection = () => {
    setCurrentStep('tour');
  };

  const handleTourCompleted = () => {
    setCurrentStep('initialize');
  };

  const handleSkipTour = () => {
    setCurrentStep('initialize');
  };

  const handleBackToComponents = () => {
    setCurrentStep('components');
  };

  const handleBackToTheme = () => {
    setCurrentStep('theme');
  };

  const handleBackToTour = () => {
    setCurrentStep('tour');
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
    selectedTheme,
    handlers: {
      handleGetStarted,
      handleComponentsSelected,
      handleSkipComponentSelection,
      handleThemeSelected,
      handleSkipThemeSelection,
      handleTourCompleted,
      handleSkipTour,
      handleBackToComponents,
      handleBackToTheme,
      handleBackToTour,
      handleBackToWelcome,
      handleDashboardInitialized
    }
  };
};