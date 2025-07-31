import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const APMDashboard: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">APM Dashboard</h3>
        <p className="text-muted-foreground">
          Application Performance Monitoring dashboard temporarily disabled.
        </p>
      </CardContent>
    </Card>
  );
};