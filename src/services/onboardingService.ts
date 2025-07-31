
import { logger } from '../utils/logger';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  content: React.ReactNode | string;
  position: 'top' | 'bottom' | 'left' | 'right';
  required: boolean;
  completed: boolean;
  category: 'navigation' | 'features' | 'settings' | 'advanced';
}

interface OnboardingFlow {
  id: string;
  name: string;
  description: string;
  steps: OnboardingStep[];
  target_user: 'new' | 'existing' | 'advanced';
  estimated_duration: number; // in minutes
  completion_rate: number;
  active: boolean;
}

export class OnboardingService {
  private static flows: Map<string, OnboardingFlow> = new Map();
  private static currentFlow: OnboardingFlow | null = null;
  private static currentStepIndex = 0;
  private static userProgress: Map<string, Set<string>> = new Map(); // userId -> completed step IDs

  static initialize() {
    this.setupDefaultFlows();
    this.loadUserProgress();
    logger.info('Onboarding Service initialized');
  }

  private static setupDefaultFlows() {
    // New User Flow
    const newUserFlow: OnboardingFlow = {
      id: 'new-user-basics',
      name: 'Getting Started',
      description: 'Learn the basics of navigating and using the application',
      target_user: 'new',
      estimated_duration: 5,
      completion_rate: 0,
      active: true,
      steps: [
        {
          id: 'welcome',
          title: 'Welcome!',
          description: 'Welcome to your new productivity workspace',
          target: '[data-onboarding="dashboard"]',
          content: 'This is your main dashboard where you can see an overview of your work and access all features.',
          position: 'bottom',
          required: true,
          completed: false,
          category: 'navigation'
        },
        {
          id: 'sidebar-navigation',
          title: 'Navigation Sidebar',
          description: 'Your main navigation hub',
          target: '[data-onboarding="sidebar"]',
          content: 'Use this sidebar to navigate between different sections of the application. You can collapse it to save space.',
          position: 'right',
          required: true,
          completed: false,
          category: 'navigation'
        },
        {
          id: 'create-first-item',
          title: 'Create Your First Item',
          description: 'Let\'s create your first piece of content',
          target: '[data-onboarding="create-note"]',
          content: 'Click here to create your first note, document, or project. This is where your productivity journey begins!',
          position: 'bottom',
          required: true,
          completed: false,
          category: 'features'
        },
        {
          id: 'explore-features',
          title: 'Explore Features',
          description: 'Discover what you can do',
          target: '[data-onboarding="sidebar"]',
          content: 'Explore these navigation items to get the most out of your workspace. Each section offers powerful tools for productivity.',
          position: 'right',
          required: false,
          completed: false,
          category: 'features'
        }
      ]
    };

    // Advanced User Flow
    const advancedUserFlow: OnboardingFlow = {
      id: 'advanced-features',
      name: 'Advanced Features',
      description: 'Unlock the full potential with advanced features',
      target_user: 'advanced',
      estimated_duration: 8,
      completion_rate: 0,
      active: true,
      steps: [
        {
          id: 'keyboard-shortcuts',
          title: 'Keyboard Shortcuts',
          description: 'Work faster with keyboard shortcuts',
          target: '[data-onboarding="shortcuts-help"]',
          content: 'Press Ctrl+K (or Cmd+K) to open the command palette. Use Ctrl+/ to see all available shortcuts.',
          position: 'top',
          required: false,
          completed: false,
          category: 'advanced'
        },
        {
          id: 'customization',
          title: 'Customize Your Workspace',
          description: 'Make it your own',
          target: '[data-onboarding="settings"]',
          content: 'Customize themes, layouts, and preferences to match your workflow perfectly.',
          position: 'left',
          required: false,
          completed: false,
          category: 'settings'
        }
      ]
    };

    this.flows.set(newUserFlow.id, newUserFlow);
    this.flows.set(advancedUserFlow.id, advancedUserFlow);
  }

  private static loadUserProgress() {
    try {
      const saved = localStorage.getItem('onboarding_progress');
      if (saved) {
        const progressData = JSON.parse(saved);
        for (const [userId, stepIds] of Object.entries(progressData)) {
          this.userProgress.set(userId, new Set(stepIds as string[]));
        }
      }
    } catch (error) {
      logger.warn('Failed to load onboarding progress:', error);
    }
  }

  private static saveUserProgress() {
    try {
      const progressData: Record<string, string[]> = {};
      for (const [userId, stepIds] of this.userProgress.entries()) {
        progressData[userId] = Array.from(stepIds);
      }
      localStorage.setItem('onboarding_progress', JSON.stringify(progressData));
    } catch (error) {
      logger.warn('Failed to save onboarding progress:', error);
    }
  }

  static startFlow(flowId: string, userId?: string): boolean {
    const flow = this.flows.get(flowId);
    if (!flow || !flow.active) {
      return false;
    }

    this.currentFlow = { ...flow };
    this.currentStepIndex = 0;

    // Mark completed steps based on user progress
    if (userId) {
      const userCompletedSteps = this.userProgress.get(userId) || new Set();
      this.currentFlow.steps.forEach(step => {
        step.completed = userCompletedSteps.has(step.id);
      });

      // Find first incomplete required step
      const firstIncompleteIndex = this.currentFlow.steps.findIndex(
        step => step.required && !step.completed
      );
      
      if (firstIncompleteIndex !== -1) {
        this.currentStepIndex = firstIncompleteIndex;
      }
    }

    logger.info(`Started onboarding flow: ${flow.name}`);
    return true;
  }

