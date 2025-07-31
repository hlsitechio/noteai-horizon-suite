import { logger } from '@/utils/logger';
import { ReactNode } from 'react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  category: 'setup' | 'features' | 'customization' | 'advanced';
  completed: boolean;
  optional: boolean;
  required: boolean; // Alias for !optional
  order: number;
  estimatedTime: number; // in minutes
  dependencies?: string[]; // step IDs that must be completed first
  target?: string; // CSS selector for the target element
  position?: 'top' | 'bottom' | 'left' | 'right';
  content?: string | ReactNode;
}

interface UserProgress {
  userId: string;
  overallProgress: number; // 0-100
  completedSteps: string[];
  skippedSteps: string[];
  completedFlows: string[]; // New property for flow tracking
  timeSpent: number; // total time in minutes
  currentStep?: string;
  lastActivity: number;
  categories: {
    setup: number;
    features: number;
    customization: number;
    advanced: number;
  };
}

interface FlowProgress {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

interface OnboardingMetrics {
  totalSteps: number;
  completedSteps: number;
  averageCompletionTime: number;
  engagementScore: number;
  featureAdoption: number;
  userExperienceScore: number;
}

export class OnboardingService {
  private static steps: Map<string, OnboardingStep> = new Map();
  private static userProgress: Map<string, UserProgress> = new Map();
  private static metrics: OnboardingMetrics = {
    totalSteps: 0,
    completedSteps: 0,
    averageCompletionTime: 0,
    engagementScore: 0,
    featureAdoption: 0,
    userExperienceScore: 0
  };

  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized) return;

    this.setupDefaultSteps();
    this.loadUserProgress();
    this.calculateMetrics();

