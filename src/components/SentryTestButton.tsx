import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export const SentryTestButton: React.FC = () => {
  const throwError = () => {
    throw new Error("This is your first error!");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Sentry Test
        </CardTitle>
        <CardDescription>
          Click the button below to throw an error and test your Sentry integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={throwError}
          variant="destructive"
          className="w-full"
        >
          Break the world
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          This will throw an intentional error to test Sentry error tracking
        </p>
      </CardContent>
    </Card>
  );
};