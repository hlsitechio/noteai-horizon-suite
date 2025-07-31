// Enhanced layout effect hook that prevents blocking operations
import { useEffect, useRef } from 'react';

/**
 * Non-blocking alternative to useLayoutEffect
 * Uses requestAnimationFrame to defer layout reads/writes
 */
export function useOptimizedLayoutEffect(
  effect: () => void | (() => void),
  deps?: React.DependencyList
) {
  const cleanupRef = useRef<(() => void) | void | undefined>(undefined);

  useEffect(() => {
    // Schedule the effect for the next frame to avoid blocking
    let rafId: number;
    
    rafId = requestAnimationFrame(() => {
      // Clean up previous effect
      if (cleanupRef.current) {
        cleanupRef.current?.();
      }
      
      // Run the new effect
      cleanupRef.current = effect();
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (cleanupRef.current) {
        cleanupRef.current?.();
      }
    };
  }, deps);
}

/**
 * Batch layout measurements to prevent forced reflows
 */
export function useBatchedLayoutMeasurement() {
  const measurementQueue = useRef<Array<{
    element: HTMLElement;
    callback: (rect: DOMRect) => void;
  }>>([]);
  
  const batchTimeoutRef = useRef<number | null>(null);

  const measureElement = (element: HTMLElement, callback: (rect: DOMRect) => void) => {
    measurementQueue.current.push({ element, callback });

    if (!batchTimeoutRef.current) {
      batchTimeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(() => {
          // Batch all measurements together
          for (const { element, callback } of measurementQueue.current) {
            try {
              const rect = element.getBoundingClientRect();
              callback(rect);
            } catch (error) {
              console.warn('Error measuring element:', error);
            }
          }
          
          measurementQueue.current.length = 0;
          batchTimeoutRef.current = null;
        });
      }, 0);
    }
  };

  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return measureElement;
}

/**
 * Hook for optimized resize/intersection observations
 */
export function useOptimizedObserver<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);
  const observersRef = useRef<Array<{
    observer: ResizeObserver | IntersectionObserver;
    type: 'resize' | 'intersection';
  }>>([]);

  const observeResize = (callback: (entry: ResizeObserverEntry) => void) => {
    if (!elementRef.current) return;

    // Use requestIdleCallback for non-critical observations
    requestIdleCallback(() => {
      if (!elementRef.current) return;

      const observer = new ResizeObserver((entries) => {
        requestAnimationFrame(() => {
          for (const entry of entries) {
            callback(entry);
          }
        });
      });

      observer.observe(elementRef.current);
      observersRef.current.push({ observer, type: 'resize' });
    });
  };

  const observeIntersection = (
    callback: (entry: IntersectionObserverEntry) => void,
    options?: IntersectionObserverInit
  ) => {
    if (!elementRef.current) return;

    requestIdleCallback(() => {
      if (!elementRef.current) return;

      const observer = new IntersectionObserver((entries) => {
        requestAnimationFrame(() => {
          for (const entry of entries) {
            callback(entry);
          }
        });
      }, options);

      observer.observe(elementRef.current);
      observersRef.current.push({ observer, type: 'intersection' });
    });
  };

  useEffect(() => {
    return () => {
      // Cleanup all observers
      for (const { observer } of observersRef.current) {
        observer.disconnect();
      }
      observersRef.current.length = 0;
    };
  }, []);

  return {
    elementRef,
    observeResize,
    observeIntersection
  };
}