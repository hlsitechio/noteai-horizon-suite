/**
 * Performance utilities for optimizing React components and operations
 */

import React, { useCallback, useRef, useState } from 'react';

/**
 * Debounce hook that persists across re-renders
 */
export function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttle hook that limits function execution frequency
 */
export function useThrottleCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastExecution = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastExecution.current >= delay) {
        lastExecution.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastExecution.current = Date.now();
          callback(...args);
          timeoutRef.current = undefined;
        }, delay - (now - lastExecution.current));
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Memory-efficient deep comparison for React dependencies
 */
export function shallowEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  
  return true;
}

/**
 * Optimized memoization hook with custom comparison
 */
export function useShallowMemo<T>(factory: () => T, deps: any[]): T {
  const [state, setState] = useState(() => ({
    deps,
    value: factory()
  }));
  
  if (!shallowEqual(state.deps, deps)) {
    setState({
      deps,
      value: factory()
    });
  }
  
  return state.value;
}

/**
 * Optimized image loading with error handling and retry logic
 */
export class ImageLoader {
  private static cache = new Map<string, HTMLImageElement>();
  private static maxRetries = 3;
  
  static async loadImage(src: string, retries = 0): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.cache.set(src, img);
        // Limit cache size
        if (this.cache.size > 100) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        resolve(img);
      };
      
      img.onerror = () => {
        if (retries < this.maxRetries) {
          setTimeout(() => {
            this.loadImage(src, retries + 1).then(resolve).catch(reject);
          }, 1000 * (retries + 1));
        } else {
          reject(new Error(`Failed to load image: ${src}`));
        }
      };
      
      img.src = src;
    });
  }
  
  static preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.allSettled(urls.map(url => this.loadImage(url)))
      .then(results => 
        results
          .filter((result): result is PromiseFulfilledResult<HTMLImageElement> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value)
      );
  }
}

/**
 * Efficient event batching for performance-critical operations
 */
export class EventBatcher {
  private queue: (() => void)[] = [];
  private isScheduled = false;
  
  add(fn: () => void) {
    this.queue.push(fn);
    this.schedule();
  }
  
  private schedule() {
    if (!this.isScheduled) {
      this.isScheduled = true;
      requestAnimationFrame(() => {
        this.flush();
      });
    }
  }
  
  private flush() {
    const currentQueue = [...this.queue];
    this.queue.length = 0;
    this.isScheduled = false;
    
    currentQueue.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Error in batched event:', error);
      }
    });
  }
}