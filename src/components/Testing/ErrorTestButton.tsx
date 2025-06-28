
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const ErrorTestButton: React.FC = () => {
  const throwTestError = () => {
    throw new Error("This is your first error!");
  };

  return (
    <Button 
      onClick={throwTestError}
      variant="destructive"
      className="flex items-center gap-2"
    >
      <AlertTriangle className="w-4 h-4" />
      Break the world
    </Button>
  );
};

export default ErrorTestButton;
