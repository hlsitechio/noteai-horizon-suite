
import { useEffect, useCallback } from 'react';
import { DatabasePerformanceService } from '@/services/databasePerformanceService';

export const useQueryPerformanceMonitor = () => {
  const trackQuery = useCallback((queryName: string, startTime: number, success: boolean = true) => {
    const executionTime = Date.now() - startTime;
    DatabasePerformanceService.logQueryPerformance(queryName, executionTime, success);
  }, []);

  const startTimer = useCallback((queryName: string) => {
    const startTime = Date.now();
    return (success: boolean = true) => trackQuery(queryName, startTime, success);
  }, [trackQuery]);

  const getPerformanceReport = useCallback(() => {
    return DatabasePerformanceService.getPerformanceReport();
  }, []);

  const getOptimizationPlan = useCallback(async () => {
    return await DatabasePerformanceService.generateOptimizationPlan();
  }, []);

  const analyzePerformance = useCallback(async () => {
    return await DatabasePerformanceService.analyzeQueryPerformance();
  }, []);

  const getRecommendations = useCallback(async () => {
    return await DatabasePerformanceService.getOptimizationRecommendations();
  }, []);

  // Demo data generation disabled for simple app

  return {
    startTimer,
    trackQuery,
    getPerformanceReport,
    getOptimizationPlan,
    analyzePerformance,
    getRecommendations
  };
};
