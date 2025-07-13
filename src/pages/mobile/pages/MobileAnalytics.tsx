import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MobileAnalytics: React.FC = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mobile analytics interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAnalytics;