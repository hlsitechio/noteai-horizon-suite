
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLaunchDarkly } from '@/hooks/useLaunchDarkly';
import { Badge } from '@/components/ui/badge';

export const LaunchDarklyTest: React.FC = () => {
  const { isReady, error, initializeLaunchDarkly, evaluateFlag, testIntegration } = useLaunchDarkly();

  const handleInitialize = async () => {
    // You'll need to replace 'your-client-id-here' with your actual LaunchDarkly client ID
    await initializeLaunchDarkly();
  };

  const handleTestFlag = () => {
    const result = evaluateFlag('test-flag', false);
    console.log('Test flag result:', result);
  };

  const handleTestIntegration = () => {
    testIntegration();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          LaunchDarkly + Sentry Integration
          <Badge variant={isReady ? "default" : "secondary"}>
            {isReady ? "Ready" : "Not Ready"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Test the feature flag monitoring integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            Error: {error.message}
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            onClick={handleInitialize} 
            disabled={isReady}
            className="w-full"
          >
            {isReady ? "Initialized" : "Initialize LaunchDarkly"}
          </Button>
          
          <Button 
            onClick={handleTestFlag} 
            disabled={!isReady}
            variant="outline"
            className="w-full"
          >
            Test Flag Evaluation
          </Button>
          
          <Button 
            onClick={handleTestIntegration} 
            disabled={!isReady}
            variant="outline"
            className="w-full"
          >
            Test Integration
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>1. Update the client ID in the hook</p>
          <p>2. Initialize LaunchDarkly</p>
          <p>3. Test flag evaluation and error capture</p>
          <p>4. Check Sentry dashboard for feature flag data</p>
        </div>
      </CardContent>
    </Card>
  );
};
