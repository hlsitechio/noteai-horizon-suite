import React, { createContext, useContext } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { OnboardingTooltip } from './OnboardingTooltip';
import { WelcomeScreen } from './WelcomeScreen';

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

  return (
    <OnboardingContext.Provider value={onboarding}>
      {children}
      
      {/* Welcome Screen */}
      {onboarding.onboardingState.showWelcome && !onboarding.isLoading && (
        <WelcomeScreen
          onStartTour={onboarding.startWelcomeTour}
          onSkip={onboarding.skipWelcome}
        />
      )}
      
      {/* Onboarding Tooltip */}
      {onboarding.activeStep && !onboarding.onboardingState.showWelcome && (
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