import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnhancedMobileSettings: React.FC = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mobile settings interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMobileSettings;