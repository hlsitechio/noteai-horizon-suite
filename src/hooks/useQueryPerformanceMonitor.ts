
import { useEffect, useCallback } from 'react';
import { DatabasePerformanceService } from '@/services/databasePerformanceService';

export const useQueryPerformanceMonitor = () => {
  const trackQuery = useCallback((queryName: string, startTime: number) => {
    const executionTime = Date.now() - startTime;
    DatabasePerformanceService.logQueryPerformance(queryName, executionTime);
  }, []);

  const startTimer = useCallback((queryName: string) => {
    const startTime = Date.now();
    return () => trackQuery(queryName, startTime);
  }, [trackQuery]);

  const getPerformanceReport = useCallback(() => {
    return DatabasePerformanceService.getPerformanceReport();
  }, []);

  const getOptimizationPlan = useCallback(async () => {
    return await DatabasePerformanceService.generateOptimizationPlan();
  }, []);

  return {
    startTimer,
    trackQuery,
    getPerformanceReport,
    getOptimizationPlan
  };
};
