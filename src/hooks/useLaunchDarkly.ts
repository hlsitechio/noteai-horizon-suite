
import { useEffect, useState } from 'react';
import { launchDarklyService } from '@/services/launchDarklyService';
import * as LaunchDarkly from "launchdarkly-js-client-sdk";

interface UseLaunchDarklyOptions {
  clientId?: string;
  userContext?: LaunchDarkly.LDUser;
  autoInitialize?: boolean;
}

export const useLaunchDarkly = (options: UseLaunchDarklyOptions = {}) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    clientId = 'your-client-id-here', // Replace with actual client ID
    userContext = { kind: "user", key: "anonymous-user" },
    autoInitialize = false
  } = options;

  useEffect(() => {
    if (autoInitialize && clientId !== 'your-client-id-here') {
      initializeLaunchDarkly();
    }
  }, [clientId, autoInitialize]);

  const initializeLaunchDarkly = async () => {
    try {
      setError(null);
      await launchDarklyService.initialize(clientId, userContext);
      setIsReady(true);
    } catch (err) {
      setError(err as Error);
      setIsReady(false);
    }
  };

  const evaluateFlag = (flagKey: string, defaultValue: any) => {
    return launchDarklyService.evaluateFlag(flagKey, defaultValue);
  };

  const testIntegration = () => {
    launchDarklyService.testIntegration();
  };

  return {
    isReady,
    error,
    initializeLaunchDarkly,
    evaluateFlag,
    testIntegration,
    client: launchDarklyService.getClient(),
  };
};
