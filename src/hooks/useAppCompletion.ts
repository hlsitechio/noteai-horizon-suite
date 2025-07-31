
import { useState, useEffect } from 'react';
import { TestingService } from '@/services/testingService';
import { BundleAnalysisService } from '@/services/bundleAnalysisService';
import { OnboardingService } from '@/services/onboardingService';
import { EnhancedTestingService } from '@/services/enhancedTestingService';
import { AdvancedErrorManagement } from '@/services/advancedErrorManagement';
import { useAuth } from '@/contexts/AuthContext';

interface AppCompletionMetrics {
  testingScore: number;
  errorScore: number;
  performanceScore: number;
  onboardingScore: number;
  overallCompletion: number;
  recommendations: Array<{
    category: 'testing' | 'errors' | 'performance' | 'onboarding';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }>;
}

export const useAppCompletion = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AppCompletionMetrics>({
    testingScore: 0,
    errorScore: 0,
    performanceScore: 0,
    onboardingScore: 0,
    overallCompletion: 0,
    recommendations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const calculateMetrics = async (): Promise<AppCompletionMetrics> => {
    // Initialize enhanced services
    EnhancedTestingService.initialize();
    AdvancedErrorManagement.initialize();

    // Testing Score (0-100) - Enhanced with comprehensive testing
    const basicTestingScore = TestingService.getHealthScore();
    const enhancedTestingMetrics = EnhancedTestingService.getMetrics();
    const testingScore = Math.max(basicTestingScore, enhancedTestingMetrics.overallHealth);
    
    // Error Score (0-100) - Now using advanced error management
    const errorMetrics = AdvancedErrorManagement.getMetrics();
    const errorScore = errorMetrics.stabilityScore;
    
    // Performance Score (0-100)
    const bundleMetrics = BundleAnalysisService.getBundleMetrics();
    const performanceScore = bundleMetrics.performanceScore;
    
    // Onboarding Score (0-100)
    const userProgress = user ? OnboardingService.getUserProgress(user.id) : { overallProgress: 0 };
    const onboardingScore = userProgress.overallProgress;
    
    // Overall Completion (weighted average)
    const weights = {
      testing: 0.3,
      errors: 0.3,
      performance: 0.25,
      onboarding: 0.15
    };
    
    const overallCompletion = 
      (testingScore * weights.testing) +
      (errorScore * weights.errors) +
      (performanceScore * weights.performance) +
      (onboardingScore * weights.onboarding);
    
    // Generate recommendations
    const recommendations = [];
    
    if (testingScore < 80) {
      recommendations.push({
        category: 'testing' as const,
        priority: 'high' as const,
        title: 'Improve Test Coverage',
        description: 'Run component tests to identify and fix issues before they reach users.'
      });
    }
    
    if (errorScore < 70) {
      recommendations.push({
        category: 'errors' as const,
        priority: 'high' as const,
        title: 'Address Error Reports',
        description: 'Review and resolve unhandled errors to improve application stability.'
      });
    }
    
    if (performanceScore < 70) {
      recommendations.push({
        category: 'performance' as const,
        priority: 'medium' as const,
        title: 'Optimize Performance',
        description: 'Implement code splitting and optimize bundle size for faster loading.'
      });
    }
    
    if (onboardingScore < 50 && user) {
      recommendations.push({
        category: 'onboarding' as const,
        priority: 'low' as const,
        title: 'Complete Onboarding',
        description: 'Finish the onboarding tour to learn all available features.'
      });
    }
    
    return {
      testingScore,
      errorScore,
      performanceScore,
      onboardingScore,
      overallCompletion,
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
    };
  };

  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      const newMetrics = await calculateMetrics();
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to calculate app completion metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize and refresh metrics
  useEffect(() => {
    refreshMetrics();
    
    // Refresh every 5 minutes
    const interval = setInterval(refreshMetrics, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  const runHealthCheck = async () => {
    setIsLoading(true);
    
    try {
      // Run comprehensive health checks
      await Promise.all([
        TestingService.runComponentTests(),
        EnhancedTestingService.runComprehensiveTests(),
        BundleAnalysisService.initialize(), // Re-initialize to get fresh metrics
      ]);
      
      await refreshMetrics();
    } catch (error) {
      console.error('Health check failed:', error);
      // Capture this error in our advanced error management
      AdvancedErrorManagement.captureError({
        type: 'javascript',
        message: `Health check failed: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'high'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCompletionStatus = () => {
    const { overallCompletion } = metrics;
    
    if (overallCompletion >= 95) {
      return {
        status: 'excellent' as const,
        message: 'Your application is production-ready and well-optimized!',
        color: 'text-green-600'
      };
    } else if (overallCompletion >= 85) {
      return {
        status: 'good' as const,
        message: 'Your application is in great shape with minor improvements needed.',
        color: 'text-blue-600'
      };
    } else if (overallCompletion >= 70) {
      return {
        status: 'fair' as const,
        message: 'Your application is functional but could benefit from optimization.',
        color: 'text-yellow-600'
      };
    } else {
      return {
        status: 'needs-work' as const,
        message: 'Your application needs attention in several areas.',
        color: 'text-red-600'
      };
    }
  };

  return {
    metrics,
    isLoading,
    lastUpdated,
    refreshMetrics,
    runHealthCheck,
    getCompletionStatus
  };
};
