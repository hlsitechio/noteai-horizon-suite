import { useEffect, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface WorkData {
  [key: string]: any;
}

interface UseWorkPreservationOptions {
  storageKey: string;
  autoSaveInterval?: number;
  onWorkRestored?: (data: WorkData) => void;
  onWorkSaved?: (data: WorkData) => void;
}

/**
 * Hook to preserve user work and prevent data loss during unexpected reloads
 */
export const useWorkPreservation = (options: UseWorkPreservationOptions) => {
  const { 
    storageKey, 
    autoSaveInterval = 5000, // 5 seconds
    onWorkRestored, 
    onWorkSaved 
  } = options;
  
  const workDataRef = useRef<WorkData>({});
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isRestoring = useRef(false);

  // Save work to localStorage
  const saveWork = useCallback((data: WorkData, silent = false) => {
    try {
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: '1.0'
      });
      
      localStorage.setItem(storageKey, serializedData);
      workDataRef.current = data;
      
      if (!silent) {
        logger.debug(`Work saved to ${storageKey}:`, data);
        onWorkSaved?.(data);
      }
    } catch (error) {
      logger.error('Failed to save work:', error);
    }
  }, [storageKey, onWorkSaved]);

  // Load work from localStorage
  const loadWork = useCallback((): WorkData | null => {
    try {
      const serializedData = localStorage.getItem(storageKey);
      
      if (!serializedData) {
        return null;
      }
      
      const parsedData = JSON.parse(serializedData);
      
      // Check if data is recent (within last 24 hours)
      const isRecent = Date.now() - parsedData.timestamp < 24 * 60 * 60 * 1000;
      
      if (!isRecent) {
        localStorage.removeItem(storageKey);
        return null;
      }
      
      return parsedData.data || null;
    } catch (error) {
      logger.error('Failed to load work:', error);
      localStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey]);

  // Restore work on component mount
  const restoreWork = useCallback(() => {
    if (isRestoring.current) return;
    
    isRestoring.current = true;
    const savedWork = loadWork();
    
    if (savedWork && Object.keys(savedWork).length > 0) {
      logger.debug(`Work restored from ${storageKey}:`, savedWork);
      workDataRef.current = savedWork;
      onWorkRestored?.(savedWork);
    }
    
    isRestoring.current = false;
  }, [loadWork, onWorkRestored, storageKey]);

  // Auto-save work with debouncing
  const scheduleAutoSave = useCallback((data: WorkData) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveWork(data, true); // Silent save for auto-save
    }, autoSaveInterval);
  }, [saveWork, autoSaveInterval]);

  // Update work data and trigger auto-save
  const updateWork = useCallback((data: WorkData) => {
    workDataRef.current = { ...workDataRef.current, ...data };
    scheduleAutoSave(workDataRef.current);
  }, [scheduleAutoSave]);

  // Clear saved work
  const clearWork = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      workDataRef.current = {};
      
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      logger.debug(`Work cleared for ${storageKey}`);
    } catch (error) {
      logger.error('Failed to clear work:', error);
    }
  }, [storageKey]);

  // Set up beforeunload handler to save work
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Save current work immediately
      if (Object.keys(workDataRef.current).length > 0) {
        saveWork(workDataRef.current, true);
        
        // Show warning if user has unsaved work
        const message = 'You have unsaved work. Are you sure you want to leave?';
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [saveWork]);

  // Restore work on mount
  useEffect(() => {
    restoreWork();
  }, [restoreWork]);

  return {
    updateWork,
    saveWork,
    clearWork,
    restoreWork,
    hasWork: Object.keys(workDataRef.current).length > 0,
    workData: workDataRef.current
  };
};