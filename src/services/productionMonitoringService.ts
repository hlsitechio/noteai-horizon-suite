import { supabase } from '@/integrations/supabase/client';
import { logger } from '../utils/logger';

interface PerformanceMetrics {
  timestamp: number;
  metric_name: string;
  metric_value: number;
  metric_type: 'counter' | 'gauge' | 'histogram';
  tags?: Record<string, any>;
}

interface RateLimitResponse {
  allowed: boolean;
  rateLimited: boolean;
  remaining?: number;
  retryAfter?: number;
  resetTime?: string;
}

export class ProductionMonitoringService {
  private static instance: ProductionMonitoringService;
  private metricsQueue: PerformanceMetrics[] = [];
  private batchTimer: number | null = null;
  private readonly BATCH_SIZE = 50;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  static getInstance(): ProductionMonitoringService {
    if (!this.instance) {
      this.instance = new ProductionMonitoringService();
    }
    return this.instance;
  }

  private constructor() {
    this.startBatchProcessor();
    this.setupErrorTracking();
    this.setupPerformanceTracking();
  }

  /**
   * Track performance metric
   */
  trackMetric(name: string, value: number, type: 'counter' | 'gauge' | 'histogram' = 'counter', tags?: Record<string, any>) {
    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      metric_name: name,
      metric_value: value,
      metric_type: type,
      tags: {
        ...tags,
        environment: import.meta.env.PROD ? 'production' : 'development',
        user_agent: navigator.userAgent.substring(0, 100) // Truncate for storage
      }
    };

    this.metricsQueue.push(metric);
    
    // If queue is full, process immediately
    if (this.metricsQueue.length >= this.BATCH_SIZE) {
      this.processBatch();
    }
  }

  /**
   * Track user action with performance timing
   */
  trackUserAction(action: string, duration?: number, metadata?: Record<string, any>) {
    this.trackMetric(`user_action.${action}`, duration || 1, 'counter', {
      action_type: action,
      ...metadata
    });
  }

  /**
   * Track API call performance
   */
  trackAPICall(endpoint: string, duration: number, success: boolean, statusCode?: number) {
    this.trackMetric('api_call_duration', duration, 'histogram', {
      endpoint,
      success,
      status_code: statusCode
    });

    this.trackMetric('api_call_count', 1, 'counter', {
      endpoint,
      success,
      status_code: statusCode
    });
  }

  /**
   * Track page load performance
   */
  trackPageLoad(path: string) {
    // Use Navigation Timing API
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (navigationEntries.length > 0) {
        const timing = navigationEntries[0];
        
        this.trackMetric('page_load_time', timing.loadEventEnd - timing.fetchStart, 'histogram', {
          page: path,
          type: 'full_load'
        });

        this.trackMetric('dom_content_loaded', timing.domContentLoadedEventEnd - timing.fetchStart, 'histogram', {
          page: path,
          type: 'dom_ready'
        });

        this.trackMetric('first_paint', timing.responseEnd - timing.fetchStart, 'histogram', {
          page: path,
          type: 'first_paint'
        });
      }
    }
  }

  /**
   * Check rate limit before making API calls
   */
  async checkRateLimit(endpoint: string, userId?: string): Promise<RateLimitResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('rate-limiter', {
        body: {
          endpoint,
          userId,
          userAgent: navigator.userAgent
        }
      });

      if (error) {
        logger.error('Rate limit check failed:', error);
        // Allow request if rate limiter is down
        return { allowed: true, rateLimited: false };
      }

      return data;
    } catch (error) {
      logger.error('Rate limit service error:', error);
      // Allow request if rate limiter is down
      return { allowed: true, rateLimited: false };
    }
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals() {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.trackMetric('web_vital_lcp', entry.startTime, 'gauge', {
          metric_type: 'largest_contentful_paint'
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID (First Input Delay)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.trackMetric('web_vital_fid', (entry as any).processingStart - entry.startTime, 'gauge', {
          metric_type: 'first_input_delay'
        });
      }
    }).observe({ entryTypes: ['first-input'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.trackMetric('web_vital_cls', clsValue, 'gauge', {
        metric_type: 'cumulative_layout_shift'
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track memory usage
   */
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      this.trackMetric('memory_used', memory.usedJSHeapSize, 'gauge', {
        metric_type: 'memory_usage'
      });

      this.trackMetric('memory_limit', memory.jsHeapSizeLimit, 'gauge', {
        metric_type: 'memory_limit'
      });

      const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      this.trackMetric('memory_usage_percentage', usagePercentage, 'gauge', {
        metric_type: 'memory_percentage'
      });
    }
  }

  /**
   * Setup automatic error tracking
   */
  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackMetric('javascript_error', 1, 'counter', {
        error_message: event.message.substring(0, 500),
        error_source: event.filename,
        error_line: event.lineno,
        error_column: event.colno
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackMetric('unhandled_promise_rejection', 1, 'counter', {
        error_reason: String(event.reason).substring(0, 500)
      });
    });
  }

  /**
   * Setup automatic performance tracking
   */
  private setupPerformanceTracking() {
    // Track long tasks (tasks taking > 50ms)
    if ('PerformanceObserver' in window) {
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.trackMetric('long_task_duration', entry.duration, 'histogram', {
              task_type: 'long_task'
            });
          }
        }).observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Long tasks not supported in all browsers
        logger.debug('Long task observer not supported');
      }
    }

    // Track resource loading times
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;
        this.trackMetric('resource_load_time', resourceEntry.responseEnd - resourceEntry.startTime, 'histogram', {
          resource_type: resourceEntry.initiatorType,
          resource_name: resourceEntry.name.split('/').pop()?.substring(0, 100)
        });
      }
    }).observe({ entryTypes: ['resource'] });
  }

  /**
   * Start batch processor for metrics
   */
  private startBatchProcessor() {
    this.batchTimer = window.setInterval(() => {
      if (this.metricsQueue.length > 0) {
        this.processBatch();
      }
    }, this.BATCH_TIMEOUT);
  }

  /**
   * Process batch of metrics
   */
  private async processBatch() {
    if (this.metricsQueue.length === 0) return;

    const batch = this.metricsQueue.splice(0, this.BATCH_SIZE);
    
    try {
      // Convert to Supabase format
      const metricsData = batch.map(metric => ({
        metric_name: metric.metric_name,
        metric_value: metric.metric_value,
        metric_type: metric.metric_type,
        tags: metric.tags || {},
        timestamp: new Date(metric.timestamp).toISOString()
      }));

      const { error } = await supabase
        .from('app_metrics')
        .insert(metricsData);

      if (error) {
        logger.error('Failed to store metrics batch:', error);
        // Re-queue metrics for retry (with limit to prevent infinite growth)
        if (this.metricsQueue.length < 1000) {
          this.metricsQueue.unshift(...batch);
        }
      } else {
        logger.debug(`Stored ${batch.length} metrics successfully`);
      }
    } catch (error) {
      logger.error('Metrics batch processing error:', error);
    }
  }

  /**
   * Get health status from monitoring service
   */
  async getHealthStatus() {
    try {
      const { data, error } = await supabase.functions.invoke('production-health-monitor');
      
      if (error) {
        logger.error('Health check failed:', error);
        return { status: 'unknown', error: error.message };
      }

      return data;
    } catch (error) {
      logger.error('Health status error:', error);
      return { status: 'error', error: String(error) };
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }

    // Process remaining metrics
    if (this.metricsQueue.length > 0) {
      this.processBatch();
    }
  }
}

// Export singleton instance
export const productionMonitoring = ProductionMonitoringService.getInstance();