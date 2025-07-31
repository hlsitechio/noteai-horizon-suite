/**
 * Memory Cleanup Utilities
 * Provides comprehensive cleanup for potential memory leaks
 */

interface CleanupFunction {
  (): void;
}

class MemoryCleanupManager {
  private cleanupFunctions: Set<CleanupFunction> = new Set();
  private intervalIds: Set<number> = new Set();
  private timeoutIds: Set<number> = new Set();
  private eventListeners: Map<Element | Window | Document, { event: string, handler: EventListener }[]> = new Map();

  /**
   * Register a cleanup function to be called during cleanup
   */
  registerCleanup(cleanup: CleanupFunction) {
    this.cleanupFunctions.add(cleanup);
    return () => this.cleanupFunctions.delete(cleanup);
  }

  /**
   * Tracked setTimeout that will be automatically cleaned up
   */
  setTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      this.timeoutIds.delete(id);
      callback();
    }, delay);
    this.timeoutIds.add(id);
    return id;
  }

  /**
   * Tracked setInterval that will be automatically cleaned up
   */
  setInterval(callback: () => void, interval: number): number {
    const id = window.setInterval(callback, interval);
    this.intervalIds.add(id);
    return id;
  }

  /**
   * Tracked event listener that will be automatically cleaned up
   */
  addEventListener(
    target: Element | Window | Document,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) {
    target.addEventListener(event, handler, options);
    
    if (!this.eventListeners.has(target)) {
      this.eventListeners.set(target, []);
    }
    this.eventListeners.get(target)!.push({ event, handler });
  }

  /**
   * Clear specific timeout
   */
  clearTimeout(id: number) {
    window.clearTimeout(id);
    this.timeoutIds.delete(id);
  }

  /**
   * Clear specific interval
   */
  clearInterval(id: number) {
    window.clearInterval(id);
    this.intervalIds.delete(id);
  }

  /**
   * Perform comprehensive cleanup
   */
  cleanup() {
    // Run registered cleanup functions
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Error in cleanup function:', error);
      }
    });
    this.cleanupFunctions.clear();

    // Clear all timeouts
    this.timeoutIds.forEach(id => window.clearTimeout(id));
    this.timeoutIds.clear();

    // Clear all intervals
    this.intervalIds.forEach(id => window.clearInterval(id));
    this.intervalIds.clear();

    // Remove all event listeners
    this.eventListeners.forEach((listeners, target) => {
      listeners.forEach(({ event, handler }) => {
        try {
          target.removeEventListener(event, handler);
        } catch (error) {
          console.warn('Error removing event listener:', error);
        }
      });
    });
    this.eventListeners.clear();
  }

  /**
   * Get cleanup statistics
   */
  getStats() {
    return {
      cleanupFunctions: this.cleanupFunctions.size,
      timeouts: this.timeoutIds.size,
      intervals: this.intervalIds.size,
      eventListeners: Array.from(this.eventListeners.values()).reduce((sum, listeners) => sum + listeners.length, 0)
    };
  }
}

// Global cleanup manager instance
export const memoryCleanup = new MemoryCleanupManager();

// Hook for React components
export const useMemoryCleanup = () => {
  const { useEffect, useRef } = require('react') as typeof import('react');
  
  const cleanupRef = useRef<CleanupFunction[]>([]);

  const registerCleanup = (cleanup: CleanupFunction) => {
    cleanupRef.current.push(cleanup);
  };

  useEffect(() => {
    return () => {
      cleanupRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn('Component cleanup error:', error);
        }
      });
    };
  }, []);

  return { registerCleanup };
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    memoryCleanup.cleanup();
  });

  // Development helper
  if (process.env.NODE_ENV === 'development') {
    (window as any).__memoryCleanup = memoryCleanup;
  }
}