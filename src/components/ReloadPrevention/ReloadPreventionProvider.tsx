import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface ReloadPreventionContextType {
  preventReload: (reason: string) => void;
  allowReload: () => void;
  isReloadPrevented: boolean;
  addWorkInProgress: (key: string) => void;
  removeWorkInProgress: (key: string) => void;
}

const ReloadPreventionContext = createContext<ReloadPreventionContextType | undefined>(undefined);

export const useReloadPrevention = () => {
  const context = useContext(ReloadPreventionContext);
  if (!context) {
    throw new Error('useReloadPrevention must be used within ReloadPreventionProvider');
  }
  return context;
};

interface ReloadPreventionProviderProps {
  children: React.ReactNode;
}

export const ReloadPreventionProvider: React.FC<ReloadPreventionProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const reloadPreventionRef = useRef({
    isReloadPrevented: false,
    reason: '',
    workInProgress: new Set<string>()
  });

  const preventReload = useCallback((reason: string) => {
    reloadPreventionRef.current.isReloadPrevented = true;
    reloadPreventionRef.current.reason = reason;
    logger.debug('Reload prevention activated:', reason);
  }, []);

  const allowReload = useCallback(() => {
    reloadPreventionRef.current.isReloadPrevented = false;
    reloadPreventionRef.current.reason = '';
    reloadPreventionRef.current.workInProgress.clear();
    logger.debug('Reload prevention deactivated');
  }, []);

  const addWorkInProgress = useCallback((key: string) => {
    reloadPreventionRef.current.workInProgress.add(key);
    if (reloadPreventionRef.current.workInProgress.size > 0) {
      preventReload(`Work in progress: ${Array.from(reloadPreventionRef.current.workInProgress).join(', ')}`);
    }
  }, [preventReload]);

  const removeWorkInProgress = useCallback((key: string) => {
    reloadPreventionRef.current.workInProgress.delete(key);
    if (reloadPreventionRef.current.workInProgress.size === 0) {
      allowReload();
    } else {
      preventReload(`Work in progress: ${Array.from(reloadPreventionRef.current.workInProgress).join(', ')}`);
    }
  }, [allowReload, preventReload]);

  // Set up beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (reloadPreventionRef.current.isReloadPrevented || reloadPreventionRef.current.workInProgress.size > 0) {
        const message = reloadPreventionRef.current.reason || 'You have unsaved work. Are you sure you want to leave?';
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Set up visibility change handler to detect tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && reloadPreventionRef.current.workInProgress.size > 0) {
        // User is switching tabs/minimizing with work in progress
        logger.debug('User switched tabs with work in progress');
        
        // Show a toast when they return
        const showReturnToast = () => {
          if (!document.hidden && reloadPreventionRef.current.workInProgress.size > 0) {
            toast({
              title: "Welcome back!",
              description: "Your work has been preserved while you were away.",
            });
            document.removeEventListener('visibilitychange', showReturnToast);
          }
        };
        
        document.addEventListener('visibilitychange', showReturnToast);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [toast]);

  // Set up error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error('Unhandled promise rejection:', event.reason);
      
      // Don't reload the page for unhandled rejections if work is in progress
      if (reloadPreventionRef.current.workInProgress.size > 0) {
        event.preventDefault();
        
        toast({
          title: "Background Error",
          description: "An error occurred in the background, but your work has been preserved.",
          variant: "destructive"
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  const contextValue: ReloadPreventionContextType = {
    preventReload,
    allowReload,
    isReloadPrevented: reloadPreventionRef.current.isReloadPrevented,
    addWorkInProgress,
    removeWorkInProgress
  };

  return (
    <ReloadPreventionContext.Provider value={contextValue}>
      {children}
    </ReloadPreventionContext.Provider>
  );
};