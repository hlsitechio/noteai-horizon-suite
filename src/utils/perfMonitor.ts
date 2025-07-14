import { onCLS, onLCP, onFCP, onTTFB } from 'web-vitals';
import throttle from 'lodash.throttle';

/**
 * Performance monitoring and Web Vitals tracking
 * Integrates with Sentry for production monitoring
 */

interface PerformanceMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

// Sentry completely disabled
const throttledSentryCapture = throttle((message: string, options: any) => {
  // No-op - Sentry removed
}, 30000);

// Track sent messages to prevent duplicates
const sentMessages = new Set<string>();
const MESSAGE_CLEANUP_INTERVAL = 60000; // Clear sent messages every minute

// Clean up sent messages periodically using scheduleIdleCallback
import { scheduleIdleCallback } from './scheduler';

const scheduleCleanup = () => {
  scheduleIdleCallback(() => {
    sentMessages.clear();
    scheduleCleanup(); // Schedule next cleanup
  }, MESSAGE_CLEANUP_INTERVAL);
};
scheduleCleanup();

/**
 * Initialize performance monitoring
 * Call this once at app startup
 */
export function initPerfMonitor(): void {
  // Completely disable performance monitoring in development
  if (import.meta.env.DEV) {
    console.log('Performance monitoring disabled in development');
    return;
  }
  
  // Track Core Web Vitals with throttling
  onCLS(throttle(onPerfEntry, 2000));
  onLCP(throttle(onPerfEntry, 2000));
  onFCP(throttle(onPerfEntry, 2000));
  onTTFB(throttle(onPerfEntry, 2000));
  
  // Monitor long tasks with heavy throttling
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver(throttle((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            const longTask = entry as PerformanceEntry & { duration: number };
            
            // Only report very significant long tasks
            if (longTask.duration > 500) {
              const messageKey = `longtask-${Math.floor(longTask.duration / 100)}`;
              
              if (!sentMessages.has(messageKey)) {
                sentMessages.add(messageKey);
                
                throttledSentryCapture('Long Task Detected', {
                  level: 'warning',
                  extra: {
                    duration: longTask.duration,
                    startTime: longTask.startTime,
                    name: longTask.name,
                  },
                  tags: {
                    performanceIssue: 'longTask',
                  },
                });
              }
            }
          }
        });
      }, 10000)); // Heavy throttling: maximum once per 10 seconds
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }
  
  // Monitor layout shifts with throttling
  if ('PerformanceObserver' in window) {
    try {
      const clsObserver = new PerformanceObserver(throttle((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            const layoutShift = entry as PerformanceEntry & { value: number };
            
            // Only report significant layout shifts
            if (layoutShift.value > 0.15) {
              const messageKey = `layoutshift-${Math.floor(layoutShift.value * 100)}`;
              
              if (!sentMessages.has(messageKey)) {
                sentMessages.add(messageKey);
                
                throttledSentryCapture('Significant Layout Shift', {
                  level: 'warning',
                  extra: {
                    value: layoutShift.value,
                    startTime: layoutShift.startTime,
                  },
                  tags: {
                    performanceIssue: 'layoutShift',
                  },
                });
              }
            }
          }
        });
      }, 8000)); // Throttle to maximum once per 8 seconds
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout shift monitoring not supported:', error);
    }
  }
}

/**
 * Handle performance entries with throttling and deduplication
 */
function onPerfEntry(metric: PerformanceMetric): void {
  const messageKey = `webvital-${metric.name}-${Math.floor(metric.value / 100)}`;
  
  // Prevent duplicate messages
  if (sentMessages.has(messageKey)) {
    return;
  }
  
  sentMessages.add(messageKey);
  
  // Send to Sentry with throttling
  throttledSentryCapture(`Web Vital: ${metric.name}`, {
    level: getMetricLevel(metric),
    extra: {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    },
    tags: {
      webVital: metric.name,
    },
  });
  
  // Log in development
  if (import.meta.env.DEV) {
    console.log(`Web Vital - ${metric.name}:`, metric.value);
  }
}

/**
 * Determine severity level based on Web Vitals thresholds
 */
function getMetricLevel(metric: PerformanceMetric): 'info' | 'warning' | 'error' {
  const { name, value } = metric;
  
  switch (name) {
    case 'CLS':
      return value > 0.25 ? 'error' : value > 0.1 ? 'warning' : 'info';
    case 'FID':
      return value > 300 ? 'error' : value > 100 ? 'warning' : 'info';
    case 'LCP':
      return value > 4000 ? 'error' : value > 2500 ? 'warning' : 'info';
    case 'FCP':
      return value > 3000 ? 'error' : value > 1800 ? 'warning' : 'info';
    case 'TTFB':
      return value > 1500 ? 'error' : value > 800 ? 'warning' : 'info';
    default:
      return 'info';
  }
}

/**
 * Mark a custom performance measurement
 */
export function markPerformance(name: string): void {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name);
  }
}

/**
 * Measure time between two performance marks
 */
export function measurePerformance(name: string, startMark: string, endMark?: string): number | null {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure?.duration || null;
    } catch (error) {
      console.warn('Performance measurement failed:', error);
      return null;
    }
  }
  return null;
}