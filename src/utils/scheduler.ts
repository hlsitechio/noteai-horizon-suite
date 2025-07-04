/**
 * Performance-optimized scheduling utilities
 * Helps prevent main thread blocking and violations
 */

/**
 * Schedule a task to run when the browser is idle
 * Falls back to setTimeout if requestIdleCallback is not available
 */
export function scheduleIdleCallback(fn: () => void, timeout = 5000): number {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(fn, { timeout });
  } else {
    // Fallback for browsers without requestIdleCallback
    return setTimeout(fn, 0) as unknown as number;
  }
}

/**
 * Cancel an idle callback
 */
export function cancelIdleCallback(id: number): void {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Break up a long-running task into smaller chunks
 * Prevents main thread blocking
 */
export async function yieldToMain(): Promise<void> {
  return new Promise(resolve => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      // Use Scheduler API if available (Chrome 94+)
      (window as any).scheduler.postTask(() => resolve(), { priority: 'background' });
    } else {
      // Fallback to setTimeout
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Process items in batches with yielding between batches
 * Prevents long tasks and violations
 */
export async function processInBatches<T>(
  items: T[],
  processor: (item: T, index: number) => void,
  batchSize = 10
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    batch.forEach((item, index) => {
      processor(item, i + index);
    });
    
    // Yield control back to the browser
    if (i + batchSize < items.length) {
      await yieldToMain();
    }
  }
}

/**
 * Throttle function using requestAnimationFrame
 * Perfect for scroll and resize handlers
 */
export function rafThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let rafId: number | null = null;
  
  return ((...args: any[]) => {
    if (rafId !== null) return;
    
    rafId = requestAnimationFrame(() => {
      fn(...args);
      rafId = null;
    });
  }) as T;
}