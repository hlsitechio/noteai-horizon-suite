import { useCallback, useEffect, useRef } from 'react';

interface UsePerformanceMonitoringReturn {
  trackOperation: (operationName: string, fn: () => Promise<any>) => Promise<any>;
  getMetrics: () => {
    averageOperationTime: number;
    totalOperations: number;
    slowOperations: Array<{ name: string; duration: number; timestamp: number }>;
  };
}

export const usePerformanceMonitoring = (): UsePerformanceMonitoringReturn => {
  const metricsRef = useRef({
    operations: [] as Array<{ name: string; duration: number; timestamp: number }>,
    totalTime: 0,
    count: 0,
  });

  const trackOperation = useCallback(async (operationName: string, fn: () => Promise<any>) => {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      // Track metrics
      metricsRef.current.operations.push({
        name: operationName,
        duration,
        timestamp: Date.now(),
      });
      
      metricsRef.current.totalTime += duration;
      metricsRef.current.count += 1;
      
      // Keep only last 100 operations
      if (metricsRef.current.operations.length > 100) {
        metricsRef.current.operations = metricsRef.current.operations.slice(-100);
      }
      
      // Log slow operations (>1 second)
      if (duration > 1000) {
        console.warn(`Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`Operation failed: ${operationName} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }, []);

  const getMetrics = useCallback(() => {
    const operations = metricsRef.current.operations;
    const averageOperationTime = metricsRef.current.count > 0 
      ? metricsRef.current.totalTime / metricsRef.current.count 
      : 0;
    
    const slowOperations = operations.filter(op => op.duration > 1000);
    
    return {
      averageOperationTime,
      totalOperations: metricsRef.current.count,
      slowOperations,
    };
  }, []);

  // Log metrics every 30 seconds in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const metrics = getMetrics();
        if (metrics.totalOperations > 0) {
          console.log('Performance Metrics:', metrics);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [getMetrics]);

  return { trackOperation, getMetrics };
};
