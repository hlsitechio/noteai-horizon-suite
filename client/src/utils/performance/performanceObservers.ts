import throttle from 'lodash.throttle';
import { hasMessageBeenSent, markMessageAsSent } from './messageDeduplication';

/**
 * Performance observers for long tasks and layout shifts
 */

// Performance monitoring no-op function
const throttledPerfCapture = throttle((message: string, options: any) => {
  // No-op - performance tracking removed
}, 30000);

/**
 * Initialize long task monitoring
 */
export function initLongTaskMonitor(): void {
  if (!('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver(throttle((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'longtask') {
          const longTask = entry as PerformanceEntry & { duration: number };
          
          // Only report very significant long tasks
          if (longTask.duration > 500) {
            const messageKey = `longtask-${Math.floor(longTask.duration / 100)}`;
            
            if (!hasMessageBeenSent(messageKey)) {
              markMessageAsSent(messageKey);
              
              throttledPerfCapture('Long Task Detected', {
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

/**
 * Initialize layout shift monitoring
 */
export function initLayoutShiftMonitor(): void {
  if (!('PerformanceObserver' in window)) {
    return;
  }

  try {
    const clsObserver = new PerformanceObserver(throttle((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          const layoutShift = entry as PerformanceEntry & { value: number };
          
          // Only report significant layout shifts
          if (layoutShift.value > 0.15) {
            const messageKey = `layoutshift-${Math.floor(layoutShift.value * 100)}`;
            
            if (!hasMessageBeenSent(messageKey)) {
              markMessageAsSent(messageKey);
              
              throttledPerfCapture('Significant Layout Shift', {
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