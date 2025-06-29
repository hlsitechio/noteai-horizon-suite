
import * as LaunchDarkly from "launchdarkly-js-client-sdk";
import * as Sentry from "@sentry/react";

class LaunchDarklyService {
  private client: LaunchDarkly.LDClient | null = null;
  private isInitialized = false;

  async initialize(clientId: string, userContext: LaunchDarkly.LDUser) {
    if (this.isInitialized) {
      console.log('LaunchDarkly already initialized');
      return this.client;
    }

    try {
      console.log('🚀 Initializing LaunchDarkly...');
      
      this.client = LaunchDarkly.initialize(
        clientId,
        userContext,
        {
          inspectors: [Sentry.buildLaunchDarklyFlagUsedHandler()],
        }
      );

      // Wait for the client to be ready
      await this.client.waitForInitialization();
      
      this.isInitialized = true;
      console.log('✅ LaunchDarkly initialized successfully');
      
      return this.client;
    } catch (error) {
      console.error('❌ Failed to initialize LaunchDarkly:', error);
      Sentry.captureException(error);
      throw error;
    }
  }

  getClient(): LaunchDarkly.LDClient | null {
    return this.client;
  }

  isReady(): boolean {
    return this.isInitialized && this.client !== null;
  }

  // Helper method to safely evaluate flags
  evaluateFlag(flagKey: string, defaultValue: any): any {
    if (!this.client || !this.isInitialized) {
      console.warn(`LaunchDarkly not initialized, returning default value for flag: ${flagKey}`);
      return defaultValue;
    }

    try {
      const result = this.client.variation(flagKey, defaultValue);
      console.log(`Flag evaluation: ${flagKey} = ${result}`);
      return result;
    } catch (error) {
      console.error(`Error evaluating flag ${flagKey}:`, error);
      Sentry.captureException(error);
      return defaultValue;
    }
  }

  // Test method for verification
  testIntegration() {
    if (!this.isReady()) {
      console.warn('LaunchDarkly not ready for testing');
      return;
    }

    console.log('🧪 Testing LaunchDarkly + Sentry integration...');
    
    // Evaluate a test flag
    const testFlagResult = this.evaluateFlag("test-flag", false);
    console.log('Test flag result:', testFlagResult);
    
    // Capture a test exception to verify the integration
    Sentry.captureException(new Error("LaunchDarkly integration test - Something went wrong!"));
    
    console.log('✅ Integration test completed - check Sentry dashboard for feature flag data');
  }

  cleanup() {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.isInitialized = false;
      console.log('🧹 LaunchDarkly client cleaned up');
    }
  }
}

export const launchDarklyService = new LaunchDarklyService();
