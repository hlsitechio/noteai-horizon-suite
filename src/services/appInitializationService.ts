
import { AnalyticsService } from './analyticsService';
import { PerformanceService } from './performanceService';
import { CleanupService } from './cleanupService';
import { initSentry } from '../config/sentry';
import * as Sentry from "@sentry/react";
import { logger } from '../utils/logger';

export class AppInitializationService {
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize cleanup service first to prevent issues
      CleanupService.initialize();

      // Initialize Sentry with reduced configuration
      initSentry();

      // Initialize performance monitoring (lightweight)
      PerformanceService.initialize();

      // Skip analytics initialization to prevent 429 errors
      // AnalyticsService.initialize();

      // Set up minimal global error handlers
      this.setupGlobalErrorHandlers();

      this.isInitialized = true;
      
      // App initialized successfully

    } catch (error) {
      logger.error('❌ Failed to initialize application:', error);
      Sentry.captureException(error);
    }
  }

  private static setupGlobalErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      // Filter out Firebase permission errors to reduce noise
      if (event.reason?.message?.includes('permission-denied')) {
        console.warn('Firebase permission error ignored:', event.reason);
        event.preventDefault();
        return;
      }
      
      Sentry.captureException(event.reason);
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      // Filter out Firebase and COOP errors
      if (event.error?.message?.includes('permission-denied') || 
          event.error?.message?.includes('Cross-Origin-Opener-Policy')) {
        console.warn('Filtered error ignored:', event.error);
        return;
      }
      
      Sentry.captureException(event.error);
    });
  }

  static cleanup() {
    PerformanceService.cleanup();
    CleanupService.cleanup();
    this.isInitialized = false;
  }
}
