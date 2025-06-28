
import { useEffect, useRef, useCallback } from 'react';
import { AdvancedCleanupManager, CleanupStats } from '@/utils/advancedMemoryCleanup';

/**
 * Hook to manage component cleanup automatically with advanced features
 */
export function useAdvancedCleanup() {
  const cleanupManagerRef = useRef<AdvancedCleanupManager | null>(null);
  const componentNameRef = useRef<string>('');

  // Initialize cleanup manager
  if (!cleanupManagerRef.current) {
    // Try to get component name from stack trace
    const stack = new Error().stack;
    const match = stack?.match(/at (\w+)/);
    componentNameRef.current = match?.[1] || 'UnknownComponent';
    
    cleanupManagerRef.current = new AdvancedCleanupManager();
  }

  const cleanup = cleanupManagerRef.current;

  // Enhanced cleanup methods with component context
  const addTimer = useCallback((id: number | NodeJS.Timeout, description?: string) => {
    cleanup?.addTimer(id, `${componentNameRef.current}: ${description || 'Timer'}`);
  }, [cleanup]);

  const addInterval = useCallback((id: number | NodeJS.Timeout, description?: string) => {
    cleanup?.addInterval(id, `${componentNameRef.current}: ${description || 'Interval'}`);
  }, [cleanup]);

  const addObserver = useCallback((observer: ResizeObserver | IntersectionObserver | MutationObserver, description?: string) => {
    cleanup?.addObserver(observer, `${componentNameRef.current}: ${description || 'Observer'}`);
  }, [cleanup]);

  const addController = useCallback((controller: AbortController, description?: string) => {
    cleanup?.addController(controller, `${componentNameRef.current}: ${description || 'AbortController'}`);
  }, [cleanup]);

  const addListener = useCallback((element: HTMLElement | Window | Document, event: string, handler: EventListener, description?: string) => {
    cleanup?.addListener(element, event, handler, `${componentNameRef.current}: ${description || event}`);
  }, [cleanup]);

  const addStream = useCallback((stream: ReadableStreamDefaultReader, description?: string) => {
    cleanup?.addStream(stream, `${componentNameRef.current}: ${description || 'Stream'}`);
  }, [cleanup]);

  const addCleanupCallback = useCallback((callback: () => void | Promise<void>, description?: string) => {
    cleanup?.addCleanupCallback(callback, `${componentNameRef.current}: ${description || 'Callback'}`);
  }, [cleanup]);

  // Performance monitoring
  const getResourceCount = useCallback(() => {
    return cleanup?.getResourceCount() || {
      timers: 0,
      intervals: 0,
      observers: 0,
      controllers: 0,
      listeners: 0,
      streams: 0,
      callbacks: 0,
    };
  }, [cleanup]);

  const isResourcesEmpty = useCallback(() => {
    return cleanup?.isResourcesEmpty() ?? true;
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupManagerRef.current) {
        cleanupManagerRef.current.cleanup().then((stats: CleanupStats) => {
          if (import.meta.env.DEV) {
            console.log(`Cleanup completed for ${componentNameRef.current}:`, stats);
          }
        });
        cleanupManagerRef.current = null;
      }
    };
  }, []);

  return {
    addTimer,
    addInterval,
    addObserver,
    addController,
    addListener,
    addStream,
    addCleanupCallback,
    getResourceCount,
    isResourcesEmpty,
    componentName: componentNameRef.current,
  };
}
