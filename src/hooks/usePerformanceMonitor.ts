/**
 * Performance Monitoring Hook (Simplified Browser-Compatible Version)
 * Monitors basic performance metrics without worker dependencies
 */

import { useState, useEffect, useCallback } from 'react';

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

  const updateMetrics = useCallback(async () => {
    try {
      // Get basic performance metrics
      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100 : 0;
      
      // Estimate CPU usage (simplified)
      const start = performance.now();
      await new Promise(resolve => setTimeout(resolve, 10));
      const cpuTime = performance.now() - start;
      const cpuUsage = Math.min((cpuTime - 10) * 10, 100);
      
      const isHighCPU = cpuUsage > 70;
      const recommendations = [];
      
      if (isHighCPU) {
        recommendations.push('Consider optimizing heavy operations');
      }
      if (memoryUsage > 80) {
        recommendations.push('Memory usage is high, consider cleaning up unused resources');
      }
      
      setMetrics({
        cpuUsage,
        memoryUsage,
        workerStats: null,
        isHighCPU,
        recommendations
      });
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;
    
    setIsMonitoring(true);
    const interval = setInterval(updateMetrics, 5000); // Reduced frequency from 2s to 5s
    
    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [isMonitoring, updateMetrics]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  // Get current metrics
  const getCurrentMetrics = useCallback(async () => {
    await updateMetrics();
    return metrics;
  }, [updateMetrics, metrics]);

  // Simplified - always return false since workers are removed
  const shouldUseWorkers = false;

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