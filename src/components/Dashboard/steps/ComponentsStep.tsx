import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ComponentSelector } from '../ComponentSelector';

interface ComponentsStepProps {
  onComponentsSelected: (components: string[]) => void;
  onSkip: () => void;
  onBackToWelcome: () => void;
  className?: string;
}

export const ComponentsStep: React.FC<ComponentsStepProps> = ({ 
  onComponentsSelected, 
  onSkip, 
  onBackToWelcome,
  className 
}) => {
  return (
    <div className={`${className}`}>
      <ComponentSelector
        onComponentsSelected={onComponentsSelected}
        onSkip={onSkip}
      />
      <div className="flex justify-center mt-4">
        <Button variant="ghost" onClick={onBackToWelcome} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Welcome
        </Button>
      </div>
    </div>
  );
};