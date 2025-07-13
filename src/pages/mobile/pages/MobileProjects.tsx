import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MobileProjects: React.FC = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mobile projects interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileProjects;