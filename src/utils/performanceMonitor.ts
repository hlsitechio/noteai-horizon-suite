/**
 * Performance Monitor and Optimizer
 * Prevents setTimeout violations and optimizes performance
 */

interface PerformanceConfig {
  maxTaskDuration: number;
  batchSize: number;
  yieldInterval: number;
}

const DEFAULT_CONFIG: PerformanceConfig = {
  maxTaskDuration: 16, // Target 60fps
  batchSize: 10,
  yieldInterval: 5
};

class PerformanceMonitor {
  private taskQueue: Array<() => void> = [];
  private isProcessing = false;
  private config: PerformanceConfig;
  private taskStartTime = 0;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Schedule a task to run when the main thread is less busy
   */
  scheduleTask(task: () => void, priority: 'low' | 'normal' | 'high' = 'normal'): void {
    if (priority === 'high') {
      this.taskQueue.unshift(task);
    } else {
      this.taskQueue.push(task);
    }

    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  /**
   * Process tasks in small batches to prevent long-running operations
   */
  private processQueue(): void {
    if (this.taskQueue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    this.taskStartTime = performance.now();

    const processBatch = () => {
      let processed = 0;

      while (
        this.taskQueue.length > 0 && 
        processed < this.config.batchSize &&
        (performance.now() - this.taskStartTime) < this.config.maxTaskDuration
      ) {
        try {
          const task = this.taskQueue.shift();
          task?.();
          processed++;
        } catch (error) {
          console.warn('Task execution error:', error);
        }
      }

      if (this.taskQueue.length > 0) {
        // Yield control and continue processing
        if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
          (window as any).scheduler.postTask(processBatch, { priority: 'background' });
        } else {
          setTimeout(processBatch, 0);
        }
      } else {
        this.isProcessing = false;
      }
    };

    processBatch();
  }

  /**
   * Wrap a long-running function to make it non-blocking
   */
  wrapLongRunningTask<T extends any[], R>(
    fn: (...args: T) => R,
    options: { 
      batchSize?: number;
      onProgress?: (progress: number) => void;
    } = {}
  ): (...args: T) => Promise<R> {
    return (...args: T): Promise<R> => {
      return new Promise((resolve, reject) => {
        try {
          const result = fn(...args);
          
          // If it's an array or iterable, process in batches
          if (Array.isArray(result)) {
            this.processBatchedResult(result, options).then((processedResult) => {
              resolve(processedResult as R);
            }).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      });
    };
  }

  private async processBatchedResult<T>(
    items: T[], 
    options: { batchSize?: number; onProgress?: (progress: number) => void }
  ): Promise<T[]> {
    const batchSize = options.batchSize || this.config.batchSize;
    const result: T[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      result.push(...batch);

      // Report progress
      if (options.onProgress) {
        const progress = Math.min((i + batchSize) / items.length, 1);
        options.onProgress(progress);
      }

      // Yield control periodically
      if (i % (batchSize * this.config.yieldInterval) === 0) {
        await new Promise(resolve => {
          if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
            (window as any).scheduler.postTask(resolve, { priority: 'background' });
          } else {
            setTimeout(resolve, 0);
          }
        });
      }
    }

    return result;
  }

  /**
   * Create a debounced function that prevents excessive calls
   */
  createDebounced<T extends any[]>(
    fn: (...args: T) => void,
    delay: number,
    options: { leading?: boolean; trailing?: boolean } = {}
  ): (...args: T) => void {
    let timeoutId: number | null = null;
    let lastCallTime = 0;
    const { leading = false, trailing = true } = options;

    return (...args: T): void => {
      const now = performance.now();
      const shouldCallLeading = leading && (now - lastCallTime > delay);

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      if (shouldCallLeading) {
        fn(...args);
        lastCallTime = now;
      }

      if (trailing) {
        timeoutId = window.setTimeout(() => {
          if (!shouldCallLeading || (performance.now() - lastCallTime >= delay)) {
            fn(...args);
            lastCallTime = performance.now();
          }
          timeoutId = null;
        }, delay);
      }
    };
  }

  /**
   * Monitor performance and warn about long tasks
   */
  startPerformanceMonitoring(): () => void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return () => {};
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure' || entry.entryType === 'longtask') {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn(`Long task detected: ${entry.name || 'unnamed'} took ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['measure', 'longtask'] });
    } catch (error) {
      console.warn('Performance monitoring setup failed:', error);
    }

    return () => {
      observer.disconnect();
    };
  }

  /**
   * Clear all pending tasks
   */
  clearQueue(): void {
    this.taskQueue.length = 0;
    this.isProcessing = false;
  }

  /**
   * Get performance statistics
   */
  getStats() {
    return {
      pendingTasks: this.taskQueue.length,
      isProcessing: this.isProcessing,
      config: this.config
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Export utilities
export const scheduleNonBlockingTask = (task: () => void, priority?: 'low' | 'normal' | 'high') => {
  performanceMonitor.scheduleTask(task, priority);
};

export const wrapLongRunningTask = performanceMonitor.wrapLongRunningTask.bind(performanceMonitor);
export const createDebounced = performanceMonitor.createDebounced.bind(performanceMonitor);
export const startPerformanceMonitoring = performanceMonitor.startPerformanceMonitoring.bind(performanceMonitor);

export default performanceMonitor;