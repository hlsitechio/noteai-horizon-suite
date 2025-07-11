import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStatus } from './hooks/useDashboardStatus';
import { useWelcomeFlow } from './hooks/useWelcomeFlow';
import { WelcomeStep } from './steps/WelcomeStep';
import { ComponentsStep } from './steps/ComponentsStep';
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
  const { currentStep, selectedComponents, handlers } = useWelcomeFlow(onDashboardInitialized);

  const handleDashboardInitialized = () => {
    setIsDashboardInitialized(true);
    handlers.handleDashboardInitialized();
  };

  // Don't show if dashboard is already initialized or still loading
  if (isLoading || isDashboardInitialized || !user) {
    return null;
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

  // Initialize Step
  if (currentStep === 'initialize') {
    return (
      <InitializeStep
        selectedComponents={selectedComponents}
        onInitialized={handleDashboardInitialized}
        onBackToComponents={handlers.handleBackToComponents}
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