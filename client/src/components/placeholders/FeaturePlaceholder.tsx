import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface FeaturePlaceholderProps {
  featureName: string;
  description?: string;
  icon?: React.ReactNode;
  [key: string]: any; // Accept any additional props to prevent errors
}

const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({ 
  featureName, 
  description = "This feature is temporarily disabled while we optimize the system.",
  icon = <AlertCircle className="w-6 h-6" />,
  ...props 
}) => {
  return (
    <Card className="m-4">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-3 text-muted-foreground">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{featureName}</h3>
        <p className="text-muted-foreground text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeaturePlaceholder;