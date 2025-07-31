import { useCallback } from 'react';
import { toast } from 'sonner';

// Generic placeholder hook for temporarily disabled features
export function usePlaceholderHook(featureName: string) {
  const showDisabledMessage = useCallback(() => {
    toast.error(`${featureName} feature is temporarily disabled`);
  }, [featureName]);

  // Return common placeholder functions
  return {
    // Common async operations
    async create() {
      showDisabledMessage();
      return null;
    },
    async update() {
      showDisabledMessage();
      return false;
    },
    async delete() {
      showDisabledMessage();
      return false;
    },
    async fetch() {
      showDisabledMessage();
      return [];
    },
    // Sync operations
    process() {
      showDisabledMessage();
      return null;
    },
    execute() {
      showDisabledMessage();
      return null;
    },
    // State
    isLoading: false,
    error: null,
    data: null,
  };
}