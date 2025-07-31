/**
 * Performance monitoring and Web Vitals tracking
 * Modular performance monitoring system
 */

import { initWebVitalsMonitor } from './webVitalsMonitor';
import { initLongTaskMonitor, initLayoutShiftMonitor } from './performanceObservers';

// Re-export all utilities
export * from './types';
export * from './webVitalsMonitor';
export * from './performanceObservers';
export * from './performanceMarking';
export * from './messageDeduplication';

/**
 * Initialize complete performance monitoring system
 * Call this once at app startup
 */
export function initPerfMonitor(): void {
  // Completely disable performance monitoring in development
  if (import.meta.env.DEV) {
    console.log('Performance monitoring disabled in development');
    return;
  }
  
  // Initialize all monitoring systems
  initWebVitalsMonitor();
  initLongTaskMonitor();
  initLayoutShiftMonitor();
}