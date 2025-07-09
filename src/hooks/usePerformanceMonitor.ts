/**
 * Performance Monitoring Hook
 * Monitors CPU usage and performance metrics to optimize worker usage
 */

import { useState, useEffect, useCallback } from 'react';
import { workerPool } from '@/workers/worker-pool';

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  workerStats: any;
  isHighCPU: boolean;
  recommendations: string[];
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    workerStats: null,
    isHighCPU: false,
    recommendations: []
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // Get basic performance metrics
  const getPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    try {
      // Get memory usage
      const memoryInfo = (performance as any)?.memory;
      const memoryUsage = memoryInfo ? 
        Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100) : 0;

      // Get worker pool statistics
      const workerStats = workerPool.getStats();

      // Estimate CPU usage based on worker queue and performance timing
      const entries = performance.getEntriesByType('measure');
      const recentEntries = entries.filter(entry => 
        Date.now() - entry.startTime < 5000 // Last 5 seconds
      );
      
      // Simple CPU estimation based on task density
      const cpuUsage = Math.min(100, Math.round(
        (recentEntries.length * 10) + 
        ((workerStats.ai?.queueSize || 0) * 5) + 
        ((workerStats.ocr?.queueSize || 0) * 10)
      ));

      const isHighCPU = cpuUsage > 70;

      // Generate recommendations
      const recommendations: string[] = [];
      if (isHighCPU) {
        recommendations.push('High CPU usage detected - consider reducing concurrent operations');
      }
      if (memoryUsage > 80) {
        recommendations.push('High memory usage - consider clearing caches or reducing data retention');
      }
      if ((workerStats.ai?.queueSize || 0) > 5) {
        recommendations.push('AI worker queue is full - consider batching operations');
      }
      if ((workerStats.ocr?.queueSize || 0) > 3) {
        recommendations.push('OCR worker queue is full - consider processing fewer images simultaneously');
      }

      return {
        cpuUsage,
        memoryUsage,
        workerStats,
        isHighCPU,
        recommendations
      };
    } catch (error) {
      console.error('[Performance Monitor] Error getting metrics:', error);
      return metrics; // Return current metrics on error
    }
  }, [metrics]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    console.log('[Performance Monitor] Started monitoring');

    const interval = setInterval(async () => {
      const newMetrics = await getPerformanceMetrics();
      setMetrics(newMetrics);
      
      // Log warnings for high resource usage
      if (newMetrics.isHighCPU) {
        console.warn('[Performance Monitor] High CPU usage detected:', newMetrics.cpuUsage + '%');
      }
      if (newMetrics.memoryUsage > 80) {
        console.warn('[Performance Monitor] High memory usage detected:', newMetrics.memoryUsage + '%');
      }
    }, 2000); // Update every 2 seconds

    // Cleanup interval
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
      console.log('[Performance Monitor] Stopped monitoring');
    };
  }, [isMonitoring, getPerformanceMetrics]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Get current metrics without starting monitoring
  const getCurrentMetrics = useCallback(async () => {
    return await getPerformanceMetrics();
  }, [getPerformanceMetrics]);

  // Check if workers should be used based on performance
  const shouldUseWorkers = useCallback(() => {
    // Use workers if:
    // 1. CPU usage is not critically high (< 90%)
    // 2. Memory usage is acceptable (< 90%)
    // 3. Worker queues are not overloaded
    const cpuOk = metrics.cpuUsage < 90;
    const memoryOk = metrics.memoryUsage < 90;
    const queueOk = (metrics.workerStats?.ai?.queueSize || 0) < 10 && 
                    (metrics.workerStats?.ocr?.queueSize || 0) < 5;
    
    return cpuOk && memoryOk && queueOk;
  }, [metrics]);

  // Auto-start monitoring when component mounts
  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getCurrentMetrics,
    shouldUseWorkers
  };
};