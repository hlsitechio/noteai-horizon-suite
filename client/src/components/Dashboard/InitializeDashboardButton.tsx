import React, { useState } from 'react';
import { createComponentLogger } from '@/utils/productionLogger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Loader2, Rocket, Settings, Database, FolderPlus, FileText, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const componentLogger = createComponentLogger('InitializeDashboardButton');

interface InitializationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

const INITIALIZATION_STEPS: InitializationStep[] = [
  {
    id: 'storage',
    title: 'Storage Setup',
    description: 'Creating personal storage buckets for your files',
    icon: Database,
    completed: false
  },
  {
    id: 'settings',
    title: 'Dashboard Configuration',
    description: 'Initializing your dashboard settings and preferences',
    icon: Settings,
    completed: false
  },
  {
    id: 'folders',
    title: 'Folder Structure',
    description: 'Setting up default folders for organization',
    icon: FolderPlus,
    completed: false
  },
  {
    id: 'welcome_note',
    title: 'Welcome Content',
    description: 'Creating your first welcome note with tips',
    icon: FileText,
    completed: false
  },
  {
    id: 'activity_tracking',
    title: 'Activity Tracking',
    description: 'Setting up activity monitoring and analytics',
    icon: Activity,
    completed: false
  }
];

interface InitializeDashboardButtonProps {
  onInitialized?: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const InitializeDashboardButton: React.FC<InitializeDashboardButtonProps> = ({
  onInitialized,
  variant = 'default',
  size = 'default',
  className
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [steps, setSteps] = useState(INITIALIZATION_STEPS);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const updateStepProgress = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => ({
      ...step,
      completed: index <= stepIndex
    })));
    setCurrentStep(stepIndex + 1);
  };

  const simulateProgress = async () => {
    const stepDurations = [1000, 800, 600, 700, 500]; // Different durations for each step
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
      updateStepProgress(i);
    }
  };

  const initializeDashboard = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to initialize your dashboard.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setShowProgress(true);
    setError(null);
    setSteps(INITIALIZATION_STEPS.map(step => ({ ...step, completed: false })));
    setCurrentStep(0);
    setIsComplete(false);

    try {
      // Start the visual progress simulation
      const progressPromise = simulateProgress();

      // Call the edge function to actually initialize the dashboard
      const { data, error: functionError } = await supabase.functions.invoke(
        'initialize-user-dashboard',
        {
          body: {
            userId: (await supabase.auth.getUser()).data.user?.id
          }
        }
      );

      // Wait for both the actual function and visual progress to complete
      await progressPromise;

      if (functionError) {
        throw new Error(typeof functionError === 'string' ? functionError : 'Failed to initialize dashboard');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Dashboard initialization failed');
      }

      if (import.meta.env.DEV) {
        console.log('Dashboard initialization completed:', data);
      }
      
      setIsComplete(true);
      
      toast({
        title: "Dashboard Initialized! 🎉",
        description: "Your personal workspace is ready. Welcome to Online Note AI!",
        variant: "default"
      });

      // Call the callback if provided
      onInitialized?.();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      componentLogger.error('Dashboard initialization error:', error);
      setError(errorMessage);
      
      toast({
        title: "Initialization Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      
      // Auto-close the progress dialog after success
      if (!error) {
        setTimeout(() => {
          setShowProgress(false);
        }, 2000);
      }
    }
  };

  const progress = steps.filter(step => step.completed).length;
  const progressPercentage = (progress / steps.length) * 100;

  return (
    <>
      <Button
        onClick={initializeDashboard}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Rocket className="h-4 w-4 mr-2" />
        )}
        {isLoading ? 'Initializing...' : 'Initialize Dashboard'}
      </Button>

      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : error ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
              {isComplete ? 'Dashboard Ready!' : error ? 'Initialization Failed' : 'Setting up your dashboard...'}
            </DialogTitle>
            <DialogDescription>
              {isComplete 
                ? 'Your personal workspace has been successfully created with all necessary resources.'
                : error 
                ? 'There was an issue setting up your dashboard. Please try again.'
                : 'Please wait while we configure your personalized workspace.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!error && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>
            )}

            <div className="space-y-3">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep && !isComplete && !error;
                const isCompleted = step.completed || isComplete;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-primary/10 border border-primary/20' : 
                      isCompleted ? 'bg-green-50 dark:bg-green-950/20' : 
                      'bg-muted/50'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${
                      isCompleted ? 'text-green-600' : 
                      isActive ? 'text-primary' : 
                      'text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${
                        isCompleted ? 'text-green-700 dark:text-green-300' : 
                        isActive ? 'text-primary' : 
                        'text-foreground'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {error && (
              <Card className="border-red-200 dark:border-red-800">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700 dark:text-red-300">
                      {error}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(error || isComplete) && (
              <div className="flex justify-end gap-2">
                {error && (
                  <Button onClick={initializeDashboard} variant="outline" size="sm">
                    Try Again
                  </Button>
                )}
                <Button 
                  onClick={() => setShowProgress(false)} 
                  variant={isComplete ? "default" : "outline"}
                  size="sm"
                >
                  {isComplete ? 'Get Started' : 'Close'}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};