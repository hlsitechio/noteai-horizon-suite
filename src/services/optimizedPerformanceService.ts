import { logger } from '../utils/logger';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export class OptimizedPerformanceService {
  private static isInitialized = false;
  private static observer: PerformanceObserver | null = null;
  private static metrics: Map<string, PerformanceMetric> = new Map();
  private static batchTimeout: number | null = null;
  private static readonly BATCH_DELAY = 5000; // Batch metrics every 5 seconds
  private static readonly MAX_METRICS = 50; // Limit stored metrics

  static initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Only initialize essential performance monitoring
      this.initializeWebVitals();
      this.setupMemoryMonitoring();
      this.isInitialized = true;
      logger.debug('✅ Optimized performance service initialized');
    } catch (error) {
      logger.error('Failed to initialize optimized performance service:', error);
    }
  }

  private static initializeWebVitals() {
    // Use a single PerformanceObserver instead of multiple event listeners
    if ('PerformanceObserver' in window) {
      try {
        this.observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric(entry.name, entry.duration || 0);
          }
        });

        // Observe essential metrics only
        this.observer.observe({ 
          entryTypes: ['navigation', 'largest-contentful-paint'] 
        });
      } catch (error) {
        logger.warn('PerformanceObserver not fully supported:', error);
      }
    }
  }

  private static setupMemoryMonitoring() {
    // Monitor memory usage only in production and with throttling
    if (import.meta.env.PROD && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          this.recordMetric('memory_used', memory.usedJSHeapSize);
          this.recordMetric('memory_limit', memory.jsHeapSizeLimit);
        }
      };

      // Check memory every 30 seconds instead of frequent intervals
      setInterval(checkMemory, 30000);
    }
  }

  private static recordMetric(name: string, value: number) {
    // Prevent memory leaks by limiting stored metrics
    if (this.metrics.size >= this.MAX_METRICS) {
      const firstKey = this.metrics.keys().next().value;
      this.metrics.delete(firstKey);
    }

    this.metrics.set(name, {
      name,
      value,
      timestamp: Date.now()
    });

    // Batch metric processing
    this.scheduleBatchProcessing();
  }

  private static scheduleBatchProcessing() {
    if (this.batchTimeout) return;

    this.batchTimeout = window.setTimeout(() => {
      this.processBatchedMetrics();
      this.batchTimeout = null;
    }, this.BATCH_DELAY);
  }

  private static processBatchedMetrics() {
    if (this.metrics.size === 0) return;

    // Process metrics in a non-blocking way
    requestIdleCallback(() => {
      const criticalMetrics = Array.from(this.metrics.values())
        .filter(metric => 
          metric.name.includes('navigation') || 
          metric.name.includes('largest-contentful-paint') ||
          metric.value > 1000 // Only log slow operations
        );

      if (criticalMetrics.length > 0) {
        logger.debug('Performance metrics:', criticalMetrics);
      }

      // Clear processed metrics
      this.metrics.clear();
    });
  }

  static trackUserAction(action: string) {
    // Simple, non-blocking user action tracking
    if (this.isInitialized) {
      this.recordMetric(`user_action_${action}`, performance.now());
    }
  }

  static cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    this.metrics.clear();
    this.isInitialized = false;
    logger.debug('✅ Optimized performance service cleaned up');
  }
}