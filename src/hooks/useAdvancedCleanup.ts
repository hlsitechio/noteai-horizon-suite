import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface CleanupItem {
  id: string;
  cleanup: () => void;
  priority: number; // Higher priority cleanup items run first
}

/**
 * Advanced cleanup hook that manages multiple cleanup tasks with priorities
 */
export const useAdvancedCleanup = () => {
  const cleanupItems = useRef<Map<string, CleanupItem>>(new Map());
  const isCleaningUp = useRef(false);

  // Add a cleanup function with optional priority
  const addCleanup = useCallback((id: string, cleanup: () => void, priority = 0) => {
    cleanupItems.current.set(id, { id, cleanup, priority });
    logger.debug(`Added cleanup task: ${id} (priority: ${priority})`);
  }, []);

  // Remove a specific cleanup function
  const removeCleanup = useCallback((id: string) => {
    const removed = cleanupItems.current.delete(id);
    if (removed) {
      logger.debug(`Removed cleanup task: ${id}`);
    }
    return removed;
  }, []);

  // Add an event listener with automatic cleanup
  const addListener = useCallback((
    target: EventTarget, 
    event: string, 
    handler: EventListener, 
    options?: AddEventListenerOptions
  ) => {
    const id = `listener-${event}-${Date.now()}`;
    
    target.addEventListener(event, handler, options);
    
    addCleanup(id, () => {
      target.removeEventListener(event, handler, options);
    }, 5); // Event listeners have high priority
    
    return id;
  }, [addCleanup]);

  // Add a timeout with automatic cleanup
  const addTimeout = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(callback, delay);
    const id = `timeout-${timeoutId}`;
    
    addCleanup(id, () => {
      clearTimeout(timeoutId);
    }, 3);
    
    return id;
  }, [addCleanup]);

  // Add an interval with automatic cleanup
  const addInterval = useCallback((callback: () => void, delay: number) => {
    const intervalId = setInterval(callback, delay);
    const id = `interval-${intervalId}`;
    
    addCleanup(id, () => {
      clearInterval(intervalId);
    }, 3);
    
    return id;
  }, [addCleanup]);

  // Execute all cleanup functions
  const executeCleanup = useCallback(() => {
    if (isCleaningUp.current) return;
    
    isCleaningUp.current = true;
    
    try {
      // Sort cleanup items by priority (highest first)
      const sortedItems = Array.from(cleanupItems.current.values())
        .sort((a, b) => b.priority - a.priority);
      
      logger.debug(`Executing ${sortedItems.length} cleanup tasks`);
      
      for (const item of sortedItems) {
        try {
          item.cleanup();
          logger.debug(`Executed cleanup task: ${item.id}`);
        } catch (error) {
          logger.error(`Error in cleanup task ${item.id}:`, error);
        }
      }
      
      cleanupItems.current.clear();
      logger.debug('All cleanup tasks executed');
    } catch (error) {
      logger.error('Error during cleanup execution:', error);
    } finally {
      isCleaningUp.current = false;
    }
  }, []);

  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      executeCleanup();
    };
  }, [executeCleanup]);

  return {
    addCleanup,
    removeCleanup,
    addListener,
    addTimeout,
    addInterval,
    executeCleanup,
    hasCleanupTasks: cleanupItems.current.size > 0
  };
};