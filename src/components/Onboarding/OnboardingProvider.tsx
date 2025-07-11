import React, { createContext, useContext, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingTooltip } from './OnboardingTooltip';
import { useLocation } from 'react-router-dom';

const OnboardingContext = createContext<ReturnType<typeof useOnboarding> | null>(null);

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const onboarding = useOnboarding();
  const location = useLocation();

  // Auto-show onboarding for current page
  useEffect(() => {
    const currentPage = location.pathname.includes('/app/dashboard') ? 'dashboard' :
                       location.pathname.includes('/app/settings') ? 'settings' :
                       'dashboard';
    
    onboarding.showStepForPage(currentPage);
  }, [location.pathname, onboarding]);

  return (
    <OnboardingContext.Provider value={onboarding}>
      {children}
      
      {/* Onboarding Tooltip */}
      {onboarding.activeStep && (
        <OnboardingTooltip
          step={onboarding.activeStep}
          onNext={onboarding.nextStep}
          onPrevious={onboarding.previousStep}
          onSkip={onboarding.skipOnboarding}
          onClose={() => onboarding.setActiveStep(null)}
          currentStepIndex={onboarding.onboardingState.currentStep}
          totalSteps={onboarding.steps.length}
        />
      )}
    </OnboardingContext.Provider>
  );
}