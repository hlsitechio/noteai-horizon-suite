import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  page?: string;
  action?: () => void;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to NoteAI Suite!',
    description: 'Let me show you around this powerful note-taking and productivity app.',
    page: 'dashboard'
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'This is your main dashboard where you can see an overview of your notes, tasks, and productivity metrics.',
    target: '[data-onboarding="dashboard"]',
    position: 'bottom',
    page: 'dashboard'
  },
  {
    id: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'Use the sidebar to navigate between different sections of the app. You can create notes, manage folders, and access settings.',
    target: '[data-onboarding="sidebar"]',
    position: 'right',
    page: 'dashboard'
  },
  {
    id: 'create-note',
    title: 'Create Your First Note',
    description: 'Click the plus button to create your first note. You can write, format, and organize your thoughts here.',
    target: '[data-onboarding="create-note"]',
    position: 'bottom',
    page: 'dashboard'
  },
  {
    id: 'notes-list',
    title: 'Notes Management',
    description: 'Here you can see all your notes, search through them, and organize them into folders.',
    target: '[data-onboarding="notes-list"]',
    position: 'right',
    page: 'dashboard'
  },
  {
    id: 'settings',
    title: 'Customize Your Experience',
    description: 'Access settings to personalize your workspace, manage preferences, and control features like this onboarding.',
    target: '[data-onboarding="settings"]',
    position: 'left',
    page: 'settings'
  }
];

interface OnboardingState {
  enabled: boolean;
  completed: boolean;
  currentStep: number;
  completedSteps: string[];
}

export function useOnboarding() {
  const { user } = useAuth();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    enabled: true,
    completed: false,
    currentStep: 0,
    completedSteps: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState<OnboardingStep | null>(null);

  // Load onboarding state from database
  const loadOnboardingState = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading onboarding state:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setOnboardingState({
          enabled: data.onboarding_enabled,
          completed: data.onboarding_completed,
          currentStep: data.current_step,
          completedSteps: data.completed_steps || []
        });
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save onboarding state to database
  const saveOnboardingState = useCallback(async (state: Partial<OnboardingState>) => {
    if (!user) return;

    try {
      const updateData = {
        user_id: user.id,
        onboarding_enabled: state.enabled ?? onboardingState.enabled,
        onboarding_completed: state.completed ?? onboardingState.completed,
        current_step: state.currentStep ?? onboardingState.currentStep,
        completed_steps: state.completedSteps ?? onboardingState.completedSteps,
        last_seen_step: state.currentStep ?? onboardingState.currentStep
      };

      const { error } = await supabase
        .from('user_onboarding')
        .upsert(updateData, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving onboarding state:', error);
        throw error;
      }

      setOnboardingState(prev => ({ ...prev, ...state }));
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      toast({
        title: "Error",
        description: "Failed to save onboarding preferences.",
        variant: "destructive"
      });
    }
  }, [user, onboardingState]);

  // Toggle onboarding enabled/disabled
  const toggleOnboarding = useCallback(async (enabled: boolean) => {
    await saveOnboardingState({ enabled });
  }, [saveOnboardingState]);

  // Start onboarding
  const startOnboarding = useCallback(async () => {
    await saveOnboardingState({ 
      enabled: true, 
      completed: false, 
      currentStep: 0, 
      completedSteps: [] 
    });
    setActiveStep(ONBOARDING_STEPS[0]);
  }, [saveOnboardingState]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    await saveOnboardingState({ 
      completed: true, 
      currentStep: ONBOARDING_STEPS.length 
    });
    setActiveStep(null);
  }, [saveOnboardingState]);

  // Next step
  const nextStep = useCallback(async () => {
    const nextStepIndex = onboardingState.currentStep + 1;
    const currentStepId = ONBOARDING_STEPS[onboardingState.currentStep]?.id;
    
    if (nextStepIndex >= ONBOARDING_STEPS.length) {
      await completeOnboarding();
      return;
    }

    const newCompletedSteps = currentStepId ? 
      [...onboardingState.completedSteps, currentStepId] : 
      onboardingState.completedSteps;

    await saveOnboardingState({ 
      currentStep: nextStepIndex, 
      completedSteps: newCompletedSteps 
    });
    
    setActiveStep(ONBOARDING_STEPS[nextStepIndex]);
  }, [onboardingState, saveOnboardingState, completeOnboarding]);

  // Previous step
  const previousStep = useCallback(async () => {
    const prevStepIndex = Math.max(0, onboardingState.currentStep - 1);
    await saveOnboardingState({ currentStep: prevStepIndex });
    setActiveStep(ONBOARDING_STEPS[prevStepIndex]);
  }, [onboardingState.currentStep, saveOnboardingState]);

  // Skip onboarding
  const skipOnboarding = useCallback(async () => {
    await saveOnboardingState({ enabled: false, completed: true });
    setActiveStep(null);
  }, [saveOnboardingState]);

  // Check if should show onboarding
  const shouldShowOnboarding = useCallback((page?: string) => {
    if (!onboardingState.enabled || onboardingState.completed || !user) {
      return false;
    }

    const currentStepData = ONBOARDING_STEPS[onboardingState.currentStep];
    if (!currentStepData) return false;

    if (page && currentStepData.page && currentStepData.page !== page) {
      return false;
    }

    return true;
  }, [onboardingState, user]);

  // Show step for current page
  const showStepForPage = useCallback((page: string) => {
    if (!shouldShowOnboarding(page)) return;

    const currentStepData = ONBOARDING_STEPS[onboardingState.currentStep];
    if (currentStepData && currentStepData.page === page) {
      setActiveStep(currentStepData);
    }
  }, [onboardingState.currentStep, shouldShowOnboarding]);

  useEffect(() => {
    loadOnboardingState();
  }, [loadOnboardingState]);

  return {
    onboardingState,
    isLoading,
    activeStep,
    setActiveStep,
    toggleOnboarding,
    startOnboarding,
    completeOnboarding,
    nextStep,
    previousStep,
    skipOnboarding,
    shouldShowOnboarding,
    showStepForPage,
    steps: ONBOARDING_STEPS
  };
}