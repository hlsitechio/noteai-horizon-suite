import { useEffect, useCallback } from 'react';
import { productionMonitoring } from '../services/productionMonitoringService';
import { productionCache } from '../services/productionCacheService';
import { unifiedSecurityService } from '../services/security';

interface UseProductionMonitoringOptions {
  trackPageViews?: boolean;
  trackUserActions?: boolean;
  trackErrors?: boolean;
  enableCaching?: boolean;
  enableRateLimit?: boolean;
}

interface UseProductionMonitoringReturn {
  trackUserAction: (action: string, metadata?: Record<string, any>) => void;
  trackAPICall: (endpoint: string, duration: number, success: boolean, statusCode?: number) => void;
  checkRateLimit: (endpoint: string, userId?: string) => Promise<{ allowed: boolean; rateLimited: boolean }>;
  getCachedData: <T>(key: string) => Promise<T | null>;
  setCachedData: <T>(key: string, data: T, ttl?: number) => Promise<void>;
  getHealthStatus: () => Promise<any>;
  getCacheStats: () => any;
  getSecurityStats: () => any;
}

/**
 * Production monitoring hook for tracking performance, security, and user actions
 */
export function useProductionMonitoring(
  options: UseProductionMonitoringOptions = {}
): UseProductionMonitoringReturn {
  const {
    trackPageViews = true,
    trackUserActions = true,
    trackErrors = true,
    enableCaching = true,
    enableRateLimit = true,
  } = options;

  // Track page view on mount and route changes
  useEffect(() => {
    if (trackPageViews && import.meta.env.PROD) {
      productionMonitoring.trackPageLoad(window.location.pathname);
    }
  }, [trackPageViews]);

  // Set up error tracking
  useEffect(() => {
    if (!trackErrors || !import.meta.env.PROD) return;

    const handleError = (event: ErrorEvent) => {
      // Temporarily disable error tracking to prevent RLS errors
      return;
      productionMonitoring.trackMetric('javascript_error', 1, 'counter', {
        error_message: event.message.substring(0, 500),
        error_source: event.filename,
        error_line: event.lineno,
        page: window.location.pathname
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Temporarily disable rejection tracking to prevent RLS errors
      return;
      productionMonitoring.trackMetric('unhandled_promise_rejection', 1, 'counter', {
        error_reason: String(event.reason).substring(0, 500),
        page: window.location.pathname
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackErrors]);

  // Track user action with automatic performance timing
  const trackUserAction = useCallback((action: string, metadata?: Record<string, any>) => {
    if (!trackUserActions || !import.meta.env.PROD) return;

    const startTime = performance.now();
    productionMonitoring.trackUserAction(action, performance.now() - startTime, {
      page: window.location.pathname,
      ...metadata
    });
  }, [trackUserActions]);

  // Track API call performance
  const trackAPICall = useCallback((
    endpoint: string, 
    duration: number, 
    success: boolean, 
    statusCode?: number
  ) => {
    if (!import.meta.env.PROD) return;

    productionMonitoring.trackAPICall(endpoint, duration, success, statusCode);
  }, []);

  // Rate limiting check with caching
  const checkRateLimit = useCallback(async (endpoint: string, userId?: string) => {
    if (!enableRateLimit) {
      return { allowed: true, rateLimited: false };
    }

    // Check cache first for rate limit status
    const cacheKey = `rate_limit_${endpoint}_${userId || 'anonymous'}`;
    if (enableCaching) {
      const cached = await productionCache.get<{ allowed: boolean; rateLimited: boolean }>(cacheKey);
      if (cached && !cached.rateLimited) {
        return cached;
      }
    }

    const result = await productionMonitoring.checkRateLimit(endpoint, userId);
    
    // Cache successful rate limit checks briefly
    if (enableCaching && result.allowed) {
      await productionCache.set(cacheKey, result, { ttl: 30000 }); // 30 seconds
    }

    return result;
  }, [enableRateLimit, enableCaching]);

  // Cached data operations
  const getCachedData = useCallback(async <T>(key: string): Promise<T | null> => {
    if (!enableCaching) return null;
    return productionCache.get<T>(key);
  }, [enableCaching]);

  const setCachedData = useCallback(async <T>(key: string, data: T, ttl?: number): Promise<void> => {
    if (!enableCaching) return;
    await productionCache.set(key, data, { ttl });
  }, [enableCaching]);

  // Get health status
  const getHealthStatus = useCallback(async () => {
    return productionMonitoring.getHealthStatus();
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    if (!enableCaching) return null;
    return productionCache.getStats();
  }, [enableCaching]);

  // Get security statistics
  const getSecurityStats = useCallback(() => {
    return unifiedSecurityService.getStats();
  }, []);

  return {
    trackUserAction,
    trackAPICall,
    checkRateLimit,
    getCachedData,
    setCachedData,
    getHealthStatus,
    getCacheStats,
    getSecurityStats,
  };
}

/**
 * Enhanced hook for API calls with automatic monitoring, caching, and rate limiting
 */
export function useProductionAPI() {
  const {
    trackAPICall,
    checkRateLimit,
    getCachedData,
    setCachedData,
  } = useProductionMonitoring();

  const makeRequest = useCallback(async <T>(
    endpoint: string,
    options: RequestInit & {
      cache?: boolean;
      cacheTTL?: number;
      rateLimit?: boolean;
      userId?: string;
    } = {}
  ): Promise<T> => {
    const {
      cache = true,
      cacheTTL = 5 * 60 * 1000, // 5 minutes
      rateLimit = true,
      userId,
      ...fetchOptions
    } = options;

    const startTime = performance.now();
    const cacheKey = `api_${endpoint}_${JSON.stringify(fetchOptions.body || '')}`;

    try {
      // Check cache first
      if (cache && fetchOptions.method !== 'POST') {
        const cached = await getCachedData<T>(cacheKey);
        if (cached) {
          trackAPICall(endpoint, performance.now() - startTime, true, 200);
          return cached;
        }
      }

      // Check rate limit
      if (rateLimit) {
        const rateLimitResult = await checkRateLimit(endpoint, userId);
        if (rateLimitResult.rateLimited) {
          throw new Error(`Rate limit exceeded for ${endpoint}`);
        }
      }

      // Make the request
      const response = await fetch(endpoint, fetchOptions);
      const duration = performance.now() - startTime;
      
      if (!response.ok) {
        trackAPICall(endpoint, duration, false, response.status);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful responses
      if (cache && response.status === 200) {
        await setCachedData(cacheKey, data, cacheTTL);
      }

      trackAPICall(endpoint, duration, true, response.status);
      return data;

    } catch (error) {
      const duration = performance.now() - startTime;
      trackAPICall(endpoint, duration, false, 0);
      throw error;
    }
  }, [trackAPICall, checkRateLimit, getCachedData, setCachedData]);

  return { makeRequest };
}

/**
 * Hook for performance-optimized component rendering tracking
 */
export function usePerformanceTracking(componentName: string) {
  const { trackUserAction } = useProductionMonitoring();

  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16) { // Only track slow renders (>16ms for 60fps)
        trackUserAction('component_slow_render', {
          component: componentName,
          duration: renderTime
        });
      }
    };
  }, [componentName, trackUserAction]);

  const trackComponentAction = useCallback((action: string, metadata?: Record<string, any>) => {
    trackUserAction(`${componentName}_${action}`, metadata);
  }, [componentName, trackUserAction]);

  return { trackComponentAction };
}