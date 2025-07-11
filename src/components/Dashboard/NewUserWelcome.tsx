import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStatus } from './hooks/useDashboardStatus';
import { useWelcomeFlow } from './hooks/useWelcomeFlow';
import { UserInfoStep } from './steps/UserInfoStep';
import { WelcomeStep } from './steps/WelcomeStep';
import { ComponentsStep } from './steps/ComponentsStep';
import { ThemeStep } from './steps/ThemeStep';
import { TourStep } from './steps/TourStep';
import { InitializeStep } from './steps/InitializeStep';

interface NewUserWelcomeProps {
  onDashboardInitialized?: () => void;
  className?: string;
}

export const NewUserWelcome: React.FC<NewUserWelcomeProps> = ({ 
  onDashboardInitialized,
  className 
}) => {
  const { user } = useAuth();
  const { isDashboardInitialized, isLoading, setIsDashboardInitialized } = useDashboardStatus();
  const { currentStep, selectedComponents, selectedTheme, handlers } = useWelcomeFlow(onDashboardInitialized);

  const handleDashboardInitialized = () => {
    setIsDashboardInitialized(true);
    handlers.handleDashboardInitialized();
  };

  // Don't show if dashboard is already initialized or still loading
  if (isLoading || isDashboardInitialized || !user) {
    return null;
  }

  // User Info Step
  if (currentStep === 'userinfo') {
    return (
      <UserInfoStep
        onComplete={handlers.handleUserInfoComplete}
        className={className}
      />
    );
  }

  // Component Selection Step
  if (currentStep === 'components') {
    return (
      <ComponentsStep
        onComponentsSelected={handlers.handleComponentsSelected}
        onSkip={handlers.handleSkipComponentSelection}
        onBackToWelcome={handlers.handleBackToWelcome}
        className={className}
      />
    );
  }

  // Theme Selection Step
  if (currentStep === 'theme') {
    return (
      <ThemeStep
        onThemeSelected={handlers.handleThemeSelected}
        onSkip={handlers.handleSkipThemeSelection}
        onBackToComponents={handlers.handleBackToComponents}
        className={className}
      />
    );
  }

  // Interface Tour Step
  if (currentStep === 'tour') {
    return (
      <TourStep
        onTourCompleted={handlers.handleTourCompleted}
        onSkip={handlers.handleSkipTour}
        onBackToTheme={handlers.handleBackToTheme}
        className={className}
      />
    );
  }

  // Initialize Step
  if (currentStep === 'initialize') {
    return (
      <InitializeStep
        selectedComponents={selectedComponents}
        onInitialized={handleDashboardInitialized}
        onBackToComponents={handlers.handleBackToTour}
        className={className}
      />
    );
  }

  // Welcome Step (default)
  return (
    <WelcomeStep
      onGetStarted={handlers.handleGetStarted}
      className={className}
    />
  );
};