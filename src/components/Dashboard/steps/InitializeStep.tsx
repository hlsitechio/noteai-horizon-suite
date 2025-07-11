import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { InitializeDashboardButton } from '../InitializeDashboardButton';

interface InitializeStepProps {
  selectedComponents: string[];
  onInitialized: () => void;
  onBackToComponents: () => void;
  className?: string;
}

export const InitializeStep: React.FC<InitializeStepProps> = ({ 
  selectedComponents,
  onInitialized,
  onBackToComponents,
  className 
}) => {
  return (
    <div className={`max-w-2xl mx-auto p-6 space-y-6 ${className}`}>
      <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Ready to Initialize! 🚀
          </CardTitle>
          <CardDescription className="text-lg">
            {selectedComponents.length > 0 
              ? `We'll set up your dashboard with ${selectedComponents.length} selected components and create your workspace.`
              : "We'll create your basic workspace with default settings."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InitializeDashboardButton
            onInitialized={onInitialized}
            variant="default"
            size="lg"
            className="w-full text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-shadow"
          />
          <Button variant="ghost" onClick={onBackToComponents} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Component Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};