import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apmService } from '@/services/apmService';
import { unifiedConsoleManager } from '@/utils/unifiedConsoleManager';
import { PerformanceMonitor } from '@/lib/logger';

export interface APMStats {
  totalErrors: number;
  filteredErrors: number;
  avgResponseTime: number;
  alertCount: number;
  sessionDuration: number;
  pageViews: number;
}

export const useAPMMonitoring = () => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(true);
  const [filterLevel, setFilterLevel] = useState<'none' | 'dev' | 'strict'>('dev');
  const [stats, setStats] = useState<APMStats>({
    totalErrors: 0,
    filteredErrors: 0,
    avgResponseTime: 0,
    alertCount: 0,
    sessionDuration: 0,
    pageViews: 0
  });

  // Initialize APM when user is available
  useEffect(() => {
    if (user?.id) {
      apmService.setUserId(user.id);
      apmService.setEnabled(isEnabled);
      
      // Track page view
      apmService.recordUserAction('page_view');
    }
  }, [user?.id, isEnabled]);

  // Console management is handled by the unified system

  // Performance monitoring setup
  useEffect(() => {
    if (!isEnabled) return;

    // Track page load performance
    const trackPageLoad = () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 0) {
        apmService.recordPageLoad(loadTime);
      }
    };

    // Track navigation performance
    if (performance.timing.loadEventEnd > 0) {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    // Track unhandled errors
    const handleError = (event: ErrorEvent) => {
      apmService.recordError({
        error_type: 'javascript_error',
        error_message: event.message,
        error_stack: event.error?.stack,
        component_name: 'global',
        severity: 'high',
        tags: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    };

    // Track unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      apmService.recordError({
        error_type: 'promise_rejection',
        error_message: String(event.reason),
        component_name: 'global',
        severity: 'high',
        tags: { type: 'unhandled_rejection' }
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('load', trackPageLoad);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, [isEnabled]);

  // Track route changes
  useEffect(() => {
    if (!isEnabled) return;

    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      apmService.recordMetric({
        metric_type: 'navigation',
        metric_name: 'page_duration',
        metric_value: duration,
        tags: { url: window.location.pathname }
      });
    };
  }, [window.location.pathname, isEnabled]);

  // Load stats periodically
  useEffect(() => {
    if (!isEnabled || !user?.id) return;

    const loadStats = async () => {
      try {
        const [errors, alerts, metrics] = await Promise.all([
          apmService.getErrors('24h', true),
          apmService.getAlerts(true),
          apmService.getMetrics('24h')
        ]);

        const totalErrors = errors.length;
        const filteredErrors = errors.filter(e => e.is_filtered).length;
        const responseTimes = metrics
          .filter(m => m.metric_name === 'api_call')
          .map(m => m.metric_value);
        const avgResponseTime = responseTimes.length > 0 
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
          : 0;

        setStats({
          totalErrors,
          filteredErrors,
          avgResponseTime,
          alertCount: alerts.length,
          sessionDuration: Date.now() - performance.timing.navigationStart,
          pageViews: metrics.filter(m => m.metric_name === 'page_view').length || 1
        });
      } catch (error) {
        console.error('Failed to load APM stats:', error);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 60000); // Reduced frequency from 30s to 60s

    return () => clearInterval(interval);
  }, [isEnabled, user?.id]);

  // Utility functions
  const trackUserAction = useCallback((action: string, duration?: number) => {
    if (isEnabled) {
      apmService.recordUserAction(action, duration);
    }
  }, [isEnabled]);

  const trackApiCall = useCallback((endpoint: string, duration: number, status: number) => {
    if (isEnabled) {
      apmService.recordApiCall(endpoint, duration, status);
    }
  }, [isEnabled]);

  const recordError = useCallback((error: Error, component?: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium') => {
    if (isEnabled) {
      apmService.recordError({
        error_type: 'application_error',
        error_message: error.message,
        error_stack: error.stack,
        component_name: component,
        severity,
        tags: { manual: true }
      });
    }
  }, [isEnabled]);

  const measurePerformance = useCallback(<T>(label: string, fn: () => T): T => {
    if (!isEnabled) return fn();
    
    return PerformanceMonitor.measure(label, () => {
      const result = fn();
      
      // Record the measurement in APM
      const duration = performance.now();
      apmService.recordMetric({
        metric_type: 'performance',
        metric_name: label,
        metric_value: duration,
        tags: { manual_measurement: true }
      });
      
      return result;
    });
  }, [isEnabled]);

  const measureAsyncPerformance = useCallback(async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    if (!isEnabled) return fn();
    
    return PerformanceMonitor.measureAsync(label, async () => {
      const startTime = performance.now();
      const result = await fn();
      const duration = performance.now() - startTime;
      
      apmService.recordMetric({
        metric_type: 'performance',
        metric_name: label,
        metric_value: duration,
        tags: { manual_measurement: true, async: true }
      });
      
      return result;
    });
  }, [isEnabled]);

  const enableFiltering = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);
  }, []);

  const setConsoleFilterLevel = useCallback((level: 'none' | 'dev' | 'strict') => {
    setFilterLevel(level);
  }, []);

  const suppressNextError = useCallback(() => {
    // Console suppression handled by unified system
  }, []);

  return {
    // State
    isEnabled,
    filterLevel,
    stats,
    
    // Control functions
    enableFiltering,
    setConsoleFilterLevel,
    suppressNextError,
    
    // Tracking functions
    trackUserAction,
    trackApiCall,
    recordError,
    measurePerformance,
    measureAsyncPerformance,
    
    // Service access
    apmService,
    unifiedConsoleManager
  };
};