import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MobileDashboard: React.FC = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mobile dashboard coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileDashboard;