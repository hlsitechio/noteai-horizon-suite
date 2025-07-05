
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
    // Reduced performance monitoring to prevent violations
    setTimeout(() => {
      try {
        const metrics = PerformanceService.getMetrics();
        // Only send critical metrics to reduce noise
        const criticalMetrics = Object.entries(metrics).filter(
          ([metric, value]) => typeof value === 'number' && value > 0
        );
        
        if (criticalMetrics.length > 0) {
          criticalMetrics.forEach(([metric, value]) => {
            AnalyticsService.trackEvent('performance_metric', {
              metric_name: metric,
              metric_value: value,
            });
          });
        }
      } catch (error) {
        // Silent failure to prevent console noise
      }
    }, 10000); // Increased delay to reduce violations
  }

  static cleanup() {
    PerformanceService.cleanup();
    this.isInitialized = false;
  }
}
