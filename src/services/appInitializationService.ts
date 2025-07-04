
import { AnalyticsService } from './analyticsService';
import { PerformanceService } from './performanceService';
import { initSentry } from '../config/sentry';
import * as Sentry from "@sentry/react";
import { logger } from '../utils/logger';

export class AppInitializationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Sentry first for error tracking
      initSentry();

      // Initialize performance monitoring
      PerformanceService.initialize();

      // Initialize analytics
      AnalyticsService.initialize();

      // Set up global error handlers
      this.setupGlobalErrorHandlers();

      // Set up performance monitoring
      this.setupPerformanceMonitoring();

      this.isInitialized = true;
      
      // Show the clean welcome message before console override happens
      const originalConsoleInfo = console.info;
      setTimeout(() => {
        originalConsoleInfo('🚀 Welcome to Online Note AI!');
      }, 100);
      
      // Track initialization
      AnalyticsService.trackEvent('app_initialized', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      });

    } catch (error) {
      logger.error('❌ Failed to initialize application:', error);
      Sentry.captureException(error);
    }
  }

  private static setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      Sentry.captureException(event.reason);
      AnalyticsService.trackError(new Error(String(event.reason)), 'unhandled_promise');
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      Sentry.captureException(event.error);
      AnalyticsService.trackError(event.error, 'javascript_error');
    });
  }

  private static setupPerformanceMonitoring() {
    // Monitor Core Web Vitals and send to analytics
    setTimeout(() => {
      const metrics = PerformanceService.getMetrics();
      Object.entries(metrics).forEach(([metric, value]) => {
        AnalyticsService.trackEvent('performance_metric', {
          metric_name: metric,
          metric_value: value,
        });
      });
    }, 5000); // Wait 5 seconds to collect metrics
  }

  static cleanup() {
    PerformanceService.cleanup();
    this.isInitialized = false;
  }
}
