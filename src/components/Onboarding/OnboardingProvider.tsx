import React, { createContext, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const onboarding = useOnboarding();
  
  if (!onboarding) {
    return <>{children}</>;
  }

  // Determine current page from pathname
  const currentPage = location.pathname === '/' ? 'landing' : 
                     location.pathname === '/landing' ? 'landing' :
                     location.pathname === '/dashboard' ? 'dashboard' :
                     location.pathname === '/settings' ? 'settings' : 
                     location.pathname.slice(1); // remove leading slash

  // Check if onboarding should show on current page
  const shouldShowOnCurrentPage = onboarding.shouldShowOnboarding(currentPage);

  // Debug logging (development only) - reduced frequency
  const debugLogRef = useRef<string>('');
  const currentDebugKey = `${location.pathname}-${shouldShowOnCurrentPage}`;
  
  if (import.meta.env.DEV && debugLogRef.current !== currentDebugKey) {
    debugLogRef.current = currentDebugKey;
    console.log('Current pathname:', location.pathname, 'Detected page:', currentPage);
    console.log('Should show onboarding on', currentPage, ':', shouldShowOnCurrentPage);
  }

  return (
    <OnboardingContext.Provider value={onboarding}>
      {children}
      
      {/* Welcome Screen - only show if should show on current page */}
      {shouldShowOnCurrentPage && onboarding.onboardingState.showWelcome && !onboarding.isLoading && (
        <WelcomeScreen
          onStartTour={onboarding.startWelcomeTour}
          onSkip={onboarding.skipWelcome}
        />
      )}
      
      {/* Onboarding Tooltip - only show if should show on current page */}
      {shouldShowOnCurrentPage && onboarding.activeStep && !onboarding.onboardingState.showWelcome && (
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