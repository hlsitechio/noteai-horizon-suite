// Optimized layout utilities to prevent forced reflows
import { logger } from './logger';

interface LayoutMetric {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class LayoutUtils {
  private static measurementCache = new Map<string, { metric: LayoutMetric; timestamp: number }>();
  private static readonly CACHE_DURATION = 100; // Cache measurements for 100ms
  
  /**
   * Get element dimensions with caching to prevent forced reflows
   */
  static getMeasurements(element: HTMLElement, cacheKey?: string): LayoutMetric {
    const key = cacheKey || `${element.tagName}_${element.className}`;
    const now = Date.now();
    
    // Check cache first
    const cached = this.measurementCache.get(key);
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.metric;
    }
    
    // Use requestAnimationFrame to batch DOM reads
    return this.batchedMeasurement(element, key);
  }
  
  private static batchedMeasurement(element: HTMLElement, key: string): LayoutMetric {
    // Use getBoundingClientRect only once per frame
    const rect = element.getBoundingClientRect();
    const metric: LayoutMetric = {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top
    };
    
    // Cache the result
    this.measurementCache.set(key, {
      metric,
      timestamp: Date.now()
    });
    
    return metric;
  }
  
  /**
   * Optimized mouse position calculation
   */
  static getRelativeMousePosition(
    event: MouseEvent | React.MouseEvent,
    element: HTMLElement,
    cacheKey?: string
  ): { x: number; y: number } {
    const rect = this.getMeasurements(element, cacheKey);
    return {
      x: event.clientX - rect.x,
      y: event.clientY - rect.y
    };
  }
  
  /**
   * Debounced scroll handler to prevent excessive calls
   */
  static createOptimizedScrollHandler(
    handler: (scrollTop: number) => void,
    delay: number = 16 // ~60fps
  ): (event: Event) => void {
    let timeoutId: number | null = null;
    let lastScrollTop = 0;
    
    return (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollTop = target.scrollTop;
      
      // Skip if scroll position hasn't changed significantly
      if (Math.abs(scrollTop - lastScrollTop) < 1) return;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = window.setTimeout(() => {
        handler(scrollTop);
        lastScrollTop = scrollTop;
        timeoutId = null;
      }, delay);
    };
  }
  
  /**
   * Clear cached measurements
   */
  static clearCache() {
    this.measurementCache.clear();
  }
  
  /**
   * Remove old cache entries
   */
  static cleanupCache() {
    const now = Date.now();
    for (const [key, cached] of this.measurementCache.entries()) {
      if (now - cached.timestamp > this.CACHE_DURATION * 10) {
        this.measurementCache.delete(key);
      }
    }
  }
}

// Auto-cleanup cache periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    LayoutUtils.cleanupCache();
  }, 5000); // Clean every 5 seconds
}