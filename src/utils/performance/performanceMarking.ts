/**
 * Performance marking and measurement utilities
 */

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

/**
 * Clear all performance marks and measures
 */
export function clearPerformanceMetrics(): void {
  if ('performance' in window) {
    if ('clearMarks' in performance) {
      performance.clearMarks();
    }
    if ('clearMeasures' in performance) {
      performance.clearMeasures();
    }
  }
}

/**
 * Get all performance marks
 */
export function getPerformanceMarks(): PerformanceEntry[] {
  if ('performance' in window && 'getEntriesByType' in performance) {
    return performance.getEntriesByType('mark');
  }
  return [];
}

/**
 * Get all performance measures
 */
export function getPerformanceMeasures(): PerformanceEntry[] {
  if ('performance' in window && 'getEntriesByType' in performance) {
    return performance.getEntriesByType('measure');
  }
  return [];
}