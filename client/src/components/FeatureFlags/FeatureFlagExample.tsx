import React from 'react';
import { useFeatureFlags, verifyFeatureFlagsSetup } from '@/hooks/useFeatureFlags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const FeatureFlagExample: React.FC = () => {
  const { isInitialized, evaluateFlag, evaluateStringFlag, evaluateNumberFlag, client } = useFeatureFlags();

  // Example feature flags
  const showNewFeature = evaluateFlag('show-new-feature', false);
  const themeName = evaluateStringFlag('theme-name', 'default');
  const maxItems = evaluateNumberFlag('max-items', 10);

  const handleVerifySetup = () => {
    verifyFeatureFlagsSetup(client);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Feature Flags Demo</CardTitle>
        <CardDescription>
          LaunchDarkly integration demo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Client Status:</span>
          <Badge variant={isInitialized ? "default" : "secondary"}>
            {isInitialized ? "Initialized" : "Loading"}
          </Badge>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Feature Flag Values:</h4>
          
          <div className="flex items-center justify-between">
            <span>New Feature:</span>
            <Badge variant={showNewFeature ? "default" : "outline"}>
              {showNewFeature ? "Enabled" : "Disabled"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Theme:</span>
            <Badge variant="outline">{themeName}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Max Items:</span>
            <Badge variant="outline">{maxItems}</Badge>
          </div>
        </div>

        {showNewFeature && (
          <div className="p-3 bg-primary/10 rounded-md">
            <p className="text-sm">
              🎉 This content is only visible when the 'show-new-feature' flag is enabled!
            </p>
          </div>
        )}

        <Button onClick={handleVerifySetup} className="w-full">
          Test Integration
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>
            Click "Test Integration" to verify feature flag functionality.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};