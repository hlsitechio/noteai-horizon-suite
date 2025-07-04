import { useMemo, useRef, useEffect } from 'react';
import * as Comlink from 'comlink';

/**
 * Hook for managing Web Workers with automatic cleanup
 * Offloads heavy computations to background threads
 */
export function useWorker<T = any>(workerUrl: string) {
  const workerRef = useRef<Worker | null>(null);
  const apiRef = useRef<T | null>(null);

  const workerApi = useMemo(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Create worker from URL or inline
      const worker = new Worker(workerUrl);
      workerRef.current = worker;
      
      // Wrap with Comlink for easy communication
      const api = Comlink.wrap(worker) as T;
      apiRef.current = api;
      
      return api;
    } catch (error) {
      console.error('Failed to create worker:', error);
      return null;
    }
  }, [workerUrl]);

  // Cleanup worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
        apiRef.current = null;
      }
    };
  }, []);

  return workerApi;
}

/**
 * Hook specifically for AI processing tasks
 */
export function useAIWorker() {
  return useWorker('/src/workers/aiProcessor.worker.ts');
}