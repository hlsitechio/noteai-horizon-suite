import { onCLS, onLCP, onFCP, onTTFB } from 'web-vitals';
import throttle from 'lodash.throttle';
import type { PerformanceMetric, LogLevel } from './types';
import { hasMessageBeenSent, markMessageAsSent } from './messageDeduplication';

/**
 * Web Vitals monitoring and tracking
 */

// Performance monitoring no-op function
const throttledPerfCapture = throttle((message: string, options: any) => {
  // No-op - performance tracking removed
}, 30000);

/**
 * Determine severity level based on Web Vitals thresholds
 */
function getMetricLevel(metric: PerformanceMetric): LogLevel {
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
 * Handle performance entries with throttling and deduplication
 */
function onPerfEntry(metric: PerformanceMetric): void {
  const messageKey = `webvital-${metric.name}-${Math.floor(metric.value / 100)}`;
  
  // Prevent duplicate messages
  if (hasMessageBeenSent(messageKey)) {
    return;
  }
  
  markMessageAsSent(messageKey);
  
  // Log performance metric with throttling
  throttledPerfCapture(`Web Vital: ${metric.name}`, {
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
 * Initialize Web Vitals monitoring
 */
export function initWebVitalsMonitor(): void {
  // Track Core Web Vitals with throttling
  onCLS(throttle(onPerfEntry, 2000));
  onLCP(throttle(onPerfEntry, 2000));
  onFCP(throttle(onPerfEntry, 2000));
  onTTFB(throttle(onPerfEntry, 2000));
}