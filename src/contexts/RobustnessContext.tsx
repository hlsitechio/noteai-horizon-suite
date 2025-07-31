/**
 * Robustness Context
 * Provides global error handling, retry mechanisms, and stability monitoring
 */

import React, { createContext, useContext, useCallback, useReducer, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { safeAsync, retryAsync } from '@/utils/robustAsync';

interface RobustnessState {
  errors: Array<{
    id: string;
    error: Error;
    timestamp: Date;
    context?: string;
    recovered?: boolean;
  }>;
  retryAttempts: Map<string, number>;
  systemHealth: 'healthy' | 'degraded' | 'critical';
  lastHealthCheck: Date | null;
}

type RobustnessAction =
  | { type: 'LOG_ERROR'; payload: { error: Error; context?: string } }
  | { type: 'MARK_RECOVERED'; payload: { errorId: string } }
  | { type: 'INCREMENT_RETRY'; payload: { operationId: string } }
  | { type: 'RESET_RETRY'; payload: { operationId: string } }
  | { type: 'UPDATE_HEALTH'; payload: { health: RobustnessState['systemHealth'] } }
  | { type: 'CLEANUP_OLD_ERRORS' };

interface RobustnessContextValue {
  state: RobustnessState;
  logError: (error: Error, context?: string) => string;
  markRecovered: (errorId: string) => void;
  safeExecute: <T>(operation: () => Promise<T>, context?: string) => Promise<T | null>;
  retryOperation: <T>(operation: () => Promise<T>, context?: string, maxRetries?: number) => Promise<T>;
  getSystemHealth: () => RobustnessState['systemHealth'];
}

const initialState: RobustnessState = {
  errors: [],
  retryAttempts: new Map(),
  systemHealth: 'healthy',
  lastHealthCheck: null
};

function robustnessReducer(state: RobustnessState, action: RobustnessAction): RobustnessState {
  switch (action.type) {
    case 'LOG_ERROR': {
      const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newError = {
        id: errorId,
        error: action.payload.error,
        timestamp: new Date(),
        context: action.payload.context,
        recovered: false
      };

      const errors = [...state.errors, newError].slice(-50); // Keep last 50 errors
      
      // Update system health based on error frequency
      const recentErrors = errors.filter(e => 
        Date.now() - e.timestamp.getTime() < 60000 // Last minute
      );
      
      let systemHealth: RobustnessState['systemHealth'] = 'healthy';
      if (recentErrors.length > 10) {
        systemHealth = 'critical';
      } else if (recentErrors.length > 5) {
        systemHealth = 'degraded';
      }

      return {
        ...state,
        errors,
        systemHealth,
        lastHealthCheck: new Date()
      };
    }

    case 'MARK_RECOVERED': {
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload.errorId
            ? { ...error, recovered: true }
            : error
        )
      };
    }

    case 'INCREMENT_RETRY': {
      const newRetryAttempts = new Map(state.retryAttempts);
      const current = newRetryAttempts.get(action.payload.operationId) || 0;
      newRetryAttempts.set(action.payload.operationId, current + 1);
      
      return {
        ...state,
        retryAttempts: newRetryAttempts
      };
    }

    case 'RESET_RETRY': {
      const newRetryAttempts = new Map(state.retryAttempts);
      newRetryAttempts.delete(action.payload.operationId);
      
      return {
        ...state,
        retryAttempts: newRetryAttempts
      };
    }

    case 'UPDATE_HEALTH': {
      return {
        ...state,
        systemHealth: action.payload.health,
        lastHealthCheck: new Date()
      };
    }

    case 'CLEANUP_OLD_ERRORS': {
      const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
      return {
        ...state,
        errors: state.errors.filter(error => 
          error.timestamp.getTime() > cutoff
        )
      };
    }

    default:
      return state;
  }
}

const RobustnessContext = createContext<RobustnessContextValue | undefined>(undefined);

export const useRobustness = (): RobustnessContextValue => {
  const context = useContext(RobustnessContext);
  if (!context) {
    throw new Error('useRobustness must be used within a RobustnessProvider');
  }
  return context;
};

interface RobustnessProviderProps {
  children: ReactNode;
}

export const RobustnessProvider: React.FC<RobustnessProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(robustnessReducer, initialState);

  // Cleanup old errors periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      dispatch({ type: 'CLEANUP_OLD_ERRORS' });
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(cleanup);
  }, []);

  // Monitor system health
  useEffect(() => {
    if (state.systemHealth === 'critical') {
      toast.error('System is experiencing issues. Some features may be unavailable.', {
        duration: 10000,
      });
    } else if (state.systemHealth === 'degraded') {
      toast.warning('System performance is degraded. Please try again if issues persist.', {
        duration: 5000,
      });
    }
  }, [state.systemHealth]);

  const logError = useCallback((error: Error, context?: string): string => {
    const action = { type: 'LOG_ERROR' as const, payload: { error, context } };
    dispatch(action);
    
    // Return error ID for tracking
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const markRecovered = useCallback((errorId: string) => {
    dispatch({ type: 'MARK_RECOVERED', payload: { errorId } });
  }, []);

  const safeExecute = useCallback(async <T,>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    const result = await safeAsync(operation);
    
    if (!result.success) {
      logError(result.error!, context);
      return null;
    }
    
    return result.data;
  }, [logError]);

  const retryOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    context?: string,
    maxRetries: number = 3
  ): Promise<T> => {
    const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const result = await retryAsync(operation, {
        maxAttempts: maxRetries,
        shouldRetry: (error, attempt) => {
          dispatch({ type: 'INCREMENT_RETRY', payload: { operationId } });
          
          // Don't retry certain types of errors
          if (error.message.includes('Unauthorized') || 
              error.message.includes('Forbidden') ||
              error.message.includes('Not Found')) {
            return false;
          }
          
          return attempt < maxRetries;
        }
      });
      
      dispatch({ type: 'RESET_RETRY', payload: { operationId } });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      logError(err, context);
      throw err;
    }
  }, [logError]);

  const getSystemHealth = useCallback((): RobustnessState['systemHealth'] => {
    return state.systemHealth;
  }, [state.systemHealth]);

  const value: RobustnessContextValue = {
    state,
    logError,
    markRecovered,
    safeExecute,
    retryOperation,
    getSystemHealth
  };

  return (
    <RobustnessContext.Provider value={value}>
      {children}
    </RobustnessContext.Provider>
  );
};