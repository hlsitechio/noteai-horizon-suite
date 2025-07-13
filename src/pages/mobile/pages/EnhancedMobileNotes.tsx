import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EnhancedMobileNotes: React.FC = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Mobile Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Mobile notes interface coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMobileNotes;