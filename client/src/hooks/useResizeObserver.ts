import { useLayoutEffect, useRef, useCallback } from 'react';

/**
 * Hook for efficiently observing element resize changes
 * More performant than polling with setInterval
 */
export function useResizeObserver<T extends HTMLElement>(
  callback: (entry: ResizeObserverEntry) => void
) {
  const ref = useRef<T>(null);
  
  const observerCallback = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      callback(entry);
    }
  }, [callback]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    
    const observer = new ResizeObserver(observerCallback);
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [observerCallback]);

  return ref;
}

/**
 * Hook for observing intersection changes (visibility)
 * Useful for lazy loading and animations
 */
export function useIntersectionObserver<T extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<T>(null);
  
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      callback(entry);
    }
  }, [callback]);

  useLayoutEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(observerCallback, options);
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [observerCallback, options]);

  return ref;
}