
import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DemoCredentials: React.FC = () => {
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <div className="space-y-2">
          <p className="font-semibold">Email & Password Authentication</p>
          <p className="text-sm">
            This app uses secure email and password authentication powered by Supabase.
            Create a new account or sign in with your existing credentials.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            Your password must be at least 6 characters long for security.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default DemoCredentials;
