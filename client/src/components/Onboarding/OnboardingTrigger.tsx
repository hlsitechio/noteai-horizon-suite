import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingTour } from './OnboardingTour';
import { OnboardingService } from '@/services/onboardingService';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Play, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingTriggerProps {
  variant?: 'button' | 'card';
  size?: 'sm' | 'default' | 'lg';
  showProgress?: boolean;
}

export const OnboardingTrigger: React.FC<OnboardingTriggerProps> = ({
  variant = 'button',
  size = 'default',
  showProgress = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showTour, setShowTour] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userProgress = OnboardingService.getUserProgress(user?.id || '');
  const hasCompletedOnboarding = userProgress.completedFlows.includes('new-user-basics');
  const currentProgress = OnboardingService.getCurrentFlowProgress();

  const startTour = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start the onboarding tour.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const started = OnboardingService.startFlow('new-user-basics', user.id);
      if (started) {
        setShowTour(true);
        toast({
          title: "Onboarding Started",
          description: "Welcome! Let's explore the key features together.",
        });
      }
    } catch (error) {
      console.error('Failed to start onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to start onboarding tour. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restartTour = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      OnboardingService.resetUserProgress(user.id);
      const started = OnboardingService.startFlow('new-user-basics', user.id);
      if (started) {
        setShowTour(true);
        toast({
          title: "Tour Restarted",
          description: "Starting the onboarding tour from the beginning.",
        });
      }
    } catch (error) {
      console.error('Failed to restart onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to restart tour. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeTour = () => {
    setShowTour(false);
  };

  if (variant === 'card') {
    return (
      <>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5" />
              App Tour
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {hasCompletedOnboarding 
                    ? "Take a refresher tour of the app's key features"
                    : "Learn about the app's features with a guided tour"
                  }
                </p>
                {showProgress && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    <span>
                      {hasCompletedOnboarding 
                        ? "Completed" 
                        : `Step ${currentProgress.currentStep} of ${currentProgress.totalSteps}`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={hasCompletedOnboarding ? restartTour : startTour}
                disabled={isLoading}
                size="sm"
                className="flex items-center gap-2"
              >
                {hasCompletedOnboarding ? (
                  <>
                    <RotateCcw className="h-3 w-3" />
                    Restart Tour
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" />
                    Start Tour
                  </>
                )}
              </Button>
              
              {hasCompletedOnboarding && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Tour Completed",
                      description: "You've already completed the onboarding tour!",
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Info className="h-3 w-3" />
                  Status
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <OnboardingTour 
          isVisible={showTour} 
          onClose={closeTour}
          flowId="new-user-basics"
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={hasCompletedOnboarding ? restartTour : startTour}
        disabled={isLoading}
        size={size}
        variant={hasCompletedOnboarding ? "outline" : "default"}
        className="flex items-center gap-2"
      >
        {hasCompletedOnboarding ? (
          <>
            <RotateCcw className="h-3 w-3" />
            Restart Tour
          </>
        ) : (
          <>
            <Play className="h-3 w-3" />
            Start Tour
          </>
        )}
      </Button>

      <OnboardingTour 
        isVisible={showTour} 
        onClose={closeTour}
        flowId="new-user-basics"
      />
    </>
  );
};