    logger.info('Onboarding Service initialized');
    this.isInitialized = true;
  }

  private static setupDefaultSteps() {
    const defaultSteps: OnboardingStep[] = [
      {
        id: 'welcome',
        title: 'Welcome to the App',
        description: 'Get introduced to the main features and navigation',
        category: 'setup',
        completed: false,
        optional: false,
        required: true,
        order: 1,
        estimatedTime: 2,
        target: '[data-onboarding="welcome"]',
        position: 'bottom',
        content: 'Let\'s take a quick tour to get you started with all the powerful features available.'
      },
      {
        id: 'profile-setup',
        title: 'Set Up Your Profile',
        description: 'Complete your profile information and preferences',
        category: 'setup',
        completed: false,
        optional: false,
        required: true,
        order: 2,
        estimatedTime: 5,
        dependencies: ['welcome'],
        target: '[data-onboarding="profile"]',
        position: 'left',
        content: 'Add your personal information to personalize your experience.'
      },
      {
        id: 'dashboard-tour',
        title: 'Dashboard Overview',
        description: 'Learn about the dashboard and its key components',
        category: 'features',
        completed: false,
        optional: false,
        required: true,
        order: 3,
        estimatedTime: 3,
        dependencies: ['profile-setup'],
        target: '[data-onboarding="dashboard"]',
        position: 'top',
        content: 'This is your central hub where you can see all your important information at a glance.'
      },
      {
        id: 'navigation-tutorial',
        title: 'Navigation Tutorial',
        description: 'Master the sidebar navigation and menu system',
        category: 'features',
        completed: false,
        optional: false,
        required: true,
        order: 4,
        estimatedTime: 4,
        dependencies: ['dashboard-tour'],
        target: '[data-onboarding="sidebar"]',
        position: 'right',
        content: 'Use the sidebar to quickly access all features and tools.'
      },
      {
        id: 'ai-features',
        title: 'AI Features Tour',
        description: 'Explore AI-powered features and capabilities',
        category: 'features',
        completed: false,
        optional: false,
        required: true,
        order: 5,
        estimatedTime: 6,
        dependencies: ['navigation-tutorial'],
        target: '[data-onboarding="ai-features"]',
        position: 'bottom',
        content: 'Discover how AI can help boost your productivity.'
      },
      {
        id: 'customization',
        title: 'Customize Your Experience',
        description: 'Personalize themes, layouts, and preferences',
        category: 'customization',
        completed: false,
        optional: true,
        required: false,
        order: 6,
        estimatedTime: 8,
        dependencies: ['ai-features'],
        target: '[data-onboarding="settings"]',
        position: 'left',
        content: 'Customize the interface to match your preferences.'
      },
      {
        id: 'collaboration',
        title: 'Collaboration Features',
        description: 'Learn about sharing and team collaboration tools',
        category: 'features',
        completed: false,
        optional: true,
        required: false,
        order: 7,
        estimatedTime: 5,
        dependencies: ['ai-features'],
        target: '[data-onboarding="collaboration"]',
        position: 'top',
        content: 'Collaborate seamlessly with your team members.'
      },
      {
        id: 'advanced-settings',
        title: 'Advanced Settings',
        description: 'Configure advanced features and integrations',
        category: 'advanced',
        completed: false,
        optional: true,
        required: false,
        order: 8,
        estimatedTime: 10,
        dependencies: ['customization'],
        target: '[data-onboarding="advanced"]',
        position: 'bottom',
        content: 'Fine-tune advanced settings for power users.'
      },
      {
        id: 'keyboard-shortcuts',
        title: 'Keyboard Shortcuts',
        description: 'Learn productivity shortcuts and hotkeys',
        category: 'advanced',
        completed: false,
        optional: true,
        required: false,
        order: 9,
        estimatedTime: 4,
        dependencies: ['navigation-tutorial'],
        target: '[data-onboarding="shortcuts"]',
        position: 'right',
        content: 'Master keyboard shortcuts to work more efficiently.'
      },
      {
        id: 'completion',
        title: 'Onboarding Complete',
        description: 'Congratulations! You\'re ready to use the app',
        category: 'setup',
        completed: false,
        optional: false,
        required: true,
        order: 10,
        estimatedTime: 1,
        dependencies: ['ai-features'],
        target: '[data-onboarding="completion"]',
        position: 'top',
        content: 'Congratulations! You\'ve completed the onboarding tour and are ready to explore all features.'
      }
    ];

    defaultSteps.forEach(step => {
      this.steps.set(step.id, step);
    });

    this.metrics.totalSteps = defaultSteps.length;
  }

  private static loadUserProgress() {
    // Load from localStorage or initialize
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.entries(data).forEach(([userId, progress]) => {
          this.userProgress.set(userId, progress as UserProgress);
        });
      } catch (error) {
        logger.warn('Failed to load onboarding progress', error);
      }
    }
  }

  private static saveUserProgress() {
    const data = Object.fromEntries(this.userProgress);
    localStorage.setItem('onboarding-progress', JSON.stringify(data));
  }

  static getUserProgress(userId: string): UserProgress {
    if (!this.userProgress.has(userId)) {
      const newProgress: UserProgress = {
        userId,
        overallProgress: 0,
        completedSteps: [],
        skippedSteps: [],
        completedFlows: [], // Initialize empty flows array
        timeSpent: 0,
        lastActivity: Date.now(),
        categories: {
          setup: 0,
          features: 0,
          customization: 0,
          advanced: 0
        }
      };
      this.userProgress.set(userId, newProgress);
      this.saveUserProgress();
    }

    return this.userProgress.get(userId)!;
  }

  static completeStep(userId: string, stepId: string, timeSpent: number = 0): boolean {
    const step = this.steps.get(stepId);
    if (!step) {
      logger.warn(`Onboarding step not found: ${stepId}`);
      return false;
    }

    const progress = this.getUserProgress(userId);

    // Check dependencies
    if (step.dependencies) {
      const unmetDependencies = step.dependencies.filter(dep => 
        !progress.completedSteps.includes(dep)
      );
      
      if (unmetDependencies.length > 0) {
        logger.warn(`Cannot complete step ${stepId}. Missing dependencies: ${unmetDependencies.join(', ')}`);
        return false;
      }
    }

    // Mark step as completed
    if (!progress.completedSteps.includes(stepId)) {
      progress.completedSteps.push(stepId);
      progress.timeSpent += timeSpent;
      progress.lastActivity = Date.now();

      // Remove from skipped if it was skipped before
      const skippedIndex = progress.skippedSteps.indexOf(stepId);
      if (skippedIndex > -1) {
        progress.skippedSteps.splice(skippedIndex, 1);
      }

      this.updateProgress(userId);
      this.saveUserProgress();

      logger.info(`Onboarding step completed: ${stepId} by user ${userId}`);
      return true;
    }

    return false;
  }

  // Remove the old skipStep method since we updated it above

  private static updateProgress(userId: string) {
    const progress = this.getUserProgress(userId);
    const totalSteps = Array.from(this.steps.values());
    const requiredSteps = totalSteps.filter(step => !step.optional);
    
    // Calculate overall progress
    const completedRequired = progress.completedSteps.filter(stepId => {
      const step = this.steps.get(stepId);
      return step && !step.optional;
    }).length;
    
    const totalOptional = progress.completedSteps.filter(stepId => {
      const step = this.steps.get(stepId);
      return step && step.optional;
    }).length;

    // Base progress from required steps
    const baseProgress = (completedRequired / requiredSteps.length) * 80; // 80% for required
    
    // Bonus progress from optional steps
    const optionalSteps = totalSteps.filter(step => step.optional);
    const bonusProgress = optionalSteps.length > 0 ? (totalOptional / optionalSteps.length) * 20 : 0; // 20% for optional

    progress.overallProgress = Math.min(100, baseProgress + bonusProgress);

    // Calculate category progress
    Object.keys(progress.categories).forEach(category => {
      const categorySteps = totalSteps.filter(step => step.category === category);
      const completedInCategory = progress.completedSteps.filter(stepId => {
        const step = this.steps.get(stepId);
        return step && step.category === category;
      });
      
      progress.categories[category as keyof typeof progress.categories] = 
        categorySteps.length > 0 ? (completedInCategory.length / categorySteps.length) * 100 : 0;
    });

    // Update current step
    const nextStep = this.getNextStep(userId);
    progress.currentStep = nextStep?.id;

    this.calculateMetrics();
  }

  static getNextStep(userId: string): OnboardingStep | null {
    const progress = this.getUserProgress(userId);
    const allSteps = Array.from(this.steps.values()).sort((a, b) => a.order - b.order);

    for (const step of allSteps) {
      const isCompleted = progress.completedSteps.includes(step.id);
      const isSkipped = progress.skippedSteps.includes(step.id);
      
      if (!isCompleted && !isSkipped) {
        // Check if dependencies are met
        if (step.dependencies) {
          const dependenciesMet = step.dependencies.every(dep => 
            progress.completedSteps.includes(dep)
          );
          
          if (dependenciesMet) {
            return step;
          }
        } else {
          return step;
        }
      }
    }

    return null;
  }

  static getAvailableSteps(userId: string): OnboardingStep[] {
    const progress = this.getUserProgress(userId);
    const allSteps = Array.from(this.steps.values());

    return allSteps.filter(step => {
      const isCompleted = progress.completedSteps.includes(step.id);
      const isSkipped = progress.skippedSteps.includes(step.id);
      
      if (isCompleted || isSkipped) return false;

      // Check dependencies
      if (step.dependencies) {
        return step.dependencies.every(dep => progress.completedSteps.includes(dep));
      }

      return true;
    }).sort((a, b) => a.order - b.order);
  }

  static resetProgress(userId: string) {
    this.userProgress.delete(userId);
    this.saveUserProgress();
    logger.info(`Onboarding progress reset for user ${userId}`);
  }

  // Legacy compatibility methods for existing components
  static getCurrentStep(userId?: string): OnboardingStep | null {
    if (!userId) return null;
    return this.getNextStep(userId);
  }

  static getCurrentFlowProgress(userId?: string): FlowProgress {
    if (!userId) {
      return { currentStep: 0, totalSteps: 0, progress: 0 };
    }
    
    const progress = this.getUserProgress(userId);
    const allSteps = Array.from(this.steps.values());
    const currentStep = this.getNextStep(userId);
    const currentStepIndex = currentStep ? allSteps.findIndex(s => s.id === currentStep.id) : allSteps.length;
    
    return {
      currentStep: currentStepIndex + 1,
      totalSteps: allSteps.length,
      progress: progress.overallProgress
    };
  }

  static startFlow(flowId: string, userId?: string): boolean {
    if (!userId) return false;
    // Initialize user progress if needed
    this.getUserProgress(userId);
    return true;
  }

  static nextStep(userId: string): OnboardingStep | null {
    const nextStep = this.getNextStep(userId);
    if (nextStep) {
      this.completeStep(userId, nextStep.id);
      return this.getNextStep(userId); // Return the new next step
    }
    return null;
  }

  static previousStep(): OnboardingStep | null {
    // Simple implementation - just return null for now
    // In a full implementation, this would handle step navigation
    return null;
  }

  static skipStep(userId?: string, stepId?: string): OnboardingStep | null {
    if (!userId) return null;
    
    // If stepId not provided, skip current step
    const currentStep = this.getNextStep(userId);
    if (!currentStep) return null;
    
    const targetStepId = stepId || currentStep.id;
    const step = this.steps.get(targetStepId);
    if (!step || !step.optional) {
      return currentStep; // Can't skip required steps
    }

    const progress = this.getUserProgress(userId);
    
    if (!progress.skippedSteps.includes(targetStepId) && !progress.completedSteps.includes(targetStepId)) {
      progress.skippedSteps.push(targetStepId);
      progress.lastActivity = Date.now();
      this.updateProgress(userId);
      this.saveUserProgress();
      
      logger.info(`Onboarding step skipped: ${targetStepId} by user ${userId}`);
    }

    return this.getNextStep(userId);
  }

  static resetUserProgress(userId: string) {
    return this.resetProgress(userId);
  }

  private static calculateMetrics() {
    const allProgress = Array.from(this.userProgress.values());
    
    if (allProgress.length === 0) {
      this.metrics = {
        totalSteps: this.steps.size,
        completedSteps: 0,
        averageCompletionTime: 0,
        engagementScore: 0,
        featureAdoption: 0,
        userExperienceScore: 0
      };
      return;
    }

    // Calculate average completion time
    const totalTime = allProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    this.metrics.averageCompletionTime = totalTime / allProgress.length;

    // Calculate engagement score (based on progress and recency)
    const now = Date.now();
    const engagementScores = allProgress.map(p => {
      const recencyScore = Math.max(0, 100 - ((now - p.lastActivity) / (24 * 60 * 60 * 1000))); // Days since last activity
      return (p.overallProgress + recencyScore) / 2;
    });
    this.metrics.engagementScore = engagementScores.reduce((sum, score) => sum + score, 0) / engagementScores.length;

    // Calculate feature adoption (percentage of users who completed feature steps)
    const featureSteps = Array.from(this.steps.values()).filter(step => step.category === 'features');
    const usersWithFeatures = allProgress.filter(p => 
      featureSteps.some(step => p.completedSteps.includes(step.id))
    );
    this.metrics.featureAdoption = (usersWithFeatures.length / allProgress.length) * 100;

    // Calculate UX score (overall satisfaction based on completion rates and time)
    const avgProgress = allProgress.reduce((sum, p) => sum + p.overallProgress, 0) / allProgress.length;
    const expectedTime = Array.from(this.steps.values()).reduce((sum, step) => sum + step.estimatedTime, 0);
    const timeEfficiency = Math.min(100, (expectedTime / this.metrics.averageCompletionTime) * 100);
    this.metrics.userExperienceScore = (avgProgress + timeEfficiency) / 2;

    // Update completed steps
    this.metrics.completedSteps = allProgress.reduce((sum, p) => sum + p.completedSteps.length, 0);
  }

  static getMetrics(): OnboardingMetrics {
    return { ...this.metrics };
  }

  static getStepById(stepId: string): OnboardingStep | undefined {
    return this.steps.get(stepId);
  }

  static getAllSteps(): OnboardingStep[] {
    return Array.from(this.steps.values()).sort((a, b) => a.order - b.order);
  }

  static getCompletionInsights(userId: string) {
    const progress = this.getUserProgress(userId);
    const metrics = this.getMetrics();
    
    return {
      progress: progress.overallProgress,
      status: progress.overallProgress >= 90 ? 'expert' :
              progress.overallProgress >= 70 ? 'advanced' :
              progress.overallProgress >= 40 ? 'intermediate' : 'beginner',
      timeSpent: progress.timeSpent,
      nextStep: this.getNextStep(userId),
      categoryProgress: progress.categories,
      recommendations: this.generateRecommendations(progress),
      estimatedTimeToComplete: this.getEstimatedTimeToComplete(userId)
    };
  }

  private static generateRecommendations(progress: UserProgress): string[] {
    const recommendations: string[] = [];
    
    if (progress.overallProgress < 30) {
      recommendations.push('Complete the basic setup steps to get started');
    }
    
    if (progress.categories.features < 50) {
      recommendations.push('Explore more features to improve your experience');
    }
    
    if (progress.categories.customization < 25 && progress.categories.features > 50) {
      recommendations.push('Customize your workspace to match your preferences');
    }
    
    if (progress.overallProgress > 70 && progress.categories.advanced < 25) {
      recommendations.push('Try advanced features to become a power user');
    }

    return recommendations;
  }

  private static getEstimatedTimeToComplete(userId: string): number {
    const availableSteps = this.getAvailableSteps(userId);
    return availableSteps.reduce((sum, step) => sum + step.estimatedTime, 0);
  }
}