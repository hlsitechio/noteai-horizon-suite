import { useState, useEffect, useCallback } from 'react';
import * as LaunchDarkly from 'launchdarkly-js-client-sdk';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlagHook {
  isInitialized: boolean;
  evaluateFlag: (flagKey: string, defaultValue: boolean) => boolean;
  evaluateStringFlag: (flagKey: string, defaultValue: string) => string;
  evaluateNumberFlag: (flagKey: string, defaultValue: number) => number;
  client: LaunchDarkly.LDClient | null;
}

export const useFeatureFlags = (): FeatureFlagHook => {
  const [client, setClient] = useState<LaunchDarkly.LDClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Get LaunchDarkly client ID from Supabase secrets
        const { data, error } = await supabase.functions.invoke('get-launchdarkly-config');
        
        if (error || !data?.clientId) {
          console.warn('LaunchDarkly client ID not configured. Feature flags will use default values.');
          return;
        }

        // Get current user context for LaunchDarkly
        const { data: { user } } = await supabase.auth.getUser();
        
        const userContext: LaunchDarkly.LDUser = {
          key: user?.id || "anonymous-user",
          email: user?.email,
          custom: {
            environment: import.meta.env.MODE,
          }
        };

        // Initialize LaunchDarkly client
        const ldClient = LaunchDarkly.initialize(
          data.clientId,
          userContext,
          {
            // Enable streaming for real-time flag updates
            streaming: true,
          }
        );

        // Wait for client to be ready with timeout
        await ldClient.waitForInitialization(5000);
        
        setClient(ldClient);
        setIsInitialized(true);
        
        console.log('LaunchDarkly client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize LaunchDarkly client:', error);
      }
    };

    initializeClient();

    // Cleanup function
    return () => {
      if (client) {
        client.close();
      }
    };
  }, []);

  const evaluateFlag = useCallback((flagKey: string, defaultValue: boolean): boolean => {
    if (!client || !isInitialized) {
      return defaultValue;
    }
    
    try {
      return client.variation(flagKey, defaultValue);
    } catch (error) {
      console.error(`Failed to evaluate feature flag ${flagKey}:`, error);
      return defaultValue;
    }
  }, [client, isInitialized]);

  const evaluateStringFlag = useCallback((flagKey: string, defaultValue: string): string => {
    if (!client || !isInitialized) {
      return defaultValue;
    }
    
    try {
      return client.variation(flagKey, defaultValue);
    } catch (error) {
      console.error(`Failed to evaluate string feature flag ${flagKey}:`, error);
      return defaultValue;
    }
  }, [client, isInitialized]);

  const evaluateNumberFlag = useCallback((flagKey: string, defaultValue: number): number => {
    if (!client || !isInitialized) {
      return defaultValue;
    }
    
    try {
      return client.variation(flagKey, defaultValue);
    } catch (error) {
      console.error(`Failed to evaluate number feature flag ${flagKey}:`, error);
      return defaultValue;
    }
  }, [client, isInitialized]);

  return {
    isInitialized,
    evaluateFlag,
    evaluateStringFlag,
    evaluateNumberFlag,
    client,
  };
};

// Example usage and verification function
export const verifyFeatureFlagsSetup = (client: LaunchDarkly.LDClient | null) => {
  if (!client) {
    console.warn('LaunchDarkly client not initialized');
    return;
  }

  try {
    // Test flag evaluation
    const testFlag = client.variation("test-flag", false);
    console.log('Test flag value:', testFlag);

    
    
    console.log('Feature flags verification completed.');
  } catch (error) {
    console.error('Feature flags verification failed:', error);
    
  }
};