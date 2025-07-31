import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface StorageInitializationStatus {
  isInitialized: boolean;
  isLoading: boolean;
  needsInitialization: boolean;
  error: string | null;
}

export const useStorageInitialization = (userId: string | null) => {
  const [status, setStatus] = useState<StorageInitializationStatus>({
    isInitialized: false,
    isLoading: true,
    needsInitialization: false,
    error: null
  });

  useEffect(() => {
    if (!userId) {
      setStatus({
        isInitialized: false,
        isLoading: false,
        needsInitialization: false,
        error: null
      });
      return;
    }

    checkInitializationStatus();
  }, [userId]);

  const checkInitializationStatus = async () => {
    if (!userId) return;

    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: null }));

      const { data, error } = await supabase
        .from('user_storage_initialization')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      const isInitialized = data?.initialization_completed || false;
      const needsInitialization = !isInitialized;

      setStatus({
        isInitialized,
        isLoading: false,
        needsInitialization,
        error: null
      });

      logger.auth.debug('Storage initialization status:', { 
        isInitialized, 
        needsInitialization,
        data 
      });

    } catch (error) {
      logger.auth.error('Error checking storage initialization:', error);
      setStatus({
        isInitialized: false,
        isLoading: false,
        needsInitialization: false,
        error: error instanceof Error ? error.message : 'Failed to check initialization status'
      });
    }
  };

  const markAsInitialized = () => {
    setStatus(prev => ({
      ...prev,
      isInitialized: true,
      needsInitialization: false
    }));
  };

  return {
    ...status,
    refreshStatus: checkInitializationStatus,
    markAsInitialized
  };
};