import React, { useCallback, useRef, useLayoutEffect, startTransition, useDeferredValue } from 'react';
import { rafThrottle, scheduleIdleCallback, processInBatches } from '@/utils/scheduler';
import { markPerformance, measurePerformance } from '@/utils/perfMonitor';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

/**
 * Collection of performance-optimized hooks
 */

/**
 * Hook for throttling event handlers with requestAnimationFrame
 * Perfect for scroll, resize, and mouse move events
 */
export function useRAFThrottle<T extends (...args: any[]) => void>(
  callback: T,
  deps: React.DependencyList
): T {
  const throttledRef = useRef<T | null>(null);
  
  useLayoutEffect(() => {
    throttledRef.current = rafThrottle(callback);
  }, deps);
  
  return useCallback((...args: any[]) => {
    throttledRef.current?.(...args);
  }, []) as T;
}

/**
 * Hook for debouncing functions with lodash.debounce
 * More flexible than useDebounce for complex scenarios
 */
export function useLodashDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  options?: { leading?: boolean; trailing?: boolean; maxWait?: number }
): T {
  const debouncedRef = useRef<T | null>(null);
  
  useLayoutEffect(() => {
    debouncedRef.current = debounce(callback, delay, options) as any;
    
    return () => {
      (debouncedRef.current as any)?.cancel?.();
    };
  }, [callback, delay, options]);
  
  return useCallback((...args: any[]) => {
    debouncedRef.current?.(...args);
  }, []) as T;
}

/**
 * Hook for throttling functions with lodash.throttle
 */
export function useLodashThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  options?: { leading?: boolean; trailing?: boolean }
): T {
  const throttledRef = useRef<T | null>(null);
  
  useLayoutEffect(() => {
    throttledRef.current = throttle(callback, delay, options) as any;
    
    return () => {
      (throttledRef.current as any)?.cancel?.();
    };
  }, [callback, delay, options]);
  
  return useCallback((...args: any[]) => {
    throttledRef.current?.(...args);
  }, []) as T;
}

/**
 * Hook for scheduling non-urgent updates with React 18 transitions
 */
export function useTransitionState<T>(
  initialState: T
): [T, T, (value: T) => void] {
  const [state, setState] = React.useState(initialState);
  const deferredState = useDeferredValue(state);
  
  const setTransitionState = useCallback((value: T) => {
    startTransition(() => {
      setState(value);
    });
  }, []);
  
  return [state, deferredState, setTransitionState];
}

/**
 * Hook for processing large datasets in batches
 */
export function useBatchProcessor<T>() {
  const processBatch = useCallback(async (
    items: T[],
    processor: (item: T, index: number) => void,
    batchSize = 50
  ) => {
    markPerformance('batch-processing-start');
    
    await processInBatches(items, processor, batchSize);
    
    const duration = measurePerformance(
      'batch-processing', 
      'batch-processing-start'
    );
    
    if (duration && duration > 100) {
      console.warn(`Batch processing took ${duration}ms for ${items.length} items`);
    }
  }, []);
  
  return processBatch;
}

/**
 * Hook for scheduling idle callbacks
 */
export function useIdleCallback() {
  const scheduleIdle = useCallback((callback: () => void, timeout?: number) => {
    return scheduleIdleCallback(callback, timeout);
  }, []);
  
  return scheduleIdle;
}

/**
 * Hook for performance monitoring of component lifecycle
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0);
  
  useLayoutEffect(() => {
    renderCountRef.current += 1;
    markPerformance(`${componentName}-render-${renderCountRef.current}`);
    
    return () => {
      const duration = measurePerformance(
        `${componentName}-render-duration`,
        `${componentName}-render-${renderCountRef.current}`
      );
      
      if (duration && duration > 16.67) { // More than one frame
        console.warn(`${componentName} render took ${duration}ms`);
      }
    };
  });
  
  return renderCountRef.current;
}