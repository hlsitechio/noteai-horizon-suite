import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAPMMonitoring } from './useAPMMonitoring';
import { useGlobalErrorHandler } from './useGlobalErrorHandler';

/**
 * Integration hook that automatically sets up APM monitoring
 * and integrates with existing error handling systems
 */
export const useAPMIntegration = () => {
  const { user } = useAuth();
  const { 
    trackUserAction, 
    trackApiCall, 
    recordError, 
    measureAsyncPerformance,
    apmService 
  } = useAPMMonitoring();

  // Enable global error handling
  useGlobalErrorHandler();

  // Initialize APM when user is available
  useEffect(() => {
    if (user?.id) {
      apmService.setUserId(user.id);
    }
  }, [user?.id, apmService]);

  // Track navigation changes
  useEffect(() => {
    trackUserAction('page_navigation');
  }, [window.location.pathname, trackUserAction]);

  // Enhanced fetch wrapper with APM tracking
  const apmFetch = async (url: string, options?: RequestInit): Promise<Response> => {
    const startTime = performance.now();
    const endpoint = url.replace(/\?.*/g, ''); // Remove query params for cleaner metrics
    
    try {
      const response = await fetch(url, options);
      const duration = performance.now() - startTime;
      
      trackApiCall(endpoint, duration, response.status);
      
      if (!response.ok) {
        recordError(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          'fetch',
          response.status >= 500 ? 'high' : 'medium'
        );
      }
      
      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      trackApiCall(endpoint, duration, 0);
      
      recordError(
        error as Error,
        'fetch',
        'critical'
      );
      
      throw error;
    }
  };

  // Enhanced component error boundary wrapper
  const withAPMErrorBoundary = (Component: React.ComponentType<any>) => {
    return (props: any) => {
      useEffect(() => {
        const originalError = console.error;
        console.error = (...args: any[]) => {
          const errorMessage = args.join(' ');
          if (errorMessage.includes('React') || errorMessage.includes('component')) {
            recordError(
              new Error(errorMessage),
              Component.displayName || Component.name || 'Component',
              'medium'
            );
          }
          originalError(...args);
        };

        return () => {
          console.error = originalError;
        };
      }, []);

      return <Component {...props} />;
    };
  };

  // Performance measurement wrapper for async operations
  const measureAPMPerformance = async (
    label: string,
    operation: () => Promise<any>
  ): Promise<any> => {
    return measureAsyncPerformance(label, operation);
  };

  return {
    // Enhanced utilities
    apmFetch,
    withAPMErrorBoundary,
    measureAPMPerformance,
    
    // Direct access to tracking functions
    trackUserAction,
    trackApiCall,
    recordError,
    
    // Service access
    apmService
  };
};