  static getCurrentStep(): OnboardingStep | null {
    if (!this.currentFlow || this.currentStepIndex >= this.currentFlow.steps.length) {
      return null;
    }
    return this.currentFlow.steps[this.currentStepIndex];
  }

  static nextStep(userId?: string): OnboardingStep | null {
    if (!this.currentFlow) return null;

    // Mark current step as completed
    const currentStep = this.getCurrentStep();
    if (currentStep && userId) {
      this.markStepCompleted(userId, currentStep.id);
    }

    // Move to next step
    this.currentStepIndex++;
    
    // Skip already completed steps
    while (
      this.currentStepIndex < this.currentFlow.steps.length &&
      this.currentFlow.steps[this.currentStepIndex].completed
    ) {
      this.currentStepIndex++;
    }

    const nextStep = this.getCurrentStep();
    
    if (!nextStep) {
      this.completeFlow(userId);
    }

    return nextStep;
  }

  static previousStep(): OnboardingStep | null {
    if (!this.currentFlow || this.currentStepIndex <= 0) {
      return null;
    }

    this.currentStepIndex--;
    return this.getCurrentStep();
  }

  static skipStep(userId?: string): OnboardingStep | null {
    const currentStep = this.getCurrentStep();
    if (currentStep?.required) {
      return currentStep; // Can't skip required steps
    }

    return this.nextStep(userId);
  }

  static markStepCompleted(userId: string, stepId: string) {
    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, new Set());
    }
    
    this.userProgress.get(userId)!.add(stepId);
    this.saveUserProgress();

    // Update current flow if active
    if (this.currentFlow) {
      const step = this.currentFlow.steps.find(s => s.id === stepId);
      if (step) {
        step.completed = true;
      }
    }

    logger.debug(`Step completed: ${stepId} for user: ${userId}`);
  }

  private static completeFlow(userId?: string) {
    if (!this.currentFlow) return;

    const flowId = this.currentFlow.id;
    this.currentFlow = null;
    this.currentStepIndex = 0;

    logger.info(`Onboarding flow completed: ${flowId}${userId ? ` for user: ${userId}` : ''}`);

    // Track completion analytics
    this.trackFlowCompletion(flowId, userId);
  }

  private static trackFlowCompletion(flowId: string, userId?: string) {
    // This would integrate with analytics service
    try {
      const event = {
        event_name: 'onboarding_flow_completed',
        flow_id: flowId,
        user_id: userId,
        timestamp: Date.now()
      };
      
      // Store completion event
      const completions = JSON.parse(localStorage.getItem('onboarding_completions') || '[]');
      completions.push(event);
      localStorage.setItem('onboarding_completions', JSON.stringify(completions));
    } catch (error) {
      logger.warn('Failed to track flow completion:', error);
    }
  }

  static getAvailableFlows(userType: 'new' | 'existing' | 'advanced' = 'new'): OnboardingFlow[] {
    return Array.from(this.flows.values())
      .filter(flow => flow.active && (flow.target_user === userType || flow.target_user === 'existing'))
      .sort((a, b) => a.estimated_duration - b.estimated_duration);
  }

  static getUserProgress(userId: string): {
    completedSteps: string[];
    completedFlows: string[];
    currentFlow?: string;
    overallProgress: number;
  } {
    const completedSteps = Array.from(this.userProgress.get(userId) || []);
    
    // Calculate completed flows
    const completedFlows: string[] = [];
    for (const [flowId, flow] of this.flows.entries()) {
      const requiredSteps = flow.steps.filter(s => s.required);
      const completedRequired = requiredSteps.filter(s => completedSteps.includes(s.id));
      
      if (completedRequired.length === requiredSteps.length) {
        completedFlows.push(flowId);
      }
    }

    // Calculate overall progress
    const totalSteps = Array.from(this.flows.values())
      .flatMap(f => f.steps.filter(s => s.required))
      .length;
    
    const overallProgress = totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;

    return {
      completedSteps,
      completedFlows,
      currentFlow: this.currentFlow?.id,
      overallProgress
    };
  }

  static resetUserProgress(userId: string) {
    this.userProgress.delete(userId);
    this.saveUserProgress();
    
    if (this.currentFlow) {
      this.currentFlow.steps.forEach(step => {
        step.completed = false;
      });
    }
    
    logger.info(`Reset onboarding progress for user: ${userId}`);
  }

  static isStepVisible(stepId: string): boolean {
    if (!this.currentFlow) return false;
    
    const step = this.currentFlow.steps.find(s => s.id === stepId);
    if (!step) return false;

    // Check if target element exists
    const target = document.querySelector(step.target);
    return target !== null;
  }

  static getCurrentFlowProgress(): {
    currentStep: number;
    totalSteps: number;
    progress: number;
    flowName?: string;
  } {
    if (!this.currentFlow) {
      return {
        currentStep: 0,
        totalSteps: 0,
        progress: 0
      };
    }

    return {
      currentStep: this.currentStepIndex + 1,
      totalSteps: this.currentFlow.steps.length,
      progress: ((this.currentStepIndex + 1) / this.currentFlow.steps.length) * 100,
      flowName: this.currentFlow.name
    };
  }
}
