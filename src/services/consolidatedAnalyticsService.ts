import { logger } from '../utils/logger';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
}

export class ConsolidatedAnalyticsService {
  private static isInitialized = false;
  private static eventQueue: AnalyticsEvent[] = [];
  private static flushTimer: number | null = null;
  private static readonly FLUSH_INTERVAL = 10000; // Flush every 10 seconds
  private static readonly MAX_QUEUE_SIZE = 100;

  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Only initialize in production to reduce development noise
      if (import.meta.env.PROD) {
        this.setupPeriodicFlush();
      }
      
      this.isInitialized = true;
      logger.debug('✅ Consolidated analytics service initialized');
    } catch (error) {
      logger.error('Failed to initialize analytics:', error);
    }
  }

  private static setupPeriodicFlush() {
    this.flushTimer = window.setInterval(() => {
      this.flushEvents();
    }, this.FLUSH_INTERVAL);
  }

  static trackEvent(name: string, properties?: Record<string, any>) {
    if (!this.isInitialized) return;

    // Prevent queue overflow
    if (this.eventQueue.length >= this.MAX_QUEUE_SIZE) {
      this.eventQueue.shift(); // Remove oldest event
    }

    this.eventQueue.push({
      name,
      properties,
      timestamp: Date.now()
    });

    // Immediate flush for critical events
    if (name.includes('error') || name.includes('crash')) {
      this.flushEvents();
    }
  }

  static trackPageView(path: string, title?: string) {
    this.trackEvent('page_view', { path, title });
  }

  static trackUserAction(action: string, context?: string) {
    this.trackEvent('user_action', { action, context });
  }

  static trackError(error: Error, context?: string) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack?.substring(0, 500), // Limit stack trace size
      context
    });
  }

  private static flushEvents() {
    if (this.eventQueue.length === 0) return;

    // Use requestIdleCallback for non-blocking processing
    requestIdleCallback(() => {
      try {
        // In production, send to your analytics service here
        // For now, we'll just log in development
        if (import.meta.env.DEV && this.eventQueue.length > 0) {
          logger.debug('Analytics events:', this.eventQueue.slice(0, 5)); // Log first 5 events only
        }

        // Clear the queue
        this.eventQueue.length = 0;
      } catch (error) {
        logger.error('Failed to flush analytics events:', error);
      }
    });
  }

  static setUserId(userId: string) {
    this.trackEvent('user_identified', { userId });
  }

  static cleanup() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush remaining events before cleanup
    this.flushEvents();
    this.isInitialized = false;
    logger.debug('✅ Consolidated analytics service cleaned up');
  }
}