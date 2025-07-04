import * as Sentry from '@sentry/react';
import { onCLS, onLCP, onFCP, onTTFB } from 'web-vitals';

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

/**
 * Initialize performance monitoring
 * Call this once at app startup
 */
export function initPerfMonitor(): void {
  // Track Core Web Vitals
  onCLS(onPerfEntry);
  onLCP(onPerfEntry);
  onFCP(onPerfEntry);
  onTTFB(onPerfEntry);
  
  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'longtask') {
            const longTask = entry as PerformanceEntry & { duration: number };
            
            Sentry.captureMessage('Long Task Detected', {
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
            
            console.warn(`Long task detected: ${longTask.duration}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }
  
  // Monitor layout shifts
  if ('PerformanceObserver' in window) {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            const layoutShift = entry as PerformanceEntry & { value: number };
            
            if (layoutShift.value > 0.1) {
              Sentry.captureMessage('Significant Layout Shift', {
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
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout shift monitoring not supported:', error);
    }
  }
}

/**
 * Handle performance entries
 */
function onPerfEntry(metric: PerformanceMetric): void {
  // Send to Sentry
  Sentry.captureMessage(`Web Vital: ${metric.name}`, {
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