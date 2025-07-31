/**
 * Robust Performance-Optimized Scheduler
 * Provides safe scheduling with fallback mechanisms and error handling
 */

type ScheduledCallback = () => void;
type ScheduleId = number;

interface SchedulerState {
  isIdleCallbackSupported: boolean;
  isSchedulerSupported: boolean;
  activeCallbacks: Map<ScheduleId, { cancel: () => void; callback: ScheduledCallback }>;
  nextId: ScheduleId;
}

// Global scheduler state with safe initialization
const schedulerState: SchedulerState = {
  isIdleCallbackSupported: false,
  isSchedulerSupported: false,
  activeCallbacks: new Map(),
  nextId: 1
};

// Safely detect browser capabilities
const detectCapabilities = (): void => {
  try {
    if (typeof window !== 'undefined') {
      schedulerState.isIdleCallbackSupported = 'requestIdleCallback' in window;
      schedulerState.isSchedulerSupported = 'scheduler' in window && 
        'postTask' in (window as any).scheduler;
    }
  } catch (error) {
    console.warn('Browser capability detection failed:', error);
  }
};

// Initialize capabilities
detectCapabilities();

/**
 * Schedule a callback with robust fallback mechanisms
 */
export function scheduleIdleCallback(callback: ScheduledCallback, timeout = 5000): ScheduleId {
  const id = schedulerState.nextId++;
  
  const safeCallback = () => {
    try {
      schedulerState.activeCallbacks.delete(id);
      callback();
    } catch (error) {
      console.warn('Scheduled callback error:', error);
      schedulerState.activeCallbacks.delete(id);
    }
  };

  let cancelFn: () => void;

  try {
    if (schedulerState.isIdleCallbackSupported) {
      const idleId = requestIdleCallback(safeCallback, { timeout });
      cancelFn = () => cancelIdleCallback(idleId);
    } else {
      const timeoutId = setTimeout(safeCallback, 0);
      cancelFn = () => clearTimeout(timeoutId);
    }
  } catch (error) {
    console.warn('Primary scheduling failed, using fallback:', error);
    const timeoutId = setTimeout(safeCallback, 0);
    cancelFn = () => clearTimeout(timeoutId);
  }

  schedulerState.activeCallbacks.set(id, { cancel: cancelFn, callback });
  return id;
}

/**
 * Cancel a scheduled callback safely
 */
export function cancelIdleCallback(id: ScheduleId): void {
  try {
    const entry = schedulerState.activeCallbacks.get(id);
    if (entry) {
      entry.cancel();
      schedulerState.activeCallbacks.delete(id);
    }
  } catch (error) {
    console.warn('Cancel callback failed:', error);
    schedulerState.activeCallbacks.delete(id);
  }
}

/**
 * Yield control back to the browser safely
 */
export async function yieldToMain(): Promise<void> {
  return new Promise(resolve => {
    try {
      if (schedulerState.isSchedulerSupported) {
        (window as any).scheduler.postTask(() => resolve(), { priority: 'background' });
      } else {
        setTimeout(resolve, 0);
      }
    } catch (error) {
      console.warn('Yield to main failed, using fallback:', error);
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Process items in batches with safe yielding
 */
export async function processInBatches<T>(
  items: T[],
  processor: (item: T, index: number) => void | Promise<void>,
  batchSize = 10
): Promise<void> {
  try {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      // Process batch with error handling for each item
      for (let j = 0; j < batch.length; j++) {
        try {
          const result = processor(batch[j], i + j);
          if (result instanceof Promise) {
            await result;
          }
        } catch (error) {
          console.warn(`Batch processing error at index ${i + j}:`, error);
          // Continue processing other items
        }
      }
      
      // Yield control back to browser between batches
      if (i + batchSize < items.length) {
        await yieldToMain();
      }
    }
  } catch (error) {
    console.error('Batch processing failed:', error);
    throw error;
  }
}

/**
 * Throttle function using requestAnimationFrame with error handling
 */
export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let rafId: number | null = null;
  let isDestroyed = false;
  
  const throttledFn = ((...args: any[]) => {
    if (isDestroyed || rafId !== null) return;
    
    try {
      rafId = requestAnimationFrame(() => {
        if (!isDestroyed) {
          try {
            fn(...args);
          } catch (error) {
            console.warn('RAF throttled function error:', error);
          }
        }
        rafId = null;
      });
    } catch (error) {
      console.warn('RAF throttle setup failed:', error);
      // Fallback to immediate execution
      try {
        fn(...args);
      } catch (fnError) {
        console.warn('Fallback function execution failed:', fnError);
      }
    }
  }) as T;

  // Add cleanup method
  (throttledFn as any).destroy = () => {
    isDestroyed = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttledFn;
}

/**
 * Schedule with retry mechanism
 */
export function scheduleWithRetry(
  callback: ScheduledCallback,
  maxRetries: number = 3,
  delayMs: number = 1000
): ScheduleId {
  let retryCount = 0;

  const retryCallback = () => {
    try {
      callback();
    } catch (error) {
      retryCount++;
      if (retryCount < maxRetries) {
        console.warn(`Callback failed, retrying (${retryCount}/${maxRetries}):`, error);
        scheduleIdleCallback(retryCallback, delayMs * retryCount);
      } else {
        console.error('Callback failed after max retries:', error);
      }
    }
  };

  return scheduleIdleCallback(retryCallback);
}

/**
 * Clean up all pending callbacks
 */
export function cleanupAllCallbacks(): void {
  try {
    for (const [id, entry] of schedulerState.activeCallbacks) {
      try {
        entry.cancel();
      } catch (error) {
        console.warn(`Failed to cancel callback ${id}:`, error);
      }
    }
    schedulerState.activeCallbacks.clear();
  } catch (error) {
    console.warn('Cleanup all callbacks failed:', error);
    schedulerState.activeCallbacks.clear();
  }
}

/**
 * Get scheduler statistics for debugging
 */
export function getSchedulerStats() {
  return {
    isIdleCallbackSupported: schedulerState.isIdleCallbackSupported,
    isSchedulerSupported: schedulerState.isSchedulerSupported,
    activeCallbacks: schedulerState.activeCallbacks.size,
    nextId: schedulerState.nextId
  };
}